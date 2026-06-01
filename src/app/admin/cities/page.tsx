"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { toast } from "sonner";
import useDashboardAdminCitiesData from "@/hooks/use-dashboardAdminCities";
import { AddCityModal, CityFormData } from "@/components/modals/add-city-modal";
import { ViewCityModal } from "@/components/modals/view-city-modal";
import { EditCityModal } from "@/components/modals/edit-city-modal";

// Type definitions matching the actual API response
interface CityApiResponse {
  id: number;
  name: string;
  area_name: string;
  country_name: string;
  locations_count: number;
  projects_count: number;
  created_at: string;
  updated_at: string;
  status: boolean;
}

interface City {
  id: number;
  name: string;
  areaName: string;
  countryName: string;
  locationsCount: number;
  projectsCount: number;
  createdAt: string;
  updatedAt: string;
  status: boolean;
}

interface CitiesPageProps {
  initialPage?: number;
  itemsPerPage?: number;
}

export default function CitiesPage({
  initialPage = 1,
  itemsPerPage = 10,
}: CitiesPageProps) {
  const { data: session } = useSession();

  // State for filters and UI
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedCities, setSelectedCities] = useState<number[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [cityVisibility, setCityVisibility] = useState<Record<number, boolean>>({});
  const [isAddCityModalOpen, setIsAddCityModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cityToDelete, setCityToDelete] = useState<number | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch cities data using custom hook
  const { paginatedCitiesData, createCityMutation, deleteCityMutation, updateCityMutation } =
    useDashboardAdminCitiesData(
      currentPage,
      itemsPerPage,
      debouncedSearch,
    );

  const { data, isLoading, isError, error, isFetching, refetch } =
    paginatedCitiesData;

  // Map API data to component interface
  // Handle both response formats: { data: [...] } or direct array
  const rawData = data as { data?: any } | undefined;
  console.log("Raw API Data:", rawData);
  let itemsArray: any[] = rawData?.data?.data || [];

  const cities: City[] = itemsArray.map((city) => {
    const c = (city as { data?: CityApiResponse }).data || city;
    return {
      id: c.id,
      name: c.name || "N/A",
      areaName: c.area_name || "N/A",
      countryName: c.country_name || "N/A",
      locationsCount: c.locations_count || 0,
      projectsCount: c.projects_count || 0,
      createdAt: c.created_at || new Date().toISOString(),
      updatedAt: c.updated_at || new Date().toISOString(),
      status: c.status ?? true,
    };
  });

  const totalCities = (rawData as any)?.data?.total || 0;
  const totalPages = Math.ceil(Number(totalCities) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Initialize visibility state based on cities data from API
  useEffect(() => {
    const rawItems = (data as { data?: CityApiResponse[] })?.data;
    const itemsArray = Array.isArray(rawItems) ? rawItems : [];
    if (itemsArray.length > 0) {
      const visibilityState = itemsArray.reduce(
        (
          acc: Record<number, boolean>,
          item: { data?: CityApiResponse } | CityApiResponse,
        ) => {
          const c =
            (item as {
              status: any;
              id: any;
              data?: CityApiResponse;
            }) || item;
          return {
            ...acc,
            [c.id]: c.status ? true : false,
          };
        },
        {},
      );
      setCityVisibility(visibilityState);
    }
  }, [data]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedCities(cities.map((c) => c.id));
      } else {
        setSelectedCities([]);
      }
    },
    [cities],
  );

  const handleSelectCity = useCallback(
    (id: number, checked: boolean) => {
      if (checked) {
        setSelectedCities([...selectedCities, id]);
      } else {
        setSelectedCities(selectedCities.filter((cid) => cid !== id));
      }
    },
    [selectedCities],
  );

  const toggleVisibility = useCallback((id: number) => {
    setCityVisibility((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    toast.success(`City status updated`);
  }, []);

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

  // Get selected city object for view modal
  const selectedCity = cities.find((c) => c.id === selectedCityId) || null;

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Cities Management
          </h1>
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-700 border-purple-200 rounded-full px-2"
          >
            {totalCities}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
            onClick={() => setIsAddCityModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add City
          </Button>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          {/* Search */}
          <div className="relative w-full min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for area"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to page 1 when searching
              }}
              className="pl-10 bg-white border-gray-200"
            />
          </div>

          {/* Area Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              <SelectItem value="Gulf Area">Gulf Area</SelectItem>
              <SelectItem value="Coast Area">Coast Area</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
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

      {/* Loading State with Skeletons */}
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

      {/* Error State */}
      {isError && !isLoading && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-800">
              <strong>Error:</strong>{" "}
              {error instanceof Error ? error.message : "Failed to load cities"}
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

      {/* Table */}
      {!isLoading && !isError && (
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-[35px] px-2">
                  <Checkbox
                    checked={
                      cities.length > 0 &&
                      selectedCities.length === cities.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[110px] px-2 text-xs">
                  Name
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[90px] px-2 text-xs">
                  Area
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[80px] px-2 text-xs">
                  Country
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[110px] px-2 text-xs">
                  Locations Count
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[110px] px-2 text-xs">
                  Projects Count
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[140px] px-2 text-xs">
                  Created Date
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[60px] px-2 text-xs">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-gray-900 text-center w-[80px] px-2 text-xs">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cities.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-24 text-center text-gray-500"
                  >
                    No cities found.
                  </TableCell>
                </TableRow>
              ) : (
                cities.map((city) => (
                  <TableRow key={city.id}>
                    <TableCell className="px-2">
                      <Checkbox
                        checked={selectedCities.includes(city.id)}
                        onCheckedChange={(checked) =>
                          handleSelectCity(city.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-gray-900 px-2 text-xs truncate">
                      {city.name}
                    </TableCell>
                    <TableCell className="text-gray-900 px-2 text-xs">
                      {city.areaName}
                    </TableCell>
                    <TableCell className="text-gray-900 px-2 text-xs">
                      {city.countryName}
                    </TableCell>
                    <TableCell className="text-gray-900 px-2 text-xs">
                      {city.locationsCount}
                    </TableCell>
                    <TableCell className="text-gray-900 px-2 text-xs">
                      {city.projectsCount}
                    </TableCell>
                    <TableCell className="text-gray-900 px-2 text-xs">
                      {new Date(city.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-2">
                      <Switch
                        checked={cityVisibility[city.id] || false}
                        onCheckedChange={() => toggleVisibility(city.id)}
                      />
                    </TableCell>
                    <TableCell className="text-center px-2">
                      <TableActions
                        onView={() => {
                          setSelectedCityId(city.id);
                          setIsViewModalOpen(true);
                        }}
                        onEdit={() => {
                          setSelectedCityId(city.id);
                          setIsEditModalOpen(true);
                        }}
                        onDelete={() => {
                          setCityToDelete(city.id);
                          setDeleteDialogOpen(true);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, totalCities)} of {totalCities}
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
            {getPageNumbers().map((page, index) =>
              typeof page === "string" ? (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                  {page}
                </span>
              ) : (
                <Button
                  key={`page-${page}`}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePageChange(page)}
                  disabled={currentPage === page || isFetching}
                  className={
                    currentPage === page
                      ? "h-8 w-8 bg-gray-900 hover:bg-gray-800 text-white"
                      : "h-8 w-8 border-gray-200"
                  }
                >
                  {page}
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

      {/* Add City Modal */}
      <AddCityModal
        isOpen={isAddCityModalOpen}
        onClose={() => setIsAddCityModalOpen(false)}
        onSubmit={(data) => {
          createCityMutation.mutate(
            {
              name: data.cityName,
              state_id: data.stateId,
              country_id: data.countryId,
            },
            {
              onSuccess: () => setIsAddCityModalOpen(false),
            },
          );
        }}
      />

      {/* View City Modal */}
      {/* <ViewCityModal
        city={selectedCity}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedCityId(null);
        }}
        onEdit={() => {
          setIsViewModalOpen(false);
          setIsEditModalOpen(true);
        }}
        onDelete={() => {
          setIsViewModalOpen(false);
          setDeleteDialogOpen(true);
        }}
      /> */}

      {/* Edit City Modal */}
      {/* {selectedCityId && (
        <EditCityModal
          cityId={selectedCityId}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCityId(null);
          }}
          onSuccess={() => {
            toast.success("City updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["cities"] });
            setIsEditModalOpen(false);
            setSelectedCityId(null);
          }}
        />
      )} */}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen && cityToDelete !== null}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setCityToDelete(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete City
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this city? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {cityToDelete && (
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <p className="font-medium text-gray-900">
                  {cities.find((c) => c.id === cityToDelete)?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {cities.find((c) => c.id === cityToDelete)?.countryName}
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setCityToDelete(null);
              }}
              disabled={deleteCityMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (cityToDelete) {
                  deleteCityMutation.mutate(cityToDelete, {
                    onSuccess: () => {
                      setDeleteDialogOpen(false);
                      setCityToDelete(null);
                    },
                  });
                }
              }}
              disabled={deleteCityMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteCityMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
