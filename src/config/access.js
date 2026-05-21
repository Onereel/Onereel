/**
 * ═══════════════════════════════════════════════════════════════════════
 * UNIVERSAL ACCESS CONFIGURATION - SINGLE SOURCE OF TRUTH
 * ═══════════════════════════════════════════════════════════════════════
 *
 * This is a Universal AI Creative Engine.
 * Platform verification is PERMANENTLY DISABLED.
 *
 * GUARANTEES:
 * ✅ Guests can create reels
 * ✅ Signed-in users can create reels
 * ✅ NO platform verification required (X, Twitter, etc.)
 * ✅ Auth only determines save history & billing
 * ✅ Auth NEVER blocks creation features
 *
 * LOCKED CONFIGURATION - DO NOT MODIFY
 * ═══════════════════════════════════════════════════════════════════════
 */

export const UNIVERSAL_ACCESS = true;

export const ACCESS_CONFIG = {
  // Core feature access (always true)
  GUEST_REEL_CREATION: true,
  GUEST_AI_GENERATION: true,
  GUEST_THUMBNAIL_GENERATION: true,
  GUEST_HOOK_GENERATION: true,

  // Verification requirements (always false)
  REQUIRE_PLATFORM_VERIFICATION: false,
  REQUIRE_X_VERIFICATION: false,
  REQUIRE_TWITTER_VERIFICATION: false,
  REQUIRE_BLUE_CHECK: false,

  // Auth determines these only
  AUTH_REQUIRED_FOR_SAVE: false, // Guests get temp save
  AUTH_REQUIRED_FOR_BILLING: true,
  AUTH_REQUIRED_FOR_HISTORY: true,

  // Feature gates (all open)
  VIDEO_GENERATION_GATE: false,
  THUMBNAIL_GENERATION_GATE: false,
  HOOK_GENERATION_GATE: false,
  TREND_ALERTS_GATE: false,
};

/**
 * Check if feature is accessible (always returns true)
 */
export function canAccessFeature(feature) {
  if (!UNIVERSAL_ACCESS) {
    console.warn(
      "[Universal Access] UNIVERSAL_ACCESS is disabled - this should never happen!",
    );
  }
  return true; // Universal access always grants permission
}

/**
 * Check if user needs platform verification (always returns false)
 */
export function requiresPlatformVerification() {
  return false; // Never require platform verification
}

/**
 * Get access message for UI
 */
export function getAccessMessage() {
  return {
    title: "Create Without Limits",
    description: "No verification required - start creating immediately",
    ctaText: "Start Creating",
  };
}
