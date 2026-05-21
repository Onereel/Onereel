import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// GET /api/profiles - List all profiles with filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const skills = searchParams.get("skills");
    const minFollowers = searchParams.get("minFollowers");
    const sortBy = searchParams.get("sortBy") || "created_at";

    let query = "SELECT * FROM profiles WHERE 1=1";
    const values = [];
    let paramCount = 0;

    if (role && ["creator", "freelancer", "both"].includes(role)) {
      paramCount++;
      query += ` AND role = $${paramCount}`;
      values.push(role);
    }

    if (skills) {
      paramCount++;
      const skillsArray = skills.split(",").map((s) => s.trim());
      query += ` AND skills && $${paramCount}`;
      values.push(skillsArray);
    }

    if (minFollowers) {
      paramCount++;
      query += ` AND follower_count >= $${paramCount}`;
      values.push(parseInt(minFollowers));
    }

    // Add sorting
    const validSortFields = ["created_at", "rating", "follower_count", "name"];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "created_at";
    query += ` ORDER BY ${sortField} DESC`;

    const profiles = await sql(query, values);
    return Response.json({ success: true, profiles });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return Response.json(
      { success: false, error: "Failed to fetch profiles" },
      { status: 500 },
    );
  }
}

// POST /api/profiles - Create or update profile
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      user_id,
      username,
      name,
      bio,
      profile_image_url,
      follower_count,
      role,
      skills,
      portfolio_links,
      hourly_rate,
      fixed_pricing,
    } = body;

    // Validate required fields
    if (!user_id || !username || !name) {
      return Response.json(
        {
          success: false,
          error: "Missing required fields: user_id, username, name",
        },
        { status: 400 },
      );
    }

    // Check if profile already exists
    const existing =
      await sql`SELECT * FROM profiles WHERE user_id = ${user_id}`;

    if (existing.length > 0) {
      // Update existing profile
      const updated = await sql`
        UPDATE profiles 
        SET 
          username = ${username},
          name = ${name},
          bio = ${bio || null},
          profile_image_url = ${profile_image_url || null},
          follower_count = ${follower_count || 0},
          role = ${role || "both"},
          skills = ${skills || []},
          portfolio_links = ${portfolio_links || []},
          hourly_rate = ${hourly_rate || null},
          fixed_pricing = ${fixed_pricing || null},
          onboarding_completed = ${true},
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${user_id}
        RETURNING *
      `;
      return Response.json({ success: true, profile: updated[0] });
    } else {
      // Create new profile
      const created = await sql`
        INSERT INTO profiles (
          user_id, username, name, bio, profile_image_url, follower_count, role,
          skills, portfolio_links, hourly_rate, fixed_pricing, onboarding_completed
        ) VALUES (
          ${user_id}, ${username}, ${name}, ${bio || null}, ${profile_image_url || null}, 
          ${follower_count || 0}, ${role || "both"},
          ${skills || []}, ${portfolio_links || []}, ${hourly_rate || null}, 
          ${fixed_pricing || null}, ${true}
        )
        RETURNING *
      `;
      return Response.json(
        { success: true, profile: created[0] },
        { status: 201 },
      );
    }
  } catch (error) {
    console.error("Error creating/updating profile:", error);
    return Response.json(
      { success: false, error: "Failed to create/update profile" },
      { status: 500 },
    );
  }
}

// PATCH /api/profiles - Partial profile update
export async function PATCH(request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json();

    // Get user's current profile
    const existing = await sql`
      SELECT * FROM profiles WHERE user_id = ${session.user.id}
    `;

    if (existing.length === 0) {
      return Response.json(
        { success: false, error: "Profile not found" },
        { status: 404 },
      );
    }

    // Build dynamic update query with only provided fields
    const updates = [];
    const values = [];
    let paramCount = 0;

    if (body.skills !== undefined) {
      paramCount++;
      updates.push(`skills = $${paramCount}`);
      values.push(body.skills);
    }

    if (body.bio !== undefined) {
      paramCount++;
      updates.push(`bio = $${paramCount}`);
      values.push(body.bio);
    }

    if (body.category !== undefined) {
      paramCount++;
      updates.push(`category = $${paramCount}`);
      values.push(body.category);
    }

    if (body.hourly_rate !== undefined) {
      paramCount++;
      updates.push(`hourly_rate = $${paramCount}`);
      values.push(body.hourly_rate);
    }

    if (body.portfolio_links !== undefined) {
      paramCount++;
      updates.push(`portfolio_links = $${paramCount}`);
      values.push(body.portfolio_links);
    }

    if (updates.length === 0) {
      return Response.json(
        { success: false, error: "No fields to update" },
        { status: 400 },
      );
    }

    // Add updated_at
    paramCount++;
    updates.push("updated_at = CURRENT_TIMESTAMP");

    // Add user_id for WHERE clause
    paramCount++;
    values.push(session.user.id);

    const query = `
      UPDATE profiles 
      SET ${updates.join(", ")}
      WHERE user_id = $${paramCount}
      RETURNING *
    `;

    const updated = await sql(query, values);

    return Response.json({
      success: true,
      profile: updated[0],
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return Response.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
