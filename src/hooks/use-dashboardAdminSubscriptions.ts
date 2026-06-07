"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AdminSubscriptionsService } from "@/services/AdminSubscriptionsService";

export default function useDashboardAdminSubscriptions(activeTab?: string) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const packagesQuery = useQuery({
    queryKey: ["subscriptions", "packages"],
    queryFn: () => AdminSubscriptionsService.getPackages(),
    enabled: !!token && activeTab === "developer-packages",
  });

  const customerPlansQuery = useQuery({
    queryKey: ["subscriptions", "customerPlans"],
    queryFn: () => AdminSubscriptionsService.getCustomerPlans(),
    enabled: !!token && activeTab === "customer-plans",
  });

  const deletePackageMutation = useMutation({
    mutationFn: (packageId: number) => AdminSubscriptionsService.deletePackage(packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "packages"] });
    },
  });

  const createCustomerPlanMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => AdminSubscriptionsService.createCustomerPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "customerPlans"] });
    },
  });

  const updateCustomerPlanMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Record<string, unknown> }) =>
      AdminSubscriptionsService.updateCustomerPlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "customerPlans"] });
    },
  });

  return {
    packagesQuery,
    customerPlansQuery,
    deletePackageMutation,
    createCustomerPlanMutation,
    updateCustomerPlanMutation,
  };
}