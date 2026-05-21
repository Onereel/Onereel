import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * COLLABORATIONS API
 * Premium creator network - opportunity feed & creation
 * ═══════════════════════════════════════════════════════════════════════
 */

// GET - Fetch collaboration feed with smart filtering
export async function GET(request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);

    // Filters
    const industry = searchParams.get("industry");
    const niche = searchParams.get("niche");
    const collabType = searchParams.get("type");
    const collabStyle = searchParams.get("style");
    const skills = searchParams.get("skills"); // Comma-separated
    const status = searchParams.get("status") || "active";
    const featured = searchParams.get("featured") === "true";

    // Get current user's profile ID if authenticated
    let currentProfileId = null;
    if (session?.user) {
      const profile = await sql`
        SELECT id FROM profiles WHERE user_id = ${session.user.id}
      `;
      if (profile && profile.length > 0) {
        currentProfileId = profile[0].id;
      }
    }

    // Build dynamic query
    let query = `
      SELECT 
        c.*,
        p.name as creator_name,
        p.username as creator_username,
        p.profile_image_url as creator_image,
        p.verified_creator as creator_verified,
        p.rating as creator_rating,
        (SELECT COUNT(*) FROM collaboration_applications WHERE collaboration_id = c.id) as application_count,
        (SELECT COUNT(*) FROM collaboration_saves WHERE collaboration_id = c.id) as save_count
        ${currentProfileId ? `, (SELECT COUNT(*) > 0 FROM collaboration_applications WHERE collaboration_id = c.id AND applicant_id = $${2}) as has_applied` : ", false as has_applied"}
      FROM collaborations c
      JOIN profiles p ON c.creator_id = p.id
      WHERE c.status = $1
    `;

    const params = [status];
    if (currentProfileId) {
      params.push(currentProfileId);
    }
    let paramIndex = currentProfileId ? 3 : 2;

    if (industry) {
      query += ` AND LOWER(c.industry) = LOWER($${paramIndex})`;
      params.push(industry);
      paramIndex++;
    }

    if (niche) {
      query += ` AND LOWER(c.niche) = LOWER($${paramIndex})`;
      params.push(niche);
      paramIndex++;
    }

    if (collabType) {
      query += ` AND c.collab_type = $${paramIndex}`;
      params.push(collabType);
      paramIndex++;
    }

    if (collabStyle) {
      query += ` AND c.collab_style = $${paramIndex}`;
      params.push(collabStyle);
      paramIndex++;
    }

    if (skills) {
      const skillArray = skills.split(",").map((s) => s.trim());
      query += ` AND c.required_skills && $${paramIndex}::text[]`;
      params.push(skillArray);
      paramIndex++;
    }

    if (featured) {
      query += ` AND c.is_featured = true`;
    }

    // Exclude expired
    query += ` AND (c.expires_at IS NULL OR c.expires_at > NOW())`;

    // 🔥 PRIMARY SORT: NEWEST FIRST (then featured, then urgency)
    query += ` ORDER BY c.created_at DESC, c.is_featured DESC, 
      CASE c.urgency_level 
        WHEN 'urgent' THEN 1 
        WHEN 'high' THEN 2 
        WHEN 'normal' THEN 3 
        WHEN 'low' THEN 4 
      END LIMIT 50`;

    const collaborations = await sql(query, params);

    console.log(
      "[Collaborations API] GET: Fetched",
      collaborations.length,
      "collaborations (sorted newest first)",
    );

    return Response.json({
      success: true,
      collaborations,
      count: collaborations.length,
    });
  } catch (error) {
    console.error("[Collaborations API] GET error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// POST - Create new collaboration opportunity
export async function POST(request) {
  console.log("[Collaborations API] ═══════════════════════════════════════");
  console.log("[Collaborations API] POST: Starting collaboration creation...");
  console.log("[Collaborations API] Request headers:", {
    host: request.headers.get("host"),
    origin: request.headers.get("origin"),
    cookie: request.headers.get("cookie") ? "PRESENT" : "MISSING",
    "content-type": request.headers.get("content-type"),
  });

  try {
    console.log("[Collaborations API] POST: Calling auth()...");
    const session = await auth();

    console.log("[Collaborations API] POST: Auth result:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
    });

    if (!session?.user) {
      console.error(
        "[Collaborations API] POST: ❌ No session found - user not authenticated",
      );
      return Response.json(
        {
          success: false,
          error: "Authentication required",
          hint: "Please sign in and try again",
        },
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    console.log(
      "[Collaborations API] POST: ✓ User authenticated:",
      session.user.id,
    );

    // Get user's profile
    console.log(
      "[Collaborations API] POST: Looking up profile for user:",
      session.user.id,
    );
    const profiles = await sql`
      SELECT id, verified_creator FROM profiles WHERE user_id = ${session.user.id}
    `;

    if (!profiles || profiles.length === 0) {
      console.error(
        "[Collaborations API] POST: ❌ Profile not found for user:",
        session.user.id,
      );
      return Response.json(
        {
          success: false,
          error: "Profile not found. Please create your profile first.",
          hint: "Visit /profile/setup to create your profile",
        },
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const profileId = profiles[0].id;
    console.log("[Collaborations API] POST: ✓ Profile found - ID:", profileId);

    const body = await request.json();
    const {
      title,
      vision,
      referenceUrls,
      collabType,
      compensationDetails,
      rolesNeeded,
      requiredSkills,
      estimatedTimeline,
      collabStyle,
      location,
      industry,
      niche,
      visibility,
      urgencyLevel,
    } = body;

    console.log("[Collaborations API] POST: Request data:", {
      title,
      collabType,
      rolesCount: rolesNeeded?.length,
      skillsCount: requiredSkills?.length,
    });

    // Validation
    if (!title || !vision || !collabType || !rolesNeeded || !requiredSkills) {
      console.error("[Collaborations API] POST: ❌ Missing required fields");
      return Response.json(
        {
          success: false,
          error: "Missing required fields",
          required: [
            "title",
            "vision",
            "collabType",
            "rolesNeeded",
            "requiredSkills",
          ],
        },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    if (rolesNeeded.length === 0 || requiredSkills.length === 0) {
      console.error("[Collaborations API] POST: ❌ Empty roles or skills");
      return Response.json(
        {
          success: false,
          error: "At least one role and skill required",
        },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Create collaboration
    console.log("[Collaborations API] POST: Inserting into database...");

    const result = await sql`
      INSERT INTO collaborations (
        creator_id,
        title,
        vision,
        reference_urls,
        collab_type,
        compensation_details,
        roles_needed,
        required_skills,
        estimated_timeline,
        collab_style,
        location,
        industry,
        niche,
        visibility,
        urgency_level,
        is_verified
      ) VALUES (
        ${profileId},
        ${title},
        ${vision},
        ${referenceUrls || []},
        ${collabType},
        ${compensationDetails || null},
        ${rolesNeeded},
        ${requiredSkills},
        ${estimatedTimeline || null},
        ${collabStyle || null},
        ${location || null},
        ${industry || null},
        ${niche || null},
        ${visibility || "public"},
        ${urgencyLevel || "normal"},
        ${profiles[0].verified_creator || false}
      )
      RETURNING *
    `;

    if (!result || result.length === 0) {
      console.error(
        "[Collaborations API] POST: ❌ Insert failed - no result returned",
      );
      return Response.json(
        {
          success: false,
          error: "Failed to create collaboration",
        },
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const collaboration = result[0];
    console.log(
      "[Collaborations API] POST: ✅ SUCCESS - Collaboration created with ID:",
      collaboration.id,
    );
    console.log("[Collaborations API] ═══════════════════════════════════════");

    return Response.json(
      {
        success: true,
        collaboration: collaboration,
        message: "Collaboration created successfully",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("[Collaborations API] POST: ❌ EXCEPTION:", error);
    console.error("[Collaborations API] POST: Stack trace:", error.stack);
    console.error(
      "[Collaborations API] ═══════════════════════════════════════",
    );

    return Response.json(
      {
        success: false,
        error: error.message || "Internal server error",
        type: error.constructor.name,
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
