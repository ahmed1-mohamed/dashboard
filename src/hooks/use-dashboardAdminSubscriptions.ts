"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AdminSubscriptionsService } from "@/services/AdminSubscriptionsService";

export default function useDashboardAdminSubscriptions() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const packagesQuery = useQuery({
    queryKey: ["subscriptions", "packages"],
    queryFn: () => AdminSubscriptionsService.getPackages(),
    enabled: !!token,
  });

  const featuresQuery = useQuery({
    queryKey: ["subscriptions", "features"],
    queryFn: () => AdminSubscriptionsService.getFeatures(),
    enabled: !!token,
  });

  const deletePackageMutation = useMutation({
    mutationFn: (packageId: number) => AdminSubscriptionsService.deletePackage(packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "packages"] });
    },
  });

  const createFeatureMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => AdminSubscriptionsService.createFeature(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "features"] });
    },
  });

  const deleteFeatureMutation = useMutation({
    mutationFn: (featureId: number) => AdminSubscriptionsService.deleteFeature(featureId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "features"] });
    },
  });

  return {
    packagesQuery,
    featuresQuery,
    deletePackageMutation,
    createFeatureMutation,
    deleteFeatureMutation,
  };
}