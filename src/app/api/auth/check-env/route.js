/**
 * Environment Variable Diagnostic Endpoint
 * Check if required auth environment variables are configured
 */
export async function GET() {
  // Check both old and new variable names
  const hasOldVars =
    !!process.env.TWITTER_CLIENT_ID && !!process.env.TWITTER_CLIENT_SECRET;
  const hasNewVars = !!process.env.X_CLIENT_ID && !!process.env.X_CLIENT_SECRET;

  const envCheck = {
    // New variable names (recommended)
    X_CLIENT_ID: !!process.env.X_CLIENT_ID,
    X_CLIENT_SECRET: !!process.env.X_CLIENT_SECRET,

    // Old variable names (legacy support)
    TWITTER_CLIENT_ID: !!process.env.TWITTER_CLIENT_ID,
    TWITTER_CLIENT_SECRET: !!process.env.TWITTER_CLIENT_SECRET,

    // Other required variables
    AUTH_SECRET: !!process.env.AUTH_SECRET,
    AUTH_URL: !!process.env.AUTH_URL,
    DATABASE_URL: !!process.env.DATABASE_URL,

    // Show partial values for debugging (only first 8 chars)
    CLIENT_ID_PREVIEW:
      (process.env.X_CLIENT_ID || process.env.TWITTER_CLIENT_ID)?.substring(
        0,
        8,
      ) || "NOT SET",
    AUTH_URL_VALUE: process.env.AUTH_URL || "NOT SET",

    // Which variables are being used
    using: hasNewVars
      ? "X_CLIENT_ID/SECRET"
      : hasOldVars
        ? "TWITTER_CLIENT_ID/SECRET"
        : "NONE",
  };

  const allSet =
    (hasNewVars || hasOldVars) && envCheck.AUTH_SECRET && envCheck.AUTH_URL;

  return Response.json(
    {
      status: allSet ? "OK" : "MISSING_VARIABLES",
      message: allSet
        ? `All required environment variables are set (using ${envCheck.using})`
        : "Some environment variables are missing",
      variables: envCheck,
      expectedCallbackUrl: `${process.env.AUTH_URL || "[AUTH_URL not set]"}/api/auth/callback/x`,
      recommendations:
        hasOldVars && !hasNewVars
          ? "⚠️ Consider migrating from TWITTER_CLIENT_ID/SECRET to X_CLIENT_ID/SECRET"
          : null,
      instructions: {
        step1:
          "Set X_CLIENT_ID in environment variables (or TWITTER_CLIENT_ID for legacy)",
        step2:
          "Set X_CLIENT_SECRET in environment variables (or TWITTER_CLIENT_SECRET for legacy)",
        step3: "Set AUTH_SECRET to a random 32+ character string",
        step4: "Ensure AUTH_URL matches your deployment URL",
        step5: `Add this EXACT callback URL to X Developer Portal: ${process.env.AUTH_URL || "[YOUR_URL]"}/api/auth/callback/x`,
        step6:
          "Make sure callback URL in X portal does NOT have trailing slash",
        step7: "Restart your dev server after setting environment variables",
      },
    },
    {
      status: allSet ? 200 : 500,
    },
  );
}
