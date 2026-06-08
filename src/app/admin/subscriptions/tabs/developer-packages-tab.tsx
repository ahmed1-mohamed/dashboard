"use client";

import { useState, useCallback } from "react";
import { Plus, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDeveloperPackages } from "@/hooks/use-dashboardAdminSubscriptions";

import { PackageCard } from "../components/package-card";
import { LoadingSkeleton } from "../components/loading-skeleton";
import { ErrorState } from "../components/error-state";
import { EmptyState } from "../components/empty-state";

import AddDeveloperPackageModal from "@/components/modals/create-developer-package-modal";
import UpdateDeveloperPackageModal from "@/components/modals/update-developer-package-modal";
import ViewDeveloperPackageModal from "@/components/modals/view-developer-package-modal";

export function DeveloperPackagesTab() {
  const {
    packagesQuery,
    deletePackageMutation,
  } = useDeveloperPackages();

  const [searchQuery, setSearchQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updatePackageData, setUpdatePackageData] = useState<any | null>(null);
  const [viewPackageData, setViewPackageData] = useState<any | null>(null);

  const handleDeletePackage = useCallback(
    (packageId: number) => {
      deletePackageMutation.mutate(packageId, {
        onSuccess: () => {
          toast.success("Package deleted successfully");
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : "Failed to delete package";
          toast.error(message);
        },
      });
    },
    [deletePackageMutation],
  );

  const packagesData = (packagesQuery.data as any)?.data;
  const packages = Array.isArray(packagesData)
    ? packagesData
    : (packagesData?.data || (packagesData as any)?.packages || []);

  const filteredPackages = packages.filter(
    (pkg: any) =>
      pkg.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.code?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  let bestValueId: number | null = null;
  let lowestRate = Infinity;
  filteredPackages.forEach((p: any) => {
    const rate = p.price / p.credits;
    if (rate < lowestRate && p.status) {
      lowestRate = rate;
      bestValueId = p.id;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setCreateModalOpen(true)}
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
      </div>

      {packagesQuery.isLoading ? (
        <LoadingSkeleton />
      ) : packagesQuery.isError ? (
        <ErrorState
          error={
            packagesQuery.error instanceof Error
              ? packagesQuery.error.message
              : "Failed to load packages"
          }
          onRetry={() => packagesQuery.refetch()}
        />
      ) : packages.length === 0 ? (
        <EmptyState
          title="No packages found"
          message="There are no ad credit packages available at the moment."
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPackages.map((pkg: any) => (
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
      )}

      <AddDeveloperPackageModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => packagesQuery.refetch()}
      />

      <UpdateDeveloperPackageModal
        open={!!updatePackageData}
        onClose={() => setUpdatePackageData(null)}
        onSuccess={() => packagesQuery.refetch()}
        packageData={updatePackageData}
      />

      <ViewDeveloperPackageModal
        open={!!viewPackageData}
        onClose={() => setViewPackageData(null)}
        packageData={viewPackageData}
      />
    </div>
  );
}
