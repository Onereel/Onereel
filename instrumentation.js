/**
 * Next.js Instrumentation
 * Runs once when the server starts
 */

// Initialize environment variables at server startup
import "./src/app/api/utils/env-init.js";

export function register() {
  console.log("[Server Boot] Server started - environment initialized");
}
