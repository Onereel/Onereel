import sql from "@/app/api/utils/sql";

// GET /api/applications - List applications
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");
    const applicantId = searchParams.get("applicantId");
    const status = searchParams.get("status");

    let query = `
      SELECT a.*, 
        j.title as job_title,
        j.budget as job_budget,
        p.name as applicant_name,
        p.username as applicant_username,
        p.profile_image_url as applicant_image,
        p.rating as applicant_rating,
        p.skills as applicant_skills
      FROM applications a
      JOIN jobs j ON j.id = a.job_id
      JOIN profiles p ON p.id = a.applicant_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 0;

    if (jobId) {
      paramCount++;
      query += ` AND a.job_id = $${paramCount}`;
      values.push(parseInt(jobId));
    }

    if (applicantId) {
      paramCount++;
      query += ` AND a.applicant_id = $${paramCount}`;
      values.push(parseInt(applicantId));
    }

    if (status) {
      paramCount++;
      query += ` AND a.status = $${paramCount}`;
      values.push(status);
    }

    query += " ORDER BY a.created_at DESC";

    const applications = await sql(query, values);
    return Response.json({ success: true, applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return Response.json(
      { success: false, error: "Failed to fetch applications" },
      { status: 500 },
    );
  }
}

// POST /api/applications - Create application
export async function POST(request) {
  try {
    const body = await request.json();
    const { job_id, applicant_id, proposal, proposed_rate } = body;

    if (!job_id || !applicant_id || !proposal) {
      return Response.json(
        {
          success: false,
          error: "Missing required fields: job_id, applicant_id, proposal",
        },
        { status: 400 },
      );
    }

    // Verify applicant is verified
    const applicant =
      await sql`SELECT * FROM profiles WHERE id = ${applicant_id}`;
    if (applicant.length === 0) {
      return Response.json(
        { success: false, error: "Applicant profile not found" },
        { status: 404 },
      );
    }

    if (!applicant[0].verified_creator) {
      return Response.json(
        {
          success: false,
          error: "Only verified users can apply to jobs",
        },
        { status: 403 },
      );
    }

    // Check if already applied
    const existing = await sql`
      SELECT * FROM applications 
      WHERE job_id = ${job_id} AND applicant_id = ${applicant_id}
    `;

    if (existing.length > 0) {
      return Response.json(
        { success: false, error: "Already applied to this job" },
        { status: 400 },
      );
    }

    const created = await sql`
      INSERT INTO applications (job_id, applicant_id, proposal, proposed_rate)
      VALUES (${job_id}, ${applicant_id}, ${proposal}, ${proposed_rate || null})
      RETURNING *
    `;

    return Response.json(
      { success: true, application: created[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating application:", error);
    return Response.json(
      { success: false, error: "Failed to create application" },
      { status: 500 },
    );
  }
}
