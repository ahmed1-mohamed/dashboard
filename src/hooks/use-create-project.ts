"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminProjectsService } from "@/features/projects/services/AdminProjectsService";
import type { CreateProjectWithMediaParams, CreateProjectResult } from "@/features/projects/services/AdminProjectsService";

export { type CreateProjectWithMediaParams };

export default function useCreateProject() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateProjectWithMediaParams) => AdminProjectsService.createProjectWithMedia(data),
    onSuccess: (result: CreateProjectResult) => {
      toast.success(`${result.projectName} created successfully!`);
      queryClient.invalidateQueries({ queryKey: ["Projects"] });
    },
    onError: (error: any) => {
      const errorList = error?.response?.data?.errors;
      const flatMessages = errorList
        ? Object.values(errorList)
          .map((errObj: any) => Object.values(errObj))
          .flat()
          .join(", ")
        : "";

      const fallbackMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create project. Please try again.";

      toast.error(flatMessages || fallbackMessage);
      throw error;
    },
  });

  return {
    createProject: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
