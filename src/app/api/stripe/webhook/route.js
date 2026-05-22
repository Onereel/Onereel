import sql from "@/app/api/utils/sql";
import Stripe from "stripe";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe not configured");
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

/**
 * ═══════════════════════════════════════════════════════════════════════
 * 🎣 STRIPE WEBHOOK HANDLER
 * ═══════════════════════════════════════════════════════════════════════
 * Handles subscription lifecycle events from Stripe
 */

export async function POST(request) {
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const body = await request.text();
    event = getStripe().webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error(
      `[Stripe Webhook] Signature verification failed:`,
      err.message,
    );
    return Response.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  console.log(`[Stripe Webhook] Event received: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutComplete(event.data.object);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdate(event.data.object);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionCancelled(event.data.object);
        break;

      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error(`[Stripe Webhook] Error processing ${event.type}:`, error);
    return Response.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

/**
 * Handle successful checkout
 */
async function handleCheckoutComplete(session) {
  const profileId = session.metadata?.profile_id;
  const customerId = session.customer;
  const subscriptionId = session.subscription;

  if (!profileId) {
    console.error("[Webhook] No profile_id in checkout session metadata");
    return;
  }

  console.log(`[Webhook] Checkout completed for profile ${profileId}`);

  // Update profile with subscription info
  await sql`
    UPDATE profiles
    SET 
      subscription_tier = 'pro',
      subscription_status = 'active',
      stripe_customer_id = ${customerId},
      stripe_subscription_id = ${subscriptionId}
    WHERE id = ${parseInt(profileId)}
  `;

  console.log(`[Webhook] Profile ${profileId} upgraded to Pro`);
}

/**
 * Handle subscription creation/update
 */
async function handleSubscriptionUpdate(subscription) {
  const customerId = subscription.customer;
  const subscriptionId = subscription.id;
  const status = subscription.status;
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

  console.log(`[Webhook] Subscription ${subscriptionId} status: ${status}`);

  // Find profile by customer ID
  const profiles = await sql`
    SELECT * FROM profiles 
    WHERE stripe_customer_id = ${customerId}
  `;

  if (profiles.length === 0) {
    console.error(`[Webhook] No profile found for customer ${customerId}`);
    return;
  }

  const profile = profiles[0];

  // Map Stripe status to our status
  const ourStatus = mapStripeStatus(status);
  const tier = status === "active" || status === "trialing" ? "pro" : "free";

  await sql`
    UPDATE profiles
    SET 
      subscription_tier = ${tier},
      subscription_status = ${ourStatus},
      stripe_subscription_id = ${subscriptionId},
      subscription_period_end = ${currentPeriodEnd}
    WHERE id = ${profile.id}
  `;

  console.log(`[Webhook] Profile ${profile.id} updated: ${tier}/${ourStatus}`);
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCancelled(subscription) {
  const customerId = subscription.customer;
  const subscriptionId = subscription.id;

  console.log(`[Webhook] Subscription ${subscriptionId} cancelled`);

  const profiles = await sql`
    SELECT * FROM profiles 
    WHERE stripe_customer_id = ${customerId}
  `;

  if (profiles.length === 0) {
    console.error(`[Webhook] No profile found for customer ${customerId}`);
    return;
  }

  const profile = profiles[0];

  // Downgrade to free tier
  await sql`
    UPDATE profiles
    SET 
      subscription_tier = 'free',
      subscription_status = 'cancelled',
      subscription_period_end = NULL
    WHERE id = ${profile.id}
  `;

  console.log(`[Webhook] Profile ${profile.id} downgraded to free tier`);
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(invoice) {
  const customerId = invoice.customer;
  const subscriptionId = invoice.subscription;

  console.log(`[Webhook] Payment succeeded for subscription ${subscriptionId}`);

  // Ensure subscription is active
  await sql`
    UPDATE profiles
    SET subscription_status = 'active'
    WHERE stripe_customer_id = ${customerId}
    AND stripe_subscription_id = ${subscriptionId}
  `;
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice) {
  const customerId = invoice.customer;
  const subscriptionId = invoice.subscription;

  console.log(`[Webhook] Payment failed for subscription ${subscriptionId}`);

  // Mark subscription as past_due
  await sql`
    UPDATE profiles
    SET subscription_status = 'past_due'
    WHERE stripe_customer_id = ${customerId}
    AND stripe_subscription_id = ${subscriptionId}
  `;
}

/**
 * Map Stripe subscription status to our status
 */
function mapStripeStatus(stripeStatus) {
  const statusMap = {
    active: "active",
    trialing: "active",
    past_due: "past_due",
    canceled: "cancelled",
    unpaid: "past_due",
    incomplete: "inactive",
    incomplete_expired: "cancelled",
  };

  return statusMap[stripeStatus] || "inactive";
}
