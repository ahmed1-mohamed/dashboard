"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download, Settings2, AlertCircle, AlertTriangle } from "lucide-react";
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
import { EditPropertyModal } from "@/components/modals/edit-property-modal";

export default function PropertiesPage() {
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
    initialPerPage: 15,
    initialFilters: {
      type: "all",
      status: "all",
    },
  });

  // Construct filters for API
  const apiFilters = useMemo(() => {
    return {
      search: debouncedSearch,
      status: filters.status !== "all" ? filters.status : undefined,
      property_type_id: filters.type !== "all" ? Number(filters.type) : undefined,
    };
  }, [debouncedSearch, filters]);

  const {
    data: propertiesData,
    total,
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

  const properties: Property[] = useMemo(() => {
    return (propertiesData || []).map((prop: any) => ({
      id: prop.property_id,
      unitNumber: prop.property_no || prop.property_name || "N/A",
      project_name: prop.project_name?.toString() || "N/A",
      type: prop.type || prop.property_subtype || "N/A",
      area: prop.size ? `${prop.size} sqm` : prop.plot_size ? `${prop.plot_size} sqm` : "N/A",
      floor: "N/A",
      price: prop.price ? `${Number(prop.price).toLocaleString()} AED` : "N/A",
      property_name: prop.property_name?.toString() || "N/A",
      status: prop.availability_status === "available" ? "Available" : "Reserved",
    }));
  }, [propertiesData]);

  const totalPages = Math.max(1, Math.ceil((total || 0) / perPage));

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

  const handleExport = useCallback(() => {
    if (properties.length === 0) {
      toast.info("No properties to export");
      return;
    }
    const headers = ["ID","Unit Number","Property Name","Type","Area","Floor","Price","Project","Status"];
    const rows = properties.map((p) => [
      p.id, `"${p.unitNumber}"`, `"${p.property_name}"`,
      `"${p.type}"`, `"${p.area}"`, p.floor,
      `"${p.price}"`, `"${p.project_name}"`, p.status,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `properties_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Properties exported!");
  }, [properties]);

  return (
    <div className="p-4 px-3 space-y-4 max-w-full overflow-hidden">
      <PageHeader
        title="Properties"
        totalItems={total || 0}
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
              <Button variant="outline" className="gap-2 border-gray-200" onClick={handleExport}>
                <Download className="h-4 w-4" /> Export
              </Button>
              <Button variant="outline" className="gap-2 border-gray-200">
                <Settings2 className="h-4 w-4" /> Table settings
              </Button>
            </div>
          </div>

          <PropertiesTable
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
            totalItems={total || 0}
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

      <EditPropertyModal
        isOpen={editModalOpen}
        onClose={() => { setEditModalOpen(false); setPropertyToEdit(null); }}
        propertyId={propertyToEdit || 0}
      />
    </div>
  );
}