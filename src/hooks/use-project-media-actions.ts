"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { editProjectMedia } from "@/data/api-client";

interface UpdateProjectMediaData {
  description: string;
  is_primary: boolean;
  my_order: boolean;
}

export function useProjectMediaActions() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Update project media mutation
  const updateMutation = useMutation({
    mutationFn: async ({ mediaId, data }: { mediaId: number; data: any }) => {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Not authenticated");
      return editProjectMedia(mediaId, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectDetails"] });
      toast.success("Media updated successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update media";
      toast.error(errorMessage);
    },
  });

  return {
    updateProjectMedia: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
