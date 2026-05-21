import { Flame } from "lucide-react";

export function InactivityPrompt({
  showInactivityPrompt,
  setShowInactivityPrompt,
  user,
  perfectMatches,
}) {
  if (!showInactivityPrompt || !user || perfectMatches.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-6 shadow-2xl max-w-md z-50 animate-fade-in">
      <button
        onClick={() => setShowInactivityPrompt(false)}
        className="absolute top-2 right-2 text-white/60 hover:text-white"
      >
        ×
      </button>
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-white/20 p-2 rounded-lg">
          <Flame size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg">
            🔥 {perfectMatches.length} collaborations need your skills
          </h3>
          <p className="text-white/90 text-sm">
            Perfect matches are waiting for you
          </p>
        </div>
      </div>
      <button
        onClick={() => {
          setShowInactivityPrompt(false);
          document
            .getElementById("feed")
            ?.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="w-full bg-white text-purple-600 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all"
      >
        View Matches Now
      </button>
    </div>
  );
}
