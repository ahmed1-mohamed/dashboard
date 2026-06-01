"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { AdminCitiesService } from "@/services/AdminCitiesService";
import { CityInput } from "@/validators/city.schema";

export default function useDashboardAdminCitiesData(
  page?: number,
  limit?: number,
  search?: string,
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const allCitiesData = useQuery({
    queryKey: ["allCities"],
    queryFn: () => AdminCitiesService.getAllCities(),
    retry: false,
    enabled: !!token,
  });

  const paginatedCitiesData = useQuery({
    queryKey: ["cities", page, limit, search],
    queryFn: () => AdminCitiesService.getCities(page!, limit!, search),
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const createCityMutation = useMutation({
    mutationFn: (data: CityInput) => {
      if (!token) throw new Error("No access token");
      return AdminCitiesService.createCity(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
      queryClient.invalidateQueries({ queryKey: ["allCities"] });
      toast.success("City created successfully!");
    },
    onError: (error) => {
      console.error("Error creating city:", error);
      toast.error("Failed to create city");
    },
  });

  const deleteCityMutation = useMutation({
    mutationFn: (cityId: number) => {
      if (!token) throw new Error("No access token");
      return AdminCitiesService.deleteCity(cityId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
      queryClient.invalidateQueries({ queryKey: ["allCities"] });
      toast.success("City deleted successfully!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete city.");
    },
  });

  const updateCityMutation = useMutation({
    mutationFn: ({ cityId, data }: { cityId: number; data: CityInput }) => {
      if (!token) throw new Error("No access token");
      return AdminCitiesService.updateCity(cityId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
      queryClient.invalidateQueries({ queryKey: ["allCities"] });
      toast.success("City updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating city:", error);
      toast.error("Failed to update city");
    },
  });

  return {
    allCitiesData,
    paginatedCitiesData,
    createCityMutation,
    deleteCityMutation,
    updateCityMutation,
  };
}
