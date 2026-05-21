import { DollarSign, Users, TrendingUp, Sparkles, Zap } from "lucide-react";

export const COLLAB_TYPE_CONFIG = {
  paid: {
    label: "Paid Project",
    icon: DollarSign,
    color: "green",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  partnership: {
    label: "Partnership",
    icon: Users,
    color: "purple",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  equity: {
    label: "Equity Share",
    icon: TrendingUp,
    color: "blue",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  passion: {
    label: "Passion Project",
    icon: Sparkles,
    color: "pink",
    bg: "bg-pink-50",
    text: "text-pink-700",
    border: "border-pink-200",
  },
  brand_deal: {
    label: "Brand Deal",
    icon: Zap,
    color: "orange",
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
};
