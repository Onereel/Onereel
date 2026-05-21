import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    const { id } = params;

    const profile = await sql`
      SELECT id FROM profiles WHERE user_id = ${session.user.id}
    `;

    if (!profile || profile.length === 0) {
      return Response.json(
        { success: false, error: "Profile not found" },
        { status: 404 },
      );
    }

    const profileId = profile[0].id;

    // Toggle save
    const existing = await sql`
      SELECT id FROM collaboration_saves 
      WHERE collaboration_id = ${id} AND profile_id = ${profileId}
    `;

    if (existing && existing.length > 0) {
      // Unsave
      await sql`
        DELETE FROM collaboration_saves 
        WHERE collaboration_id = ${id} AND profile_id = ${profileId}
      `;

      await sql`
        UPDATE collaborations 
        SET save_count = GREATEST(save_count - 1, 0)
        WHERE id = ${id}
      `;

      return Response.json({
        success: true,
        saved: false,
      });
    } else {
      // Save
      await sql`
        INSERT INTO collaboration_saves (collaboration_id, profile_id)
        VALUES (${id}, ${profileId})
      `;

      await sql`
        UPDATE collaborations 
        SET save_count = save_count + 1
        WHERE id = ${id}
      `;

      return Response.json({
        success: true,
        saved: true,
      });
    }
  } catch (error) {
    console.error("[Collaboration Save] error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
