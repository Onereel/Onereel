import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request, { params }) {
  console.log(
    "[Collaboration Apply API] POST: Starting application process...",
  );

  try {
    const session = await auth();
    if (!session?.user) {
      console.log(
        "[Collaboration Apply API] POST: ❌ No session - authentication required",
      );
      return Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    console.log(
      "[Collaboration Apply API] POST: User authenticated:",
      session.user.id,
    );

    const { id } = params;
    const body = await request.json();
    const { message, portfolioHighlights, availability } = body;

    console.log("[Collaboration Apply API] POST: Collaboration ID:", id);

    if (!message) {
      console.log("[Collaboration Apply API] POST: ❌ Message is required");
      return Response.json(
        { success: false, error: "Message is required" },
        { status: 400 },
      );
    }

    // Get user's profile
    const profile = await sql`
      SELECT id, name, username FROM profiles WHERE user_id = ${session.user.id}
    `;

    if (!profile || profile.length === 0) {
      console.error(
        "[Collaboration Apply API] POST: ❌ Profile not found for user:",
        session.user.id,
      );
      return Response.json(
        { success: false, error: "Profile not found" },
        { status: 404 },
      );
    }

    const profileId = profile[0].id;
    console.log(
      "[Collaboration Apply API] POST: 📋 Applicant Profile ID:",
      profileId,
      "| Name:",
      profile[0].name,
      "| User ID:",
      session.user.id,
    );

    // Check if collaboration exists and is active
    const collab = await sql`
      SELECT c.status, c.creator_id, c.title,
        p.user_id as creator_user_id,
        p.name as creator_name
      FROM collaborations c
      JOIN profiles p ON p.id = c.creator_id
      WHERE c.id = ${id}
    `;

    if (!collab || collab.length === 0) {
      console.log("[Collaboration Apply API] POST: ❌ Collaboration not found");
      return Response.json(
        { success: false, error: "Collaboration not found" },
        { status: 404 },
      );
    }

    console.log(
      "[Collaboration Apply API] POST: 📋 Collaboration found:",
      collab[0].title,
    );
    console.log(
      "[Collaboration Apply API] POST: 👤 Creator Profile ID:",
      collab[0].creator_id,
      "| User ID:",
      collab[0].creator_user_id,
      "| Name:",
      collab[0].creator_name,
    );

    if (collab[0].status !== "active") {
      console.log(
        "[Collaboration Apply API] POST: ❌ Collaboration is not active - status:",
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
        "[Collaboration Apply API] POST: ❌ User trying to apply to their own collaboration",
      );
      return Response.json(
        { success: false, error: "Cannot apply to your own collaboration" },
        { status: 400 },
      );
    }

    console.log(
      "[Collaboration Apply API] POST: Creating or updating application...",
    );

    // Create application
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
        ${message},
        ${portfolioHighlights || []},
        ${availability || null},
        'pending'
      )
      ON CONFLICT (collaboration_id, applicant_id) 
      DO UPDATE SET
        message = EXCLUDED.message,
        portfolio_highlights = EXCLUDED.portfolio_highlights,
        availability = EXCLUDED.availability
      RETURNING *
    `;

    if (!application || application.length === 0) {
      console.error(
        "[Collaboration Apply API] POST: ❌ Failed to create application - no record returned",
      );
      return Response.json(
        { success: false, error: "Failed to create application" },
        { status: 500 },
      );
    }

    console.log(
      "[Collaboration Apply API] POST: ✅ Application created/updated - ID:",
      application[0].id,
    );

    // Increment application count (only if new application, not update)
    // Check if this was an insert or update
    const countCheck = await sql`
      SELECT COUNT(*) as count FROM collaboration_applications WHERE collaboration_id = ${id}
    `;

    // Update the denormalized count to match reality
    await sql`
      UPDATE collaborations 
      SET application_count = ${countCheck[0].count}
      WHERE id = ${id}
    `;

    console.log(
      "[Collaboration Apply API] POST: ✅ Application count synced to:",
      countCheck[0].count,
    );

    // 🔥 CREATE NOTIFICATION FOR COLLABORATION CREATOR
    console.log(
      "[Collaboration Apply API] POST: 🔔 Creating notification for creator...",
    );
    console.log(
      "[Collaboration Apply API] POST: 🔔 Notification will be sent to:",
      {
        recipient_user_id: collab[0].creator_user_id,
        recipient_profile_id: collab[0].creator_id,
        recipient_name: collab[0].creator_name,
        applicant_user_id: session.user.id,
        applicant_profile_id: profileId,
        applicant_name: profile[0].name,
        collaboration_id: id,
        collaboration_title: collab[0].title,
      },
    );

    try {
      const notificationResult = await sql`
        INSERT INTO notifications (
          user_id,
          profile_id,
          type,
          title,
          message,
          link,
          read,
          email_sent
        ) VALUES (
          ${collab[0].creator_user_id},
          ${collab[0].creator_id},
          'application',
          'New editor application received',
          ${`${profile[0].name} (@${profile[0].username}) applied to "${collab[0].title}". Review their application now!`},
          ${`/collaborations/${id}`},
          false,
          false
        )
        RETURNING *
      `;

      console.log(
        "[Collaboration Apply API] POST: ✅ Notification created successfully!",
      );
      console.log("[Collaboration Apply API] POST: 🔔 Notification details:", {
        notification_id: notificationResult[0]?.id,
        recipient_user_id: notificationResult[0]?.user_id,
        recipient_profile_id: notificationResult[0]?.profile_id,
        title: notificationResult[0]?.title,
        link: notificationResult[0]?.link,
        read: notificationResult[0]?.read,
        created_at: notificationResult[0]?.created_at,
      });
    } catch (notificationError) {
      console.error(
        "[Collaboration Apply API] POST: ❌ CRITICAL: Failed to create notification!",
        notificationError,
      );
      console.error(
        "[Collaboration Apply API] POST: ❌ Notification error details:",
        {
          error_message: notificationError.message,
          error_stack: notificationError.stack,
          creator_user_id: collab[0].creator_user_id,
          creator_profile_id: collab[0].creator_id,
        },
      );
      // Don't fail the application if notification fails - just log it
    }

    console.log(
      "[Collaboration Apply API] POST: ✅ SUCCESS - Application complete",
    );

    return Response.json({
      success: true,
      application: application[0],
    });
  } catch (error) {
    console.error(
      "[Collaboration Apply API] POST: ❌ Unexpected error:",
      error,
    );
    console.error("[Collaboration Apply API] POST: Stack trace:", error.stack);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
