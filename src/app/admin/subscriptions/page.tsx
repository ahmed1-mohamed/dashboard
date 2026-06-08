"use client";

import { useState } from "react";
import { Package, Users, Sparkles, Layers } from "lucide-react";

import { CustomerPlansTab } from "./tabs/customer-plans-tab";
import { DeveloperPackagesTab } from "./tabs/developer-packages-tab";
import { FeaturesTab } from "./tabs/features-tab";
import { AddonsTab } from "./tabs/addons-tab";

type TabType = "customer-plans" | "developer-packages" | "features" | "addons";

const TAB_CONFIG = {
  "customer-plans": { label: "Customer Plans", icon: Users },
  "developer-packages": { label: "Developer", icon: Package },
  "features": { label: "Features", icon: Sparkles },
  addons: { label: "Add-ons", icon: Layers },
} as const;

export default function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("subscriptions_active_tab");
      if (saved && (saved === "customer-plans" || saved === "developer-packages" || saved === "features" || saved === "addons")) {
        return saved as TabType;
      }
    }
    return "customer-plans";
  });

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      localStorage.setItem("subscriptions_active_tab", tab);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Subscriptions & Packages
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your subscription plans, developer packages, features, and add-ons
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-100 overflow-x-auto pb-px no-scrollbar">
        {(Object.entries(TAB_CONFIG) as [TabType, typeof TAB_CONFIG[TabType]][]).map(
          ([key, config]) => {
            const Icon = config.icon;
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap
                  ${
                    isActive
                      ? "border-teal-600 text-teal-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-teal-600" : "text-gray-400"}`} />
                {config.label}
              </button>
            );
          },
        )}
      </div>

      {/* Active Tab Content */}
      <div className="mt-6">
        {activeTab === "customer-plans" && <CustomerPlansTab />}
        {activeTab === "developer-packages" && <DeveloperPackagesTab />}
        {activeTab === "features" && <FeaturesTab />}
        {activeTab === "addons" && <AddonsTab />}
      </div>
    </div>
  );
}
