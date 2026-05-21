/**
 * ═══════════════════════════════════════════════════════════════════════
 * VERIFIED BADGE - UNIVERSAL ACCESS MODE (DISABLED)
 * ═══════════════════════════════════════════════════════════════════════
 *
 * This component is now INVISIBLE.
 * Platform verification badges are permanently disabled.
 * ═══════════════════════════════════════════════════════════════════════
 */

import { UNIVERSAL_ACCESS } from "@/config/access";

export default function VerifiedBadge({
  verified = false,
  blueVerified = false,
  size = "md",
  showText = false,
}) {
  // UNIVERSAL ACCESS MODE: Never show verification badges
  if (UNIVERSAL_ACCESS) {
    return null;
  }

  // Fallback (should never be reached)
  return null;
}
