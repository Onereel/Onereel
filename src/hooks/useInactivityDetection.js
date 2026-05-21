import { useEffect } from "react";

export function useInactivityDetection(
  inactivityTimerRef,
  lastActivityRef,
  setShowInactivityPrompt,
) {
  useEffect(() => {
    const resetInactivityTimer = () => {
      lastActivityRef.current = Date.now();
      setShowInactivityPrompt(false);

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      inactivityTimerRef.current = setTimeout(() => {
        setShowInactivityPrompt(true);
      }, 60000); // 60 seconds
    };

    // Track user activity
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);
    window.addEventListener("scroll", resetInactivityTimer);
    window.addEventListener("click", resetInactivityTimer);

    resetInactivityTimer();

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
      window.removeEventListener("scroll", resetInactivityTimer);
      window.removeEventListener("click", resetInactivityTimer);
    };
  }, [inactivityTimerRef, lastActivityRef, setShowInactivityPrompt]);
}
