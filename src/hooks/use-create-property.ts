"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminPropertiesService } from "@/services/AdminPropertiesService";
import { PropertiesInput } from "@/validators/propertiesSchema";
import { toast } from "sonner";

export default function useCreateProperty() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: PropertiesInput) => AdminPropertiesService.createProperty(data),
    onSuccess: () => {
      toast.success("Property created successfully!");
      queryClient.invalidateQueries({ queryKey: ["Properties"] });
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
        "Failed to Create Property.";

      toast.error(flatMessages || fallbackMessage);
      throw error;
    },
  });

  return {
    createProperty: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}