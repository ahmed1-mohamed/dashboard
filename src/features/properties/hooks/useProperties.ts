"use client";

import { useQuery, keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AdminPropertiesService, PropertiesFilterParams } from "../services/AdminPropertiesService";
import { mapProperty } from "../utils/map-property";
import { useMemo } from "react";

export default function useProperties(
  page: number = 1,
  perPage: number = 15,
  filters?: PropertiesFilterParams,
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

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
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const deletePropertyMutation = useMutation({
    mutationFn: (id: number) => AdminPropertiesService.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  const updatePropertyMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
      AdminPropertiesService.updateProperty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  const rawResponse = propertiesQuery.data as
    | { data: unknown[]; total: number }
    | undefined;

  const rawData = rawResponse?.data ?? [];
  const properties = useMemo(() => rawData.map(mapProperty), [rawData]);

  return {
    properties,
    totalProperties: rawResponse?.total ?? 0,
    isLoading: propertiesQuery.isLoading,
    isError: propertiesQuery.isError,
    error: propertiesQuery.error,
    refetch: propertiesQuery.refetch,
    paginatedPropertiesData: propertiesQuery,
    deletePropertyMutation,
    updatePropertyMutation,
  };
}
