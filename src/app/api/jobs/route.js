import sql from "@/app/api/utils/sql";

// GET /api/jobs - List all jobs with filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "open";
    const skills = searchParams.get("skills");
    const creatorId = searchParams.get("creatorId");

    let query = `
      SELECT j.*, 
        p.name as creator_name,
        p.username as creator_username,
        p.profile_image_url as creator_image,
        COUNT(DISTINCT a.id) as application_count
      FROM jobs j
      JOIN profiles p ON p.id = j.creator_id
      LEFT JOIN applications a ON a.job_id = j.id
      WHERE j.status = $1
    `;
    const values = [status];
    let paramCount = 1;

    if (skills) {
      paramCount++;
      const skillsArray = skills.split(",").map((s) => s.trim());
      query += ` AND j.required_skills && $${paramCount}`;
      values.push(skillsArray);
    }

    if (creatorId) {
      paramCount++;
      query += ` AND j.creator_id = $${paramCount}`;
      values.push(parseInt(creatorId));
    }

    query += " GROUP BY j.id, p.id ORDER BY j.created_at DESC";

    const jobs = await sql(query, values);
    return Response.json({ success: true, jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return Response.json(
      { success: false, error: "Failed to fetch jobs" },
      { status: 500 },
    );
  }
}

// POST /api/jobs - Create a new job
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      creator_id,
      title,
      description,
      budget,
      deadline,
      required_skills,
    } = body;

    // Validate required fields
    if (!creator_id || !title || !description || !budget) {
      return Response.json(
        {
          success: false,
          error:
            "Missing required fields: creator_id, title, description, budget",
        },
        { status: 400 },
      );
    }

    // Verify creator profile exists and is verified
    const creator = await sql`SELECT * FROM profiles WHERE id = ${creator_id}`;
    if (creator.length === 0) {
      return Response.json(
        { success: false, error: "Creator profile not found" },
        { status: 404 },
      );
    }

    if (!creator[0].verified_creator) {
      return Response.json(
        {
          success: false,
          error: "Only verified users can post jobs",
        },
        { status: 403 },
      );
    }

    const created = await sql`
      INSERT INTO jobs (
        creator_id, title, description, budget, deadline, required_skills
      ) VALUES (
        ${creator_id}, ${title}, ${description}, ${budget}, 
        ${deadline || null}, ${required_skills || []}
      )
      RETURNING *
    `;

    return Response.json({ success: true, job: created[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return Response.json(
      { success: false, error: "Failed to create job" },
      { status: 500 },
    );
  }
}
