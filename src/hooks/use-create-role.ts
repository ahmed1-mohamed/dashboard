"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { AdminRolesService } from "@/services/AdminRolesService";
import type { RolesFormInput } from "@/validators/role.schema";

interface ApiErrorResponse {
  status?: Record<string, string[]>;
  message?: string;
}

interface ApiError {
  response?: {
    data?: ApiErrorResponse;
  };
  message?: string;
}

export function useCreateRole() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: RolesFormInput) => {
      if (!session?.user?.accessToken) {
        throw new Error("Not authenticated");
      }
      return AdminRolesService.createRole(data);
    },
    onSuccess: () => {
      toast.success("Role created successfully!");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["roles_admin"] });
    },
    onError: (error: unknown) => {
      const axiosError = error as ApiError;
      const errorMessage =
        axiosError.response?.data?.status?.role_type?.[0] ||
        axiosError.response?.data?.status?.role_name?.[0] ||
        axiosError.response?.data?.status?.description?.[0] ||
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Failed to create Role. Please try again.";
      toast.error(errorMessage);
      throw error;
    },
  });

  return {
    createRole: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
