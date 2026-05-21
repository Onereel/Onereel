/**
 * FAIL-SOFT AUTH WRAPPER
 * Returns null gracefully if auth is not configured or fails
 */

let authInstance = null;
let authError = null;
let initAttempted = false;

async function initAuth() {
  if (authInstance) return authInstance;
  if (authError) return null;
  if (initAttempted) return null;

  initAttempted = true;

  try {
    if (!process.env.DATABASE_URL) {
      authError = new Error("DATABASE_URL not configured");
      return null;
    }

    if (!process.env.AUTH_SECRET) {
      authError = new Error("AUTH_SECRET not configured");
      return null;
    }

    const authModule = await import("@/auth");

    if (!authModule?.auth) {
      throw new Error("Auth module not found");
    }

    authInstance = authModule.auth;
    return authInstance;
  } catch (error) {
    authError = error;
    return null;
  }
}

export async function auth() {
  try {
    const authFn = await initAuth();
    if (!authFn) return null;

    let session;
    try {
      session = await authFn();
    } catch (authCallError) {
      return null;
    }

    if (session && typeof session !== "object") {
      return null;
    }

    return session;
  } catch (error) {
    return null;
  }
}

export function isAuthConfigured() {
  return !!(process.env.DATABASE_URL && process.env.AUTH_SECRET);
}

export default auth;
