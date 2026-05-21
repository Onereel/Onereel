import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// GET /api/notifications
export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unread") === "true";

    const notifications = unreadOnly
      ? await sql`
          SELECT * FROM notifications 
          WHERE user_id = ${session.user.id} AND read = false
          ORDER BY created_at DESC LIMIT 50
        `
      : await sql`
          SELECT * FROM notifications 
          WHERE user_id = ${session.user.id}
          ORDER BY created_at DESC LIMIT 100
        `;

    return Response.json({ success: true, notifications });
  } catch (error) {
    console.error("[Notifications] GET error:", error);
    return Response.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}

// POST /api/notifications - Create notification (internal use)
export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id, profile_id, type, title, message, link } = body;

    if (!user_id || !type || !title || !message) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const notification = await sql`
      INSERT INTO notifications (user_id, profile_id, type, title, message, link)
      VALUES (${user_id}, ${profile_id}, ${type}, ${title}, ${message}, ${link})
      RETURNING *
    `;

    if (process.env.RESEND_API_KEY) {
      try {
        await sendEmailNotification(user_id, title, message, link);
        await sql`UPDATE notifications SET email_sent = true WHERE id = ${notification[0].id}`;
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }
    }

    return Response.json({ notification: notification[0] });
  } catch (error) {
    console.error("[Notifications] POST error:", error);
    return Response.json(
      { error: "Failed to create notification" },
      { status: 500 },
    );
  }
}

// PATCH /api/notifications - Mark as read
export async function PATCH(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { notificationId, markAllRead } = body;

    if (markAllRead) {
      await sql`UPDATE notifications SET read = true WHERE user_id = ${session.user.id} AND read = false`;
      return Response.json({
        success: true,
        message: "All notifications marked as read",
      });
    }

    if (notificationId) {
      await sql`UPDATE notifications SET read = true WHERE id = ${notificationId} AND user_id = ${session.user.id}`;
      return Response.json({ success: true });
    }

    return Response.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("[Notifications] PATCH error:", error);
    return Response.json(
      { error: "Failed to update notification" },
      { status: 500 },
    );
  }
}

// Helper function to send email notifications
async function sendEmailNotification(userId, title, message, link) {
  // Get user email
  const users =
    await sql`SELECT email FROM auth_users WHERE id = ${userId} LIMIT 1`;
  if (!users.length || !users[0].email) return;

  // This would integrate with Resend or another email service
  // For now, just log it
  console.log(`📧 Email notification would be sent to ${users[0].email}:`, {
    subject: title,
    body: message,
    link: link || process.env.APP_URL,
  });

  // TODO: Integrate with Resend API when RESEND_API_KEY is available
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'One Reel <notifications@onereel.app>',
  //   to: users[0].email,
  //   subject: title,
  //   html: `<p>${message}</p>${link ? `<a href="${link}">View Details</a>` : ''}`
  // });
}
