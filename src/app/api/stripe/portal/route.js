import { auth } from "@/lib/safe-auth";
import sql from "@/app/api/utils/sql";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * ═══════════════════════════════════════════════════════════════════════
 * 🏛️ STRIPE CUSTOMER PORTAL
 * ═══════════════════════════════════════════════════════════════════════
 * Creates a portal session for subscription management
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

    if (!profile.stripe_customer_id) {
      return Response.json(
        {
          success: false,
          error: "No subscription found. Subscribe first.",
        },
        { status: 400 },
      );
    }

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.APP_URL}/dashboard`,
    });

    console.log(`[Stripe] Portal session created for ${session.user.email}`);

    return Response.json({
      success: true,
      url: portalSession.url,
    });
  } catch (error) {
    console.error("[Stripe] Portal error:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to create portal session",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
