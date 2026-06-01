"use client";

import { useState, useEffect, useCallback } from "react";
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
  Search,
  Plus,
  Download,
  Settings2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import useDashboardAdminLocations from "@/hooks/use-dashboardAdminLocations";
import {
  AddLocationModal,
  LocationFormData,
} from "@/components/modals/add-location-modal";
import { ViewLocationModal } from "@/components/modals/view-location-modal";
import { EditLocationModal } from "@/components/modals/edit-location-modal";
import { DeleteLocationModal } from "@/components/modals/delete-location-modal";

interface Location {
  location_id: number;
  location_landmark: string;
  city_name: string;
  country_name: string;
  area_name: string;
  created_at: string;
  projects_count: number;
}

export default function LocationsManagementPage() {
  const queryClient = useQueryClient();

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [selectedLocations, setSelectedLocations] = useState<number[]>([]);
  const [locationStatuses, setLocationStatuses] = useState<
    Record<number, boolean>
  >({});
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<number | null>(null);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch locations using TanStack Query hook
  const {
    paginatedLocationsData,
    createLocationMutation,
    deleteLocationMutation,
  } = useDashboardAdminLocations(currentPage, perPage, debouncedSearch);

  const { data, isLoading, isError, error, isFetching, refetch } =
    paginatedLocationsData;

  // Map API data to component interface
  const rawData = data as { data?: any } | undefined;
  console.log("Raw API Data:", rawData);
  let itemsArray: any[] = rawData?.data?.data || [];

  const locations: Location[] = itemsArray.map((loc) => {
    const location = (loc as { data?: Location }).data || loc;
    return {
      location_id: location.location_id,
      location_landmark: location.location_landmark || "N/A",
      city_name: location.city_name || "N/A",
      country_name: location.country_name || "N/A",
      area_name: location.area_name?.trim() || "N/A",
      created_at: location.created_at || "N/A",
      projects_count: location.projects_count || 0,
    };
  });

  const total = (rawData as any)?.data?.total || 0;
  const totalPages = Math.ceil(Number(total) / perPage);
  const startIndex = (currentPage - 1) * perPage;

  // Initialize visibility state based on locations data from API
  useEffect(() => {
    const rawItems = (data as { data?: Location[] })?.data;
    const itemsArray = Array.isArray(rawItems) ? rawItems : [];
    if (itemsArray.length > 0) {
      const visibilityState = itemsArray.reduce(
        (acc: Record<number, boolean>, item: Location) => {
          return {
            ...acc,
            [item.location_id]: true,
          };
        },
        {},
      );
      setLocationStatuses(visibilityState);
    }
  }, [data]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedLocations(locations.map((l) => l.location_id));
      } else {
        setSelectedLocations([]);
      }
    },
    [locations],
  );

  const handleSelectLocation = useCallback(
    (location_id: number, checked: boolean) => {
      if (checked) {
        setSelectedLocations([...selectedLocations, location_id]);
      } else {
        setSelectedLocations(
          selectedLocations.filter((id) => id !== location_id),
        );
      }
    },
    [selectedLocations],
  );

  const handleToggleStatus = useCallback((location_id: number) => {
    setLocationStatuses((prev) => ({
      ...prev,
      [location_id]: !prev[location_id],
    }));
    toast.success(`Location status updated`);
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

  const handleViewLocation = useCallback((location: Location) => {
    setSelectedLocation(location);
    setIsViewModalOpen(true);
  }, []);

  const handleEditLocation = useCallback((location: Location) => {
    setSelectedLocation(location);
    setIsEditModalOpen(true);
  }, []);

  const handleAddLocation = (data: LocationFormData) => {
    const locationData = {
      location_name_en: data.locationName,
      location_name_ar: data.locationName,
      city_id: Number(data.cityId) || undefined,
      area_id: Number(data.areaId) || undefined,
      google_map_link: data.googleMapLink,
      latitude: data.latitude ? Number(data.latitude) : undefined,
      longitude: data.longitude ? Number(data.longitude) : undefined,
      north_side: data.northSide || undefined,
      south_side: data.southSide || undefined,
      east_side: data.eastSide || undefined,
      west_side: data.westSide || undefined,
      landmark: data.landmark ? [data.landmark] : undefined,
      description: data.description || undefined,
    };
    createLocationMutation.mutate(locationData, {
      onSuccess: () => {
        toast.success("Location created successfully!");
        setIsAddLocationModalOpen(false);
      },
      onError: (error) => {
        console.error("Error creating location:", error);
        toast.error("Failed to create location");
      },
    });
  };

  const handleConfirmDelete = () => {
    if (locationToDelete) {
      deleteLocationMutation.mutate(locationToDelete, {
        onSuccess: () => {
          toast.success("Location deleted successfully!");
          setIsDeleteModalOpen(false);
          setLocationToDelete(null);
        },
        onError: (error) => {
          console.error("Error deleting location:", error);
          toast.error("Failed to delete location");
        },
      });
    }
  };

  const handleEditSuccess = async () => {
    queryClient.invalidateQueries({ queryKey: ["locations"] });
    toast.success("Location updated successfully!");
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 10;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      for (let i = 1; i <= Math.min(maxVisible, totalPages); i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className="p-4 px-3 space-y-4 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Locations Management
          </h1>
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-700 border-purple-200 rounded-full px-2"
          >
            {total}
          </Badge>
        </div>
        <Button
          className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
          onClick={() => setIsAddLocationModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add New Location
        </Button>
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200"
            />
          </div>

          {/* Cities Filter */}
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              <SelectItem value="Dubai">Dubai</SelectItem>
              <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
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
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[100px]" />
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
              {error instanceof Error
                ? error.message
                : "Failed to load locations"}
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
                      locations.length > 0 &&
                      selectedLocations.length === locations.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[200px] px-2 text-xs">
                  Name
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[80px] px-2 text-xs">
                  City
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[80px] px-2 text-xs">
                  Area
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[70px] px-2 text-xs">
                  Country
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[70px] px-2 text-xs">
                  Projects
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[80px] px-2 text-xs">
                  Projects Count
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[120px] px-2 text-xs">
                  Created Date
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[60px] px-2 text-xs">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-gray-900 text-center w-[50px] px-2 text-xs">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="h-24 text-center text-gray-500"
                  >
                    No locations found.
                  </TableCell>
                </TableRow>
              ) : (
                locations.map((location) => (
                  <TableRow key={location.location_id}>
                    <TableCell className="px-2">
                      <Checkbox
                        checked={selectedLocations.includes(
                          location.location_id,
                        )}
                        onCheckedChange={(checked) =>
                          handleSelectLocation(
                            location.location_id,
                            checked as boolean,
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className="text-gray-900 px-2 text-xs truncate">
                      {location.location_landmark}
                    </TableCell>
                    <TableCell className="text-gray-900 px-2 text-xs">
                      {location.city_name}
                    </TableCell>
                    <TableCell className="text-gray-900 px-2 text-xs truncate">
                      {location.area_name}
                    </TableCell>
                    <TableCell className="text-gray-900 px-2 text-xs">
                      {location.country_name}
                    </TableCell>
                    <TableCell className="text-gray-900 px-2 text-xs">
                      {location.projects_count}
                    </TableCell>
                    <TableCell className="text-gray-900 px-2 text-xs">
                      {location.projects_count}
                    </TableCell>
                    <TableCell className="text-gray-900 px-2 text-xs">
                      {location.created_at}
                    </TableCell>
                    <TableCell className="px-2">
                      <Switch
                        checked={locationStatuses[location.location_id]}
                        onCheckedChange={() =>
                          handleToggleStatus(location.location_id)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center px-2">
                      <TableActions
                        onView={() => handleViewLocation(location)}
                        onEdit={() => handleEditLocation(location)}
                        onDelete={() => {
                          setLocationToDelete(location.location_id);
                          setIsDeleteModalOpen(true);
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
            Showing {startIndex + 1}-{Math.min(startIndex + perPage, total)} of{" "}
            {total}
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
            {getPageNumbers().map((page, index) => (
              <Button
                key={index}
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
            ))}
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

      {/* Add Location Modal */}
      <AddLocationModal
        isOpen={isAddLocationModalOpen}
        onClose={() => setIsAddLocationModalOpen(false)}
      />

      {/* View Location Modal */}
      {/* {selectedLocation && (
        <ViewLocationModal
          locationId={selectedLocation.location_id}
          locationLandmark={selectedLocation.location_landmark}
          cityName={selectedLocation.city_name}
          countryName={selectedLocation.country_name}
          areaName={selectedLocation.area_name}
          createdAt={selectedLocation.created_at}
          projectsCount={selectedLocation.projects_count}
          isActive={locationStatuses[selectedLocation.location_id] ?? true}
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedLocation(null);
          }}
          onEdit={() => {
            setIsViewModalOpen(false);
            setIsEditModalOpen(true);
          }}
          onDelete={() => {
            setIsViewModalOpen(false);
            setLocationToDelete(selectedLocation.location_id);
            setIsDeleteModalOpen(true);
          }}
        />
      )} */}

      {/* Edit Location Modal */}
      {/* {selectedLocation && (
        <EditLocationModal
          locationId={selectedLocation.location_id}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedLocation(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )} */}

      {/* Delete Location Modal */}
      <DeleteLocationModal
        location={selectedLocation}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setLocationToDelete(null);
        }}
        onSuccess={handleConfirmDelete}
      />
    </div>
  );
}
