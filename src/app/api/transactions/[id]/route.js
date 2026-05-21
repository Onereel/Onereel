import sql from "@/app/api/utils/sql";

// PATCH /api/transactions/[id] - Update transaction status
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, stripe_payment_intent_id } = body;

    const validStatuses = [
      "pending",
      "held",
      "in_progress",
      "completed",
      "released",
      "refunded",
      "disputed",
    ];
    if (status && !validStatuses.includes(status)) {
      return Response.json(
        { success: false, error: "Invalid status" },
        { status: 400 },
      );
    }

    const updateData = {
      status: status || null,
      stripe_payment_intent_id: stripe_payment_intent_id || null,
    };

    // If status is being set to 'released', set completed_at
    if (status === "released") {
      updateData.completed_at = "CURRENT_TIMESTAMP";
    }

    let query = "UPDATE transactions SET ";
    const values = [];
    let paramCount = 0;
    const setClauses = [];

    if (updateData.status) {
      paramCount++;
      setClauses.push(`status = $${paramCount}`);
      values.push(updateData.status);
    }

    if (updateData.stripe_payment_intent_id) {
      paramCount++;
      setClauses.push(`stripe_payment_intent_id = $${paramCount}`);
      values.push(updateData.stripe_payment_intent_id);
    }

    if (status === "released") {
      setClauses.push("completed_at = CURRENT_TIMESTAMP");
    }

    if (setClauses.length === 0) {
      return Response.json(
        { success: false, error: "No fields to update" },
        { status: 400 },
      );
    }

    paramCount++;
    query += setClauses.join(", ") + ` WHERE id = $${paramCount} RETURNING *`;
    values.push(id);

    const updated = await sql(query, values);

    if (updated.length === 0) {
      return Response.json(
        { success: false, error: "Transaction not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, transaction: updated[0] });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return Response.json(
      { success: false, error: "Failed to update transaction" },
      { status: 500 },
    );
  }
}
