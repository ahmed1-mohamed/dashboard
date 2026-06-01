"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { editArea } from "@/data/api-client";
import { AreaInput } from "@/validators/area.schema";

export function useAreaActions() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Update area mutation
  const updateMutation = useMutation({
    mutationFn: async ({ areaId, data }: { areaId: number; data: AreaInput }) => {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Not authenticated");
      return editArea(areaId, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      toast.success("Area updated successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message ||
                          error?.message ||
                          "Failed to update area";
      toast.error(errorMessage);
    },
  });

  return {
    updateArea: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}