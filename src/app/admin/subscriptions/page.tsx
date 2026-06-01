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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
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
import { AddFeatureModal } from "@/components/modals/add-feature-modal";
import { toast } from "sonner";

// ============================================
// Tab Types
// ============================================

type TabType = "customer-plans" | "developer-packages" | "features" | "addons";

const TAB_CONFIG = {
  "customer-plans": { label: "Customer Plans", icon: Users },
  "developer-packages": { label: "Developer", icon: Package },
  features: { label: "Features", icon: Sparkles },
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
  badge_id:number;
  name: string;
  code: string;
  applies_to: string;
}

interface PackagesResponse {
  packages: PackageItem[];
}

// ============================================
// Helper Components
// ============================================

const LoadingSkeleton = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="border-gray-200">
        <CardContent className="p-5 space-y-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const ErrorState = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="bg-red-50 p-4 rounded-full mb-4">
      <AlertCircle className="w-8 h-8 text-red-500" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Failed to load data
    </h3>
    <p className="text-gray-500 mb-4 max-w-md">{error}</p>
    <Button onClick={onRetry} variant="outline" className="gap-2">
      <RefreshCw className="w-4 h-4" />
      Try Again
    </Button>
  </div>
);

const EmptyState = ({
  title = "No items found",
  message = "There are no items available at the moment.",
}: {
  title?: string;
  message?: string;
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="bg-gray-100 p-4 rounded-full mb-4">
      <Search className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 mb-4">{message}</p>
  </div>
);

// ============================================
// Package Card
// ============================================

function PackageCard({
  pkg,
  isBestValue,
  onDelete,
  isDeleting,
}: {
  pkg: any;
  isBestValue: boolean;
  onDelete: (packageId: number) => void;
  isDeleting: boolean;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    onDelete(pkg.id);
    setDialogOpen(false);
  };

  return (
    <Card className="relative border hover:border-teal-500 transition-all duration-200">
      {isBestValue && pkg.status && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <Badge className="bg-teal-600 text-white">Best Value</Badge>
        </div>
      )}

      {/* Delete Button - Positioned in top-right corner */}
      <div className="absolute top-3 right-3 z-10">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Delete Package
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this package? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <p className="font-medium text-gray-900">{pkg.name}</p>
                <p className="text-sm text-gray-500">
                  {pkg.code} • AED {pkg.price} • {pkg.credits.toLocaleString()}{" "}
                  Credits
                </p>
                {pkg.subscribers > 0 && (
                  <p className="text-sm text-amber-600">
                    Warning: This package has {pkg.subscribers} subscriber(s)
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Package
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <CardContent className="p-5 space-y-3">
        {/* Name */}
        <div className="flex items-start justify-between pr-10">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{pkg.name}</h3>
            <code className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
              {pkg.code}
            </code>
          </div>
          <span className="text-xs text-gray-400">ID: {pkg.id}</span>
        </div>

        {/* Price */}
        <div>
          <span className="text-purple-600 font-semibold text-lg">
            AED {pkg.price}
          </span>
          <div className="text-gray-500 mt-1 text-sm">
            {pkg.credits.toLocaleString()} Credits
          </div>
        </div>

        {/* Subscribers */}
        <div className="text-xs text-gray-400">
          Subscribers: {pkg.subscribers}
        </div>

        {/* Status */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-sm text-gray-500">Status</span>
          <Badge
            className={
              pkg.status
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }
          >
            {pkg.status ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Button */}
        {pkg.status && (
          <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
            Select Package
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// Feature Card (same design as Package Card)
// ============================================

function FeatureCard({
  feature,
  isSelected,
  onSelect,
  onDelete,
  isDeleting,
}: {
  feature: any;
  isSelected: boolean;
  onSelect: (featureId: number) => void;
  onDelete: (featureId: number) => void;
  isDeleting: boolean;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    onDelete(feature.badge_id);
    setDialogOpen(false);
  };

  return (
    <Card
      className={`relative border transition-all duration-200 ${
        isSelected
          ? "border-teal-500 ring-2 ring-teal-500/20"
          : "hover:border-teal-500"
      }`}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <Badge className="bg-teal-600 text-white">Selected</Badge>
        </div>
      )}

      {/* Action buttons */}
      <div className="absolute top-3 right-3 z-10 flex gap-1">
        {/* Delete Button */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Delete Feature
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this feature? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <p className="font-medium text-gray-900">{feature.name}</p>
                <p className="text-sm text-gray-500">
                  {feature.code} • {feature.applies_to}
                </p>
              </div>
            </div>
            <DialogFooter className="sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Feature
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <CardContent className="p-5 space-y-3">
        {/* Name */}
        <div className="flex items-start justify-between pr-10">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {feature.name}
            </h3>
            <code className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
              {feature.code}
            </code>
          </div>
          <span className="text-xs text-gray-400">ID: {feature.badge_id}</span>
        </div>

        {/* Applies To */}
        <div>
          <span className="text-sm text-gray-500">Applies To:</span>
          <span className="ml-2 text-gray-900">{feature.applies_to}</span>
        </div>

        {/* Pricing and Limits */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <span className="text-xs text-gray-400">Monthly</span>
            <p className="text-purple-600 font-semibold">
              {feature.monthly_price_credits} credits
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-400">Priority</span>
            <p className="font-medium text-gray-900">
              +{feature.priority_boost}
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-400">Max Entities</span>
            <p className="font-medium text-gray-900">{feature.max_entities}</p>
          </div>
        </div>

        {/* Placement Details */}
        {feature.placement && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-1">
            <p className="text-xs font-medium text-gray-500">Placement</p>
            <div className="flex gap-2 flex-wrap">
              {feature.placement.platform && (
                <Badge variant="outline" className="text-xs">
                  {feature.placement.platform}
                </Badge>
              )}
              {feature.placement.location && (
                <Badge variant="outline" className="text-xs">
                  {feature.placement.location}
                </Badge>
              )}
              {feature.placement.format && (
                <Badge variant="outline" className="text-xs">
                  {feature.placement.format}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Status and Select Button */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-sm text-gray-500">Status</span>
          <Badge
            className={
              feature.is_active
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }
          >
            {feature.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Select Button */}
        <Button
          onClick={() => onSelect(feature.badge_id)}
          className={`w-full gap-2 ${
            isSelected
              ? "bg-teal-600 hover:bg-teal-700 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-900"
          }`}
        >
          {isSelected ? (
            <>
              <Check className="w-4 h-4" />
              Selected
            </>
          ) : (
            "Select Feature"
          )}
        </Button>
      </CardContent>
    </Card>
  );
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
  // Use custom hook
  const {
    packagesQuery,
    featuresQuery,
    deletePackageMutation,
    createFeatureMutation,
    deleteFeatureMutation,
  } = useDashboardAdminSubscriptions();

  const [activeTab, setActiveTab] = useState<TabType>("customer-plans");
  const [searchQuery, setSearchQuery] = useState("");
  const [createAdModalOpen, setCreateAdModalOpen] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<Set<number>>(
    new Set(),
  );
  const [createFeatureModalOpen, setCreateFeatureModalOpen] = useState(false);

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

  // Toggle Feature Selection
  const handleToggleFeature = useCallback((featureId: number) => {
    setSelectedFeatures((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(featureId)) {
        newSet.delete(featureId);
      } else {
        newSet.add(featureId);
      }
      return newSet;
    });
  }, []);

  // Create Feature
  const handleCreateFeature = useCallback(
    (data: {
      name: string;
      applies_to: string;
      monthly_price_credits: number;
      priority_boost?: number;
      max_entities?: number;
      is_active?: boolean;
    }) => {
      createFeatureMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Feature created successfully");
          setCreateFeatureModalOpen(false);
        },
        onError: (error) => {
          const message =
            error instanceof Error ? error.message : "Failed to create feature";
          toast.error(message);
        },
      });
    },
    [createFeatureMutation],
  );

  // Delete Feature
  const handleDeleteFeature = useCallback(
    (featureId: number) => {
      deleteFeatureMutation.mutate(featureId, {
        onSuccess: () => {
          toast.success("Feature deleted successfully");
          // Remove from selected if selected
          setSelectedFeatures((prev) => {
            const newSet = new Set(prev);
            newSet.delete(featureId);
            return newSet;
          });
        },
        onError: (error) => {
          const message =
            error instanceof Error ? error.message : "Failed to delete feature";
          toast.error(message);
        },
      });
    },
    [deleteFeatureMutation],
  );

  // Get data from queries
  const packages =
    (packagesQuery.data?.data as PackagesResponse | undefined)?.packages || [];
  const features = (featuresQuery.data?.data as Feature[]) || [];

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

  // Filtering for features
  const filteredFeatures = features.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.applies_to.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "customer-plans":
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

      case "features":
        if (featuresQuery.isLoading) {
          return <LoadingSkeleton />;
        }
        if (featuresQuery.isError) {
          return (
            <ErrorState
              error={
                featuresQuery.error instanceof Error
                  ? featuresQuery.error.message
                  : "Failed to load features"
              }
              onRetry={() => featuresQuery.refetch()}
            />
          );
        }
        if (features.length === 0) {
          return (
            <EmptyState
              title="No features found"
              message="There are no badge features available at the moment."
            />
          );
        }
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFeatures.map((feature) => (
              <FeatureCard
                key={feature.badge_id}
                feature={feature}
                isSelected={selectedFeatures.has(feature.badge_id)}
                onSelect={handleToggleFeature}
                onDelete={handleDeleteFeature}
                isDeleting={
                  deleteFeatureMutation.isPending &&
                  deleteFeatureMutation.variables === feature.badge_id
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

        {(activeTab === "customer-plans" ||
          activeTab === "developer-packages") && (
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
              onClick={() => setCreateFeatureModalOpen(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Feature
            </Button>

            <Button
              variant="outline"
              onClick={() => featuresQuery.refetch()}
              disabled={featuresQuery.isFetching}
              className="gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${featuresQuery.isFetching ? "animate-spin" : ""}`}
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
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  isActive
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
        activeTab === "features") && (
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder={
              activeTab === "features"
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

      {/* Create Feature Modal */}
      {createFeatureModalOpen && (
        <AddFeatureModal
          isOpen={createFeatureModalOpen}
          onClose={() => setCreateFeatureModalOpen(false)}
          onSuccess={() => {
            featuresQuery.refetch();
            setCreateFeatureModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
