import { Briefcase, Users, ArrowRight } from "lucide-react";

export function ActiveProjectsSection({ activeProjects }) {
  if (!activeProjects || activeProjects.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 shadow-xl mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <Briefcase size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white">
                Your Active Projects
              </h2>
              <p className="text-white/90">
                {activeProjects.length} collaboration
                {activeProjects.length !== 1 ? "s" : ""} in progress
              </p>
            </div>
          </div>
          <a
            href="/active-projects"
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2"
          >
            View All
            <ArrowRight size={18} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeProjects.slice(0, 3).map((project) => (
            <div
              key={project.workspace_id}
              className="bg-white rounded-xl p-4 shadow-md"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[#111418] line-clamp-1">
                  {project.title}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    project.status === "active"
                      ? "bg-blue-100 text-blue-700"
                      : project.status === "in_review"
                        ? "bg-yellow-100 text-yellow-700"
                        : project.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {project.status === "active"
                    ? "Active"
                    : project.status === "in_review"
                      ? "In Review"
                      : project.status === "completed"
                        ? "Completed"
                        : project.status}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3 text-sm text-[#667085]">
                <Users size={14} />
                <span>
                  {project.role === "creator"
                    ? "Working with"
                    : "Collaborating with"}
                  :
                </span>
                <span className="font-semibold text-[#111418]">
                  {project.other_party_name}
                </span>
              </div>

              <div className="flex gap-2">
                <a
                  href={`/workspace/${project.workspace_id}`}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all text-center text-sm"
                >
                  Open Workspace
                </a>
                <span className="px-3 py-2 bg-gray-100 text-[#667085] rounded-lg text-xs font-semibold">
                  {project.role === "creator" ? "Creator" : "Editor"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
