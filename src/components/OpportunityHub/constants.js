import { DollarSign, Users, TrendingUp, Sparkles, Zap } from "lucide-react";

export const COLLAB_TYPE_LABELS = {
  paid: { label: "Paid Project", icon: DollarSign, color: "green" },
  partnership: { label: "Partnership", icon: Users, color: "purple" },
  equity: { label: "Equity Share", icon: TrendingUp, color: "blue" },
  passion: { label: "Passion Project", icon: Sparkles, color: "pink" },
  brand_deal: { label: "Brand Deal", icon: Zap, color: "orange" },
};
