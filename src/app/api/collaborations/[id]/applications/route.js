import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * COLLABORATION APPLICATIONS API
 * Fetch all applications for a specific collaboration
 * Only accessible by the collaboration creator
 * ═══════════════════════════════════════════════════════════════════════
 */

export async function GET(request, { params }) {
  console.log(
    "[Collaboration Applications API] GET: Fetching applications for collaboration ID:",
    params.id,
  );

  try {
    const { id } = params;

    // Try to get session - but handle failure gracefully
    let session = null;
    try {
      session = await auth();
    } catch (sessionError) {
      console.error(
        "[Collaboration Applications API] GET: Session fetch failed:",
        sessionError.message,
      );
      return Response.json(
        {
          success: false,
          error: "Authentication required to view applications",
          needsAuth: true,
        },
        { status: 401 },
      );
    }

    if (!session?.user) {
      console.log("[Collaboration Applications API] GET: No user in session");
      return Response.json(
        {
          success: false,
          error: "Authentication required to view applications",
          needsAuth: true,
        },
        { status: 401 },
      );
    }

    console.log(
      "[Collaboration Applications API] GET: User authenticated:",
      session.user.id,
    );

    // Get user's profile
    const profile = await sql`
      SELECT id FROM profiles WHERE user_id = ${session.user.id}
    `;

    if (!profile || profile.length === 0) {
      console.error(
        "[Collaboration Applications API] GET: Profile not found for user:",
        session.user.id,
      );
      return Response.json(
        { success: false, error: "Profile not found" },
        { status: 404 },
      );
    }

    const profileId = profile[0].id;
    console.log("[Collaboration Applications API] GET: Profile ID:", profileId);

    // Check if collaboration exists and get creator
    const collaboration = await sql`
      SELECT id, creator_id, title, status
      FROM collaborations
      WHERE id = ${id}
    `;

    if (!collaboration || collaboration.length === 0) {
      console.log(
        "[Collaboration Applications API] GET: ❌ Collaboration not found",
      );
      return Response.json(
        { success: false, error: "Collaboration not found", notFound: true },
        { status: 404 },
      );
    }

    const collab = collaboration[0];
    console.log(
      "[Collaboration Applications API] GET: Collaboration found:",
      collab.title,
    );
    console.log(
      "[Collaboration Applications API] GET: Creator ID:",
      collab.creator_id,
      "| Current user:",
      profileId,
    );

    // Verify the current user is the creator
    if (collab.creator_id !== profileId) {
      console.warn(
        "[Collaboration Applications API] GET: ⚠️ Unauthorized - User is not the creator",
      );
      return Response.json(
        {
          success: false,
          error: "Only the collaboration creator can view applications",
          unauthorized: true,
        },
        { status: 403 },
      );
    }

    console.log(
      "[Collaboration Applications API] GET: ✅ User verified as creator - fetching applications...",
    );

    // Fetch applications with applicant details
    const applications = await sql`
      SELECT 
        ca.id,
        ca.collaboration_id,
        ca.applicant_id,
        ca.message,
        ca.portfolio_highlights,
        ca.availability,
        ca.status,
        ca.created_at,
        p.name as applicant_name,
        p.username as applicant_username,
        p.profile_image_url as applicant_image,
        p.bio as applicant_bio,
        p.skills as applicant_skills,
        p.portfolio_links as applicant_portfolio,
        p.rating as applicant_rating,
        p.total_reviews as applicant_reviews,
        p.verified_creator as applicant_verified
      FROM collaboration_applications ca
      JOIN profiles p ON ca.applicant_id = p.id
      WHERE ca.collaboration_id = ${id}
      ORDER BY ca.created_at DESC
    `;

    console.log(
      "[Collaboration Applications API] GET: ✅ Found",
      applications.length,
      "applications",
    );

    // Log each application for debugging
    applications.forEach((app, idx) => {
      console.log(
        `[Collaboration Applications API] GET: Application ${idx + 1}:`,
        {
          id: app.id,
          applicant: app.applicant_name,
          status: app.status,
          created: app.created_at,
        },
      );
    });

    return Response.json({
      success: true,
      applications,
      count: applications.length,
      collaborationTitle: collab.title,
    });
  } catch (error) {
    console.error(
      "[Collaboration Applications API] GET: ❌ Unexpected error:",
      error,
    );
    console.error(
      "[Collaboration Applications API] GET: Stack trace:",
      error.stack,
    );
    return Response.json(
      {
        success: false,
        error: "Failed to fetch applications. Please try again.",
        serverError: true,
      },
      { status: 500 },
    );
  }
}

