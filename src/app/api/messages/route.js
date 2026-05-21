import sql from "@/app/api/utils/sql";

// GET /api/messages - Get messages for a conversation
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");
    const userId = searchParams.get("userId");

    if (!conversationId && !userId) {
      return Response.json(
        {
          success: false,
          error: "Either conversationId or userId is required",
        },
        { status: 400 },
      );
    }

    if (conversationId) {
      // Get messages for a specific conversation
      const messages = await sql`
        SELECT m.*, 
          sp.name as sender_name,
          sp.username as sender_username,
          sp.profile_image_url as sender_image,
          rp.name as receiver_name,
          rp.username as receiver_username,
          rp.profile_image_url as receiver_image
        FROM messages m
        JOIN profiles sp ON sp.id = m.sender_id
        JOIN profiles rp ON rp.id = m.receiver_id
        WHERE m.conversation_id = ${conversationId}
        ORDER BY m.created_at ASC
      `;

      return Response.json({ success: true, messages });
    } else {
      // Get all conversations for a user
      const conversations = await sql`
        SELECT DISTINCT ON (conversation_id)
          conversation_id,
          CASE 
            WHEN sender_id = ${userId} THEN receiver_id
            ELSE sender_id
          END as other_user_id,
          message,
          created_at,
          read
        FROM messages
        WHERE sender_id = ${userId} OR receiver_id = ${userId}
        ORDER BY conversation_id, created_at DESC
      `;

      // Get profile info for each conversation partner
      const conversationsWithProfiles = await Promise.all(
        conversations.map(async (conv) => {
          const profiles = await sql`
            SELECT name, username, profile_image_url
            FROM profiles
            WHERE id = ${conv.other_user_id}
          `;
          return {
            ...conv,
            other_user: profiles[0],
          };
        }),
      );

      return Response.json({
        success: true,
        conversations: conversationsWithProfiles,
      });
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json(
      { success: false, error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

// POST /api/messages - Send a message
export async function POST(request) {
  try {
    const body = await request.json();
    const { sender_id, receiver_id, message } = body;

    if (!sender_id || !receiver_id || !message) {
      return Response.json(
        {
          success: false,
          error: "Missing required fields: sender_id, receiver_id, message",
        },
        { status: 400 },
      );
    }

    // Create conversation ID (consistent ordering)
    const ids = [sender_id, receiver_id].sort((a, b) => a - b);
    const conversationId = `${ids[0]}_${ids[1]}`;

    const created = await sql`
      INSERT INTO messages (conversation_id, sender_id, receiver_id, message)
      VALUES (${conversationId}, ${sender_id}, ${receiver_id}, ${message})
      RETURNING *
    `;

    return Response.json(
      { success: true, message: created[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return Response.json(
      { success: false, error: "Failed to send message" },
      { status: 500 },
    );
  }
}
