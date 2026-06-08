"use client";

import { useState, useCallback } from "react";
import { Plus, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFeatures } from "@/hooks/use-dashboardAdminSubscriptions";

import { BadgeCard } from "../components/badge-card";
import { LoadingSkeleton } from "../components/loading-skeleton";
import { ErrorState } from "../components/error-state";
import { EmptyState } from "../components/empty-state";

import CreateBadgeModal from "@/components/modals/create-badge-modal";
import UpdateBadgeModal from "@/components/modals/update-badge-modal";
import ViewBadgeModal from "@/components/modals/view-badge-modal";

export function FeaturesTab() {
  const {
    badgesQuery,
    deleteBadgeMutation,
  } = useFeatures();

  const [searchQuery, setSearchQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateBadgeData, setUpdateBadgeData] = useState<any | null>(null);
  const [viewBadgeData, setViewBadgeData] = useState<any | null>(null);

  const handleDeleteBadge = useCallback(
    (badgeId: number) => {
      deleteBadgeMutation.mutate(badgeId, {
        onSuccess: () => {
          toast.success("Feature deleted successfully");
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : "Failed to delete feature";
          toast.error(message);
        },
      });
    },
    [deleteBadgeMutation],
  );

  const badgesData = (badgesQuery.data as any)?.data;
  const badges = Array.isArray(badgesData) ? badgesData : (badgesData?.data || []);

  const filteredBadges = badges.filter(
    (b: any) =>
      b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.code?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search features..."
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
      </div>

      {badgesQuery.isLoading ? (
        <LoadingSkeleton />
      ) : badgesQuery.isError ? (
        <ErrorState
          error={
            badgesQuery.error instanceof Error
              ? badgesQuery.error.message
              : "Failed to load features"
          }
          onRetry={() => badgesQuery.refetch()}
        />
      ) : filteredBadges.length === 0 ? (
        <EmptyState
          title="No features found"
          message="There are no features or badges available at the moment."
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBadges.map((badge: any, index: number) => (
            <BadgeCard
              key={badge.id || badge.badge_id || `badge-${index}`}
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
      )}

      <CreateBadgeModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => badgesQuery.refetch()}
      />

      <UpdateBadgeModal
        open={!!updateBadgeData}
        onClose={() => setUpdateBadgeData(null)}
        onSuccess={() => badgesQuery.refetch()}
        badgeData={updateBadgeData}
      />

      <ViewBadgeModal
        open={!!viewBadgeData}
        onClose={() => setViewBadgeData(null)}
        badgeData={viewBadgeData}
      />
    </div>
  );
}
