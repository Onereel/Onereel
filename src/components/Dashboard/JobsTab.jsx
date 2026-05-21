import { Plus, Briefcase } from "lucide-react";

export function JobsTab({ myJobs }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#111418] dark:text-white">
          My Jobs
        </h2>
        <a
          href="/jobs/create"
          className="flex items-center px-6 py-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold rounded-full transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Post Job
        </a>
      </div>

      {myJobs.length === 0 ? (
        <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-12 text-center">
          <Briefcase
            size={48}
            className="mx-auto text-gray-300 dark:text-white/20 mb-4"
          />
          <p className="text-[#667085] dark:text-white/60 mb-4">
            You haven't posted any jobs yet
          </p>
          <a
            href="/jobs/create"
            className="inline-block bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Post Your First Job
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {myJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <a
                    href={`/jobs/${job.id}`}
                    className="text-xl font-bold text-[#111418] dark:text-white hover:text-[#1DA1F2] transition-colors"
                  >
                    {job.title}
                  </a>
                  <p className="text-[#667085] dark:text-white/60 mt-2 line-clamp-2">
                    {job.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-4 text-sm">
                    <span className="text-[#1DA1F2] font-semibold">
                      ${parseFloat(job.budget).toFixed(0)} budget
                    </span>
                    <span className="text-[#667085] dark:text-white/60">
                      {job.application_count || 0} applications
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        job.status === "open"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : job.status === "in_progress"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
