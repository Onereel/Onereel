import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * INTRODUCTION ENGINE
 * ═══════════════════════════════════════════════════════════════════════
 *
 * When someone applies, both sides get notified:
 *
 * To Project Owner:
 * → "🔥 Someone just applied to your collaboration."
 *
 * To Applicant:
 * → "🚀 You're in! The creator has been notified."
 *
 * This creates MOMENTUM and makes the marketplace feel alive.
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

    const body = await request.json();
    const { collaboration_id } = body;

    // Get collaboration and latest application
    const collab = await sql`
      SELECT c.id, c.title, c.creator_id,
        p.name as creator_name,
        p.user_id as creator_user_id
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

    // Get applicant info
    const applicant = await sql`
      SELECT p.id, p.name, p.user_id
      FROM profiles p
      WHERE p.user_id = ${session.user.id}
    `;

    if (!applicant || applicant.length === 0) {
      return Response.json(
        { success: false, error: "Applicant profile not found" },
        { status: 404 },
      );
    }

    const applicantProfile = applicant[0];

    // 🔥 SEND NOTIFICATION TO CREATOR
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
        ${collaboration.creator_user_id},
        ${collaboration.creator_id},
        'application',
        '🔥 New application to your collaboration',
        ${`${applicantProfile.name} is interested in "${collaboration.title}". View their application now!`},
        ${`/dashboard?tab=applications`},
        false,
        false
      )
    `;

    // 🔥 SEND CONFIRMATION TO APPLICANT
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
        ${applicantProfile.user_id},
        ${applicantProfile.id},
        'application',
        '🚀 You're in! Application sent',
        ${`Your application to "${collaboration.title}" has been sent to ${collaboration.creator_name}.`},
        ${`/collaborations/${collaboration.id}`},
        false,
        false
      )
    `;

    return Response.json({
      success: true,
      message: "Introduction triggered successfully",
    });
  } catch (error) {
    console.error("[Introduction Engine] error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
