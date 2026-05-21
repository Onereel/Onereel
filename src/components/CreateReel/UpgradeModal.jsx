import { Crown } from "lucide-react";

export function UpgradeModal({ show, error, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-2xl p-8 max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center mx-auto mb-4">
            <Crown size={32} className="text-black" />
          </div>
          <h3 className="text-2xl font-bold text-[#111418] mb-2">
            Limit Reached
          </h3>
          <p className="text-[#667085]">{error}</p>
        </div>
        <div className="space-y-3">
          <a
            href="/pricing"
            className="block w-full bg-gradient-to-r from-[#1DA1F2] to-[#0EA5E9] text-white py-3 rounded-xl font-bold text-center hover:opacity-90 transition-opacity"
          >
            Upgrade to Pro
          </a>
          <button
            onClick={onClose}
            className="block w-full bg-[#F8F9FB] text-[#667085] py-3 rounded-xl font-semibold hover:bg-[#E5E7EB] transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
