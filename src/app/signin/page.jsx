"use client";

import { useEffect } from "react";

export default function SignInRedirect() {
  useEffect(() => {
    window.location.href = "/account/signin";
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-[#1DA1F2] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[#667085] dark:text-white/60">
          Redirecting to sign in...
        </p>
      </div>
    </div>
  );
}
