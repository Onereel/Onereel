import { useState } from "react";
import { AlertCircle, Send, ExternalLink } from "lucide-react";
import { triggerNotificationRefresh } from "@/hooks/useNotifications";

export function ApplyModal({
  collaborationId,
  collaborationTitle,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    message: "",
    portfolioHighlights: [],
    availability: "",
  });

  const [newHighlight, setNewHighlight] = useState("");

  const addHighlight = () => {
    if (newHighlight.trim() && formData.portfolioHighlights.length < 5) {
      setFormData({
        ...formData,
        portfolioHighlights: [
          ...formData.portfolioHighlights,
          newHighlight.trim(),
        ],
      });
      setNewHighlight("");
    }
  };

  const removeHighlight = (index) => {
    setFormData({
      ...formData,
      portfolioHighlights: formData.portfolioHighlights.filter(
        (_, i) => i !== index,
      ),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/collaborations/${collaborationId}/apply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit application");
      }

      // 🔥 FIX: Trigger notification refresh so creator's bell icon updates
      triggerNotificationRefresh();

      onSuccess();
    } catch (err) {
      console.error("Error submitting application:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#111418] mb-1">
                Apply to Collaborate
              </h2>
              <p className="text-sm text-[#667085]">{collaborationTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <AlertCircle size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#111418] mb-2">
              Why are you a great fit? *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Introduce yourself, highlight your relevant experience, and explain why you're excited about this project..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
              required
            />
            <p className="text-xs text-[#667085] mt-1">
              Tip: Be specific and authentic. Show enthusiasm!
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#111418] mb-2">
              Portfolio Highlights (Optional)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                placeholder="https://example.com/your-work"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button
                type="button"
                onClick={addHighlight}
                className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-all"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.portfolioHighlights.map((link, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg"
                >
                  <ExternalLink size={16} className="text-purple-600" />
                  <span className="flex-1 truncate text-sm text-purple-800">
                    {link}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeHighlight(idx)}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#111418] mb-2">
              Availability (Optional)
            </label>
            <input
              type="text"
              value={formData.availability}
              onChange={(e) =>
                setFormData({ ...formData, availability: e.target.value })
              }
              placeholder="e.g., Available immediately, 10 hours/week, weekends only"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.message}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    style={{ animation: "spin 1s linear infinite" }}
                  ></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
