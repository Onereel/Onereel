import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * HIGH-INTELLIGENCE RECOMMENDATION ENGINE
 * Multi-signal matching that feels like magic
 * ═══════════════════════════════════════════════════════════════════════
 */

/**
 * Calculate match score between user and collaboration
 * Future-ready for AI scoring
 */
function calculateMatchScore(
  collaboration,
  userProfile,
  userApplicationHistory,
) {
  let score = 0;
  const weights = {
    skillOverlap: 40, // Most important
    roleMatch: 25, // User's role preference
    pastApplications: 15, // Similar categories applied to
    industryMatch: 10, // Industry preference
    urgency: 5, // High urgency = slight boost
    freshness: 5, // New opportunities = slight boost
  };

  // 1. Skill Overlap (0-40 points)
  const userSkills = (userProfile.skills || []).map((s) => s.toLowerCase());
  const requiredSkills = (collaboration.required_skills || []).map((s) =>
    s.toLowerCase(),
  );
  const skillMatches = userSkills.filter((skill) =>
    requiredSkills.some((req) => req.includes(skill) || skill.includes(req)),
  ).length;

  if (userSkills.length > 0 && requiredSkills.length > 0) {
    const skillOverlapRatio = skillMatches / Math.max(requiredSkills.length, 1);
    score += skillOverlapRatio * weights.skillOverlap;
  }

  // 2. Role Match (0-25 points)
  const rolesNeeded = (collaboration.roles_needed || []).map((r) =>
    r.toLowerCase(),
  );
  const userRole = (userProfile.role || "both").toLowerCase();

  if (rolesNeeded.length > 0) {
    const roleKeywords = {
      creator: ["creator", "youtuber", "influencer", "content creator"],
      freelancer: [
        "editor",
        "designer",
        "cinematographer",
        "animator",
        "photographer",
        "writer",
        "producer",
      ],
      both: [...["creator", "youtuber"], ...["editor", "designer"]],
    };

    const relevantKeywords = roleKeywords[userRole] || roleKeywords.both;
    const roleMatches = rolesNeeded.filter((role) =>
      relevantKeywords.some((keyword) => role.includes(keyword)),
    ).length;

    score += (roleMatches / rolesNeeded.length) * weights.roleMatch;
  }

  // 3. Past Application Pattern (0-15 points)
  if (userApplicationHistory.length > 0) {
    const appliedToSimilarType = userApplicationHistory.filter(
      (app) => app.collab_type === collaboration.collab_type,
    ).length;

    const appliedToSimilarIndustry = userApplicationHistory.filter(
      (app) => app.industry === collaboration.industry,
    ).length;

    if (appliedToSimilarType > 0) score += 7;
    if (appliedToSimilarIndustry > 0) score += 8;
  }

  // 4. Industry/Category Match (0-10 points)
  if (userProfile.category && collaboration.industry) {
    const categoryLower = userProfile.category.toLowerCase();
    const industryLower = collaboration.industry.toLowerCase();

    if (
      categoryLower === industryLower ||
      categoryLower.includes(industryLower) ||
      industryLower.includes(categoryLower)
    ) {
      score += weights.industryMatch;
    }
  }

  // 5. Urgency Boost (0-5 points)
  if (collaboration.urgency_level === "urgent") {
    score += weights.urgency;
  } else if (collaboration.urgency_level === "high") {
    score += weights.urgency * 0.6;
  }

  // 6. Freshness Boost (0-5 points)
  const hoursSinceCreated =
    (Date.now() - new Date(collaboration.created_at)) / (1000 * 60 * 60);
  if (hoursSinceCreated < 24) {
    score += weights.freshness;
  } else if (hoursSinceCreated < 72) {
    score += weights.freshness * 0.5;
  }

  return Math.min(100, Math.round(score));
}

