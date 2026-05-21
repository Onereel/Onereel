import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * CREATIVE GRAPH API
 * Network Effect Engine - Auto-builds relationships from real activity
 * ═══════════════════════════════════════════════════════════════════════
 */

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return Response.json(
        { success: false, error: "user_id required" },
        { status: 400 },
      );
    }

    // Get user's profile ID
    const profiles = await sql`
      SELECT id FROM profiles WHERE user_id = ${userId}
    `;

    if (profiles.length === 0) {
      return Response.json(
        { success: false, error: "Profile not found" },
        { status: 404 },
      );
    }

    const profileId = profiles[0].id;

    // Get all connections for this user
    const connections = await sql`
      SELECT 
        cc.*,
        p.name as connected_name,
        p.profile_image_url as connected_image,
        p.username as connected_username,
        p.skills as connected_skills,
        p.trust_level as connected_trust_level
      FROM creative_connections cc
      JOIN profiles p ON p.id = cc.connected_user_id
      WHERE cc.user_id = ${profileId}
      ORDER BY cc.strength_score DESC, cc.last_worked_together DESC
      LIMIT 50
    `;

    // Group by connection type
    const grouped = {
      frequent_collaborators: connections.filter(
        (c) => c.strength_score >= 3 && c.connection_type === "collaboration",
      ),
      recent_work: connections.filter((c) => {
        const daysSince =
          (Date.now() - new Date(c.last_worked_together).getTime()) /
          (1000 * 60 * 60 * 24);
        return daysSince <= 30;
      }),
      trusted_partners: connections.filter((c) => c.project_count >= 5),
      all_connections: connections,
    };

    return Response.json({
      success: true,
      connections: grouped,
      total: connections.length,
    });
  } catch (error) {
    console.error("Error fetching creative connections:", error);
    return Response.json(
      { success: false, error: "Failed to fetch connections" },
      { status: 500 },
    );
  }
}

/**
 * CREATE CONNECTION (Internal API - called after completed work)
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id, connected_user_id, connection_type, project_id } = body;

    if (!user_id || !connected_user_id || !connection_type) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if connection exists - if so, strengthen it
    const existing = await sql`
      SELECT * FROM creative_connections
      WHERE user_id = ${user_id} 
      AND connected_user_id = ${connected_user_id}
      AND connection_type = ${connection_type}
    `;

    if (existing.length > 0) {
      // Strengthen existing connection
      const updated = await sql`
        UPDATE creative_connections
        SET 
          strength_score = strength_score + 1,
          project_count = project_count + 1,
          last_worked_together = CURRENT_TIMESTAMP
        WHERE id = ${existing[0].id}
        RETURNING *
      `;

      return Response.json({
        success: true,
        connection: updated[0],
        action: "strengthened",
      });
    }

    // Create new connection
    const newConnection = await sql`
      INSERT INTO creative_connections (
        user_id,
        connected_user_id,
        connection_type,
        strength_score,
        project_count,
        last_worked_together
      )
      VALUES (
        ${user_id},
        ${connected_user_id},
        ${connection_type},
        1,
        1,
        CURRENT_TIMESTAMP
      )
      RETURNING *
    `;

    // Create reciprocal connection
    await sql`
      INSERT INTO creative_connections (
        user_id,
        connected_user_id,
        connection_type,
        strength_score,
        project_count,
        last_worked_together
      )
      VALUES (
        ${connected_user_id},
        ${user_id},
        ${connection_type},
        1,
        1,
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (user_id, connected_user_id, connection_type)
      DO UPDATE SET
        strength_score = creative_connections.strength_score + 1,
        project_count = creative_connections.project_count + 1,
        last_worked_together = CURRENT_TIMESTAMP
    `;

    return Response.json({
      success: true,
      connection: newConnection[0],
      action: "created",
    });
  } catch (error) {
    console.error("Error creating connection:", error);
    return Response.json(
      { success: false, error: "Failed to create connection" },
      { status: 500 },
    );
  }
}
