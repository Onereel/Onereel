export function CreateProfilePrompt() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">
          Create Your Profile
        </h2>
        <p className="text-[#667085] dark:text-white/60 mb-6">
          You need to create your profile before using One Reel
        </p>
        <a
          href="/profile/setup"
          className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-8 py-3 rounded-full transition-all"
        >
          Create Profile
        </a>
      </div>
    </div>
  );
}
