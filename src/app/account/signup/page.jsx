"use client";

import { useState } from "react";
import useAuth from "@/utils/useAuth";
import { Shield, ArrowLeft } from "lucide-react";

export default function SignUpPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signUpWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    console.log("[SignUp] ═══════════════════════════════════════");
    console.log("[SignUp] Starting signup process...");

    // ✅ Call sign-up and handle result manually
    const result = await signUpWithCredentials({
      email,
      password,
      callbackUrl: "/profile/setup", // Changed: redirect to profile setup after signup
    });

    // ✅ Check for errors
    if (result?.error) {
      console.error("[SignUp] ❌ Signup failed:", result.error);
      setError("This email is already registered. Try signing in instead.");
      setLoading(false);
      return;
    }

    console.log("[SignUp] ✅ Account created successfully");

    // ✅ Wait for session to be established
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("[SignUp] Verifying session and creating profile...");

    // ✅ Verify session exists
    try {
      const sessionCheck = await fetch("/api/auth/session", {
        credentials: "include",
      });
      const sessionData = await sessionCheck.json();

      if (sessionData?.user) {
        console.log(
          "[SignUp] ✅ Session verified, user is authenticated:",
          sessionData.user.email,
        );

        // ✅ AUTO-CREATE MINIMAL PROFILE (CRITICAL FIX FOR CREDENTIALS SIGNUP)
        console.log("[SignUp] Creating initial profile...");
        try {
          const profileResponse = await fetch("/api/profiles/auto-create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              name: sessionData.user.name || "Creator",
              email: sessionData.user.email,
            }),
          });

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            console.log(
              "[SignUp] ✅ Profile created:",
              profileData.created ? "NEW" : "EXISTING",
            );
          } else {
            console.warn(
              "[SignUp] ⚠️ Profile creation failed, but continuing...",
            );
          }
        } catch (profileError) {
          console.warn("[SignUp] ⚠️ Could not create profile:", profileError);
        }
      } else {
        console.warn(
          "[SignUp] ⚠️ No session found after signup, but continuing...",
        );
      }
    } catch (sessionError) {
      console.warn("[SignUp] ⚠️ Could not verify session:", sessionError);
    }

    // ✅ Success - redirect to profile setup to complete profile
    console.log("[SignUp] Redirecting to Profile Setup...");
    console.log("[SignUp] ═══════════════════════════════════════");
    window.location.href = "/profile/setup";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1DA1F2] to-[#0A66C2] flex items-center justify-center p-6">
      <a
        href="/"
        className="absolute top-6 left-6 inline-flex items-center text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to home
      </a>

      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#121212] rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1DA1F2] to-[#0A66C2] rounded-full mb-4">
              <Shield size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-[#111418] dark:text-white mb-2">
              Create Account
            </h1>
            <p className="text-[#667085] dark:text-white/60">
              Join the One Reel creator marketplace
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                Email
              </label>
              <input
                required
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                Password
              </label>
              <input
                required
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password (min. 8 characters)"
                className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1DA1F2] hover:bg-[#1a8cd8] disabled:bg-gray-400 text-white font-bold py-4 rounded-full transition-colors"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-[#667085] dark:text-white/60">
              Already have an account?{" "}
              <a
                href="/account/signin"
                className="text-[#1DA1F2] hover:underline font-semibold"
              >
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
