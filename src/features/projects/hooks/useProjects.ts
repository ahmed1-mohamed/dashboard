"use client";

import { useQuery, keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AdminProjectsService } from "../services/AdminProjectsService";

export default function useDashboardAdminData(
  page?: number,
  limit?: number,
  search?: string,
  status?: string,
  projectType?: string,
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const allProjectsData = useQuery({
    queryKey: ["allProjects"],
    queryFn: () => AdminProjectsService.getProjects(),
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  const paginatedProjectsData = useQuery({
    queryKey: ["projects", page, limit, search, status, projectType],
    queryFn: () => AdminProjectsService.getProjectsPaginated(page!, limit!, search, status, projectType),
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const queryClient = useQueryClient();

  const deleteProjectMutation = useMutation({
    mutationFn: (id: number) => AdminProjectsService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["allProjects"] });
    },
  });

  return {
    allProjectsData,
    paginatedProjectsData,
    deleteProjectMutation,
  };
}
