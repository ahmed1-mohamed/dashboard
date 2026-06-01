"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AdminLocationsService } from "@/services/AdminLocationsService";

export default function useDashboardAdminLocations(
  page?: number,
  limit?: number,
  search?: string,
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const paginatedLocationsData = useQuery({
    queryKey: ["locations", page, limit, search],
    queryFn: () => AdminLocationsService.getLocations(page!, limit!, search),
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const createLocationMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => AdminLocationsService.createLocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });

  const updateLocationMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      AdminLocationsService.updateLocation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });

  const deleteLocationMutation = useMutation({
    mutationFn: (id: number) => AdminLocationsService.deleteLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });

  return {
    paginatedLocationsData,
    createLocationMutation,
    updateLocationMutation,
    deleteLocationMutation,
  };
}