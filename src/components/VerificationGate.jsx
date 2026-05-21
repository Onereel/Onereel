/**
 * ═══════════════════════════════════════════════════════════════════════
 * VERIFICATION GATE - UNIVERSAL ACCESS MODE (DISABLED)
 * ═══════════════════════════════════════════════════════════════════════
 *
 * This component is now a PASS-THROUGH component.
 * Platform verification is permanently disabled.
 *
 * All children render immediately without any verification checks.
 * ═══════════════════════════════════════════════════════════════════════
 */

import { UNIVERSAL_ACCESS } from "@/config/access";

export default function VerificationGate({ children }) {
  // UNIVERSAL ACCESS MODE: Always render children immediately
  if (UNIVERSAL_ACCESS) {
    return <>{children}</>;
  }

  // Fallback (should never be reached)
  console.warn(
    "[VerificationGate] UNIVERSAL_ACCESS is disabled - this should not happen!",
  );
  return <>{children}</>;
}
