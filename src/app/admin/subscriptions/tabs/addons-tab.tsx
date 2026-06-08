"use client";

import { useState, useCallback } from "react";
import { Plus, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddons } from "@/hooks/use-dashboardAdminSubscriptions";

import { AddonCard } from "../components/addon-card";
import { LoadingSkeleton } from "../components/loading-skeleton";
import { ErrorState } from "../components/error-state";
import { EmptyState } from "../components/empty-state";

import CreateAddonModal from "@/components/modals/create-addon-modal";
import UpdateAddonModal from "@/components/modals/update-addon-modal";
import ViewAddonModal from "@/components/modals/view-addon-modal";

export function AddonsTab() {
  const {
    addonsQuery,
    deleteAddonMutation,
  } = useAddons();

  const [searchQuery, setSearchQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateAddonData, setUpdateAddonData] = useState<any | null>(null);
  const [viewAddonData, setViewAddonData] = useState<any | null>(null);

  const handleDeleteAddon = useCallback(
    (addonId: number) => {
      deleteAddonMutation.mutate(addonId, {
        onSuccess: () => {
          toast.success("Add-on deleted successfully");
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : "Failed to delete add-on";
          toast.error(message);
        },
      });
    },
    [deleteAddonMutation],
  );

  const addonsData = (addonsQuery.data as any)?.data;
  const addons = Array.isArray(addonsData) ? addonsData : (addonsData?.data || []);

  const filteredAddons = addons.filter(
    (a: any) =>
      a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.code?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search add-ons..."
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
      </div>

      {addonsQuery.isLoading ? (
        <LoadingSkeleton />
      ) : addonsQuery.isError ? (
        <ErrorState
          error={
            addonsQuery.error instanceof Error
              ? addonsQuery.error.message
              : "Failed to load add-ons"
          }
          onRetry={() => addonsQuery.refetch()}
        />
      ) : filteredAddons.length === 0 ? (
        <EmptyState
          title="No add-ons found"
          message="There are no add-ons available at the moment."
        />
      ) : (
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
      )}

      <CreateAddonModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
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
    </div>
  );
}
