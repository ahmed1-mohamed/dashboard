"use client";

import { useQuery, keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AdminBookingsService } from "@/services/AdminBookingsService";
import { toast } from "sonner";

export default function useDashboardAdminBookingsData() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const bookingsData = useQuery({
    queryKey: ["bookings"],
    queryFn: () => AdminBookingsService.getBookings(),
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  // Confirm booking mutation
  const confirmMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      await AdminBookingsService.confirmBooking(bookingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking confirmed successfully!");
    },
    onError: (error: any) => {
      console.error(error);
      toast.error("Failed to confirm booking.");
    },
  });

  // Decline booking mutation
  const declineMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      await AdminBookingsService.declineBooking(bookingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking declined successfully!");
    },
    onError: (error: any) => {
      console.error(error);
      toast.error("Failed to decline booking.");
    },
  });

  const handleConfirm = (bookingId: number) => {
    confirmMutation.mutate(bookingId);
  };

  const handleDecline = (bookingId: number) => {
    declineMutation.mutate(bookingId);
  };

  return {
    bookingsData,
    handleConfirm,
    handleDecline,
    isConfirming: confirmMutation.isPending,
    isDeclining: declineMutation.isPending,
  };
}
