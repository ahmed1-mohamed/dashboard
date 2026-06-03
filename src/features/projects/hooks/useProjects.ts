"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AdminProjectsService } from "../services/AdminProjectsService";

export default function useProjects(
  page: number = 1,
  perPage: number = 10,
  search?: string,
  status?: string,
  projectType?: string,
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const paginatedProjectsData = useQuery({
    queryKey: ["projects", page, perPage, search, status, projectType],
    queryFn: () =>
      AdminProjectsService.getProjectsPaginated(
        page,
        perPage,
        search,
        status,
        projectType,
      ),
    retry: false,
    enabled: !!token,
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (id: number) => AdminProjectsService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      AdminProjectsService.toggleActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
      AdminProjectsService.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return {
    paginatedProjectsData,
    deleteProjectMutation,
    toggleActiveMutation,
    updateProjectMutation,
  };
}
