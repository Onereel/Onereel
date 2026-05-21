// Use safe-auth wrapper to prevent crashes if auth module fails to initialize
import { auth } from "@/lib/safe-auth";

export const dynamic = "force-dynamic";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * SESSION ENDPOINT
 * Returns current session data for client-side auth state
 * CRITICAL: Must always return valid JSON, never empty responses
 * ═══════════════════════════════════════════════════════════════════════
 */

export async function GET(request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return Response.json(
        { user: null },
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        },
      );
    }

    return Response.json(
      {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        },
        expires: session.expires,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    );
  } catch (error) {
    console.error("[Session API] Error:", error);
    return Response.json(
      { user: null },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    );
  }
}
