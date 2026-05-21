import sql from "@/app/api/utils/sql";
import { auth } from "@/lib/safe-auth";

// GET /api/disputes - Get disputes
export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get("transaction_id");

    // Get user's profile
    const profiles = await sql`
      SELECT id FROM profiles WHERE user_id = ${session.user.id} LIMIT 1
    `;

    if (profiles.length === 0) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    const profileId = profiles[0].id;

    let disputes;
    if (transactionId) {
      disputes = await sql`
        SELECT d.*, 
          p.name as initiator_name,
          t.amount as transaction_amount
        FROM disputes d
        JOIN profiles p ON d.initiated_by = p.id
        JOIN transactions t ON d.transaction_id = t.id
        WHERE d.transaction_id = ${parseInt(transactionId)}
        ORDER BY d.created_at DESC
      `;
    } else {
      // Get disputes where user is involved in the transaction
      disputes = await sql`
        SELECT d.*, 
          p.name as initiator_name,
          t.amount as transaction_amount
        FROM disputes d
        JOIN profiles p ON d.initiated_by = p.id
        JOIN transactions t ON d.transaction_id = t.id
        WHERE t.payer_id = ${profileId} OR t.payee_id = ${profileId}
        ORDER BY d.created_at DESC
      `;
    }

    return Response.json({ disputes });
  } catch (error) {
    console.error("Error fetching disputes:", error);
    return Response.json(
      { error: "Failed to fetch disputes" },
      { status: 500 },
    );
  }
}

// POST /api/disputes - Create dispute
export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { transactionId, reason, description } = body;

    if (!transactionId || !reason || !description) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get user's profile
    const profiles = await sql`
      SELECT id FROM profiles WHERE user_id = ${session.user.id} LIMIT 1
    `;

    if (profiles.length === 0) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    const profileId = profiles[0].id;

    // Verify user is part of the transaction
    const transactions = await sql`
      SELECT * FROM transactions 
      WHERE id = ${transactionId} 
      AND (payer_id = ${profileId} OR payee_id = ${profileId})
      LIMIT 1
    `;

    if (transactions.length === 0) {
      return Response.json(
        { error: "Transaction not found or unauthorized" },
        { status: 404 },
      );
    }

    // Create dispute
    const dispute = await sql`
      INSERT INTO disputes (transaction_id, initiated_by, reason, description, status)
      VALUES (${transactionId}, ${profileId}, ${reason}, ${description}, 'open')
      RETURNING *
    `;

    // Update transaction status to disputed
    await sql`
      UPDATE transactions 
      SET status = 'disputed'
      WHERE id = ${transactionId}
    `;

    // Create notification for the other party
    const otherPartyId =
      transactions[0].payer_id === profileId
        ? transactions[0].payee_id
        : transactions[0].payer_id;

    const otherPartyUser = await sql`
      SELECT user_id FROM profiles WHERE id = ${otherPartyId} LIMIT 1
    `;

    if (otherPartyUser.length > 0) {
      await sql`
        INSERT INTO notifications (user_id, profile_id, type, title, message, link)
        VALUES (
          ${otherPartyUser[0].user_id}, 
          ${otherPartyId}, 
          'system', 
          'Dispute Filed',
          'A dispute has been filed on one of your transactions. Please review.',
          '/dashboard?tab=disputes'
        )
      `;
    }

    return Response.json({ dispute: dispute[0] });
  } catch (error) {
    console.error("Error creating dispute:", error);
    return Response.json(
      { error: "Failed to create dispute" },
      { status: 500 },
    );
  }
}

// PATCH /api/disputes - Update dispute (admin only for now)
export async function PATCH(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const isAdmin = await sql`
      SELECT id FROM admin_users WHERE user_id = ${session.user.id} LIMIT 1
    `;

    if (isAdmin.length === 0) {
      return Response.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { disputeId, status, resolution } = body;

    if (!disputeId || !status) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const updateFields = ["status = " + sql`${status}`];
    if (resolution) updateFields.push("resolution = " + sql`${resolution}`);
    if (
      status === "resolved" ||
      status === "refunded" ||
      status === "rejected"
    ) {
      updateFields.push("resolved_at = CURRENT_TIMESTAMP");
    }

    await sql`
      UPDATE disputes 
      SET status = ${status},
          resolution = ${resolution || null},
          resolved_at = ${status === "resolved" || status === "refunded" || status === "rejected" ? sql`CURRENT_TIMESTAMP` : null}
      WHERE id = ${disputeId}
    `;

    // If refunded, update transaction
    if (status === "refunded") {
      const disputes =
        await sql`SELECT transaction_id FROM disputes WHERE id = ${disputeId} LIMIT 1`;
      if (disputes.length > 0) {
        await sql`
          UPDATE transactions 
          SET status = 'refunded'
          WHERE id = ${disputes[0].transaction_id}
        `;
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error updating dispute:", error);
    return Response.json(
      { error: "Failed to update dispute" },
      { status: 500 },
    );
  }
}
