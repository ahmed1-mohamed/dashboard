"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { Download, Settings2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

import { useServerPagination } from "@/hooks/useServerPagination";
import useActivityLogs from "@/features/activity/hooks/useActivityLogs";
import { ActivityTable } from "@/features/activity/components/ActivityTable";
import { ActivityFilters } from "@/features/activity/components/ActivityFilters";
import { Activity, ActivityLogResponse } from "@/features/activity/types";
import { activityExportToExcel, activityExportToPDF } from "@/lib/handle-export";

export default function ActivityLogPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ActivityLogPageContent />
    </Suspense>
  );
}

const INITIAL_FILTERS = {
  action: "all",
  entity: "all",
  date: "all",
};

function ActivityLogPageContent() {
  const router = useRouter();
  const {
    page,
    perPage,
    searchQuery,
    debouncedSearch,
    filters,
    setPage,
    setPerPage,
    setSearchQuery,
    setFilter,
  } = useServerPagination({
    initialPage: 1,
    initialPerPage: 10,
    initialFilters: INITIAL_FILTERS,
  });

  const { paginatedActivityData } = useActivityLogs(
    page,
    perPage,
    debouncedSearch || undefined,
    filters.action !== "all" ? filters.action : undefined,
    filters.entity !== "all" ? filters.entity : undefined,
    filters.date !== "all" ? filters.date : undefined,
  );

  const { data: rawData, isLoading, isError, error } = paginatedActivityData;

  const [selectedActivities, setSelectedActivities] = useState<number[]>([]);

  const itemsArray = useMemo(() => {
    if (!rawData) return [];
    if (Array.isArray(rawData)) return rawData;
    const raw = rawData as Record<string, unknown>;
    if (Array.isArray(raw.data)) return raw.data as unknown[];
    const nested = raw.data as Record<string, unknown> | undefined;
    if (nested && Array.isArray(nested.data)) return nested.data as unknown[];
    const firstArray = Object.values(raw).find((v) => Array.isArray(v));
    if (firstArray) return firstArray as unknown[];
    return [];
  }, [rawData]);

  const totalActivities: number = useMemo(() => {
    if (Array.isArray(rawData)) return rawData.length;
    const raw = rawData as Record<string, any>;
    if (raw?.meta?.total !== undefined) {
      return raw.meta.total;
    }
    if (raw?.total !== undefined) {
      return raw.total;
    }
    if (raw?.data?.total !== undefined) {
      return raw.data.total;
    }
    return itemsArray.length;
  }, [rawData, itemsArray.length]);

  const activities: Activity[] = useMemo(() => {
    return itemsArray.map((prop: unknown, index: number) => {
      const p = prop as ActivityLogResponse;
      if (!p.id && index === 0) {
        console.log("First mapped activity item is missing ID! Raw item:", JSON.stringify(p, null, 2));
      }

      let desc = "No description";
      if (p.action === "updated" || p.new_values || p.old_values) {
        desc = `Updated ${p.entity_type} ID: ${p.entity_id}`;
      } else if (p.action === "created") {
        desc = `Created new ${p.entity_type}`;
      } else if (p.action === "deleted") {
        desc = `Deleted ${p.entity_type} ID: ${p.entity_id}`;
      }

      let displayAction = p.action || "N/A";
      if (displayAction === "created") displayAction = "create";
      if (displayAction === "updated") displayAction = "update";
      if (displayAction === "deleted") displayAction = "delete";

      return {
        id: p.id || (p as any).activity_id || (p as any).log_id || (p as any)._id || index + 1,
        userId: p.user_id || 0,
        user: p.user_name || "Unknown User",
        action: displayAction,
        entity: p.entity_type || "N/A",
        description: desc,
        dateTime: p.created_at ? new Date(p.created_at).toLocaleString() : "N/A",
        ipAddress: p.ip_address || "N/A",
      };
    });
  }, [itemsArray]);

  const filteredActivities: Activity[] = activities;

  const totalPages = Math.max(1, Math.ceil(totalActivities / perPage));

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedActivities(checked ? filteredActivities.map((a) => a.id) : []);
    },
    [filteredActivities],
  );

  const handleSelectActivity = useCallback((id: number, checked: boolean) => {
    setSelectedActivities((prev) =>
      checked ? [...prev, id] : prev.filter((aid) => aid !== id),
    );
  }, []);

  const handleExport = useCallback((format: string) => {
    if (!rawData?.data || rawData.data.length === 0) {
      toast.info("No activities to export");
      return;
    }

    if (format === "XLSX" || format === "Excel") {
      activityExportToExcel(rawData.data);
      toast.success("Activity logs exported successfully");
    } else if (format === "PDF") {
      activityExportToPDF(rawData.data);
      toast.success("Activity logs exported to PDF successfully");
    } else {
      toast.info(`Export to ${format} is not supported yet`);
    }
  }, [rawData]);

  return (
    <div className="p-4 px-3 space-y-4 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600 mx-auto" />
            <p className="mt-4 text-sm text-gray-600">Loading activities...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            <strong>Error:</strong> {error?.message || "Failed to load activities"}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <ActivityFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              actionFilter={filters.action}
              onActionChange={(val) => setFilter("action", val)}
              entityFilter={filters.entity}
              onEntityChange={(val) => setFilter("entity", val)}
              dateFilter={filters.date}
              onDateChange={(val) => setFilter("date", val)}
            />

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 border-gray-200">
                    <Download className="h-4 w-4" /> Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32 bg-white">
                  <DropdownMenuItem onClick={() => handleExport("XLSX")}>
                    XLSX
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("PDF")}>
                    PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("Excel")}>
                    Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" className="gap-2 border-gray-200">
                <Settings2 className="h-4 w-4" /> Table settings
              </Button>
            </div>
          </div>

          <ActivityTable
            activities={filteredActivities}
            selectedActivities={selectedActivities}
            onSelectAll={handleSelectAll}
            onSelectActivity={handleSelectActivity}
            onView={(id) => router.push(`/admin/activity/${id}`)}
            onCreate={(id) => console.log("Create", id)}
            onUpdate={(id) => console.log("Update", id)}
            onDelete={(id) => console.log("Delete", id)}
            onLogin={(id) => console.log("Login", id)}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            perPage={perPage}
            totalItems={totalActivities}
            currentItemsCount={filteredActivities.length}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
          />
        </>
      )}
    </div>
  );
}
