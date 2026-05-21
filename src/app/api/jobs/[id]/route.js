import sql from "@/app/api/utils/sql";

// GET /api/jobs/[id] - Get single job with applications
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const jobs = await sql`
      SELECT j.*, 
        p.name as creator_name,
        p.username as creator_username,
        p.profile_image_url as creator_image,
        p.follower_count as creator_followers
      FROM jobs j
      JOIN profiles p ON p.id = j.creator_id
      WHERE j.id = ${id}
    `;

    if (jobs.length === 0) {
      return Response.json(
        { success: false, error: "Job not found" },
        { status: 404 },
      );
    }

    // Get applications for this job
    const applications = await sql`
      SELECT a.*, 
        p.name as applicant_name,
        p.username as applicant_username,
        p.profile_image_url as applicant_image,
        p.rating as applicant_rating,
        p.skills as applicant_skills
      FROM applications a
      JOIN profiles p ON p.id = a.applicant_id
      WHERE a.job_id = ${id}
      ORDER BY a.created_at DESC
    `;

    return Response.json({
      success: true,
      job: jobs[0],
      applications,
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    return Response.json(
      { success: false, error: "Failed to fetch job" },
      { status: 500 },
    );
  }
}

// PATCH /api/jobs/[id] - Update job status
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, selected_applicant_id } = body;

    const validStatuses = ["open", "in_progress", "completed", "cancelled"];
    if (status && !validStatuses.includes(status)) {
      return Response.json(
        { success: false, error: "Invalid status" },
        { status: 400 },
      );
    }

    const updated = await sql`
      UPDATE jobs 
      SET 
        status = COALESCE(${status}, status),
        selected_applicant_id = COALESCE(${selected_applicant_id || null}, selected_applicant_id),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (updated.length === 0) {
      return Response.json(
        { success: false, error: "Job not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, job: updated[0] });
  } catch (error) {
    console.error("Error updating job:", error);
    return Response.json(
      { success: false, error: "Failed to update job" },
      { status: 500 },
    );
  }
}
