"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { AdminExpertsService } from "@/services/AdminExpertsService";

export function useExpertActions() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Create expert mutation
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Not authenticated");
      return AdminExpertsService.createExpert(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experts"] });
      queryClient.invalidateQueries({ queryKey: ["expert-conversations"] });
      toast.success("Expert created successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "Failed to create expert";
      toast.error(errorMessage);
    },
  });

  // Update expert mutation
  const updateMutation = useMutation({
    mutationFn: async ({ expertId, formData }: { expertId: number; formData: FormData }) => {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Not authenticated");
      return AdminExpertsService.updateExpert(expertId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experts"] });
      toast.success("Expert updated successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "Failed to update expert";
      toast.error(errorMessage);
    },
  });

  // Delete expert mutation
  const deleteMutation = useMutation({
    mutationFn: async (expertId: number) => {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Not authenticated");
      return AdminExpertsService.deleteExpert(expertId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experts"] });
      toast.success("Expert deleted successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "Failed to delete expert";
      toast.error(errorMessage);
    },
  });

  return {
    createExpert: createMutation.mutateAsync,
    updateExpert: updateMutation.mutateAsync,
    deleteExpert: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
