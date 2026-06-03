"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableActions } from "@/components/table/table-actions";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Download,
  Settings2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import useDashboardAdminAreasData from "@/hooks/use-dashboardAdminAreas";
import { AddAreaModal } from "@/components/modals/add-area-modal";
import { ViewAreaModal } from "@/components/modals/view-area-modal";
import { EditAreaModal } from "@/components/modals/edit-area-modal";

// Type definitions matching the actual API response
interface AreaApiResponse {
  area_id: number;
  area_name: string;
  region?: string;
  latitude?: string;
  longitude?: string;
  description?: string;
  population?: number;
  major_landmarks?: string[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  dld_area_id?: number;
  locations_count?: number;
  projects_count?: number;
}

interface Area {
  area_id: number;
  area_name: string;
  region: string;
  latitude: string;
  longitude: string;
  description: string;
  population: number;
  major_landmarks: string[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  dld_area_id: number | undefined;
  locations_count: number | undefined;
  projects_count: number | undefined;
  status: boolean;
}

interface PaginatedAreasResponse {
  status: boolean;
  data: AreaApiResponse[];
  current_page: number;
  per_page: number;
  total: number;
}

interface AreasPageProps {
  initialPage?: number;
  itemsPerPage?: number;
}

export default function AreasPage({
  initialPage = 1,
  itemsPerPage = 15,
}: AreasPageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
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

  // Fetch areas data using custom hook
  const {
    areasData,
    createAreaMutation,
    deleteAreaMutation,
    updateAreaMutation,
  } = useDashboardAdminAreasData(currentPage, itemsPerPageState);

  const { data, isLoading, isError, error, isFetching, refetch } = areasData;

  // Map API data to component interface
  const rawData = data as { data?: any } | undefined;
  console.log("Raw API Data:", rawData);
  let itemsArray: any[] = rawData?.data?.data || [];

  const areas: Area[] = itemsArray.map((area: AreaApiResponse) => ({
    area_id: area.area_id,
    area_name: area.area_name || "N/A",
    region: area.region || "",
    latitude: area.latitude || "",
    longitude: area.longitude || "",
    description: area.description || "",
    population: area.population || 0,
    major_landmarks: area.major_landmarks || [],
    created_at: area.created_at || "",
    updated_at: area.updated_at || "",
    deleted_at: area.deleted_at || null,
    dld_area_id: area.dld_area_id,
    locations_count: area.locations_count,
    projects_count: area.projects_count,
    status: !area.deleted_at,
  }));

  const totalAreas = (rawData as any)?.data?.total || 0;
  const totalPages = Math.ceil(Number(totalAreas) / itemsPerPageState);
  const startIndex = (currentPage - 1) * itemsPerPageState;

  // Initialize status state based on areas data from API
  useEffect(() => {
    if (areas.length > 0) {
      const statusState = areas.reduce(
        (acc: Record<number, boolean>, area) => ({
          ...acc,
          [area.area_id]: area.status,
        }),
        {},
      );
      setAreaStatuses(statusState);
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
        setSelectedAreas([...selectedAreas, area_id]);
      } else {
        setSelectedAreas(selectedAreas.filter((aid) => aid !== area_id));
      }
    },
    [selectedAreas],
  );

  const handleToggleStatus = useCallback(
    (area_id: number) => {
      // Note: Status is derived from deleted_at, so we'll handle via delete/restore
      // For now, just update optimistically and invalidate
      setAreaStatuses((prev) => ({
        ...prev,
        [area_id]: !prev[area_id],
      }));
      // No direct API endpoint, so we just invalidate to refetch
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

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

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

  // Generate page numbers for pagination
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
    <div className="p-4 px-3 space-y-4 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Areas</h1>
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-700 border-purple-200 rounded-full px-2"
          >
            {totalAreas}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
            onClick={() => setIsAddAreaModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add New Area
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          <div className="relative w-full min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for areas"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 border-gray-200">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="gap-2 border-gray-200">
            <Settings2 className="h-4 w-4" />
            Table settings
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-10 w-[120px]" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[60px]" />
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-4 w-[70px]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isError && !isLoading && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-800">
              <strong>Error:</strong>{" "}
              {error instanceof Error ? error.message : "Failed to load areas"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="mt-2 border-red-200 text-red-700 hover:bg-red-100"
          >
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-[35px] px-2">
                  <Checkbox
                    checked={
                      areas.length > 0 && selectedAreas.length === areas.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[200px] px-2 text-sm">
                  Area Name
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
                  Region
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
                  Population
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[150px] px-2 text-sm">
                  Major Landmarks
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
                  Created
                </TableHead>
                <TableHead className="font-semibold text-gray-900 text-center w-[80px] px-2 text-sm">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-gray-900 text-center w-[50px] px-2 text-sm">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {areas.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-gray-500"
                  >
                    No areas found.
                  </TableCell>
                </TableRow>
              ) : (
                areas.map((area) => (
                  <TableRow key={area.area_id}>
                    <TableCell className="px-2">
                      <Checkbox
                        checked={selectedAreas.includes(area.area_id)}
                        onCheckedChange={(checked) =>
                          handleSelectArea(area.area_id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-teal-600 font-medium px-2 text-sm">
                      {area.area_name}
                    </TableCell>
                    <TableCell className="text-gray-900 px-2 text-sm">
                      {area.region}
                    </TableCell>
                    <TableCell className="text-gray-900 px-2 text-sm">
                      {area.population}
                    </TableCell>
                    <TableCell className="text-gray-900 px-2 text-sm">
                      {area.major_landmarks?.join(", ") || "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-900 px-2 text-sm">
                      {area.created_at}
                    </TableCell>
                    <TableCell className="text-center px-2">
                      <Switch
                        checked={areaStatuses[area.area_id] !== false}
                        onCheckedChange={() => handleToggleStatus(area.area_id)}
                      />
                    </TableCell>
                    <TableCell className="text-center px-2">
                      <TableActions
                        onView={() => {
                          setAreaToView(area);
                          setViewAreaModalOpen(true);
                        }}
                        onEdit={() => {
                          setAreaToEdit(area.area_id);
                          setAreaToEditData(area);
                          setEditAreaModalOpen(true);
                        }}
                        onDelete={() => handleDeleteArea(area.area_id)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {!isLoading && !isError && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1}-
            {Math.min(startIndex + itemsPerPageState, totalAreas)} of{" "}
            {totalAreas}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isFetching}
              className="h-8 w-8 border-gray-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {getPageNumbers().map((pageNum, index) =>
              typeof pageNum === "string" ? (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
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
                      ? "h-8 w-8 bg-gray-900 hover:bg-gray-800 text-white"
                      : "h-8 w-8 border-gray-200"
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
              className="h-8 w-8 border-gray-200"
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

      {/* View Area Modal */}
      {/* <ViewAreaModal
        area={areaToView}
        isOpen={viewAreaModalOpen}
        onClose={() => {
          setViewAreaModalOpen(false);
          setAreaToView(null);
        }}
        onEdit={() => {
          setViewAreaModalOpen(false);
          setAreaToEdit(areaToView?.area_id || null);
          setAreaToEditData(areaToView);
          setEditAreaModalOpen(true);
        }}
        onDelete={() => {
          setViewAreaModalOpen(false);
          handleDeleteArea(areaToView?.area_id || null);
        }}
      /> */}

      {/* Edit Area Modal */}
      {/* {editAreaModalOpen && areaToEdit && (
        <EditAreaModal
          key={areaToEdit}
          isOpen={editAreaModalOpen}
          onClose={() => {
            setEditAreaModalOpen(false);
            setAreaToEdit(null);
            setAreaToEditData(null);
          }}
          areaId={areaToEdit}
          initialArea={areaToEditData ?? undefined}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["areas"] });
            setEditAreaModalOpen(false);
            setAreaToEdit(null);
            setAreaToEditData(null);
            toast.success("Area updated successfully!");
          }}
        />
      )} */}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
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
                <p className="font-medium text-gray-900">
                  {areas.find((a) => a.area_id === areaToDelete)?.area_name}
                </p>
                <p className="text-sm text-gray-500">
                  {areas.find((a) => a.area_id === areaToDelete)?.region ||
                    "No region"}
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setAreaToDelete(null);
              }}
              disabled={deleteAreaMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteArea}
              disabled={deleteAreaMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteAreaMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