export async function GET(request) {
  try {
    const session = await auth();

    // ═══════════════════════════════════════════════════════════════════
    // PUBLIC RECOMMENDATIONS (No Auth)
    // Show trending/popular collaborations
    // ═══════════════════════════════════════════════════════════════════
    if (!session?.user) {
      const trending = await sql`
        SELECT 
          c.*,
          p.name as creator_name,
          p.username as creator_username,
          p.profile_image_url as creator_image,
          p.verified_creator as creator_verified,
          (c.view_count + c.application_count * 2 + c.save_count * 3) as engagement_score
        FROM collaborations c
        JOIN profiles p ON c.creator_id = p.id
        WHERE c.status = 'active'
          AND c.visibility = 'public'
          AND (c.expires_at IS NULL OR c.expires_at > NOW())
        ORDER BY engagement_score DESC, c.created_at DESC
        LIMIT 6
      `;

      return Response.json({
        success: true,
        opportunities: trending.map((c) => ({
          ...c,
          match_score: 0,
          match_reason: "trending",
        })),
        collaborators: [],
        recommendationQuality: "trending",
      });
    }

    // ═══════════════════════════════════════════════════════════════════
    // PERSONALIZED RECOMMENDATIONS (Authenticated)
    // Multi-signal intelligent matching
    // ═══════════════════════════════════════════════════════════════════

    // Get user's profile
    const profile = await sql`
      SELECT id, skills, category, role FROM profiles WHERE user_id = ${session.user.id}
    `;

    if (!profile || profile.length === 0) {
      return Response.json({
        success: true,
        opportunities: [],
        collaborators: [],
        recommendationQuality: "no_profile",
      });
    }

    const userProfile = profile[0];

    // Get user's application history for pattern learning
    const applicationHistory = await sql`
      SELECT 
        c.collab_type,
        c.industry,
        c.niche,
        c.roles_needed
      FROM collaboration_applications ca
      JOIN collaborations c ON ca.collaboration_id = c.id
      WHERE ca.applicant_id = ${userProfile.id}
      ORDER BY ca.created_at DESC
      LIMIT 20
    `;

    // Fetch candidate collaborations (exclude user's own)
    const candidates = await sql`
      SELECT 
        c.*,
        p.name as creator_name,
        p.username as creator_username,
        p.profile_image_url as creator_image,
        p.verified_creator as creator_verified
      FROM collaborations c
      JOIN profiles p ON c.creator_id = p.id
      WHERE c.status = 'active'
        AND c.visibility = 'public'
        AND c.creator_id != ${userProfile.id}
        AND (c.expires_at IS NULL OR c.expires_at > NOW())
        AND c.id NOT IN (
          SELECT collaboration_id 
          FROM collaboration_applications 
          WHERE applicant_id = ${userProfile.id}
        )
      ORDER BY c.created_at DESC
      LIMIT 50
    `;

    // Score each collaboration
    const scoredOpportunities = candidates.map((collab) => {
      const matchScore = calculateMatchScore(
        collab,
        userProfile,
        applicationHistory,
      );

      // Determine match reason for UI display
      let matchReason = "general";
      if (matchScore >= 70) matchReason = "perfect_match";
      else if (matchScore >= 50) matchReason = "strong_match";
      else if (matchScore >= 30) matchReason = "good_match";

      return {
        ...collab,
        match_score: matchScore,
        match_reason: matchReason,
        // AI-ready fields for future ML
        skill_vector: userProfile.skills || [],
        interaction_weight: matchScore / 100,
      };
    });

    // Sort by score and take top recommendations
    scoredOpportunities.sort((a, b) => b.match_score - a.match_score);

    // Determine recommendation quality
    const topScore = scoredOpportunities[0]?.match_score || 0;
    let recommendationQuality = "low_confidence";

    if (topScore >= 70) recommendationQuality = "high_confidence";
    else if (topScore >= 40) recommendationQuality = "medium_confidence";

    // If confidence is low, mix in trending
    let finalRecommendations = scoredOpportunities.slice(0, 6);

    if (
      recommendationQuality === "low_confidence" &&
      finalRecommendations.length < 6
    ) {
      const trending = await sql`
        SELECT 
          c.*,
          p.name as creator_name,
          p.username as creator_username,
          p.profile_image_url as creator_image,
          p.verified_creator as creator_verified
        FROM collaborations c
        JOIN profiles p ON c.creator_id = p.id
        WHERE c.status = 'active'
          AND c.visibility = 'public'
          AND c.creator_id != ${userProfile.id}
          AND (c.expires_at IS NULL OR c.expires_at > NOW())
          AND c.id NOT IN (${finalRecommendations.map((r) => r.id).concat([0])})
        ORDER BY (c.view_count + c.application_count * 2) DESC
        LIMIT ${6 - finalRecommendations.length}
      `;

      finalRecommendations = [
        ...finalRecommendations,
        ...trending.map((t) => ({
          ...t,
          match_score: 20,
          match_reason: "trending_fallback",
          skill_vector: [],
          interaction_weight: 0.2,
        })),
      ];
    }

    // Recommend collaborators with complementary skills
    const collaborators = await sql`
      SELECT 
        p.id,
        p.name,
        p.username,
        p.profile_image_url,
        p.verified_creator,
        p.bio,
        p.skills,
        p.rating,
        p.total_reviews
      FROM profiles p
      WHERE p.id != ${userProfile.id}
        AND p.skills IS NOT NULL
        AND array_length(p.skills, 1) > 0
      ORDER BY p.rating DESC, p.total_reviews DESC
      LIMIT 6
    `;

    return Response.json({
      success: true,
      opportunities: finalRecommendations,
      collaborators,
      recommendationQuality,
      userHasSkills: (userProfile.skills || []).length > 0,
    });
  } catch (error) {
    console.error("[Recommendations API] error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
