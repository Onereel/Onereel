import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * COLLABORATION DETAIL API
 * Session-independent fetch with optional user features
 * Returns workspace info for both creator and accepted editor
 * ═══════════════════════════════════════════════════════════════════════
 */

export async function GET(request, { params }) {
  console.log(
    "[Collaboration Detail API] GET: Fetching collaboration ID:",
    params.id,
  );

  try {
    const { id } = params;

    // Fetch collaboration data (session-independent)
    console.log("[Collaboration Detail API] GET: Querying database...");

    const collaboration = await sql`
      SELECT 
        c.*,
        p.name as creator_name,
        p.username as creator_username,
        p.profile_image_url as creator_image,
        p.verified_creator as creator_verified,
        p.rating as creator_rating,
        p.total_reviews as creator_total_reviews,
        p.bio as creator_bio,
        (SELECT COUNT(*) FROM collaboration_applications WHERE collaboration_id = c.id) as application_count,
        (SELECT COUNT(*) FROM collaboration_saves WHERE collaboration_id = c.id) as save_count
      FROM collaborations c
      JOIN profiles p ON c.creator_id = p.id
      WHERE c.id = ${id}
    `;

    if (!collaboration || collaboration.length === 0) {
      console.log(
        "[Collaboration Detail API] GET: ❌ Collaboration not found in database",
      );
      return Response.json(
        { success: false, error: "Collaboration not found", notFound: true },
        { status: 404 },
      );
    }

    console.log(
      "[Collaboration Detail API] GET: ✅ Collaboration found:",
      collaboration[0].title,
    );

    // Try to get session (optional - don't fail if this errors)
    let isSaved = false;
    let hasApplied = false;
    let currentProfileId = null;
    let session = null;
    let workspaceInfo = null; // Workspace info for creator or accepted editor
    let acceptedEditorInfo = null; // For creator to see who they accepted

    try {
      session = await auth();
      console.log(
        "[Collaboration Detail API] GET: Session check:",
        session ? "authenticated" : "guest",
      );
    } catch (sessionError) {
      console.warn(
        "[Collaboration Detail API] GET: Session fetch failed (continuing as guest):",
        sessionError.message,
      );
      // Continue without session - this is fine for viewing collaborations
    }

    // If user is authenticated, check saved/applied status
    if (session?.user) {
      try {
        const profile = await sql`
          SELECT id FROM profiles WHERE user_id = ${session.user.id}
        `;

        if (profile && profile.length > 0) {
          currentProfileId = profile[0].id;
          console.log(
            "[Collaboration Detail API] GET: Current user profile ID:",
            currentProfileId,
          );

          const saved = await sql`
            SELECT id FROM collaboration_saves 
            WHERE collaboration_id = ${id} AND profile_id = ${currentProfileId}
          `;
          isSaved = saved.length > 0;

          // Check if user is the creator
          const isCreator = collaboration[0].creator_id === currentProfileId;
          console.log("[Collaboration Detail API] GET: Is creator:", isCreator);

          // If creator, get workspace info and accepted editor details
          if (isCreator) {
            const workspace = await sql`
              SELECT 
                w.id as workspace_id,
                w.status as workspace_status,
                w.editor_id,
                w.created_at as workspace_created_at,
                p.name as editor_name,
                p.username as editor_username,
                p.profile_image_url as editor_image,
                p.verified_creator as editor_verified,
                p.bio as editor_bio,
                p.skills as editor_skills,
                p.rating as editor_rating,
                p.total_reviews as editor_total_reviews,
                ca.id as application_id
              FROM workspaces w
              JOIN profiles p ON w.editor_id = p.id
              JOIN collaboration_applications ca ON w.application_id = ca.id
              WHERE w.collaboration_id = ${id}
              LIMIT 1
            `;

            if (workspace && workspace.length > 0) {
              workspaceInfo = {
                workspace_id: workspace[0].workspace_id,
                workspace_status: workspace[0].workspace_status,
                workspace_created_at: workspace[0].workspace_created_at,
              };

              acceptedEditorInfo = {
                id: workspace[0].editor_id,
                name: workspace[0].editor_name,
                username: workspace[0].editor_username,
                image: workspace[0].editor_image,
                verified: workspace[0].editor_verified,
                bio: workspace[0].editor_bio,
                skills: workspace[0].editor_skills,
                rating: workspace[0].editor_rating,
                total_reviews: workspace[0].editor_total_reviews,
              };

              console.log(
                "[Collaboration Detail API] GET: ✅ Creator workspace found:",
                {
                  workspaceId: workspaceInfo.workspace_id,
                  editorName: acceptedEditorInfo.name,
                  workspaceStatus: workspaceInfo.workspace_status,
                },
              );
            }

            // Return creator-specific response
            return Response.json({
              success: true,
              collaboration: {
                ...collaboration[0],
                creator_id: collaboration[0].creator_id,
              },
              isSaved,
              hasApplied: false,
              currentProfileId,
              applicationStatus: null,
              applicationId: null,
              workspaceId: workspaceInfo?.workspace_id || null,
              appliedAt: null,
              isCreator: true,
              workspaceInfo,
              acceptedEditorInfo,
            });
          } else {
            // If not creator, check if user has applied
            const applicationData = await sql`
              SELECT 
                ca.id as application_id,
                ca.status,
                ca.created_at as applied_at,
                w.id as workspace_id,
                w.status as workspace_status
              FROM collaboration_applications ca
              LEFT JOIN workspaces w ON ca.id = w.application_id
              WHERE ca.collaboration_id = ${id} AND ca.applicant_id = ${currentProfileId}
            `;

            if (applicationData && applicationData.length > 0) {
              hasApplied = true;
              const appDetails = applicationData[0];

              console.log(
                "[Collaboration Detail API] GET: ✅ User application details:",
                {
                  applicationId: appDetails.application_id,
                  status: appDetails.status,
                  workspaceId: appDetails.workspace_id,
                  appliedAt: appDetails.applied_at,
                },
              );

              // Build workspace info for accepted editor
              if (appDetails.workspace_id) {
                workspaceInfo = {
                  workspace_id: appDetails.workspace_id,
                  workspace_status: appDetails.workspace_status,
                };
              }

              // Return full application details for editor
              return Response.json({
                success: true,
                collaboration: {
                  ...collaboration[0],
                  creator_id: collaboration[0].creator_id,
                },
                isSaved,
                hasApplied: true,
                currentProfileId,
                applicationStatus: appDetails.status,
                applicationId: appDetails.application_id,
                workspaceId: appDetails.workspace_id,
                appliedAt: appDetails.applied_at,
                isCreator: false,
                workspaceInfo,
                acceptedEditorInfo: null,
              });
            } else {
              hasApplied = false;
            }
          }

          console.log("[Collaboration Detail API] GET: User interaction:", {
            isSaved,
            hasApplied,
            isCreator,
          });
        }
      } catch (profileError) {
        console.warn(
          "[Collaboration Detail API] GET: Profile check failed (continuing):",
          profileError.message,
        );
        // Continue anyway - user can still view the collaboration
      }
    }

    console.log(
      "[Collaboration Detail API] GET: ✅ Returning collaboration data (guest or no application)",
    );

    return Response.json({
      success: true,
      collaboration: {
        ...collaboration[0],
        creator_id: collaboration[0].creator_id,
      },
      isSaved,
      hasApplied: false,
      currentProfileId,
      applicationStatus: null,
      applicationId: null,
      workspaceId: null,
      appliedAt: null,
      isCreator: collaboration[0].creator_id === currentProfileId,
      workspaceInfo: null,
      acceptedEditorInfo: null,
    });
  } catch (error) {
    console.error(
      "[Collaboration Detail API] GET: ❌ Unexpected error:",
      error,
    );
    console.error("[Collaboration Detail API] GET: Stack trace:", error.stack);
    return Response.json(
      {
        success: false,
        error: "Failed to load collaboration. Please try again.",
        serverError: true,
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    if (body.incrementViews) {
      await sql`
        UPDATE collaborations 
        SET view_count = view_count + 1 
        WHERE id = ${id}
      `;
      console.log(
        "[Collaboration Detail API] PATCH: View count incremented for ID:",
        id,
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("[Collaboration Detail API] PATCH error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    const { id } = params;

    // Verify ownership
    const profile = await sql`
      SELECT id FROM profiles WHERE user_id = ${session.user.id}
    `;

    if (!profile || profile.length === 0) {
      return Response.json(
        { success: false, error: "Profile not found" },
        { status: 404 },
      );
    }

    const collab = await sql`
      SELECT creator_id FROM collaborations WHERE id = ${id}
    `;

    if (!collab || collab.length === 0) {
      return Response.json(
        { success: false, error: "Collaboration not found" },
        { status: 404 },
      );
    }

    if (collab[0].creator_id !== profile[0].id) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 },
      );
    }

    await sql`DELETE FROM collaborations WHERE id = ${id}`;
    console.log(
      "[Collaboration Detail API] DELETE: Collaboration deleted:",
      id,
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error("[Collaboration Detail API] DELETE error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
