"use client";

import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import useDashboardAdminLocations from "@/hooks/use-dashboardAdminLocations";
import { Pagination } from "@/components/shared/Pagination";
import { locationsExportToPDF, locationsExportToExcel } from "@/lib/handle-export";

import { LocationsFilters } from "@/features/locations/components/LocationsFilters";
import { LocationsTable } from "@/features/locations/components/LocationsTable";
import { Location } from "@/features/locations/types";

import {
  AddLocationModal,
  LocationFormData,
} from "@/components/modals/add-location-modal";
import { DeleteLocationModal } from "@/components/modals/delete-location-modal";

export default function LocationsManagementPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState({ city: "all", status: "all" });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch((prev) => {
        if (prev !== searchQuery) {
          setPage(1);
        }
        return searchQuery;
      });
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const setFilter = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const [selectedLocations, setSelectedLocations] = useState<number[]>([]);
  const [locationStatuses, setLocationStatuses] = useState<Record<number, boolean>>({});

  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<number | null>(null);

  const {
    paginatedLocationsData: allLocationsData,
    createLocationMutation,
    updateLocationMutation,
    deleteLocationMutation,
  } = useDashboardAdminLocations(1, 1000, debouncedSearch);

  const allRaw = (allLocationsData.data as { data?: any } | undefined)?.data;
  const allItems: any[] = Array.isArray(allRaw) ? allRaw : allRaw?.data ?? [];

  const cities: string[] = Array.from(
    new Set(
      allItems
        .map((loc: any) => loc?.city_name)
        .filter((c: string) => c && c !== "N/A" && c.trim() !== ""),
    ),
  ).sort() as string[];

  const { data, isLoading, isError, error, refetch } = allLocationsData;

  const locations: Location[] = allItems.map((loc: any) => ({
    location_id: loc.location_id,
    location_landmark: loc.location_landmark || "N/A",
    city_name: loc.city_name || "N/A",
    country_name: loc.country_name || "N/A",
    area_name: loc.area_name?.trim() || "N/A",
    created_at: loc.created_at || "N/A",
    projects_count: loc.projects_count || 0,
    status: loc.status || loc.is_active || "active",
  }));

  let filteredLocations: Location[] = locations;

  if (filters.city !== "all") {
    filteredLocations = filteredLocations.filter((loc) => loc.city_name === filters.city);
  }

  if (filters.status !== "all") {
    const isActiveFilter = filters.status === "active";
    filteredLocations = filteredLocations.filter((loc) => {
      const status = locationStatuses[loc.location_id] ?? true;
      return status === isActiveFilter;
    });
  }

  const total: number = filteredLocations.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const currentLocations = filteredLocations.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    const items: Location[] = locations;
    if (items.length > 0) {
      const visibilityState = items.reduce(
        (acc: Record<number, boolean>, item: Location) => {
          const isActive = item.status === "active" || item.status === "1" || item.status === 1 || item.status === true;
          return { ...acc, [item.location_id]: isActive };
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
        setSelectedLocations((prev) => [...prev, location_id]);
      } else {
        setSelectedLocations((prev) => prev.filter((id) => id !== location_id));
      }
    },
    [],
  );

  const handleToggleStatus = useCallback((location_id: number) => {
    const currentStatus = locationStatuses[location_id] ?? true;
    const newStatus = !currentStatus;

    setLocationStatuses((prev) => ({
      ...prev,
      [location_id]: newStatus,
    }));

    const formData = new FormData();
    formData.append("status", newStatus ? "active" : "inactive");
    
    // Some APIs expect _method=PUT when using FormData
    formData.append("_method", "PUT");

    updateLocationMutation.mutate(
      { id: location_id, data: formData },
      {
        onSuccess: () => {
          toast.success(`Location status updated to ${newStatus ? 'Active' : 'Inactive'}`);
        },
        onError: (error) => {
          console.error("Error updating status:", error);
          setLocationStatuses((prev) => ({
            ...prev,
            [location_id]: currentStatus,
          }));
          toast.error("Failed to update location status");
        }
      }
    );
  }, [locationStatuses, updateLocationMutation]);

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

  return (
    <div className="p-3 sm:p-4 space-y-4 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Locations Management</h1>
          <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200 rounded-full px-2">
            {total}
          </Badge>
        </div>
        <Button
          className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm w-full sm:w-auto"
          onClick={() => setIsAddLocationModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> Add New Location
        </Button>
      </div>

      <LocationsFilters
        searchQuery={searchQuery}
        onSearchChange={(val) => { setSearchQuery(val); setPage(1); }}
        cities={cities}
        cityFilter={filters.city}
        onCityChange={(val) => { setFilter("city", val); setPage(1); }}
        statusFilter={filters.status}
        onStatusChange={(val) => { setFilter("status", val); setPage(1); }}
        onExportPDF={() => locationsExportToPDF(locations)}
        onExportExcel={() => locationsExportToExcel(locations)}
      />

      {isLoading && (
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="p-4 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-6">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[80px]" />
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
              <strong>Error:</strong> {error instanceof Error ? error.message : "Failed to load locations"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="mt-3 border-red-200 text-red-700 hover:bg-red-100"
          >
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <LocationsTable
            locations={currentLocations}
            selectedLocations={selectedLocations}
            locationStatuses={locationStatuses}
            onSelectAll={handleSelectAll}
            onSelectLocation={handleSelectLocation}
            onToggleStatus={handleToggleStatus}
            onView={(loc) => {
              router.push(`/admin/locations/${loc.location_id}`);
            }}
            onEdit={(loc) => {
              setSelectedLocation(loc);
              setIsEditModalOpen(true);
            }}
            onDelete={(loc) => {
              setLocationToDelete(loc.location_id);
              setIsDeleteModalOpen(true);
            }}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={total}
            perPage={perPage}
            onPageChange={setPage}
            onPerPageChange={(val) => {
              setPerPage(val);
              setPage(1);
            }}
          />
        </>
      )}

      <AddLocationModal
        isOpen={isAddLocationModalOpen}
        onClose={() => setIsAddLocationModalOpen(false)}
      />

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
