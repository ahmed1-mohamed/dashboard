"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { AdminCitiesService } from "@/services/AdminCitiesService";
import { AdminAreasService } from "@/services/AdminAreasService";
import { AdminLocationsService } from "@/services/AdminLocationsService";
import { LocationInput } from "@/validators/location.schema";

interface SelectOption {
  label: string;
  value: string;
}

export function useAddLocationData(isOpen: boolean) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const {
    data: citiesData,
    isLoading: isLoadingCities,
    error: citiesError,
  } = useQuery<SelectOption[]>({
    queryKey: ["cities"],
    queryFn: async () => {
      const cities = await AdminCitiesService.getAllCities();
      return cities.map((city: any) => ({
        label: city.name,
        value: String(city.id),
      }));
    },
    enabled: !!token && isOpen,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: areasData,
    isLoading: isLoadingAreas,
    error: areasError,
  } = useQuery<SelectOption[]>({
    queryKey: ["areas"],
    queryFn: async () => {
      const res = await AdminAreasService.getAreas(1, 50);
      const areaData = (res as any).data?.data || [];
      return areaData.map((area: any) => ({
        label: area.area_name,
        value: String(area.area_id),
      }));
    },
    enabled: !!token && isOpen,
    staleTime: 5 * 60 * 1000,
  });

  return {
    cities: citiesData || [],
    areas: areasData || [],
    isLoadingCities,
    isLoadingAreas,
    citiesError,
    areasError,
  };
}

export function useAddLocation() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const addLocationMutation = useMutation({
    mutationFn: async (data: LocationInput) => {
      if (!token) {
        throw new Error("Authentication token not found");
      }
      const response = await AdminLocationsService.createLocation(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      toast.success("Location added successfully!");
    },
    onError: (error: any) => {
      console.error("Error adding location:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to add location",
      );
    },
  });

  return {
    addLocation: addLocationMutation.mutateAsync,
    isAddingLocation: addLocationMutation.isPending,
    addLocationError: addLocationMutation.error,
  };
}