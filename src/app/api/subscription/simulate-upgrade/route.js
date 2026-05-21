import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get("profileId");
    const tier = searchParams.get("tier");

    if (!profileId || !tier) {
      return Response.redirect("/dashboard?upgrade=failed");
    }

    // Simulate subscription upgrade
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    await sql`
      UPDATE profiles
      SET 
        subscription_tier = ${tier},
        subscription_status = 'active',
        subscription_period_end = ${periodEnd.toISOString()}
      WHERE id = ${profileId}
    `;

    return Response.redirect("/dashboard?upgrade=success");
  } catch (error) {
    console.error("[Simulate Upgrade] Error:", error);
    return Response.redirect("/dashboard?upgrade=failed");
  }
}
