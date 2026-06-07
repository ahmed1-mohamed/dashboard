"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { AdminBookingsService } from "@/services/AdminBookingsService";
import { unpackReservationsResponse, mapReservation } from "@/features/reservations/utils/map-reservation";
import { useMemo } from "react";

interface BookingFilters {
  page?: number;
  perPage?: number;
  search?: string;
  country?: string;
  status?: string;
  type?: string;
  expiryDate?: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// export default function useDashboardAdminBookingsData(
//   filters: BookingFilters = {},
// ) {
//   const { data: session } = useSession();
//   const token = session?.user?.accessToken;
//   const queryClient = useQueryClient();

//   const {
//     page = 1,
//     perPage = 10,
//     search,
//     country,
//     status,
//     type,
//     expiryDate,
//   } = filters;

//   const bookingsData = useQuery({
//     queryKey: ["bookings", page, perPage, search, country, status, type, expiryDate],
//     queryFn: () => AdminBookingsService.getBookings(page, perPage, { search, country, status, type, expiryDate }),
//     retry: false,
//     enabled: !!token,
//     staleTime: 5 * 60 * 1000,
//     placeholderData: keepPreviousData,
//   });

//   const confirmMutation = useMutation({
//     mutationFn: async (bookingId: number) => {
//       await AdminBookingsService.confirmBooking(bookingId);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["bookings"] });
//       toast.success("Booking confirmed successfully!");
//     },
//     onError: (error: unknown) => {
//       let errorMessage = "Failed to confirm booking.";
//       if (error instanceof Error) {
//         errorMessage = error.message;
//       } else if (typeof error === "object" && error !== null) {
//         const apiError = error as ApiError;
//         errorMessage = apiError.response?.data?.message || error.message || errorMessage;
//       }
//       toast.error(errorMessage);
//     },
//   });

//   const declineMutation = useMutation({
//     mutationFn: async (bookingId: number) => {
//       await AdminBookingsService.declineBooking(bookingId);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["bookings"] });
//       toast.success("Booking declined successfully!");
//     },
//     onError: (error: unknown) => {
//       let errorMessage = "Failed to decline booking.";
//       if (error instanceof Error) {
//         errorMessage = error.message;
//       } else if (typeof error === "object" && error !== null) {
//         const apiError = error as ApiError;
//         errorMessage = apiError.response?.data?.message || error.message || errorMessage;
//       }
//       toast.error(errorMessage);
//     },
//   });

//   return {
//     bookingsData,
//     handleConfirm: confirmMutation.mutate,
//     handleDecline: declineMutation.mutate,
//     isConfirming: confirmMutation.isPending,
//     isDeclining: declineMutation.isPending,
//   };
// }

export default function useDashboardAdminBookingsData(
  filters: BookingFilters = {},
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const {
    page = 1,
    perPage = 10,
    search,
    country,
    status,
    type,
    expiryDate,
  } = filters;

  const bookingsData = useQuery({
    queryKey: [
      "bookings",
      page,
      perPage,
      search,
      country,
      status,
      type,
      expiryDate,
    ],
    queryFn: () =>
      AdminBookingsService.getBookings(page, perPage, {
        search,
        country,
        status,
        type,
        expiryDate,
      }),
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

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

  const { itemsArray, totalItems } = useMemo(() => {
    return unpackReservationsResponse(bookingsData.data);
  }, [bookingsData.data]);

  const bookings = useMemo(() => itemsArray.map(mapReservation), [itemsArray]);

  return {
    bookingsData,
    bookings,
    totalBookings: totalItems,
    handleConfirm: confirmMutation.mutate,
    handleDecline: declineMutation.mutate,
    isConfirming: confirmMutation.isPending,
    isDeclining: declineMutation.isPending,
  };
}
