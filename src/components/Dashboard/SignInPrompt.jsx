export function SignInPrompt() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">
          Please sign in
        </h2>
        <p className="text-[#667085] dark:text-white/60 mb-6">
          You need to be signed in to view your dashboard
        </p>
        <a
          href="/account/signin"
          className="inline-block bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-bold px-8 py-3 rounded-full transition-colors"
        >
          Sign In
        </a>
      </div>
    </div>
  );
}
