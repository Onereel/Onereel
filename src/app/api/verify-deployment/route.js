export async function GET() {
  try {
    const checks = {
      timestamp: new Date().toISOString(),
      environment: process.env.ENV || "production",

      // ═══════════════════════════════════════════════════════════════
      // RUNTIME ENVIRONMENT VALUES (CURRENT STATE)
      // ═══════════════════════════════════════════════════════════════
      current_values: {
        AUTH_URL: process.env.AUTH_URL || "NOT_SET",
        AUTH_SECRET_LENGTH: process.env.AUTH_SECRET?.length || 0,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT_SET",
        DATABASE_URL_SET: !!process.env.DATABASE_URL,
        STRIPE_SECRET_KEY_SET: !!process.env.STRIPE_SECRET_KEY,
        LUMA_API_KEY_SET: !!process.env.LUMA_API_KEY,
      },

      // ═══════════════════════════════════════════════════════════════
      // EXPECTED VALUES FOR PRODUCTION (onereel.online)
      // ═══════════════════════════════════════════════════════════════
      expected_values: {
        AUTH_URL: "https://onereel.online",
        AUTH_SECRET_MIN_LENGTH: 32,
        NEXTAUTH_URL: "https://onereel.online (or unset)",
      },

      checks: {
        auth_secret: {
          configured: !!process.env.AUTH_SECRET,
          length: process.env.AUTH_SECRET?.length || 0,
          valid: process.env.AUTH_SECRET?.length >= 32,
          status: process.env.AUTH_SECRET?.length >= 32 ? "PASS" : "FAIL",
          critical: true,
          message:
            process.env.AUTH_SECRET?.length >= 32
              ? "AUTH_SECRET is valid"
              : `AUTH_SECRET is only ${process.env.AUTH_SECRET?.length || 0} characters (minimum: 32)`,
        },
        auth_url: {
          configured: !!process.env.AUTH_URL,
          value: process.env.AUTH_URL || "NOT_SET",
          expected: "https://onereel.online",
          matches_custom_domain:
            process.env.AUTH_URL === "https://onereel.online",
          status:
            process.env.AUTH_URL === "https://onereel.online" ? "PASS" : "FAIL",
          critical: true,
          message:
            process.env.AUTH_URL === "https://onereel.online"
              ? "AUTH_URL correctly set to custom domain"
              : `AUTH_URL is "${process.env.AUTH_URL}" but should be "https://onereel.online"`,
        },
        nextauth_url: {
          configured: !!process.env.NEXTAUTH_URL,
          value: process.env.NEXTAUTH_URL || "NOT_SET",
          correct:
            !process.env.NEXTAUTH_URL ||
            process.env.NEXTAUTH_URL === "https://onereel.online",
          status:
            !process.env.NEXTAUTH_URL ||
            process.env.NEXTAUTH_URL === "https://onereel.online"
              ? "PASS"
              : "WARNING",
          critical: false,
          message: !process.env.NEXTAUTH_URL
            ? "NEXTAUTH_URL not set (OK - AUTH_URL is sufficient)"
            : process.env.NEXTAUTH_URL === "https://onereel.online"
              ? "NEXTAUTH_URL correctly set"
              : `NEXTAUTH_URL should be "https://onereel.online" or unset, but is "${process.env.NEXTAUTH_URL}"`,
        },
        database: {
          configured: !!process.env.DATABASE_URL,
          status: process.env.DATABASE_URL ? "PASS" : "FAIL",
          critical: true,
        },
        stripe: {
          configured: !!process.env.STRIPE_SECRET_KEY,
          status: process.env.STRIPE_SECRET_KEY ? "PASS" : "WARNING",
          critical: false,
          message: process.env.STRIPE_SECRET_KEY
            ? "Configured"
            : "Optional - not configured",
        },
        ai_video: {
          configured: !!process.env.LUMA_API_KEY,
          status: process.env.LUMA_API_KEY ? "PASS" : "WARNING",
          critical: false,
          message: process.env.LUMA_API_KEY
            ? "Luma AI configured"
            : "Optional - not configured",
        },
      },
      overall_status: "CALCULATING",
    };

    // Only fail if CRITICAL services are not configured
    const criticalFailed = Object.entries(checks.checks)
      .filter(([_, check]) => check.critical)
      .some(([_, check]) => check.status === "FAIL");

    checks.overall_status = criticalFailed ? "DEGRADED" : "HEALTHY";
    checks.ready_for_production = !criticalFailed;

    // Add specific fix instructions if there are issues
    if (criticalFailed) {
      checks.required_fixes = [];

      if (checks.checks.auth_url.status === "FAIL") {
        checks.required_fixes.push({
          variable: "AUTH_URL",
          current: process.env.AUTH_URL || "NOT_SET",
          required: "https://onereel.online",
          action:
            "Set AUTH_URL=https://onereel.online in environment variables",
        });
      }

      if (checks.checks.auth_secret.status === "FAIL") {
        checks.required_fixes.push({
          variable: "AUTH_SECRET",
          current: `${process.env.AUTH_SECRET?.length || 0} characters`,
          required: "32+ random characters",
          action: "Set AUTH_SECRET to a secure 32+ character random string",
          suggestion:
            "8k9mP2nQ5rT8wX3yZ6aB4cD7fG1hJ4kL9mN2pQ5sT8vW3xY6zA9bC2dE5fH8jK1n",
        });
      }
    }

    return Response.json(checks, {
      status: criticalFailed ? 500 : 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    return Response.json(
      {
        error: "Verification failed",
        message: error.message,
        overall_status: "ERROR",
      },
      { status: 500 },
    );
  }
}
