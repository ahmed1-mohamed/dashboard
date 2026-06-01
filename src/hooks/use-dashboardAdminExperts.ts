"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { AdminExpertsService } from "@/services/AdminExpertsService";

export default function useDashboardAdminExpertsData(
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: string,
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const expertsData = useQuery({
    queryKey: ["experts", page, limit, search, status],
    queryFn: () =>
      AdminExpertsService.getExpertsPaginated(page, limit, search, status),
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const deleteExpertMutation = useMutation({
    mutationFn: (expertId: number) => {
      if (!token) throw new Error("No access token");
      return AdminExpertsService.deleteExpert(expertId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experts"] });
      toast.success("Expert deleted successfully!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete expert.");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ expertId, newStatus }: { expertId: number; newStatus: boolean }) => {
      return AdminExpertsService.toggleExpertStatus(expertId, newStatus ? "active" : "inactive");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experts"] });
      toast.success("Expert status updated successfully!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update expert status");
    },
  });

  return {
    expertsData,
    deleteExpertMutation,
    toggleStatusMutation,
  };
}
