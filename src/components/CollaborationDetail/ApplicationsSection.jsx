import { UserPlus, AlertCircle } from "lucide-react";
import { ApplicationCard } from "./ApplicationCard";

export function ApplicationsSection({
  applications,
  loading,
  error,
  onUpdateStatus,
  onRetry,
}) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-600 p-3 rounded-xl">
          <UserPlus size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#111418]">
            Applicants ({applications.length})
          </h2>
          <p className="text-[#667085]">
            {applications.length === 0
              ? "No applications yet"
              : `Review and manage ${applications.length} ${applications.length === 1 ? "application" : "applications"}`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div
            className="inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mb-4"
            style={{ animation: "spin 1s linear infinite" }}
          ></div>
          <p className="text-[#667085]">Loading applications...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-3" />
          <p className="text-red-700 font-semibold mb-2">
            {error === "authentication"
              ? "Sign in required"
              : error === "unauthorized"
                ? "Unauthorized access"
                : error === "networkError"
                  ? "Connection failed"
                  : "Failed to load applications"}
          </p>
          <button
            onClick={onRetry}
            className="text-red-600 hover:text-red-700 font-semibold text-sm"
          >
            Try again
          </button>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
          <UserPlus size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-semibold mb-1">
            No applications yet
          </p>
          <p className="text-sm text-gray-400">
            Share your collaboration to get more applicants
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
