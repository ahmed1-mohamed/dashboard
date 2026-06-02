"use client";

import React, { useState, useCallback, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download, Upload, Settings2, AlertCircle, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { Developer, DeveloperApiResponse } from "@/features/developers/types";
import { useDevelopers } from "@/features/developers/hooks/useDevelopers";
import { DevelopersTable } from "@/features/developers/components/DevelopersTable";
import { DevelopersFilters } from "@/features/developers/components/DevelopersFilters";
import { useServerPagination } from "@/hooks/useServerPagination";
import { AddDeveloperModal } from "@/components/modals/add-developer-modal";
import { BulkImportDevelopersModal } from "@/components/modals/bulk-import-developers-modal";
import { EditDeveloperModal } from "@/components/modals/edit-developer-modal";

interface DeveloperData {
  developer_id: number;
  name: string;
  email: string;
  phone_number: string;
  website: string;
  logo: string;
  description: string;
  status: string;
  is_top: number;
}

export default function DevelopersPage() {
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
    initialFilters: { status: "all", country: "all" },
  });

  const {
    developersData,
    deleteMutation,
    bulkImportMutation,
    toggleStatusMutation,
  } = useDevelopers(
    page,
    perPage,
    debouncedSearch || undefined,
    filters.status !== "all" ? filters.status : undefined,
    filters.country !== "all" ? filters.country : undefined,
  );

  const { data: devData, isLoading, isError, error, refetch } = developersData;

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [bulkImportModalOpen, setBulkImportModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [developerToDelete, setDeveloperToDelete] = useState<number | null>(null);
  const [selectedDeveloperId, setSelectedDeveloperId] = useState<number | null>(null);
  const [selectedDeveloperData, setSelectedDeveloperData] = useState<DeveloperData | undefined>(undefined);
  const [selectedDevelopers, setSelectedDevelopers] = useState<number[]>([]);

  const itemsArray: DeveloperApiResponse[] = useMemo(() => {
    const rawData = (devData as { data?: unknown })?.data;
    let arr: DeveloperApiResponse[] = [];
    if (Array.isArray(rawData)) {
      arr = rawData as DeveloperApiResponse[];
    } else {
      const nested = (rawData as { developers?: unknown } | undefined)?.developers;
      if (Array.isArray(nested)) arr = nested as DeveloperApiResponse[];
    }

    return arr;
  }, [devData]);

  const totalDevelopers: number = useMemo(() => {
    const rawData = (devData as { data?: unknown; total?: number })?.data;
    if (typeof (devData as { total?: number })?.total === "number") {
      return (devData as { total: number }).total;
    }
    if (rawData && typeof rawData === "object" && "total" in rawData) {
      return (rawData as { total: number }).total;
    }
    return itemsArray.length;
  }, [devData, itemsArray.length]);

  const developers: Developer[] = useMemo(() => {
    return itemsArray.map((dev) => ({
      id: dev.developer_id,
      name: dev.developer_name || "N/A",
      countries: dev.countries || "N/A",
      cities: dev.cities || "N/A",
      projects: dev.projects_count || 0,
      website: dev.website || "N/A",
      email: dev.email || "N/A",
      contact: dev.phone_number || "N/A",
      status: dev.status === "active" || Boolean(dev.is_active),
      logo: dev.logo,
    }));
  }, [itemsArray]);

  const totalPages = Math.max(1, Math.ceil(totalDevelopers / perPage));

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedDevelopers(checked ? developers.map((d) => d.id) : []);
    },
    [developers],
  );

  const handleSelectDeveloper = useCallback((id: number, checked: boolean) => {
    setSelectedDevelopers((prev) =>
      checked ? [...prev, id] : prev.filter((did) => did !== id),
    );
  }, []);

  const handleToggleStatus = useCallback(
    (id: number, newStatus: boolean) => {
      const status = newStatus ? "active" : "inactive";
      toggleStatusMutation.mutate(
        { id, status },
        {
          onSuccess: () =>
            toast.success(
              `Developer ${newStatus ? "activated" : "deactivated"} successfully`,
            ),
          onError: (err) =>
            toast.error(
              err instanceof Error ? err.message : "Failed to update status",
            ),
        },
      );
    },
    [toggleStatusMutation],
  );

  const handleEditDeveloper = useCallback(
    (id: number) => {
      const developer = itemsArray.find((d) => d.developer_id === id);
      if (developer) {
        setSelectedDeveloperId(id);
        setSelectedDeveloperData({
          developer_id: developer.developer_id,
          name: developer.developer_name || "",
          email: developer.email || "",
          phone_number: developer.phone_number || "",
          website: developer.website || "",
          logo: developer.logo || "",
          description: developer.description || "",
          status: developer.status || "active",
          is_top: developer.is_top ? 1 : 0,
        });
        setEditModalOpen(true);
      }
    },
    [itemsArray],
  );

  const handleDeleteDeveloper = useCallback((id: number) => {
    setDeveloperToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDeleteDeveloper = useCallback(() => {
    if (!developerToDelete) return;
    deleteMutation.mutate(developerToDelete, {
      onSuccess: () => {
        toast.success("Developer deleted successfully!");
        setDeleteDialogOpen(false);
        setDeveloperToDelete(null);
      },
      onError: () => toast.error("Failed to delete developer."),
    });
  }, [developerToDelete, deleteMutation]);

  const handleBulkImport = useCallback(
    (file: File) => {
      bulkImportMutation.mutate(file, {
        onSuccess: () => {
          toast.success("Developers imported successfully!");
          setBulkImportModalOpen(false);
        },
        onError: () => toast.error("Failed to import developers."),
      });
    },
    [bulkImportMutation],
  );

  const handleExport = useCallback(() => {
    if (developers.length === 0) {
      toast.info("No developers to export");
      return;
    }
    const headers = ["ID", "Name", "Email", "Phone", "Website", "Countries", "Status", "Projects"];
    const rows = developers.map((d) => [
      d.id, `"${d.name}"`, `"${d.email}"`, `"${d.contact}"`,
      `"${d.website}"`, `"${d.countries}"`,
      d.status ? "Active" : "Inactive", d.projects,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `developers_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Developers exported!");
  }, [developers]);

  return (
    <div className="p-4 px-3 space-y-4 max-w-full overflow-hidden">
      <PageHeader
        title="Developers"
        totalItems={totalDevelopers}
        actionButtonText="Add New Developer"
        onActionClick={() => setAddModalOpen(true)}
      />

      {isLoading ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-10 w-[120px]" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-4 w-[60px]" />
              </div>
            ))}
          </div>
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-800">
              <strong>Error:</strong>{" "}
              {error instanceof Error
                ? error.message
                : "Failed to load developers"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="mt-2 border-red-200 text-red-700 hover:bg-red-100"
          >
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <DevelopersFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={filters.status}
              onStatusChange={(val) => setFilter("status", val)}
              countryFilter={filters.country}
              onCountryChange={(val) => setFilter("country", val)}
            />
            <div className="flex items-center gap-2 mb-4">
              <Button variant="outline" className="gap-2 border-gray-200" onClick={handleExport}>
                <Download className="h-4 w-4" /> Export
              </Button>
              <Button
                variant="outline"
                className="gap-2 border-gray-200"
                onClick={() => setBulkImportModalOpen(true)}
              >
                <Upload className="h-4 w-4" /> Import
              </Button>
              <Button variant="outline" className="gap-2 border-gray-200">
                <Settings2 className="h-4 w-4" /> Table settings
              </Button>
            </div>
          </div>

          <DevelopersTable
            developers={developers}
            selectedDevelopers={selectedDevelopers}
            onSelectAll={handleSelectAll}
            onSelectDeveloper={handleSelectDeveloper}
            onToggleStatus={handleToggleStatus}
            onEdit={handleEditDeveloper}
            onDelete={handleDeleteDeveloper}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            perPage={perPage}
            totalItems={totalDevelopers}
            currentItemsCount={developers.length}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
          />
        </>
      )}

      <AddDeveloperModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
      <BulkImportDevelopersModal
        isOpen={bulkImportModalOpen}
        onClose={() => setBulkImportModalOpen(false)}
        onSubmit={handleBulkImport}
      />
      <EditDeveloperModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedDeveloperId(null);
          setSelectedDeveloperData(undefined);
        }}
        developerId={selectedDeveloperId}
        data={selectedDeveloperData}
        onSuccess={() => {
          setEditModalOpen(false);
          setSelectedDeveloperId(null);
          setSelectedDeveloperData(undefined);
        }}
      />

      <Dialog
        open={deleteDialogOpen && developerToDelete !== null}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setDeveloperToDelete(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" /> Delete Developer
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this developer? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteDeveloper}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
