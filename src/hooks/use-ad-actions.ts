"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { AdminAdsService } from "@/services/AdminAdsService";

export function useAdActions() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Create ad mutation
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Not authenticated");
      return AdminAdsService.createAd(formData, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      queryClient.invalidateQueries({ queryKey: ["adsTotals"] });
      toast.success("Ad created successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create ad";
      toast.error(errorMessage);
    },
  });

  // Update ad mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      adId,
      formData,
    }: {
      adId: number;
      formData: FormData;
    }) => {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Not authenticated");
      return AdminAdsService.updateAd(adId, formData, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      queryClient.invalidateQueries({ queryKey: ["adsTotals"] });
      toast.success("Ad updated successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update ad";
      toast.error(errorMessage);
    },
  });

  // Delete ad mutation
  const deleteMutation = useMutation({
    mutationFn: async (adId: number) => {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Not authenticated");
      return AdminAdsService.deleteAd(adId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      queryClient.invalidateQueries({ queryKey: ["adsTotals"] });
      toast.success("Ad deleted successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete ad";
      toast.error(errorMessage);
    },
  });

  // Toggle ad status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ adId, status }: { adId: number; status: string }) => {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Not authenticated");
      return AdminAdsService.toggleStatus(adId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      toast.success("Ad status updated successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update ad status";
      toast.error(errorMessage);
    },
  });

  return {
    createAd: createMutation.mutateAsync,
    updateAd: updateMutation.mutateAsync,
    deleteAd: deleteMutation.mutateAsync,
    toggleAdStatus: toggleStatusMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isTogglingStatus: toggleStatusMutation.isPending,
  };
}
