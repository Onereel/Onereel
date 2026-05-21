import sql from "@/app/api/utils/sql";
import Stripe from "stripe";

export async function POST(request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    // Verify webhook signature (in production, you MUST set STRIPE_WEBHOOK_SECRET)
    let event;

    if (process.env.STRIPE_WEBHOOK_SECRET) {
      try {
        event = stripe.webhooks.constructEvent(
          body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET,
        );
      } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return Response.json(
          { error: "Webhook signature verification failed" },
          { status: 400 },
        );
      }
    } else {
      // For development without webhook secret (NOT RECOMMENDED for production)
      event = JSON.parse(body);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const metadata = session.metadata;
        const transactionId = metadata.transactionId;

        if (!transactionId) {
          console.error("No transaction ID in webhook metadata");
          break;
        }

        // Update transaction status to 'held' (payment received, held in escrow)
        await sql`
          UPDATE transactions 
          SET 
            status = 'held',
            stripe_payment_intent_id = ${session.payment_intent || session.id}
          WHERE id = ${parseInt(transactionId)}
        `;

        console.log(
          `Transaction ${transactionId} updated to 'held' status after successful payment`,
        );

        // If this was for a job, update job status
        if (metadata.jobId) {
          await sql`
            UPDATE jobs 
            SET 
              status = 'in_progress',
              selected_applicant_id = ${parseInt(metadata.freelancerId)}
            WHERE id = ${parseInt(metadata.jobId)}
          `;
          console.log(`Job ${metadata.jobId} status updated to 'in_progress'`);
        }

        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        console.log("Payment Intent succeeded:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        console.error("Payment Intent failed:", paymentIntent.id);

        // Find and update transaction to failed status
        const failedTransactions = await sql`
          SELECT id FROM transactions 
          WHERE stripe_payment_intent_id = ${paymentIntent.id}
          LIMIT 1
        `;

        if (failedTransactions.length > 0) {
          await sql`
            UPDATE transactions 
            SET status = 'refunded'
            WHERE id = ${failedTransactions[0].id}
          `;
          console.log(
            `Transaction ${failedTransactions[0].id} marked as refunded due to payment failure`,
          );
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;
        console.log("Charge refunded:", charge.id);

        // Update transaction to refunded
        const refundedTransactions = await sql`
          SELECT id FROM transactions 
          WHERE stripe_payment_intent_id LIKE ${"%" + charge.payment_intent + "%"}
          LIMIT 1
        `;

        if (refundedTransactions.length > 0) {
          await sql`
            UPDATE transactions 
            SET status = 'refunded'
            WHERE id = ${refundedTransactions[0].id}
          `;
          console.log(
            `Transaction ${refundedTransactions[0].id} marked as refunded`,
          );
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json(
      { error: "Webhook handler failed", details: error.message },
      { status: 500 },
    );
  }
}
