import { Sparkles } from "lucide-react";

export function AIMatchScore() {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
          <Sparkles size={24} className="text-white" />
        </div>
        <div>
          <div className="font-bold text-[#111418]">AI Match Score</div>
          <div className="text-sm text-[#667085]">Coming Soon</div>
        </div>
      </div>
      <p className="text-sm text-[#667085]">
        We'll analyze your profile and portfolio to show how well you match this
        opportunity
      </p>
    </div>
  );
}
