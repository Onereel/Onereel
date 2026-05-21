export function DashboardStats({
  myReels,
  myGigs,
  myJobs,
  myApplications,
  myTransactions,
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
      <div className="bg-gradient-to-br from-[#1DA1F2]/10 to-[#1DA1F2]/5 rounded-xl p-4 border border-[#1DA1F2]/20">
        <div className="text-2xl font-bold text-[#1DA1F2]">
          {myReels.length}
        </div>
        <div className="text-sm text-[#667085] dark:text-white/60">
          AI Reels
        </div>
      </div>
      <div className="bg-[#F8F9FB] dark:bg-[#1E1E1E] rounded-xl p-4">
        <div className="text-2xl font-bold text-[#1DA1F2]">{myGigs.length}</div>
        <div className="text-sm text-[#667085] dark:text-white/60">
          Active Gigs
        </div>
      </div>
      <div className="bg-[#F8F9FB] dark:bg-[#1E1E1E] rounded-xl p-4">
        <div className="text-2xl font-bold text-[#1DA1F2]">{myJobs.length}</div>
        <div className="text-sm text-[#667085] dark:text-white/60">
          Open Jobs
        </div>
      </div>
      <div className="bg-[#F8F9FB] dark:bg-[#1E1E1E] rounded-xl p-4">
        <div className="text-2xl font-bold text-[#1DA1F2]">
          {myApplications.length}
        </div>
        <div className="text-sm text-[#667085] dark:text-white/60">
          Applications
        </div>
      </div>
      <div className="bg-[#F8F9FB] dark:bg-[#1E1E1E] rounded-xl p-4">
        <div className="text-2xl font-bold text-[#1DA1F2]">
          {myTransactions.length}
        </div>
        <div className="text-sm text-[#667085] dark:text-white/60">
          Transactions
        </div>
      </div>
    </div>
  );
}
