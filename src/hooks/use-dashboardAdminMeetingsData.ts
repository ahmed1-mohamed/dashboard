"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { AdminMeetingsService } from "@/services/AdminMeetingsService";

export default function useDashboardAdminMeetingsData(
  page: number = 1,
  perPage: number = 10,
  filters?: {
    country?: string;
    status?: string;
    search?: string;
  },
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const meetingsData = useQuery({
    queryKey: ["meetingRequests", page, perPage, filters],
    queryFn: () => AdminMeetingsService.getMeetingRequests(page, perPage, filters),
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const confirmMeetingMutation = useMutation({
    mutationFn: (meetingId: number) => {
      if (!token) throw new Error("No access token");
      return AdminMeetingsService.confirmMeeting(meetingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetingRequests"] });
      toast.success("Meeting request approved successfully!");
    },
    onError: (error) => {
      console.error("Error confirming meeting:", error);
      toast.error("Failed to approve meeting request");
    },
  });

  const cancelMeetingMutation = useMutation({
    mutationFn: (meetingId: number) => {
      if (!token) throw new Error("No access token");
      return AdminMeetingsService.cancelMeeting(meetingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetingRequests"] });
      toast.success("Meeting request rejected successfully!");
    },
    onError: (error) => {
      console.error("Error canceling meeting:", error);
      toast.error("Failed to reject meeting request");
    },
  });

  return {
    meetingsData,
    confirmMeetingMutation,
    cancelMeetingMutation,
  };
}
