import sql from "@/app/api/utils/sql";

// GET /api/transactions - List transactions
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const payerId = searchParams.get("payerId");
    const payeeId = searchParams.get("payeeId");
    const status = searchParams.get("status");

    let query = `
      SELECT t.*, 
        payer.name as payer_name,
        payer.username as payer_username,
        payee.name as payee_name,
        payee.username as payee_username
      FROM transactions t
      JOIN profiles payer ON payer.id = t.payer_id
      JOIN profiles payee ON payee.id = t.payee_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 0;

    if (payerId) {
      paramCount++;
      query += ` AND t.payer_id = $${paramCount}`;
      values.push(parseInt(payerId));
    }

    if (payeeId) {
      paramCount++;
      query += ` AND t.payee_id = $${paramCount}`;
      values.push(parseInt(payeeId));
    }

    if (status) {
      paramCount++;
      query += ` AND t.status = $${paramCount}`;
      values.push(status);
    }

    query += " ORDER BY t.created_at DESC";

    const transactions = await sql(query, values);
    return Response.json({ success: true, transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return Response.json(
      { success: false, error: "Failed to fetch transactions" },
      { status: 500 },
    );
  }
}

// POST /api/transactions - Create transaction
export async function POST(request) {
  try {
    const body = await request.json();
    const { job_id, gig_id, payer_id, payee_id, amount } = body;

    if (!payer_id || !payee_id || !amount) {
      return Response.json(
        {
          success: false,
          error: "Missing required fields: payer_id, payee_id, amount",
        },
        { status: 400 },
      );
    }

    if (!job_id && !gig_id) {
      return Response.json(
        {
          success: false,
          error: "Either job_id or gig_id is required",
        },
        { status: 400 },
      );
    }

    // Get platform fee percentage
    const settings = await sql`
      SELECT setting_value FROM platform_settings 
      WHERE setting_key = 'platform_fee_percentage'
    `;
    const feePercentage =
      settings.length > 0 ? parseFloat(settings[0].setting_value) : 12.0;
    const platformFee = (amount * feePercentage) / 100;

    const created = await sql`
      INSERT INTO transactions (
        job_id, gig_id, payer_id, payee_id, amount, 
        platform_fee, platform_fee_percentage, status
      ) VALUES (
        ${job_id || null}, ${gig_id || null}, ${payer_id}, ${payee_id}, ${amount},
        ${platformFee}, ${feePercentage}, 'pending'
      )
      RETURNING *
    `;

    return Response.json(
      { success: true, transaction: created[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating transaction:", error);
    return Response.json(
      { success: false, error: "Failed to create transaction" },
      { status: 500 },
    );
  }
}
