"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { AdminDevelopersService } from "@/services/AdminDevelopersService";
import { FormValues as DeveloperFormValues } from "@/validators/developerSchema";

export interface DeveloperData {
  developer_id: number;
  name: string;
  email: string;
  phone_number: string;
  website: string;
  logo: string;
  description: string;
  status: string;
  is_top: number;
}

export function useDeveloperActions() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Create developer mutation
  const createMutation = useMutation({
    mutationFn: async (data: DeveloperFormData) => {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Not authenticated");

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone_number", data.phone_number);
      if (data.website) formData.append("website", data.website);
      if (data.description) formData.append("description", data.description);
      if (data.status) formData.append("status", data.status);
      formData.append("is_top", data.is_top ? "1" : "0");

      // Handle logo upload
      if (data.logo) {
        formData.append("logo", data.logo);
      }

      return AdminDevelopersService.createDeveloper(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["developers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-developers"] });
      toast.success("Developer created successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "Failed to create developer";
      toast.error(errorMessage);
    },
  });

  // Update developer mutation
  const updateMutation = useMutation({
    mutationFn: async ({ developerId, data }: { developerId: number; data: DeveloperFormData }) => {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Not authenticated");

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone_number", data.phone_number);
      if (data.website) formData.append("website", data.website);
      if (data.description) formData.append("description", data.description);
      if (data.status) formData.append("status", data.status);
      formData.append("is_top", data.is_top ? "1" : "0");

      // Handle logo upload
      if (data.logo) {
        formData.append("logo", data.logo);
      }

      return AdminDevelopersService.updateDeveloper(developerId, formData);
    },
    onSuccess: (_, { developerId }) => {
      queryClient.invalidateQueries({ queryKey: ["developers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-developers"] });
      queryClient.invalidateQueries({ queryKey: [`developer-${developerId}`] });
      toast.success("Developer updated successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "Failed to update developer";
      toast.error(errorMessage);
    },
  });

  // Delete developer mutation
  const deleteMutation = useMutation({
    mutationFn: async (developerId: number) => {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Not authenticated");
      return AdminDevelopersService.deleteDeveloper(developerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["developers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-developers"] });
      toast.success("Developer deleted successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "Failed to delete developer";
      toast.error(errorMessage);
    },
  });

  // Toggle developer status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ developerId, status }: { developerId: number; status: string }) => {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Not authenticated");
      return AdminDevelopersService.toggleStatus(developerId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["developers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-developers"] });
      toast.success("Developer status updated successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "Failed to update developer status";
      toast.error(errorMessage);
    },
  });

  return {
    createDeveloper: createMutation.mutateAsync,
    updateDeveloper: updateMutation.mutateAsync,
    deleteDeveloper: deleteMutation.mutateAsync,
    toggleDeveloperStatus: toggleStatusMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isTogglingStatus: toggleStatusMutation.isPending,
  };
}

export interface DeveloperFormData {
  name: string;
  email: string;
  phone_number: string;
  website?: string;
  description?: string;
  status?: string;
  is_top: boolean;
  logo?: File;
}