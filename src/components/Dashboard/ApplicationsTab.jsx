import { FileText } from "lucide-react";

export function ApplicationsTab({ myApplications }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-6">
        My Applications
      </h2>

      {myApplications.length === 0 ? (
        <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-12 text-center">
          <FileText
            size={48}
            className="mx-auto text-gray-300 dark:text-white/20 mb-4"
          />
          <p className="text-[#667085] dark:text-white/60 mb-4">
            You haven't applied to any jobs yet
          </p>
          <a
            href="/jobs"
            className="inline-block bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Browse Jobs
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {myApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <a
                    href={`/jobs/${app.job_id}`}
                    className="text-lg font-bold text-[#111418] dark:text-white hover:text-[#1DA1F2] transition-colors"
                  >
                    {app.job_title}
                  </a>
                  {app.proposed_rate && (
                    <div className="text-sm text-[#1DA1F2] font-semibold mt-1">
                      Your Rate: ${parseFloat(app.proposed_rate).toFixed(0)}
                    </div>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    app.status === "pending"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : app.status === "accepted"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {app.status}
                </span>
              </div>
              <p className="text-sm text-[#667085] dark:text-white/60">
                {app.proposal}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
