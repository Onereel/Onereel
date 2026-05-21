import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * PERFECT MATCHES - AUTO-MATCHING ENGINE
 * ═══════════════════════════════════════════════════════════════════════
 *
 * This endpoint returns collaborations that are PERFECT matches for the user.
 * Criteria:
 * - User's skills overlap with required_skills
 * - User's role matches roles_needed
 * - High engagement (views, applications)
 * - Recent (posted in last 7 days get boost)
 * - Urgency (urgent collaborations prioritized)
 *
 * Psychology: "This was made for YOU"
 * ═══════════════════════════════════════════════════════════════════════
 */

export async function GET(request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    // Get user's profile
    const userProfile = await sql`
      SELECT id, skills, role, category
      FROM profiles
      WHERE user_id = ${session.user.id}
    `;

    if (!userProfile || userProfile.length === 0) {
      return Response.json(
        { success: false, error: "Profile not found" },
        { status: 404 },
      );
    }

    const profile = userProfile[0];
    const userSkills = (profile.skills || []).map((s) => s.toLowerCase());

    if (userSkills.length === 0) {
      // No skills set, return empty
      return Response.json({
        success: true,
        matches: [],
        message: "Set your skills to see perfect matches",
      });
    }

    // Get user's application history to avoid showing already-applied
    const applications = await sql`
      SELECT collaboration_id 
      FROM collaboration_applications
      WHERE applicant_id = ${profile.id}
    `;

    const appliedIds = applications.map((app) => app.collaboration_id);

    // Fetch active collaborations
    const collaborations = await sql`
      SELECT c.*,
        p.name as creator_name,
        p.username as creator_username,
        p.profile_image_url as creator_image,
        p.verified_creator as creator_verified
      FROM collaborations c
      JOIN profiles p ON p.id = c.creator_id
      WHERE c.status = 'active'
        AND c.creator_id != ${profile.id}
      ORDER BY c.created_at DESC
      LIMIT 100
    `;

    // Score and filter matches
    const scoredMatches = collaborations
      .map((collab) => {
        let matchScore = 0;
        const matchingSkills = [];

        // Skill overlap (most important)
        const requiredSkills = (collab.required_skills || []).map((s) =>
          s.toLowerCase(),
        );
        userSkills.forEach((userSkill) => {
          requiredSkills.forEach((reqSkill) => {
            if (reqSkill.includes(userSkill) || userSkill.includes(reqSkill)) {
              matchScore += 25;
              if (!matchingSkills.includes(userSkill)) {
                matchingSkills.push(userSkill);
              }
            }
          });
        });

        // Role match
        const rolesNeeded = (collab.roles_needed || []).map((r) =>
          r.toLowerCase(),
        );
        const userRole = (profile.role || "both").toLowerCase();

        const roleKeywords = {
          creator: ["creator", "youtuber", "influencer", "content creator"],
          freelancer: [
            "editor",
            "designer",
            "cinematographer",
            "animator",
            "photographer",
          ],
          both: ["creator", "editor", "designer"],
        };

        const relevantKeywords = roleKeywords[userRole] || roleKeywords.both;
        rolesNeeded.forEach((role) => {
          if (relevantKeywords.some((keyword) => role.includes(keyword))) {
            matchScore += 15;
          }
        });

        // Urgency boost
        if (collab.urgency_level === "urgent") {
          matchScore += 20;
        } else if (collab.urgency_level === "high") {
          matchScore += 10;
        }

        // Freshness boost
        const hoursSinceCreated =
          (Date.now() - new Date(collab.created_at)) / (1000 * 60 * 60);
        if (hoursSinceCreated < 24) {
          matchScore += 15;
        } else if (hoursSinceCreated < 72) {
          matchScore += 8;
        }

        // Engagement boost (popular collaborations)
        if (collab.view_count > 50) matchScore += 5;
        if (collab.application_count > 10) matchScore += 5;

        return {
          ...collab,
          match_score: Math.min(100, matchScore),
          matching_skills: matchingSkills,
          has_applied: appliedIds.includes(collab.id),
        };
      })
      .filter((match) => match.match_score >= 40) // Only show good matches
      .sort((a, b) => b.match_score - a.match_score);

    return Response.json({
      success: true,
      matches: scoredMatches.slice(0, 20), // Top 20 matches
    });
  } catch (error) {
    console.error("[Perfect Matches] error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
