"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AdminDevelopersService } from "../services/AdminDevelopersService";
import { unpackDevelopersResponse, mapDeveloper } from "../utils/map-developer";
import { useMemo } from "react";

export function useDevelopers(
  page: number = 1,
  perPage: number = 10,
  search?: string,
  status?: string,
  country?: string,
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const developersData = useQuery({
    queryKey: ["developers", page, perPage, search, status, country],
    queryFn: () =>
      AdminDevelopersService.getDevelopersPaginated(
        page,
        perPage,
        search,
        status,
        country,
      ),
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => AdminDevelopersService.deleteDeveloper(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["developers"] });
    },
  });

  const addMutation = useMutation({
    mutationFn: (data: FormData) => AdminDevelopersService.createDeveloper(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["developers"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      AdminDevelopersService.updateDeveloper(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["developers"] });
    },
  });

  const bulkImportMutation = useMutation({
    mutationFn: (file: File) =>
      AdminDevelopersService.bulkImportDevelopers(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["developers"] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      AdminDevelopersService.toggleStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["developers"] });
    },
  });

  const { itemsArray, totalItems } = useMemo(() => {
    return unpackDevelopersResponse(developersData.data);
  }, [developersData.data]);

  const developers = useMemo(() => itemsArray.map(mapDeveloper), [itemsArray]);

  return {
    developersData,
    developers,
    rawDevelopers: itemsArray,
    totalDevelopers: totalItems,
    deleteMutation,
    addMutation,
    updateMutation,
    bulkImportMutation,
    toggleStatusMutation,
  };
}
