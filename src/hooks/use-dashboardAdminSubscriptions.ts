"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AdminSubscriptionsService } from "@/services/AdminSubscriptionsService";


export function useDeveloperPackages() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const packagesQuery = useQuery({
    queryKey: ["subscriptions", "packages"],
    queryFn: () => AdminSubscriptionsService.getPackages(),
    enabled: !!token,
  });

  const deletePackageMutation = useMutation({
    mutationFn: (packageId: number) => AdminSubscriptionsService.deletePackage(packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "packages"] });
    },
  });

  const createPackageMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => AdminSubscriptionsService.createPackage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "packages"] });
    },
  });

  const updatePackageMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Record<string, unknown> }) =>
      AdminSubscriptionsService.updatePackage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "packages"] });
    },
  });

  return { packagesQuery, deletePackageMutation, createPackageMutation, updatePackageMutation };
}


export function useCustomerPlans() {
  const queryClient = useQueryClient();

  const customerPlansQuery = useQuery({
    queryKey: ["subscriptions", "customerPlans"],
    queryFn: () => AdminSubscriptionsService.getCustomerPlans(),
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

  const deleteCustomerPlanMutation = useMutation({
    mutationFn: (id: number | string) => AdminSubscriptionsService.deleteCustomerPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "customerPlans"] });
    },
  });

  return { customerPlansQuery, createCustomerPlanMutation, updateCustomerPlanMutation, deleteCustomerPlanMutation };
}


export function useFeatures() {
  const queryClient = useQueryClient();

  const badgesQuery = useQuery({
    queryKey: ["subscriptions", "badges"],
    queryFn: () => AdminSubscriptionsService.getBadges(),
  });

  const createBadgeMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => AdminSubscriptionsService.createBadge(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "badges"] });
    },
  });

  const updateBadgeMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Record<string, unknown> }) =>
      AdminSubscriptionsService.updateBadge(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "badges"] });
    },
  });

  const deleteBadgeMutation = useMutation({
    mutationFn: (id: number | string) => AdminSubscriptionsService.deleteBadge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "badges"] });
    },
  });

  return { badgesQuery, createBadgeMutation, updateBadgeMutation, deleteBadgeMutation };
}

export function useAddons() {
  const queryClient = useQueryClient();

  const addonsQuery = useQuery({
    queryKey: ["subscriptions", "addons"],
    queryFn: () => AdminSubscriptionsService.getAddons(),
  });

  const addonTypesQuery = useQuery({
    queryKey: ["subscriptions", "addonTypes"],
    queryFn: () => AdminSubscriptionsService.getAddonTypes(),
  });

  const createAddonMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => AdminSubscriptionsService.createAddon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "addons"] });
    },
  });

  const updateAddonMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Record<string, unknown> }) =>
      AdminSubscriptionsService.updateAddon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "addons"] });
    },
  });

  const deleteAddonMutation = useMutation({
    mutationFn: (id: number | string) => AdminSubscriptionsService.deleteAddon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "addons"] });
    },
  });

  return { addonsQuery, addonTypesQuery, createAddonMutation, updateAddonMutation, deleteAddonMutation };
}

export default function useDashboardAdminSubscriptions() {
  console.warn("useDashboardAdminSubscriptions default export is deprecated. Use specific hooks instead.");
  return {} as any;
}