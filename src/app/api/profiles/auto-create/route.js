import { auth } from "@/auth";
import { ensureProfile } from "@/app/api/utils/profile-manager";

/**
 * Auto-create profile for authenticated users who don't have one yet
 * This prevents "profile not found" errors and creates a seamless onboarding
 *
 * ✅ Uses centralized profile management system
 */
export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email } = body;

    console.log(
      "[Auto-Create Profile] Ensuring profile for user:",
      session.user.id,
    );

    // ✅ Use centralized profile manager (handles duplicates automatically)
    const profile = await ensureProfile(
      session.user.id,
      email || session.user.email,
      name || session.user.name,
    );

    const isNew = profile.created_at >= new Date(Date.now() - 1000); // Created within last second

    console.log(
      "[Auto-Create Profile]",
      isNew ? "✅ Created new profile" : "✅ Profile already existed",
    );

    return Response.json({
      success: true,
      profile: profile,
      created: isNew,
      alreadyExists: !isNew,
    });
  } catch (error) {
    console.error("[Auto-Create Profile] ❌ Error:", error);
    return Response.json(
      { error: "Failed to create profile", details: error.message },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
