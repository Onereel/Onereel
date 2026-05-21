"use client";

import { useState, useEffect } from "react";
import useAuth from "@/utils/useAuth";
import { ArrowLeft, AlertCircle, Loader2, Sparkles } from "lucide-react";

export default function SignInPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signInWithCredentials } = useAuth();

  useEffect(() => {
    // Check for URL errors (from OAuth callbacks)
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlError = params.get("error");
      const errorDetails = params.get("details");

      if (urlError === "callback_failed") {
        setError(
          `Authentication failed: ${errorDetails || "Please try again"}`,
        );
      } else if (urlError === "no_session") {
        setError("Session not found. Please try signing in again.");
      } else if (urlError) {
        setError(`Authentication error: ${urlError}`);
      }
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    console.log("[SignIn] ═══════════════════════════════════════");
    console.log("[SignIn] Starting signin process...");
    console.log("[SignIn] Email:", email);

    // ✅ STEP 1: Call sign-in
    const result = await signInWithCredentials({
      email,
      password,
      callbackUrl: "/opportunity-hub",
      redirect: false, // Manual redirect control
    });

    console.log("[SignIn] SignIn result:", result);

    // ✅ STEP 2: Check for errors
    if (result?.error) {
      console.error("[SignIn] ❌ Signin failed:", result.error);
      setError("Incorrect email or password. Please try again.");
      setLoading(false);
      console.log("[SignIn] ═══════════════════════════════════════");
      return;
    }

    console.log("[SignIn] ✅ No error in signin result");

    // ✅ STEP 3: Wait longer for session cookie to be set
    console.log("[SignIn] Waiting for session cookie to be set...");
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // ✅ STEP 4: Verify session exists with retries
    let sessionAttempts = 0;
    let sessionData = null;

    while (sessionAttempts < 3 && !sessionData?.user) {
      sessionAttempts++;
      console.log(`[SignIn] Session check attempt ${sessionAttempts}/3`);

      try {
        const sessionCheck = await fetch("/api/auth/session", {
          credentials: "include",
          cache: "no-store",
        });

        if (sessionCheck.ok) {
          sessionData = await sessionCheck.json();
          console.log("[SignIn] Session data:", {
            hasUser: !!sessionData?.user,
            userId: sessionData?.user?.id,
            email: sessionData?.user?.email,
          });

          if (sessionData?.user) {
            break; // Session found!
          }
        }

        // Wait before retry
        if (!sessionData?.user && sessionAttempts < 3) {
          console.log("[SignIn] No session yet, waiting before retry...");
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (sessionError) {
        console.error(
          `[SignIn] Session check ${sessionAttempts} failed:`,
          sessionError,
        );
      }
    }

    if (!sessionData?.user) {
      console.error("[SignIn] ❌ Session was not created after signin");
      console.log("[SignIn] Diagnostic info:");
      console.log("[SignIn] - Signin returned no error");
      console.log("[SignIn] - But session check failed");
      console.log(
        "[SignIn] - This indicates a cookie/session persistence issue",
      );
      console.log("[SignIn] ═══════════════════════════════════════");

      setError(
        "Sign-in succeeded but session was not created. This may be a cookie configuration issue. Please check the browser console for details.",
      );
      setLoading(false);
      return;
    }

    console.log("[SignIn] ✅ Session verified, user is authenticated");

    // ✅ STEP 5: Check profile and create if needed
    console.log("[SignIn] Checking profile status...");
    try {
      const profileCheck = await fetch("/api/profiles/check", {
        credentials: "include",
        cache: "no-store",
      });

      if (!profileCheck.ok) {
        console.warn("[SignIn] Profile check failed, but continuing...");
        console.log("[SignIn] Redirecting to Opportunity Hub...");
        console.log("[SignIn] ═══════════════════════════════════════");
        window.location.href = "/opportunity-hub";
        return;
      }

      const profileData = await profileCheck.json();

      console.log("[SignIn] Profile status:", {
        exists: profileData.exists,
        needsSetup: profileData.needsSetup,
        username: profileData.profile?.username,
      });

      // ✅ Redirect based on profile status
      if (profileData.needsSetup) {
        console.log("[SignIn] Profile incomplete, redirecting to setup...");
        console.log("[SignIn] ═══════════════════════════════════════");
        window.location.href = "/profile/setup";
        return;
      }

      console.log(
        "[SignIn] ✅ Profile complete, redirecting to Opportunity Hub...",
      );
      console.log("[SignIn] ═══════════════════════════════════════");
      window.location.href = "/opportunity-hub";
    } catch (profileError) {
      console.warn("[SignIn] ⚠️ Profile check error:", profileError);
      console.log("[SignIn] Continuing to Opportunity Hub anyway...");
      console.log("[SignIn] ═══════════════════════════════════════");
      window.location.href = "/opportunity-hub";
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-[#111418] dark:text-white mb-2">
            Sign in to One Reel
          </h1>
          <p className="text-[#667085] dark:text-white/60 text-lg">
            Create cinematic content instantly
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Email/Password Sign In */}
        <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-2xl p-8 mb-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 bg-[#F8F9FB] dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-xl text-[#111418] dark:text-white placeholder-[#667085] dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 bg-[#F8F9FB] dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-xl text-[#111418] dark:text-white placeholder-[#667085] dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center text-lg min-h-[56px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>Sign In</>
              )}
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-[#0A0A0A] text-[#667085] dark:text-white/60">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign In */}
        <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-2xl p-6 mb-6">
          <button
            onClick={() => (window.location.href = "/api/auth/signin/google")}
            disabled={loading}
            className="w-full bg-white dark:bg-[#1E1E1E] hover:bg-gray-50 dark:hover:bg-[#252525] disabled:bg-gray-400 text-[#111418] dark:text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center text-lg min-h-[56px] border border-gray-200 dark:border-white/10"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>
        </div>

        <div className="text-center space-y-4">
          <div>
            <span className="text-[#667085] dark:text-white/60 text-sm">
              Don't have an account?{" "}
            </span>
            <a
              href="/account/signup"
              className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
            >
              Sign up free
            </a>
          </div>

          <a
            href="/"
            className="text-[#667085] dark:text-white/60 hover:text-[#111418] dark:hover:text-white transition-colors text-sm inline-flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
