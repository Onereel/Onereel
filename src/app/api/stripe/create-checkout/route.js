import { auth } from "@/lib/safe-auth";
import sql from "@/app/api/utils/sql";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * ═══════════════════════════════════════════════════════════════════════
 * 💳 STRIPE CHECKOUT SESSION
 * ═══════════════════════════════════════════════════════════════════════
 * Creates a Stripe checkout session for Pro subscription
 */

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { priceId, billingPeriod = "monthly" } = body;

    // Get user profile
    const profiles = await sql`
      SELECT * FROM profiles WHERE user_id = ${session.user.id}
    `;

    if (profiles.length === 0) {
      return Response.json(
        { success: false, error: "Profile not found" },
        { status: 404 },
      );
    }

    const profile = profiles[0];

    // Check if already Pro
    if (
      profile.subscription_tier === "pro" &&
      profile.subscription_status === "active"
    ) {
      return Response.json(
        { success: false, error: "Already subscribed to Pro" },
        { status: 400 },
      );
    }

    // Get or create Stripe customer
    let customerId = profile.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          profile_id: profile.id.toString(),
          user_id: session.user.id,
        },
      });

      customerId = customer.id;

      // Save customer ID to profile
      await sql`
        UPDATE profiles 
        SET stripe_customer_id = ${customerId}
        WHERE id = ${profile.id}
      `;
    }

    // Get price ID from settings if not provided
    let finalPriceId = priceId;
    if (!finalPriceId) {
      const settingKey =
        billingPeriod === "yearly"
          ? "stripe_pro_yearly_price_id"
          : "stripe_pro_monthly_price_id";

      const priceSetting = await sql`
        SELECT setting_value FROM platform_settings 
        WHERE setting_key = ${settingKey}
      `;

      if (
        priceSetting.length > 0 &&
        priceSetting[0].setting_value !== "price_placeholder"
      ) {
        finalPriceId = priceSetting[0].setting_value;
      } else {
        return Response.json(
          {
            success: false,
            error: "Stripe price not configured. Contact support.",
          },
          { status: 500 },
        );
      }
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.APP_URL}/dashboard?upgrade=success`,
      cancel_url: `${process.env.APP_URL}/pricing?upgrade=cancelled`,
      metadata: {
        profile_id: profile.id.toString(),
        user_id: session.user.id,
      },
    });

    console.log(
      `[Stripe] Checkout session created for ${session.user.email}: ${checkoutSession.id}`,
    );

    return Response.json({
      success: true,
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("[Stripe] Checkout error:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to create checkout session",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
