import { Package, Briefcase, FileText, DollarSign } from "lucide-react";

export function DashboardTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "gigs", label: "My Gigs", icon: Package },
    { id: "jobs", label: "My Jobs", icon: Briefcase },
    { id: "applications", label: "Applications", icon: FileText },
    { id: "transactions", label: "Transactions", icon: DollarSign },
  ];

  return (
    <div className="flex space-x-2 mb-6 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center px-6 py-3 rounded-full font-semibold transition-colors whitespace-nowrap ${
            activeTab === tab.id
              ? "bg-[#1DA1F2] text-white"
              : "bg-white dark:bg-[#121212] text-[#667085] dark:text-white/60 hover:bg-gray-50 dark:hover:bg-[#1E1E1E]"
          }`}
        >
          <tab.icon size={18} className="mr-2" />
          {tab.label}
        </button>
      ))}
    </div>
  );
}
