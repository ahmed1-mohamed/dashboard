"use client";

import { useState, useCallback } from "react";
import {
  Plus,
  RefreshCw,
  AlertCircle,
  Search,
  Loader2,
  Trash2,
  AlertTriangle,
  Package,
  Users,
  Sparkles,
  Layers,
  Check,
  MoreHorizontal,
  Eye,
  Edit,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import useDashboardAdminSubscriptions from "@/hooks/use-dashboardAdminSubscriptions";

import AddDeveloperPackageModal from "@/components/modals/create-developer-package-modal";
import UpdateDeveloperPackageModal from "@/components/modals/update-developer-package-modal";
import ViewDeveloperPackageModal from "@/components/modals/view-developer-package-modal";
import CreateBadgeModal from "@/components/modals/create-badge-modal";
import UpdateBadgeModal from "@/components/modals/update-badge-modal";
import ViewBadgeModal from "@/components/modals/view-badge-modal";
import CreateAddonModal from "@/components/modals/create-addon-modal";
import UpdateAddonModal from "@/components/modals/update-addon-modal";
import ViewAddonModal from "@/components/modals/view-addon-modal";
import AddCustomerPlanModal from "@/components/modals/add-customer-plan-modal";
import ViewCustomerPlanModal from "@/components/modals/view-customer-plan-modal";
import UpdateCustomerPlanModal from "@/components/modals/update-customer-plan-modal";
import { toast } from "sonner";
import { LoadingSkeleton } from "./components/loading-skeleton";
import { ErrorState } from "./components/error-state";
import { EmptyState } from "./components/empty-state";
import { PackageCard } from "./components/package-card";
import { CustomerPlanCard } from "./components/customer-plan-card";
import { BadgeCard } from "./components/badge-card";
import { AddonCard } from "./components/addon-card";

type TabType = "customer-plans" | "developer-packages" | "features" | "addons";

const TAB_CONFIG = {
  "customer-plans": { label: "Customer Plans", icon: Users },
  "developer-packages": { label: "Developer", icon: Package },
  "features": { label: "Features", icon: Sparkles },
  addons: { label: "Add-ons", icon: Layers },
} as const;

interface PackageItem {
  status: boolean;
  credits: any;
  price: any;
  id: number;
  name: string;
}

interface Feature {
  badge_id: number;
  name: string;
  code: string;
  applies_to: string;
}

interface PackagesResponse {
  packages: PackageItem[];
}


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
  const [searchQuery, setSearchQuery] = useState("");
  const [createAdModalOpen, setCreateAdModalOpen] = useState(false);
  const [createCustomerPlanModalOpen, setCreateCustomerPlanModalOpen] = useState(false);
  const [createBadgeModalOpen, setCreateBadgeModalOpen] = useState(false);
  const [createAddonModalOpen, setCreateAddonModalOpen] = useState(false);
  const [updateAddonData, setUpdateAddonData] = useState<any | null>(null);
  const [viewAddonData, setViewAddonData] = useState<any | null>(null);
  const [updateBadgeData, setUpdateBadgeData] = useState<any | null>(null);
  const [viewBadgeData, setViewBadgeData] = useState<any | null>(null);
  const [updatePackageData, setUpdatePackageData] = useState<any | null>(null);
  const [viewPackageData, setViewPackageData] = useState<any | null>(null);
  const [viewPlanId, setViewPlanId] = useState<number | string | null>(null);
  const [updatePlanId, setUpdatePlanId] = useState<number | string | null>(null);

  const {
    packagesQuery,
    customerPlansQuery,
    badgesQuery,
    addonsQuery,
    deletePackageMutation,
    deleteBadgeMutation,
    deleteAddonMutation,
    deleteCustomerPlanMutation,
  } = useDashboardAdminSubscriptions(activeTab);

  // Delete Customer Plan
  const handleDeleteCustomerPlan = useCallback(
    (planId: number | string) => {
      deleteCustomerPlanMutation.mutate(planId, {
        onSuccess: () => {
          toast.success("Customer plan deleted successfully");
        },
        onError: (error) => {
          const message =
            error instanceof Error ? error.message : "Failed to delete customer plan";
          toast.error(message);
        },
      });
    },
    [deleteCustomerPlanMutation],
  );

  // Delete Package
  const handleDeletePackage = useCallback(
    (packageId: number) => {
      deletePackageMutation.mutate(packageId, {
        onSuccess: () => {
          toast.success("Package deleted successfully");
        },
        onError: (error) => {
          const message =
            error instanceof Error ? error.message : "Failed to delete package";
          toast.error(message);
        },
      });
    },
    [deletePackageMutation],
  );

  // Delete Badge
  const handleDeleteBadge = useCallback(
    (badgeId: number) => {
      deleteBadgeMutation.mutate(badgeId, {
        onSuccess: () => {
          toast.success("Feature deleted successfully");
        },
        onError: (error) => {
          const message =
            error instanceof Error ? error.message : "Failed to delete feature";
          toast.error(message);
        },
      });
    },
    [deleteBadgeMutation],
  );

  // Delete Add-on
  const handleDeleteAddon = useCallback(
    (addonId: number) => {
      deleteAddonMutation.mutate(addonId, {
        onSuccess: () => {
          toast.success("Add-on deleted successfully");
        },
        onError: (error) => {
          const message =
            error instanceof Error ? error.message : "Failed to delete add-on";
          toast.error(message);
        },
      });
    },
    [deleteAddonMutation],
  );

  // Get data from queries
  const packagesData = packagesQuery.data?.data;
  const packages = Array.isArray(packagesData)
    ? packagesData
    : (packagesData?.data || packagesData?.packages || []);
  const customerPlans = (customerPlansQuery.data?.data as any)?.data || [];

  const badgesData = badgesQuery.data?.data;
  const badges = Array.isArray(badgesData) ? badgesData : (badgesData?.data || []);

  const addonsData = addonsQuery.data?.data;
  const addons = Array.isArray(addonsData) ? addonsData : (addonsData?.data || []);

  // Filtering for customer plans
  const filteredCustomerPlans = customerPlans.filter(
    (plan: any) =>
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Filtering for packages
  const filteredPackages = packages.filter(
    (pkg: any) =>
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Best value calculation
  let bestValueId: number | null = null;
  let lowestRate = Infinity;
  filteredPackages.forEach((p) => {
    const rate = p.price / p.credits;
    if (rate < lowestRate && p.status) {
      lowestRate = rate;
      bestValueId = p.id;
    }
  });

  // Filtering for badges
  const filteredBadges = badges.filter(
    (b: any) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Filtering for addons
  const filteredAddons = addons.filter(
    (a: any) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "customer-plans":
        if (customerPlansQuery.isLoading) {
          return <LoadingSkeleton />;
        }
        if (customerPlansQuery.isError) {
          return (
            <ErrorState
              error={
                customerPlansQuery.error instanceof Error
                  ? customerPlansQuery.error.message
                  : "Failed to load customer plans"
              }
              onRetry={() => customerPlansQuery.refetch()}
            />
          );
        }
        if (customerPlans.length === 0) {
          return (
            <EmptyState
              title="No customer plans found"
              message="There are no customer plans available at the moment."
            />
          );
        }
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCustomerPlans.map((plan: any, index: number) => (
              <CustomerPlanCard
                key={plan.id || plan.code || `plan-${index}`}
                plan={plan}
                onView={(id) => setViewPlanId(id)}
                onEdit={(id) => setUpdatePlanId(id)}
                onDelete={handleDeleteCustomerPlan}
              />
            ))}
          </div>
        );

      case "developer-packages":
        if (packagesQuery.isLoading) {
          return <LoadingSkeleton />;
        }
        if (packagesQuery.isError) {
          return (
            <ErrorState
              error={
                packagesQuery.error instanceof Error
                  ? packagesQuery.error.message
                  : "Failed to load packages"
              }
              onRetry={() => packagesQuery.refetch()}
            />
          );
        }
        if (packages.length === 0) {
          return (
            <EmptyState
              title="No packages found"
              message="There are no ad credit packages available at the moment."
            />
          );
        }
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPackages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                isBestValue={pkg.id === bestValueId}
                onView={(pkgData) => setViewPackageData(pkgData)}
                onEdit={(pkgData) => setUpdatePackageData(pkgData)}
                onDelete={handleDeletePackage}
                isDeleting={
                  deletePackageMutation.isPending &&
                  deletePackageMutation.variables === pkg.id
                }
              />
            ))}
          </div>
        );

      case "features":
        if (badgesQuery.isLoading) {
          return <LoadingSkeleton />;
        }
        if (badgesQuery.isError) {
          return (
            <ErrorState
              error={
                badgesQuery.error instanceof Error
                  ? badgesQuery.error.message
                  : "Failed to load features"
              }
              onRetry={() => badgesQuery.refetch()}
            />
          );
        }
        if (filteredBadges.length === 0) {
          return (
            <EmptyState
              title="No features found"
              message="There are no features or badges available at the moment."
            />
          );
        }
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBadges.map((badge: any, index: number) => (
              <BadgeCard
                key={badge.id || `badge-${index}`}
                badge={badge}
                onView={(b) => setViewBadgeData(b)}
                onEdit={(b) => setUpdateBadgeData(b)}
                onDelete={handleDeleteBadge}
                isDeleting={
                  deleteBadgeMutation.isPending &&
                  deleteBadgeMutation.variables === (badge.id || badge.badge_id)
                }
              />
            ))}
          </div>
        );

      case "addons":
        if (addonsQuery.isLoading) {
          return <LoadingSkeleton />;
        }
        if (addonsQuery.isError) {
          return (
            <ErrorState
              error={
                addonsQuery.error instanceof Error
                  ? addonsQuery.error.message
                  : "Failed to load add-ons"
              }
              onRetry={() => addonsQuery.refetch()}
            />
          );
        }
        if (filteredAddons.length === 0) {
          return (
            <EmptyState
              title="No add-ons found"
              message="There are no add-ons available at the moment."
            />
          );
        }
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAddons.map((addon: any, index: number) => (
              <AddonCard
                key={addon.id || addon.addon_id || `addon-${index}`}
                addon={addon}
                onView={(a) => setViewAddonData(a)}
                onEdit={(a) => setUpdateAddonData(a)}
                onDelete={handleDeleteAddon}
                isDeleting={
                  deleteAddonMutation.isPending &&
                  deleteAddonMutation.variables === (addon.id || addon.addon_id)
                }
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // Get current tab config
  const currentTabConfig = TAB_CONFIG[activeTab];
  const CurrentTabIcon = currentTabConfig.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Subscriptions
          </h1>
          <p className="text-sm text-gray-500">
            Manage all subscription plans and add-ons
          </p>
        </div>

        {activeTab === "customer-plans" && (
          <div className="flex gap-2">
            <Button
              onClick={() => setCreateCustomerPlanModalOpen(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Plan
            </Button>

            <Button
              variant="outline"
              onClick={() => customerPlansQuery.refetch()}
              disabled={customerPlansQuery.isFetching}
              className="gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${customerPlansQuery.isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        )}

        {activeTab === "developer-packages" && (
          <div className="flex gap-2">
            <Button
              onClick={() => setCreateAdModalOpen(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Package
            </Button>

            <Button
              variant="outline"
              onClick={() => packagesQuery.refetch()}
              disabled={packagesQuery.isFetching}
              className="gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${packagesQuery.isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        )}
        {activeTab === "features" && (
          <div className="flex gap-2">
            <Button
              onClick={() => setCreateBadgeModalOpen(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Feature
            </Button>

            <Button
              variant="outline"
              onClick={() => badgesQuery.refetch()}
              disabled={badgesQuery.isFetching}
              className="gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${badgesQuery.isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        )}
        {activeTab === "addons" && (
          <div className="flex gap-2">
            <Button
              onClick={() => setCreateAddonModalOpen(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Add-on
            </Button>

            <Button
              variant="outline"
              onClick={() => addonsQuery.refetch()}
              disabled={addonsQuery.isFetching}
              className="gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${addonsQuery.isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1" aria-label="Tabs">
          {Object.entries(TAB_CONFIG).map(([key, config]) => {
            const Icon = config.icon;
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => handleTabChange(key as TabType)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${isActive
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {config.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search */}
      {(activeTab === "customer-plans" ||
        activeTab === "developer-packages" ||
        activeTab === "features" ||
        activeTab === "addons") && (
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={
                activeTab === "customer-plans"
                  ? "Search plans..."
                  : activeTab === "features"
                    ? "Search features..."
                    : "Search packages..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        )}

      {/* Content */}
      {renderContent()}

      {/* Modal */}
      <AddDeveloperPackageModal
        open={createAdModalOpen}
        onClose={() => setCreateAdModalOpen(false)}
        onSuccess={() => {
          packagesQuery.refetch();
        }}
      />

      <UpdateDeveloperPackageModal
        open={!!updatePackageData}
        onClose={() => setUpdatePackageData(null)}
        onSuccess={() => {
          packagesQuery.refetch();
        }}
        packageData={updatePackageData}
      />

      <ViewDeveloperPackageModal
        open={!!viewPackageData}
        onClose={() => setViewPackageData(null)}
        packageData={viewPackageData}
      />

      <CreateBadgeModal
        open={createBadgeModalOpen}
        onClose={() => setCreateBadgeModalOpen(false)}
        onSuccess={() => {
          badgesQuery.refetch();
        }}
      />

      <UpdateBadgeModal
        open={!!updateBadgeData}
        onClose={() => setUpdateBadgeData(null)}
        onSuccess={() => {
          badgesQuery.refetch();
        }}
        badgeData={updateBadgeData}
      />

      <ViewBadgeModal
        open={!!viewBadgeData}
        onClose={() => setViewBadgeData(null)}
        badgeData={viewBadgeData}
      />

      <CreateAddonModal
        open={createAddonModalOpen}
        onClose={() => setCreateAddonModalOpen(false)}
        onSuccess={() => addonsQuery.refetch()}
      />

      <UpdateAddonModal
        open={!!updateAddonData}
        onClose={() => setUpdateAddonData(null)}
        onSuccess={() => addonsQuery.refetch()}
        addonData={updateAddonData}
      />

      <ViewAddonModal
        open={!!viewAddonData}
        onClose={() => setViewAddonData(null)}
        addonData={viewAddonData}
      />

      {/* Create Customer Plan Modal */}
      <AddCustomerPlanModal
        open={createCustomerPlanModalOpen}
        onClose={() => setCreateCustomerPlanModalOpen(false)}
        onSuccess={() => {
          customerPlansQuery.refetch();
          setCreateCustomerPlanModalOpen(false);
        }}
      />

      {/* View Customer Plan Modal */}
      <ViewCustomerPlanModal
        open={viewPlanId !== null}
        onClose={() => setViewPlanId(null)}
        planId={viewPlanId}
      />

      {/* Update Customer Plan Modal */}
      <UpdateCustomerPlanModal
        open={updatePlanId !== null}
        onClose={() => setUpdatePlanId(null)}
        planId={updatePlanId}
        onSuccess={() => {
          customerPlansQuery.refetch();
          setUpdatePlanId(null);
        }}
      />
    </div>
  );
}
