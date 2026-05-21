import { ArrowLeft, Film, Crown } from "lucide-react";

export function PageHeader({ user, usage }) {
  return (
    <div className="bg-white border-b border-[#E5E7EB]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <a
          href="/"
          className="flex items-center gap-2 text-[#667085] hover:text-[#111418] mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Home
        </a>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 rounded-xl">
              <Film size={28} color="white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#111418]">
                Creative Studio
              </h1>
              <p className="text-[#667085] mt-1">
                {user
                  ? "Transform your vision into cinematic content"
                  : "Try it free - no login required!"}
              </p>
            </div>
          </div>
          {usage && usage.tier === "free" && (
            <a
              href="/pricing"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              <Crown size={18} />
              Upgrade
            </a>
          )}
        </div>
        {!user && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>Guest Mode:</strong> Try creating a reel for free!
              <a href="/account/signup" className="underline ml-1">
                Sign up
              </a>{" "}
              to save your work and unlock full features.
            </p>
          </div>
        )}
        {usage && usage.tier === "free" && (
          <div className="mt-4 bg-[#F8F9FB] rounded-xl p-4 border border-[#E5E7EB]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#667085]">
                Today: {usage.usage.today}/{usage.usage.dailyLimit} creations
              </span>
              <span className="text-[#667085]">
                This month: {usage.usage.month}/{usage.usage.monthlyLimit}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
