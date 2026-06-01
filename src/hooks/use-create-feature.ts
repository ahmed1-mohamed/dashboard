"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { AdminFeaturesService } from "@/services/AdminFeaturesService";
import { FeaturesDataType } from "@/types";

interface ApiError {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
  message?: string;
}

export function useCreateFeature() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: FeaturesDataType) => {
      if (!session?.user?.accessToken) {
        throw new Error("Not authenticated");
      }
      return AdminFeaturesService.createFeature(data);
    },
    onSuccess: () => {
      toast.success("Feature created successfully!");
      queryClient.invalidateQueries({ queryKey: ["features"] });
    },
    onError: (error: unknown) => {
      let errorMessage = "Failed to create Feature. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null) {
        const apiError = error as ApiError;
        const errorList = apiError.response?.data?.errors;
        if (errorList) {
          const flatMessages = Object.values(errorList)
            .map((errObj: any) => Object.values(errObj))
            .flat()
            .join(", ");
          errorMessage = flatMessages || errorMessage;
        } else {
          errorMessage =
            apiError.response?.data?.message ||
            apiError.message ||
            errorMessage;
        }
      }
      toast.error(errorMessage);
      throw error;
    },
  });

  return {
    createFeature: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}