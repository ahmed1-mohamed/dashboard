"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AdminFeaturesService } from "@/services/AdminFeaturesService";
import { FeaturesDataType } from "@/types";

export function useAddFeatureData(isOpen: boolean) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const { data: features = [], isLoading } = useQuery<FeaturesDataType[]>({
    queryKey: ["features"],
    queryFn: async () => {
      const response = await AdminFeaturesService.getFeatures();
      return response.data;
    },
    enabled: !!token && isOpen,
    staleTime: 5 * 60 * 1000,
  });

  return {
    features,
    isLoading,
  };
}