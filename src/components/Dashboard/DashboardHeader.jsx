import { Settings } from "lucide-react";

export function DashboardHeader({ profile }) {
  return (
    <div className="bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-[#111418] dark:text-white">
              Dashboard
            </h1>
            <p className="text-[#667085] dark:text-white/60 mt-1">
              Welcome back, {profile.name}!
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <a
              href="/profile/setup"
              className="px-4 py-2 border-2 border-gray-300 dark:border-white/10 text-[#667085] dark:text-white/60 hover:border-[#1DA1F2] hover:text-[#1DA1F2] font-semibold rounded-full transition-colors flex items-center"
            >
              <Settings size={18} className="mr-2" />
              Edit Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
