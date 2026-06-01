"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { AdminAreasService } from "@/services/AdminAreasService";
import { AreaInput } from "@/validators/area.schema";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export function useCreateArea() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: AreaInput) => {
      if (!session?.user?.accessToken) {
        throw new Error("Not authenticated");
      }
      return AdminAreasService.createArea(data);
    },
    onSuccess: () => {
      toast.success("Area added successfully");
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    },
    onError: (error: unknown) => {
      let errorMessage = "Failed to add area";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null) {
        const apiError = error as ApiError;
        errorMessage = apiError.response?.data?.message || apiError.message || errorMessage;
      }
      toast.error(errorMessage);
    },
  });

  return {
    createArea: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
}
