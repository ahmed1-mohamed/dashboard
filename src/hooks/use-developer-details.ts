"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { AdminDevelopersService } from "@/features/developers/services/AdminDevelopersService";

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
  features: any[];
  project: any[];
  paymentPlans?: any[];
  userDeveloperRelationships: any[];
  active_projects_count?: number;
  active_units_count?: number;
  available_units_count?: number;
  booked_units_count?: number;
  completed_projects_count?: number;
  total_units_count?: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface ApiResponse {
  status: boolean;
  message: string;
  data: DeveloperData;
}

export function useDeveloperDetails(developerId: number | null) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const developerQuery = useQuery<ApiResponse>({
    queryKey: ["developerDetails", developerId],
    queryFn: async () => {
      const res: any = await AdminDevelopersService.getDeveloper(
        Number(developerId),
      );

      return res.data;
    },
    enabled: !!token && !!developerId,
    retry: false,
  });

  const toggleTopMutation = useMutation({
    mutationFn: async (isTop: boolean) => {
      if (!token || !developerQuery.data!)
        throw new Error("Missing token or developer data");

      const formData = new FormData();
      const developer: any = developerQuery.data;
      formData.append("name", developer.name);
      formData.append("email", developer.email || "");
      formData.append("phone_number", developer.phone_number || "");
      formData.append("website", developer.website || "");
      formData.append("description", developer.description || "");
      formData.append("status", developer.status || "active");
      formData.append("is_top", isTop ? "1" : "0");

      return AdminDevelopersService.updateDeveloper(
        Number(developerId),
        formData,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["developerDetails", developerId],
      });
      queryClient.invalidateQueries({ queryKey: ["developers"] });
      toast.success("Developer top status updated successfully!");
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error?.message || "Failed to update developer top status");
    },
  });

  return {
    developer: developerQuery.data?.data ? developerQuery.data.data : developerQuery.data,
    isLoading: developerQuery.isLoading,
    isError: developerQuery.isError,
    error: developerQuery.error,
    toggleTop: toggleTopMutation.mutate,
    isTogglingTop: toggleTopMutation.isPending,
  };
}
