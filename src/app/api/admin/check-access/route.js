import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return Response.json({ isAdmin: false });
    }

    const adminCheck = await sql`
      SELECT id FROM admin_users WHERE user_id = ${session.user.id}
    `;

    return Response.json({
      isAdmin: adminCheck && adminCheck.length > 0,
    });
  } catch (error) {
    console.error("[Admin Check] error:", error);
    return Response.json({ isAdmin: false });
  }
}
