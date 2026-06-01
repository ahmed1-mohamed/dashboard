"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { AdminAreasService } from "@/services/AdminAreasService";
import { AreaInput } from "@/validators/area.schema";

export default function useDashboardAdminAreasData(
  page?: number,
  limit?: number,
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const areasData = useQuery({
    queryKey: ["areas", page, limit],
    queryFn: () => AdminAreasService.getAreas(page!, limit!),
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const createAreaMutation = useMutation({
    mutationFn: (data: AreaInput) => {
      if (!token) throw new Error("No access token");
      return AdminAreasService.createArea(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      toast.success("Area created successfully!");
    },
    onError: (error) => {
      console.error("Error creating area:", error);
      toast.error("Failed to create area");
    },
  });

  const deleteAreaMutation = useMutation({
    mutationFn: (areaId: number) => {
      if (!token) throw new Error("No access token");
      return AdminAreasService.deleteArea(areaId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      toast.success("Area deleted successfully!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete area.");
    },
  });

  const updateAreaMutation = useMutation({
    mutationFn: ({ areaId, data }: { areaId: number; data: AreaInput }) => {
      if (!token) throw new Error("No access token");
      return AdminAreasService.updateArea(areaId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      toast.success("Area updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating area:", error);
      toast.error("Failed to update area");
    },
  });

  return {
    areasData,
    createAreaMutation,
    deleteAreaMutation,
    updateAreaMutation,
  };
}
