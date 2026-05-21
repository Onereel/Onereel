import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * ADMIN INTRO SENDER
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Allows admins to manually send personalized introductions between
 * users and perfect-match collaborations.
 *
 * This is critical for early marketplace success.
 * ═══════════════════════════════════════════════════════════════════════
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

    // Check admin status
    const adminCheck = await sql`
      SELECT id FROM admin_users WHERE user_id = ${session.user.id}
    `;

    if (!adminCheck || adminCheck.length === 0) {
      return Response.json(
        { success: false, error: "Admin access required" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { user_id, collaboration_id } = body;

    // Get user profile
    const userProfile = await sql`
      SELECT p.id, p.user_id, p.name
      FROM profiles p
      WHERE p.id = ${user_id}
    `;

    if (!userProfile || userProfile.length === 0) {
      return Response.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    const profile = userProfile[0];

    // Get collaboration
    const collab = await sql`
      SELECT c.id, c.title, c.creator_id,
        p.name as creator_name
      FROM collaborations c
      JOIN profiles p ON p.id = c.creator_id
      WHERE c.id = ${collaboration_id}
    `;

    if (!collab || collab.length === 0) {
      return Response.json(
        { success: false, error: "Collaboration not found" },
        { status: 404 },
      );
    }

    const collaboration = collab[0];

    // Send personalized notification
    await sql`
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
        ${profile.user_id},
        ${profile.id},
        'system',
        '✨ We found a perfect match for you',
        ${`Hi ${profile.name}! We think you'd be great for "${collaboration.title}" by ${collaboration.creator_name}. Check it out!`},
        ${`/collaborations/${collaboration.id}`},
        false,
        false
      )
    `;

    return Response.json({
      success: true,
      message: `Introduction sent to ${profile.name}`,
    });
  } catch (error) {
    console.error("[Admin Send Intro] error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
