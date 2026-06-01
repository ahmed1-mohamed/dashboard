"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { editLocation } from "@/data/api-client";

interface EditLocationData {
  location_name_en: string;
  location_name_ar: string;
  area_id: number;
  city_id: number;
  google_map_link: string;
  north_side: string;
  south_side: string;
  east_side: string;
  west_side: string;
  landmark?: string[];
  description: string;
  latitude?: number;
  longitude?: number;
}

export function useLocationActions() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Update location mutation
  const updateMutation = useMutation({
    mutationFn: async ({ locationId, data }: { locationId: number; data: EditLocationData }) => {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Not authenticated");
      return editLocation(locationId, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      toast.success("Location updated successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message ||
                          error?.message ||
                          "Failed to update location";
      toast.error(errorMessage);
    },
  });

  return {
    updateLocation: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}