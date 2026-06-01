"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { editCity } from "@/data/api-client";

export function useCityActions() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Update city mutation
  const updateMutation = useMutation({
    mutationFn: async ({ cityId, data }: { cityId: number; data: any }) => {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Not authenticated");
      return editCity(cityId, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
      toast.success("City updated successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message ||
                          error?.message ||
                          "Failed to update city";
      toast.error(errorMessage);
    },
  });

  return {
    updateCity: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}