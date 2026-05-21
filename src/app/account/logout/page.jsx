"use client";

import useAuth from "@/utils/useAuth";
import { Shield, ArrowLeft } from "lucide-react";

export default function LogoutPage() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1DA1F2] to-[#0A66C2] flex items-center justify-center p-6">
      <a
        href="/dashboard"
        className="absolute top-6 left-6 inline-flex items-center text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to dashboard
      </a>

      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#121212] rounded-2xl shadow-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1DA1F2] to-[#0A66C2] rounded-full mb-6">
            <Shield size={32} className="text-white" />
          </div>

          <h1 className="text-3xl font-extrabold text-[#111418] dark:text-white mb-4">
            Sign Out
          </h1>
          <p className="text-[#667085] dark:text-white/60 mb-8">
            Are you sure you want to sign out of One Reel?
          </p>

          <button
            onClick={handleSignOut}
            className="w-full bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-bold py-4 rounded-full transition-colors mb-4"
          >
            Sign Out
          </button>

          <a
            href="/dashboard"
            className="inline-block text-[#667085] dark:text-white/60 hover:text-[#1DA1F2] transition-colors"
          >
            Cancel
          </a>
        </div>
      </div>
    </div>
  );
}
