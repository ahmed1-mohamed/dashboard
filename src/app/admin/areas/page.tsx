"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import useDashboardAdminAreasData from "@/hooks/use-dashboardAdminAreas";
import { AddAreaModal } from "@/components/modals/add-area-modal";
import { ViewAreaModal } from "@/components/modals/view-area-modal";
import { EditAreaModal } from "@/components/modals/edit-area-modal";

import { AreasHeader } from "./components/AreasHeader";
import { AreasFilters } from "./components/AreasFilters";
import { AreasTable, Area } from "./components/AreasTable";
import { areasExportToExcel, areasExportToPDF } from "@/lib/handle-export";

interface AreasPageProps {
  initialPage?: number;
  itemsPerPage?: number;
}

export default function AreasPage({
  initialPage = 1,
  itemsPerPage = 15,
}: AreasPageProps) {
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPageState, setItemsPerPage] = useState(itemsPerPage);
  const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
  const [areaStatuses, setAreaStatuses] = useState<Record<number, boolean>>({});

  const [isAddAreaModalOpen, setIsAddAreaModalOpen] = useState(false);
  const [viewAreaModalOpen, setViewAreaModalOpen] = useState(false);
  const [areaToView, setAreaToView] = useState<Area | null>(null);
  const [editAreaModalOpen, setEditAreaModalOpen] = useState(false);
  const [areaToEdit, setAreaToEdit] = useState<number | null>(null);
  const [areaToEditData, setAreaToEditData] = useState<Area | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<number | null>(null);

  const {
    areasData,
    createAreaMutation,
    deleteAreaMutation,
    updateAreaMutation,
  } = useDashboardAdminAreasData(currentPage, itemsPerPageState);

  const { data, isLoading, isError, error, isFetching, refetch } = areasData;

  const rawData = data as { data?: any } | undefined;
  const itemsArray = useMemo(() => rawData?.data?.data || [], [rawData?.data?.data]);

  const areas: Area[] = useMemo(() => {
    return itemsArray.map((area: any) => ({
      area_id: area.id || area.dld_area_id,
      area_name: area.dld_area_name || area.area_name || "N/A",
      latitude: area.latitude || "",
      longitude: area.longitude || "",
      description: area.description || "",
      created_at: area.created_at || "",
      updated_at: area.updated_at || "",
      deleted_at: area.deleted_at || null,
      dld_area_id: area.dld_area_id,
      locations_count: area.locations_count,
      projects_count: area.projects_count,
      status: !area.deleted_at,
    }));
  }, [itemsArray]);

  const totalAreas = rawData?.data?.total || itemsArray.length || 0;
  const totalPages = Math.ceil(Number(totalAreas) / itemsPerPageState);
  const startIndex = (currentPage - 1) * itemsPerPageState;

  const filteredAreas = useMemo(() => {
    return areas.filter((area) => {
      const matchesSearch = area.area_name.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesStatus = true;
      if (statusFilter !== "all") {
        const isActive = areaStatuses[area.area_id] ?? area.status;
        matchesStatus = statusFilter === "active" ? isActive : !isActive;
      }

      return matchesSearch && matchesStatus;
    });
  }, [areas, searchQuery, statusFilter, areaStatuses]);

  const handleExport = (format: "pdf" | "xlsx" | "excel") => {
    if (format === "pdf") {
      areasExportToPDF(filteredAreas);
    } else {
      areasExportToExcel(filteredAreas);
    }
  };

  useEffect(() => {
    if (areas.length > 0) {
      const statusState = areas.reduce(
        (acc, area) => {
          acc[area.area_id] = area.status;
          return acc;
        },
        {} as Record<number, boolean>
      );
      setAreaStatuses((prev) => {
        const isDifferent = 
          Object.keys(statusState).length !== Object.keys(prev).length ||
          Object.keys(statusState).some(
            (key) => statusState[Number(key)] !== prev[Number(key)]
          );
        return isDifferent ? statusState : prev;
      });
    }
  }, [areas]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedAreas(areas.map((a) => a.area_id));
      } else {
        setSelectedAreas([]);
      }
    },
    [areas],
  );

  const handleSelectArea = useCallback(
    (area_id: number, checked: boolean) => {
      if (checked) {
        setSelectedAreas((prev) => [...prev, area_id]);
      } else {
        setSelectedAreas((prev) => prev.filter((aid) => aid !== area_id));
      }
    },
    [],
  );

  const handleToggleStatus = useCallback(
    (area_id: number) => {
      setAreaStatuses((prev) => ({
        ...prev,
        [area_id]: !prev[area_id],
      }));
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    },
    [queryClient],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages],
  );

  const handleDeleteArea = useCallback((id: number | null) => {
    if (id === null) return;
    setAreaToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDeleteArea = useCallback(() => {
    if (areaToDelete !== null) {
      deleteAreaMutation.mutate(areaToDelete, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setAreaToDelete(null);
        },
      });
    }
  }, [areaToDelete, deleteAreaMutation]);

  const getPageNumbers = useCallback(() => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="p-4 px-3 space-y-4 max-w-full overflow-hidden flex flex-col h-full">
      <AreasHeader
        totalAreas={totalAreas}
        onAddArea={() => setIsAddAreaModalOpen(true)}
      />

      <AreasFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onExport={handleExport}
      />

      <div className="flex-1 min-h-0 w-full overflow-hidden">
        <AreasTable
          areas={filteredAreas}
          isLoading={isLoading}
          isError={isError}
          error={error}
          selectedAreas={selectedAreas}
          areaStatuses={areaStatuses}
          onRetry={() => refetch()}
          onSelectAll={handleSelectAll}
          onSelectArea={handleSelectArea}
          onToggleStatus={handleToggleStatus}
          onView={(area) => {
            setAreaToView(area);
            setViewAreaModalOpen(true);
          }}
          onEdit={(area) => {
            setAreaToEdit(area.area_id);
            setAreaToEditData(area);
            setEditAreaModalOpen(true);
          }}
          onDelete={(id) => handleDeleteArea(id)}
        />
      </div>

      {!isLoading && !isError && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <div className="text-sm text-gray-500 text-center sm:text-left">
            Showing {startIndex + 1}-
            {Math.min(startIndex + itemsPerPageState, totalAreas)} of{" "}
            {totalAreas}
          </div>
          <div className="flex items-center justify-center gap-1 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isFetching}
              className="h-8 w-8 border-gray-200 shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {getPageNumbers().map((pageNum, index) =>
              typeof pageNum === "string" ? (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-400 shrink-0">
                  {pageNum}
                </span>
              ) : (
                <Button
                  key={`page-${pageNum}`}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePageChange(pageNum)}
                  disabled={currentPage === pageNum || isFetching}
                  className={
                    currentPage === pageNum
                      ? "h-8 w-8 bg-gray-900 hover:bg-gray-800 text-white shrink-0"
                      : "h-8 w-8 border-gray-200 shrink-0"
                  }
                >
                  {pageNum}
                </Button>
              ),
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isFetching}
              className="h-8 w-8 border-gray-200 shrink-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <AddAreaModal
        isOpen={isAddAreaModalOpen}
        onClose={() => setIsAddAreaModalOpen(false)}
        onSubmit={(data) => {
          createAreaMutation.mutate(data, {
            onSuccess: () => setIsAddAreaModalOpen(false),
          });
        }}
      />

      <ViewAreaModal
        area={areaToView}
        isOpen={viewAreaModalOpen}
        onClose={() => {
          setViewAreaModalOpen(false);
          setAreaToView(null);
        }}
        onEdit={() => {
          setViewAreaModalOpen(false);
          if (areaToView) {
            setAreaToEdit(areaToView.area_id);
            setAreaToEditData(areaToView);
            setEditAreaModalOpen(true);
          }
        }}
        onDelete={() => {
          setViewAreaModalOpen(false);
          if (areaToView) handleDeleteArea(areaToView.area_id);
        }}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Area
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this area? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {areaToDelete && (
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <p className="font-medium text-gray-900 break-words">
                  {areas.find((a) => a.area_id === areaToDelete)?.area_name}
                </p>
                <p className="text-sm text-gray-500 break-words line-clamp-2">
                  {areas.find((a) => a.area_id === areaToDelete)?.description ||
                    "No description available"}
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-end gap-2 sm:gap-0 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setAreaToDelete(null);
              }}
              disabled={deleteAreaMutation.isPending}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteArea}
              disabled={deleteAreaMutation.isPending}
              className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
            >
              {deleteAreaMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditAreaModal
        isOpen={editAreaModalOpen}
        onClose={() => {
          setEditAreaModalOpen(false);
          setAreaToEdit(null);
          setAreaToEditData(null);
        }}
        areaId={areaToEdit!}
        initialArea={areaToEditData || undefined}
      />
    </div>
  );
}
