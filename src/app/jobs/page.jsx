"use client";

import { useState, useEffect } from "react";
import { Search, DollarSign, Calendar, Users } from "lucide-react";
import VerificationGate from "@/components/VerificationGate";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      setLoading(true);
      const response = await fetch("/api/jobs?status=open");
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <VerificationGate>
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A]">
        {/* Header */}
        <div className="bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-[#111418] dark:text-white">
                  Browse Jobs
                </h1>
                <p className="text-[#667085] dark:text-white/60 mt-1">
                  Find opportunities from verified creators
                </p>
              </div>
              <a
                href="/dashboard"
                className="px-6 py-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold rounded-full transition-colors"
              >
                Dashboard
              </a>
            </div>

            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-white/10 rounded-full bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
              />
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-[#1DA1F2] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-[#667085] dark:text-white/60">
                Loading jobs...
              </p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-[#1DA1F2]/10 rounded-full flex items-center justify-center">
                  <Users size={48} className="text-[#1DA1F2]" />
                </div>
                <h3 className="text-2xl font-bold text-[#111418] dark:text-white mb-3">
                  No jobs yet
                </h3>
                <p className="text-lg text-[#667085] dark:text-white/60 mb-6">
                  {searchTerm
                    ? "Try adjusting your search to find more opportunities."
                    : "Check back soon for new opportunities from verified creators."}
                </p>
                <a
                  href="/dashboard"
                  className="inline-block bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold px-6 py-3 rounded-full transition-colors"
                >
                  Go to Dashboard
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <a
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="block bg-white dark:bg-[#121212] rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-white/10 hover:border-[#1DA1F2] dark:hover:border-[#1DA1F2] p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#111418] dark:text-white mb-2 hover:text-[#1DA1F2] transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-[#667085] dark:text-white/60 line-clamp-2 mb-4">
                        {job.description}
                      </p>
                    </div>
                    <div className="ml-6 text-right">
                      <div className="text-2xl font-bold text-[#1DA1F2]">
                        ${parseFloat(job.budget).toFixed(0)}
                      </div>
                      <div className="text-sm text-[#667085] dark:text-white/60">
                        Budget
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  {job.required_skills && job.required_skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.required_skills.map((skill, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer Info */}
                  <div className="flex items-center justify-between text-sm text-[#667085] dark:text-white/60 pt-4 border-t border-gray-200 dark:border-white/10">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1DA1F2] to-[#0A66C2] flex items-center justify-center text-white font-bold text-xs mr-2">
                          {job.creator_name?.charAt(0) || "U"}
                        </div>
                        <span>@{job.creator_username}</span>
                      </div>
                      {job.deadline && (
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-1" />
                          Due {new Date(job.deadline).toLocaleDateString()}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Users size={16} className="mr-1" />
                        {job.application_count || 0} applicants
                      </div>
                    </div>
                    <span className="text-[#1DA1F2] font-semibold">
                      View Details →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </VerificationGate>
  );
}
