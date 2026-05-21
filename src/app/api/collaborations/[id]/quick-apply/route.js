import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * QUICK APPLY - 1-CLICK APPLICATION FLOW
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Ultra-fast application process:
 * - Auto-fill from user profile
 * - Optional pre-written message
 * - 2-second completion
 *
 * This is the CONNECTION ENGINE in action.
 * ═══════════════════════════════════════════════════════════════════════
 */

export async function POST(request, { params }) {
  console.log("[Quick Apply API] POST: Starting quick apply process...");

  try {
    const session = await auth();

    if (!session?.user) {
      console.log(
        "[Quick Apply API] POST: ❌ No session - authentication required",
      );
      return Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    console.log("[Quick Apply API] POST: User authenticated:", session.user.id);

    const { id } = params;
    const body = await request.json();
    const { message } = body;

    console.log("[Quick Apply API] POST: Collaboration ID:", id);

    // Get user's profile
    const profile = await sql`
      SELECT id, name, skills, portfolio_links
      FROM profiles
      WHERE user_id = ${session.user.id}
    `;

    if (!profile || profile.length === 0) {
      console.error(
        "[Quick Apply API] POST: ❌ Profile not found for user:",
        session.user.id,
      );
      return Response.json(
        {
          success: false,
          error: "Profile not found. Please complete your profile first.",
        },
        { status: 404 },
      );
    }

    const profileId = profile[0].id;
    console.log(
      "[Quick Apply API] POST: Profile ID:",
      profileId,
      "| Name:",
      profile[0].name,
    );

    // Check if collaboration exists and is active
    const collab = await sql`
      SELECT status, creator_id, title
      FROM collaborations
      WHERE id = ${id}
    `;

    if (!collab || collab.length === 0) {
      console.log("[Quick Apply API] POST: ❌ Collaboration not found");
      return Response.json(
        { success: false, error: "Collaboration not found" },
        { status: 404 },
      );
    }

    console.log(
      "[Quick Apply API] POST: Collaboration found:",
      collab[0].title,
    );

    if (collab[0].status !== "active") {
      console.log(
        "[Quick Apply API] POST: ❌ Collaboration is not active - status:",
        collab[0].status,
      );
      return Response.json(
        { success: false, error: "This collaboration is no longer active" },
        { status: 400 },
      );
    }

    // Can't apply to own collaboration
    if (collab[0].creator_id === profileId) {
      console.log(
        "[Quick Apply API] POST: ❌ User trying to apply to their own collaboration",
      );
      return Response.json(
        { success: false, error: "Cannot apply to your own collaboration" },
        { status: 400 },
      );
    }

    // Check if already applied
    const existingApp = await sql`
      SELECT id FROM collaboration_applications
      WHERE collaboration_id = ${id}
        AND applicant_id = ${profileId}
    `;

    if (existingApp && existingApp.length > 0) {
      console.log(
        "[Quick Apply API] POST: ⚠️ User already applied - application ID:",
        existingApp[0].id,
      );
      return Response.json(
        {
          success: false,
          error: "You have already applied to this collaboration",
        },
        { status: 400 },
      );
    }

    console.log("[Quick Apply API] POST: Creating application...");

    // Create quick application
    const application = await sql`
      INSERT INTO collaboration_applications (
        collaboration_id,
        applicant_id,
        message,
        portfolio_highlights,
        availability,
        status
      ) VALUES (
        ${id},
        ${profileId},
        ${message || "Quick Apply - Interested in collaborating!"},
        ${profile[0].portfolio_links || []},
        ${"Available to start"},
        'pending'
      )
      RETURNING *
    `;

    if (!application || application.length === 0) {
      console.error(
        "[Quick Apply API] POST: ❌ Failed to create application - no record returned",
      );
      return Response.json(
        { success: false, error: "Failed to create application" },
        { status: 500 },
      );
    }

    console.log(
      "[Quick Apply API] POST: ✅ Application created - ID:",
      application[0].id,
    );

    // Increment application count
    await sql`
      UPDATE collaborations 
      SET application_count = application_count + 1 
      WHERE id = ${id}
    `;

    console.log("[Quick Apply API] POST: ✅ Application count incremented");

    // 🔥 CREATE NOTIFICATION for collaboration creator
    await sql`
      INSERT INTO notifications (
        user_id,
        profile_id,
        type,
        title,
        message,
        link,
        read
      ) VALUES (
        (SELECT user_id FROM profiles WHERE id = ${collab[0].creator_id}),
        ${collab[0].creator_id},
        'application',
        '🔥 Someone just applied to your collaboration!',
        ${`${profile[0].name} applied to "${collab[0].title}"`},
        ${`/collaborations/${id}`},
        false
      )
    `;

    console.log("[Quick Apply API] POST: ✅ Notification sent to creator");
    console.log("[Quick Apply API] POST: ✅ SUCCESS - Quick apply complete");

    return Response.json({
      success: true,
      application: application[0],
      message: "Application sent successfully!",
    });
  } catch (error) {
    console.error("[Quick Apply API] POST: ❌ Unexpected error:", error);
    console.error("[Quick Apply API] POST: Stack trace:", error.stack);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
