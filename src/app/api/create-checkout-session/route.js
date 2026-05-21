import sql from "@/app/api/utils/sql";
import { auth } from "@/lib/safe-auth";
import Stripe from "stripe";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, gigId, jobId, freelancerId, type } = body;

    if (!amount || (!gigId && !jobId) || !freelancerId || !type) {
      return Response.json(
        {
          error:
            "Missing required fields: amount, gigId/jobId, freelancerId, type",
        },
        { status: 400 },
      );
    }

    // Get platform fee percentage from settings
    const settingsResult = await sql`
      SELECT setting_value 
      FROM platform_settings 
      WHERE setting_key = 'platform_fee_percentage' 
      LIMIT 1
    `;
    const platformFeePercentage =
      settingsResult.length > 0
        ? parseFloat(settingsResult[0].setting_value)
        : 12.0;

    // Get payer's profile
    const payerProfile = await sql`
      SELECT id FROM profiles WHERE user_id = ${session.user.id} LIMIT 1
    `;

    if (payerProfile.length === 0) {
      return Response.json(
        { error: "Please create your profile first" },
        { status: 400 },
      );
    }

    const payerId = payerProfile[0].id;

    // Calculate platform fee
    const totalAmount = parseFloat(amount);
    const platformFee = (totalAmount * platformFeePercentage) / 100;

    // Create transaction record in database
    const transactionData = {
      payer_id: payerId,
      payee_id: freelancerId,
      amount: totalAmount,
      platform_fee: platformFee,
      platform_fee_percentage: platformFeePercentage,
      status: "pending",
    };

    let transactionResult;
    if (gigId) {
      transactionResult = await sql`
        INSERT INTO transactions (
          gig_id, payer_id, payee_id, amount, platform_fee, 
          platform_fee_percentage, status
        ) VALUES (
          ${gigId}, ${payerId}, ${freelancerId}, ${totalAmount}, 
          ${platformFee}, ${platformFeePercentage}, 'pending'
        ) RETURNING id
      `;
    } else if (jobId) {
      transactionResult = await sql`
        INSERT INTO transactions (
          job_id, payer_id, payee_id, amount, platform_fee, 
          platform_fee_percentage, status
        ) VALUES (
          ${jobId}, ${payerId}, ${freelancerId}, ${totalAmount}, 
          ${platformFee}, ${platformFeePercentage}, 'pending'
        ) RETURNING id
      `;
    }

    const transactionId = transactionResult[0].id;

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name:
                type === "gig"
                  ? "Gig Service Payment"
                  : "Job Completion Payment",
              description: `Transaction #${transactionId} - Platform fee: ${platformFeePercentage}%`,
            },
            unit_amount: Math.round(totalAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.APP_URL || request.headers.get("origin")}/dashboard?payment=success&transaction=${transactionId}`,
      cancel_url: `${process.env.APP_URL || request.headers.get("origin")}/${type === "gig" ? "gigs" : "jobs"}/${gigId || jobId}?payment=cancelled`,
      metadata: {
        transactionId: transactionId.toString(),
        gigId: gigId?.toString() || "",
        jobId: jobId?.toString() || "",
        freelancerId: freelancerId.toString(),
        payerId: payerId.toString(),
        platformFee: platformFee.toFixed(2),
        type,
      },
    });

    // Update transaction with Stripe session ID
    await sql`
      UPDATE transactions 
      SET stripe_payment_intent_id = ${checkoutSession.id}
      WHERE id = ${transactionId}
    `;

    return Response.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
      transactionId,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return Response.json(
      { error: "Failed to create checkout session", details: error.message },
      { status: 500 },
    );
  }
}
