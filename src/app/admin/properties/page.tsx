"use client";

import React, { useState, useCallback, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download, Settings2, AlertCircle, AlertTriangle, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { useServerPagination } from "@/hooks/useServerPagination";
import useProperties from "@/features/properties/hooks/useProperties";
import { PropertiesTable } from "@/features/properties/components/PropertiesTable";
import { PropertiesFilters } from "@/features/properties/components/PropertiesFilters";
import { Property } from "@/features/properties/types";
import { propertiesExportToExcel } from "@/lib/exports/export-properties";
import { AdminPropertiesService } from "@/features/properties/services/AdminPropertiesService";
import { TableSettings } from "@/components/table/table-settings";
import { useTableSettings } from "@/hooks/use-table-settings";
import dynamic from "next/dynamic";

const EditPropertyModal = dynamic(() => import("@/components/modals/edit-property-modal").then((mod) => mod.EditPropertyModal));
const BulkImportPropertiesModal = dynamic(() => import("@/components/modals/bulk-import-properties-modal").then((mod) => mod.BulkImportPropertiesModal));


export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <PropertiesPageContent />
    </Suspense>
  );
}

const INITIAL_FILTERS = {
  type: "all",
  status: "all",
};

function PropertiesPageContent() {
  const router = useRouter();

  const DEFAULT_COLUMNS = [
    { id: "unitNumber", label: "Unit Number", visible: true },
    { id: "propertyName", label: "Property Name", visible: true },
    { id: "type", label: "Type", visible: true },
    { id: "area", label: "Area", visible: true },
    { id: "floor", label: "Floor", visible: true },
    { id: "price", label: "Price", visible: true },
    { id: "projectName", label: "Project Name", visible: true },
    { id: "status", label: "Status", visible: true },
    { id: "actions", label: "Actions", visible: true },
  ];

  const tableSettings = useTableSettings("properties", DEFAULT_COLUMNS);

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
    initialPerPage: tableSettings.settings.itemsPerPage,
    initialFilters: INITIAL_FILTERS,
  });

  React.useEffect(() => {
    setPerPage(String(tableSettings.settings.itemsPerPage));
  }, [tableSettings.settings.itemsPerPage, setPerPage]);

  const apiFilters = useMemo(() => {
    return {
      search: debouncedSearch,
      status: filters.status !== "all" ? filters.status : undefined,
      property_type_id: filters.type !== "all" ? Number(filters.type) : undefined,
    };
  }, [debouncedSearch, filters]);

  const {
    properties,
    totalProperties,
    isLoading,
    isError,
    error,
    refetch,
    deletePropertyMutation,
  } = useProperties(page, perPage, apiFilters);

  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<number | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const totalPages = Math.max(1, Math.ceil(totalProperties / perPage));

  const handleSelectAll = useCallback((checked: boolean) => {
    setSelectedProperties(checked ? properties.map((p) => p.id) : []);
  }, [properties]);

  const handleSelectProperty = useCallback((id: number, checked: boolean) => {
    setSelectedProperties((prev) =>
      checked ? [...prev, id] : prev.filter((pid) => pid !== id)
    );
  }, []);

  const handleEditClick = useCallback((id: number) => {
    setPropertyToEdit(id);
    setEditModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((id: number) => {
    setPropertyToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!propertyToDelete) return;
    deletePropertyMutation.mutate(propertyToDelete, {
      onSuccess: () => {
        toast.success("Property deleted successfully!");
        setDeleteDialogOpen(false);
        setPropertyToDelete(null);
        setSelectedProperties((prev) => prev.filter((id) => id !== propertyToDelete));
      },
      onError: () => toast.error("Failed to delete property"),
    });
  }, [propertyToDelete, deletePropertyMutation]);

  const handleExport = useCallback(async () => {
    toast.info("Preparing export... This might take a moment.", { duration: 3000 });
    try {
      let allExportedProperties: unknown[] = [];
      let currentPage = 1;
      let totalPagesToFetch = 1;
      const batchSize = 100;

      do {
        const response = await AdminPropertiesService.getProperties({
          page: currentPage,
          per_page: batchSize,
          ...apiFilters,
        });

        let batch: unknown[] = [];
        let currentTotal = 0;

        const rawData = (response as any)?.data || response;
        if (Array.isArray(rawData)) {
          batch = rawData;
          totalPagesToFetch = 1;
        } else {
          const nested = rawData as { data?: unknown; total?: number; meta?: any } | undefined;
          if (Array.isArray(nested?.data)) {
            batch = nested.data;
            currentTotal = nested.total ?? nested.meta?.total ?? batch.length;
          } else {
            const doublyNested = (nested?.data as { data?: unknown; total?: number } | undefined);
            if (Array.isArray(doublyNested?.data)) {
              batch = doublyNested.data;
              currentTotal = doublyNested.total ?? batch.length;
            }
          }
          if (currentTotal > 0) {
            totalPagesToFetch = Math.ceil(currentTotal / batchSize);
          } else {
            totalPagesToFetch = 1;
          }
        }

        allExportedProperties = [...allExportedProperties, ...batch];
        currentPage++;
      } while (currentPage <= totalPagesToFetch);

      if (allExportedProperties.length === 0) {
        toast.info("No properties to export");
        return;
      }
      propertiesExportToExcel(allExportedProperties);
      toast.success("Properties exported successfully!");
    } catch (error) {
      toast.error("Failed to export properties");
    }
  }, [apiFilters]);

  return (
    <div className="p-4 px-3 space-y-4 max-w-full overflow-hidden">
      <PageHeader
        title="Properties"
        totalItems={totalProperties}
        actionButtonText="Create New Property"
        onActionClick={() => router.push("/admin/properties/create")}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-600">Loading properties...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-800">
              <strong>Error:</strong> {error instanceof Error ? error.message : "Failed to load properties"}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2 border-red-200 text-red-700 hover:bg-red-100">
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <PropertiesFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              typeFilter={filters.type}
              onTypeChange={(val) => setFilter("type", val)}
              statusFilter={filters.status}
              onStatusChange={(val) => setFilter("status", val)}
            />
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="gap-2 border-gray-200"
                onClick={() => setImportModalOpen(true)}
              >
                <Upload className="h-4 w-4" /> Import
              </Button>
              <TableSettings
                settings={tableSettings}
                onExportExcel={handleExport}
              />
            </div>
          </div>

          <PropertiesTable
            settings={tableSettings}
            properties={properties}
            selectedProperties={selectedProperties}
            onSelectAll={handleSelectAll}
            onSelectProperty={handleSelectProperty}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            perPage={perPage}
            totalItems={totalProperties}
            currentItemsCount={properties.length}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
          />
        </>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" /> Delete Property
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this property? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deletePropertyMutation.isPending}>
              {deletePropertyMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {editModalOpen && (
        <EditPropertyModal
          isOpen={editModalOpen}
          onClose={() => { setEditModalOpen(false); setPropertyToEdit(null); }}
          propertyId={propertyToEdit || 0}
        />
      )}
      {importModalOpen && (
        <BulkImportPropertiesModal
          isOpen={importModalOpen}
          onClose={() => setImportModalOpen(false)}
          propertiesData={properties || []}
        />
      )}
    </div>
  );
}