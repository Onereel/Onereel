import { DollarSign, Users, TrendingUp, Sparkles, Zap } from "lucide-react";

export const COLLAB_TYPE_LABELS = {
  paid: { label: "Paid Project", icon: DollarSign, color: "green" },
  partnership: { label: "Partnership", icon: Users, color: "purple" },
  equity: { label: "Equity Share", icon: TrendingUp, color: "blue" },
  passion: { label: "Passion Project", icon: Sparkles, color: "pink" },
  brand_deal: { label: "Brand Deal", icon: Zap, color: "orange" },
};

export const URGENCY_COLORS = {
  low: "bg-gray-100 text-gray-700 border-gray-200",
  normal: "bg-blue-50 text-blue-700 border-blue-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  urgent: "bg-red-50 text-red-700 border-red-200",
};
