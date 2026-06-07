"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AdminFeaturesService } from "@/services/AdminFeaturesService";
import { FeaturesDataType } from "@/types";
import { unpackAndMapFeaturesResponse } from "@/app/admin/features/utils/map-feature";
import { useMemo } from "react";

export default function useDashboardAdminFeatures() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const featuresQuery = useQuery({
    queryKey: ["features"],
    queryFn: () => AdminFeaturesService.getFeatures(),
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  });

  const editFeatureMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FeaturesDataType }) =>
      AdminFeaturesService.updateFeature(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
    },
  });

  const createFeatureMutation = useMutation({
    mutationFn: (data: FeaturesDataType) => AdminFeaturesService.createFeature(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
    },
  });

  const deleteFeatureMutation = useMutation({
    mutationFn: (id: number) => AdminFeaturesService.deleteFeature(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
    },
  });

  const features = useMemo(() => {
    return unpackAndMapFeaturesResponse(featuresQuery.data);
  }, [featuresQuery.data]);

  return {
    featuresData: featuresQuery,
    features,
    editFeatureMutation,
    createFeatureMutation,
    deleteFeatureMutation,
  };
}