/**
 * ═══════════════════════════════════════════════════════════════════════
 * PATCH - Update application status (accept/reject)
 * When accepting: creates workspace, updates collaboration status, auto-declines others
 * ═══════════════════════════════════════════════════════════════════════
 */
export async function PATCH(request, { params }) {
  console.log(
    "[Collaboration Applications API] PATCH: Updating application status",
  );

  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    const { id } = params;
    const body = await request.json();
    const { applicationId, status } = body;

    if (!applicationId || !status) {
      return Response.json(
        { success: false, error: "Application ID and status are required" },
        { status: 400 },
      );
    }

    if (!["pending", "accepted", "declined", "withdrawn"].includes(status)) {
      return Response.json(
        { success: false, error: "Invalid status" },
        { status: 400 },
      );
    }

    console.log(
      "[Collaboration Applications API] PATCH: Application ID:",
      applicationId,
      "| New status:",
      status,
    );

    // Get user's profile
    const profile = await sql`
      SELECT id FROM profiles WHERE user_id = ${session.user.id}
    `;

    if (!profile || profile.length === 0) {
      return Response.json(
        { success: false, error: "Profile not found" },
        { status: 404 },
      );
    }

    const profileId = profile[0].id;

    // Verify ownership and get collaboration data
    const collaboration = await sql`
      SELECT id, creator_id, title, status FROM collaborations WHERE id = ${id}
    `;

    if (!collaboration || collaboration.length === 0) {
      return Response.json(
        { success: false, error: "Collaboration not found" },
        { status: 404 },
      );
    }

    if (collaboration[0].creator_id !== profileId) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 },
      );
    }

    // Get application details
    const application = await sql`
      SELECT applicant_id, status as current_status 
      FROM collaboration_applications 
      WHERE id = ${applicationId} AND collaboration_id = ${id}
    `;

    if (!application || application.length === 0) {
      return Response.json(
        { success: false, error: "Application not found" },
        { status: 404 },
      );
    }

    const applicantId = application[0].applicant_id;

    // If accepting, check if workspace already exists
    if (status === "accepted") {
      console.log(
        "[Collaboration Applications API] PATCH: Accepting application - checking for existing workspace",
      );

      const existingWorkspace = await sql`
        SELECT id FROM workspaces WHERE collaboration_id = ${id}
      `;

      if (existingWorkspace && existingWorkspace.length > 0) {
        return Response.json(
          {
            success: false,
            error: "This collaboration already has an accepted editor",
          },
          { status: 400 },
        );
      }

      // Update application status
      const updated = await sql`
        UPDATE collaboration_applications
        SET status = ${status}
        WHERE id = ${applicationId} AND collaboration_id = ${id}
        RETURNING *
      `;

      if (!updated || updated.length === 0) {
        return Response.json(
          { success: false, error: "Failed to update application" },
          { status: 500 },
        );
      }

      console.log(
        "[Collaboration Applications API] PATCH: ✅ Application accepted, creating workspace...",
      );

      // Create workspace
      const workspace = await sql`
        INSERT INTO workspaces (
          collaboration_id,
          application_id,
          creator_id,
          editor_id,
          status
        ) VALUES (
          ${id},
          ${applicationId},
          ${profileId},
          ${applicantId},
          'active'
        )
        RETURNING *
      `;

      if (!workspace || workspace.length === 0) {
        console.error(
          "[Collaboration Applications API] PATCH: ❌ Failed to create workspace",
        );
        return Response.json(
          { success: false, error: "Failed to create workspace" },
          { status: 500 },
        );
      }

      const workspaceId = workspace[0].id;
      console.log(
        "[Collaboration Applications API] PATCH: ✅ Workspace created - ID:",
        workspaceId,
      );

      // Update collaboration status to filled
      await sql`
        UPDATE collaborations
        SET status = 'filled'
        WHERE id = ${id}
      `;

      console.log(
        "[Collaboration Applications API] PATCH: ✅ Collaboration marked as filled",
      );

      // 🔥 FIX: Get all other pending applications BEFORE declining them
      const otherApplications = await sql`
        SELECT ca.id, ca.applicant_id, p.user_id, p.name
        FROM collaboration_applications ca
        JOIN profiles p ON ca.applicant_id = p.id
        WHERE ca.collaboration_id = ${id} 
          AND ca.status = 'pending'
          AND ca.id != ${applicationId}
      `;

      console.log(
        "[Collaboration Applications API] PATCH: Found",
        otherApplications.length,
        "other pending applications to auto-decline",
      );

      // Decline all other pending applications
      await sql`
        UPDATE collaboration_applications
        SET status = 'declined'
        WHERE collaboration_id = ${id} 
          AND status = 'pending'
          AND id != ${applicationId}
      `;

      console.log(
        "[Collaboration Applications API] PATCH: ✅ Other applications auto-declined",
      );

      // 🔥 FIX: Send notifications to all auto-declined applicants
      for (const otherApp of otherApplications) {
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
            ${otherApp.user_id},
            ${otherApp.applicant_id},
            'application',
            'Application not selected',
            ${`The creator selected another editor for "${collaboration[0].title}". Keep applying to other opportunities!`},
            ${`/collaborations/${id}`},
            false
          )
        `;
        console.log(
          "[Collaboration Applications API] PATCH: ✅ Auto-decline notification sent to:",
          otherApp.name,
        );
      }

      // Create workspace activity - workspace created
      await sql`
        INSERT INTO workspace_activity (
          workspace_id,
          actor_id,
          activity_type,
          metadata
        ) VALUES (
          ${workspaceId},
          ${profileId},
          'created',
          ${JSON.stringify({ collaboration_title: collaboration[0].title })}
        )
      `;

      console.log(
        "[Collaboration Applications API] PATCH: ✅ Workspace activity logged",
      );

      // Create notification for accepted editor
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
          (SELECT user_id FROM profiles WHERE id = ${applicantId}),
          ${applicantId},
          'application',
          '🎉 Your application was accepted!',
          ${`Your application for "${collaboration[0].title}" was accepted. The workspace is ready.`},
          ${`/workspace/${workspaceId}`},
          false
        )
      `;

      console.log(
        "[Collaboration Applications API] PATCH: ✅ Notification sent to accepted editor",
      );
      console.log(
        "[Collaboration Applications API] PATCH: ✅ SUCCESS - Workspace created",
      );

      return Response.json({
        success: true,
        application: updated[0],
        workspace: workspace[0],
        workspaceId,
      });
    }

    // 🔥 FIX: For DECLINED status, send notification to applicant
    if (status === "declined") {
      console.log(
        "[Collaboration Applications API] PATCH: Declining application - will send notification",
      );

      // Update application status
      const updated = await sql`
        UPDATE collaboration_applications
        SET status = ${status}
        WHERE id = ${applicationId} AND collaboration_id = ${id}
        RETURNING *
      `;

      if (!updated || updated.length === 0) {
        return Response.json(
          { success: false, error: "Application not found" },
          { status: 404 },
        );
      }

      // Send notification to the declined applicant
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
          (SELECT user_id FROM profiles WHERE id = ${applicantId}),
          ${applicantId},
          'application',
          'Application declined',
          ${`Your application for "${collaboration[0].title}" was not selected. Keep exploring other opportunities!`},
          ${`/collaborations/${id}`},
          false
        )
      `;

      console.log(
        "[Collaboration Applications API] PATCH: ✅ Decline notification sent to applicant",
      );
      console.log(
        "[Collaboration Applications API] PATCH: ✅ Application status updated to:",
        status,
      );

      return Response.json({
        success: true,
        application: updated[0],
      });
    }

    // For other status updates (pending, withdrawn, etc.), just update the application
    const updated = await sql`
      UPDATE collaboration_applications
      SET status = ${status}
      WHERE id = ${applicationId} AND collaboration_id = ${id}
      RETURNING *
    `;

    if (!updated || updated.length === 0) {
      return Response.json(
        { success: false, error: "Application not found" },
        { status: 404 },
      );
    }

    console.log(
      "[Collaboration Applications API] PATCH: ✅ Application status updated to:",
      status,
    );

    return Response.json({
      success: true,
      application: updated[0],
    });
  } catch (error) {
    console.error("[Collaboration Applications API] PATCH error:", error);
    console.error(
      "[Collaboration Applications API] PATCH Stack trace:",
      error.stack,
    );
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
