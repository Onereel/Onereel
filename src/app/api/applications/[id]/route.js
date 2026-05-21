import sql from "@/app/api/utils/sql";

// PATCH /api/applications/[id] - Accept or reject application
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["accepted", "rejected"].includes(status)) {
      return Response.json(
        {
          success: false,
          error: 'Status must be either "accepted" or "rejected"',
        },
        { status: 400 },
      );
    }

    // Get the application details
    const apps = await sql`SELECT * FROM applications WHERE id = ${id}`;
    if (apps.length === 0) {
      return Response.json(
        { success: false, error: "Application not found" },
        { status: 404 },
      );
    }

    const application = apps[0];

    // Update application status
    const updated = await sql`
      UPDATE applications 
      SET status = ${status}
      WHERE id = ${id}
      RETURNING *
    `;

    // If accepted, update the job with selected applicant and change status to in_progress
    if (status === "accepted") {
      await sql`
        UPDATE jobs 
        SET selected_applicant_id = ${application.applicant_id},
            status = 'in_progress',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${application.job_id}
      `;

      // Reject all other pending applications for this job
      await sql`
        UPDATE applications 
        SET status = 'rejected'
        WHERE job_id = ${application.job_id} 
        AND id != ${id}
        AND status = 'pending'
      `;
    }

    return Response.json({ success: true, application: updated[0] });
  } catch (error) {
    console.error("Error updating application:", error);
    return Response.json(
      { success: false, error: "Failed to update application" },
      { status: 500 },
    );
  }
}
