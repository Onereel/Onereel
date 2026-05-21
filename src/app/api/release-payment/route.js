import sql from "@/app/api/utils/sql";
import { auth } from "@/lib/safe-auth";

// POST /api/release-payment - Release escrow payment to freelancer
export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { transactionId } = body;

    if (!transactionId) {
      return Response.json(
        { error: "Transaction ID required" },
        { status: 400 },
      );
    }

    // Get the transaction
    const transactions = await sql`
      SELECT * FROM transactions WHERE id = ${transactionId} LIMIT 1
    `;

    if (transactions.length === 0) {
      return Response.json({ error: "Transaction not found" }, { status: 404 });
    }

    const transaction = transactions[0];

    // Verify the user is the payer
    const payerProfile = await sql`
      SELECT id FROM profiles WHERE user_id = ${session.user.id} LIMIT 1
    `;

    if (
      payerProfile.length === 0 ||
      payerProfile[0].id !== transaction.payer_id
    ) {
      return Response.json(
        { error: "Only the payer can release payment" },
        { status: 403 },
      );
    }

    // Check transaction status
    if (transaction.status === "released") {
      return Response.json(
        { error: "Payment already released" },
        { status: 400 },
      );
    }

    if (transaction.status !== "held" && transaction.status !== "in_progress") {
      return Response.json(
        { error: `Cannot release payment with status: ${transaction.status}` },
        { status: 400 },
      );
    }

    // Update transaction status to 'released'
    await sql`
      UPDATE transactions 
      SET 
        status = 'released',
        completed_at = CURRENT_TIMESTAMP
      WHERE id = ${transactionId}
    `;

    // Update associated job status if applicable
    if (transaction.job_id) {
      await sql`
        UPDATE jobs 
        SET status = 'completed'
        WHERE id = ${transaction.job_id}
      `;
    }

    // In a real production system, you would:
    // 1. Use Stripe Connect to transfer funds to the freelancer
    // 2. Deduct the platform fee
    // 3. Send notification emails to both parties

    console.log(`Payment released for transaction ${transactionId}`);
    console.log(
      `Platform fee collected: $${parseFloat(transaction.platform_fee).toFixed(2)}`,
    );
    console.log(
      `Freelancer receives: $${(parseFloat(transaction.amount) - parseFloat(transaction.platform_fee)).toFixed(2)}`,
    );

    return Response.json({
      success: true,
      message: "Payment released to freelancer",
      transaction: {
        id: transactionId,
        status: "released",
        amount: parseFloat(transaction.amount),
        platformFee: parseFloat(transaction.platform_fee),
        freelancerPayout:
          parseFloat(transaction.amount) - parseFloat(transaction.platform_fee),
      },
    });
  } catch (error) {
    console.error("Error releasing payment:", error);
    return Response.json(
      { error: "Failed to release payment", details: error.message },
      { status: 500 },
    );
  }
}
