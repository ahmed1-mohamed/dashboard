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
import AddCustomerPlanModal from "@/components/modals/add-customer-plan-modal";
import ViewCustomerPlanModal from "@/components/modals/view-customer-plan-modal";
import UpdateCustomerPlanModal from "@/components/modals/update-customer-plan-modal";
import { toast } from "sonner";
import { LoadingSkeleton } from "./components/loading-skeleton";
import { ErrorState } from "./components/error-state";
import { EmptyState } from "./components/empty-state";
import { PackageCard } from "./components/package-card";
import { CustomerPlanCard } from "./components/customer-plan-card";


type TabType = "customer-plans" | "developer-packages" | "addons";

const TAB_CONFIG = {
  "customer-plans": { label: "Customer Plans", icon: Users },
  "developer-packages": { label: "Developer", icon: Package },
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

// ============================================
// Add-ons Placeholder Component
// ============================================

function AddonsPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <Layers className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Add-ons Coming Soon
      </h3>
      <p className="text-gray-500 mb-4 max-w-md">
        Additional subscription add-ons will be available here soon.
      </p>
    </div>
  );
}
// ============================================
// Main Page
// ============================================

export default function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("customer-plans");
  const [searchQuery, setSearchQuery] = useState("");
  const [createAdModalOpen, setCreateAdModalOpen] = useState(false);
  const [createCustomerPlanModalOpen, setCreateCustomerPlanModalOpen] = useState(false);
  const [viewPlanId, setViewPlanId] = useState<number | string | null>(null);
  const [updatePlanId, setUpdatePlanId] = useState<number | string | null>(null);

  // Use custom hook
  const {
    packagesQuery,
    customerPlansQuery,
    deletePackageMutation,
  } = useDashboardAdminSubscriptions(activeTab);

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

  // Get data from queries
  const packages =
    (packagesQuery.data?.data as PackagesResponse | undefined)?.packages || [];
  const customerPlans = (customerPlansQuery.data?.data as any)?.data || [];

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
                onDelete={handleDeletePackage}
                isDeleting={
                  deletePackageMutation.isPending &&
                  deletePackageMutation.variables === pkg.id
                }
              />
            ))}
          </div>
        );

      case "addons":
        return <AddonsPlaceholder />;

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
                onClick={() => setActiveTab(key as TabType)}
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
        activeTab === "developer-packages") && (
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={
                activeTab === "customer-plans"
                  ? "Search plans..."
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
