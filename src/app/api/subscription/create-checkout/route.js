import { auth } from "@/lib/safe-auth";
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    let session;
    try {
      session = await auth();
    } catch (authError) {
      return Response.json(
        { error: "Authentication service unavailable" },
        { status: 503 },
      );
    }

    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await sql`
      SELECT * FROM profiles WHERE user_id = ${session.user.id}
    `;

    if (profile.length === 0) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    const { priceId, successUrl, cancelUrl } = await request.json();

    if (!priceId) {
      return Response.json({ error: "Missing priceId" }, { status: 400 });
    }

    // In production, this would create a real Stripe checkout session
    // For now, we'll simulate the upgrade
    const checkoutUrl = `/api/subscription/simulate-upgrade?profileId=${profile[0].id}&tier=pro`;

    return Response.json({
      success: true,
      checkoutUrl,
      message: "Checkout session created (simulated)",
    });
  } catch (error) {
    console.error("[Subscription Checkout] Error:", error);
    return Response.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
