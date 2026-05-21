import { ArrowLeft, Share2, Bookmark, BookmarkCheck } from "lucide-react";

export function HeaderActions({ saved, onSave, onShare }) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a
            href="/opportunity-hub"
            className="flex items-center gap-2 text-[#667085] hover:text-[#111418] transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Back to Opportunities
          </a>

          <div className="flex items-center gap-3">
            <button
              onClick={onSave}
              className={`p-2.5 rounded-xl border-2 transition-all ${
                saved
                  ? "bg-purple-50 border-purple-600 text-purple-600"
                  : "border-gray-200 text-gray-400 hover:border-purple-300 hover:text-purple-600"
              }`}
            >
              {saved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
            </button>

            <button
              onClick={onShare}
              className="p-2.5 rounded-xl border-2 border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-600 transition-all"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
