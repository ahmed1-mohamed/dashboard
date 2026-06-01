"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { editProjectFeature } from "@/data/api-client";
import { EditProjectFeatureInput } from "@/validators/project-features.schema";

export function useProjectFeatureActions() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Update project feature mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      projectId,
      featureId,
      data,
    }: {
      projectId: number;
      featureId: number;
      data: any;
    }) => {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Not authenticated");
      return editProjectFeature(projectId, featureId, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectDetails"] });
      toast.success("Project Feature updated successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update project feature";
      toast.error(errorMessage);
    },
  });

  return {
    updateProjectFeature: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
