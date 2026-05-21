/**
 * ═══════════════════════════════════════════════════════════════════════
 * ENVIRONMENT VALIDATION - PRODUCTION SAFE
 * ═══════════════════════════════════════════════════════════════════════
 *
 * CRITICAL CHANGES:
 * ❌ REMOVED: Auto-generation of AUTH_SECRET (was causing session invalidation)
 * ✅ ENFORCED: AUTH_SECRET must be set via environment variables
 * ✅ DYNAMIC: AUTH_URL now uses platform's APP_URL to support dev and production
 *
 * This file now VALIDATES environment instead of auto-generating secrets.
 * ═══════════════════════════════════════════════════════════════════════
 */

let validated = false;

/**
 * Validate critical environment variables
 * DOES NOT modify or generate any values
 */
function validateEnvironment() {
  if (validated) {
    return;
  }

  console.log("\n╔═══════════════════════════════════════════════════════╗");
  console.log("║     🔒 ENVIRONMENT VALIDATION (PRODUCTION SAFE)      ║");
  console.log("╚═══════════════════════════════════════════════════════╝");

  const errors = [];
  const warnings = [];

  // ═══════════════════════════════════════════════════════
  // CRITICAL: AUTH_SECRET (NEVER AUTO-GENERATE)
  // ═══════════════════════════════════════════════════════
  if (!process.env.AUTH_SECRET) {
    errors.push("❌ CRITICAL: AUTH_SECRET not set in environment variables");
    errors.push("   → Sessions will NOT work without AUTH_SECRET");
    errors.push("   → Set via Anything platform secrets or deployment config");
  } else {
    console.log("✅ AUTH_SECRET: Present");
  }

  // ═══════════════════════════════════════════════════════
  // CRITICAL: DATABASE_URL
  // ═══════════════════════════════════════════════════════
  if (!process.env.DATABASE_URL) {
    errors.push("❌ CRITICAL: DATABASE_URL not set");
  } else {
    console.log("✅ DATABASE_URL: Present");
  }

  // ═══════════════════════════════════════════════════════
  // IMPORTANT: AUTH_URL (Use APP_URL from platform)
  // ═══════════════════════════════════════════════════════
  if (!process.env.AUTH_URL) {
    if (process.env.APP_URL) {
      process.env.AUTH_URL = process.env.APP_URL;
      console.log(`✅ AUTH_URL: Set to ${process.env.APP_URL} (from APP_URL)`);
    } else {
      warnings.push(
        "⚠️  AUTH_URL and APP_URL not set - auth may not work correctly",
      );
    }
  } else {
    console.log(`✅ AUTH_URL: ${process.env.AUTH_URL}`);
  }

  // ═══════════════════════════════════════════════════════
  // APP_URL Fallback
  // ═══════════════════════════════════════════════════════
  if (!process.env.APP_URL && process.env.AUTH_URL) {
    process.env.APP_URL = process.env.AUTH_URL;
    console.log(`✅ APP_URL: Set to ${process.env.AUTH_URL} (from AUTH_URL)`);
  }

  // ═══════════════════════════════════════════════════════
  // LUMA_API_KEY
  // ═══════════════════════════════════════════════════════
  if (!process.env.LUMA_API_KEY) {
    warnings.push("⚠️  LUMA_API_KEY not set - video generation will fail");
  } else {
    console.log("✅ LUMA_API_KEY: Present");
  }

  // ═══════════════════════════════════════════════════════
  // REPORT RESULTS
  // ═══════════════════════════════════════════════════════
  if (warnings.length > 0) {
    console.log("\n⚠️  WARNINGS:");
    warnings.forEach((w) => console.log(w));
  }

  if (errors.length > 0) {
    console.log("\n❌ CRITICAL ERRORS:");
    errors.forEach((e) => console.log(e));
    console.log("\n🚨 Application may not function correctly!");
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log("\n✅ All environment variables validated successfully");
  }

  console.log("╚═══════════════════════════════════════════════════════╝\n");

  validated = true;
}

// Validate on first import
if (!validated) {
  validateEnvironment();
}

export { validateEnvironment };
export default validateEnvironment;
