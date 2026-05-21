import { auth } from "@/auth";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * AUTH DEBUG ENDPOINT
 * Helps diagnose authentication issues
 * ═══════════════════════════════════════════════════════════════════════
 */

export async function GET(request) {
  try {
    const session = await auth();

    const debug = {
      timestamp: new Date().toISOString(),
      environment: {
        AUTH_URL: process.env.AUTH_URL || "NOT SET",
        AUTH_SECRET: process.env.AUTH_SECRET ? "SET (hidden)" : "NOT SET",
        DATABASE_URL: process.env.DATABASE_URL ? "SET (hidden)" : "NOT SET",
        NODE_ENV: process.env.NODE_ENV,
      },
      session: {
        exists: !!session,
        user: session?.user
          ? {
              id: session.user.id,
              email: session.user.email,
              name: session.user.name,
            }
          : null,
      },
      cookies: {
        received: request.headers.get("cookie") ? "YES" : "NO",
        count: request.headers.get("cookie")?.split(";").length || 0,
      },
      headers: {
        host: request.headers.get("host"),
        origin: request.headers.get("origin"),
        referer: request.headers.get("referer"),
        "x-forwarded-host": request.headers.get("x-forwarded-host"),
        "x-forwarded-proto": request.headers.get("x-forwarded-proto"),
      },
    };

    return Response.json({
      success: true,
      debug,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
