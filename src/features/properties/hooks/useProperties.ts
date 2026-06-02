"use client";

import { useQuery, keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AdminPropertiesService, PropertiesFilterParams } from "../services/AdminPropertiesService";

export default function useDashboardAdminProperties(
  page: number = 1,
  perPage: number = 15,
  filters?: PropertiesFilterParams,
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const propertiesQuery = useQuery({
    queryKey: ["properties", page, perPage, filters],
    queryFn: () => {
      const params: PropertiesFilterParams = {
        ...filters,
        per_page: perPage,
        page,
      };
      return AdminPropertiesService.getProperties(params);
    },
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  });

  const deletePropertyMutation = useMutation({
    mutationFn: (id: number) => AdminPropertiesService.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  return {
    data: (propertiesQuery.data as any)?.data || [],
    total: (propertiesQuery.data as any)?.total || 0,
    isLoading: propertiesQuery.isLoading,
    isError: propertiesQuery.isError,
    error: propertiesQuery.error,
    refetch: propertiesQuery.refetch,
    paginatedPropertiesData: propertiesQuery,
    deletePropertyMutation,
  };
}
