import { AlertCircle, WifiOff, RefreshCw } from "lucide-react";

export function ErrorState({ error, errorType, onRetry }) {
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full border border-gray-200 text-center">
        {errorType === "notFound" ? (
          <>
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-[#111418] mb-2">
              Collaboration Not Found
            </h2>
            <p className="text-[#667085] mb-6">
              This opportunity may have been removed or doesn't exist
            </p>
            <a
              href="/opportunity-hub"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all"
            >
              Browse Opportunities
            </a>
          </>
        ) : errorType === "networkError" ? (
          <>
            <WifiOff size={48} className="mx-auto text-orange-500 mb-4" />
            <h2 className="text-2xl font-bold text-[#111418] mb-2">
              Connection Error
            </h2>
            <p className="text-[#667085] mb-6">{error}</p>
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all"
            >
              <RefreshCw size={20} />
              Try Again
            </button>
          </>
        ) : (
          <>
            <AlertCircle size={48} className="mx-auto text-orange-500 mb-4" />
            <h2 className="text-2xl font-bold text-[#111418] mb-2">
              Something Went Wrong
            </h2>
            <p className="text-[#667085] mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onRetry}
                className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all"
              >
                <RefreshCw size={20} />
                Try Again
              </button>
              <a
                href="/opportunity-hub"
                className="inline-block bg-white border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all"
              >
                Browse Opportunities
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
