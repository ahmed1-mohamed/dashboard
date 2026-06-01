"use client";

import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DashboardAdminService } from "@/services/DashboardAdminService";
import { ApiResponse } from "@/lib/apiClient";

interface UseBookingDetailsParams {
  reservationId: number;
}

interface BookingDetailsResponse {
  reservation: any;
  media: any;
  user: any;
  paymentPlan: any;
  country: any;
  property: any;
}

interface UseBookingDetailsReturn {
  bookingData: BookingDetailsResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;

  approveMutation: ReturnType<
    typeof useMutation<ApiResponse<unknown>, unknown, string>
  >;

  declineMutation: ReturnType<
    typeof useMutation<ApiResponse<unknown>, unknown, string>
  >;

  uploadSalesOfferMutation: ReturnType<
    typeof useMutation<
      ApiResponse<unknown>,
      unknown,
      { file: File; comments: string }
    >
  >;

  uploadSPAMutation: ReturnType<
    typeof useMutation<
      ApiResponse<unknown>,
      unknown,
      { file: File; comments: string }
    >
  >;

  formatPrice: (price: string, currency?: string) => string;
  stages: any[];
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusBadge: (status: string) => React.ReactNode;
}
export default function useBookingDetails({
  reservationId,
}: UseBookingDetailsParams): UseBookingDetailsReturn {
  const queryClient = useQueryClient();

  // Fetch booking details
  const {
    data: bookingData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<BookingDetailsResponse>({
    queryKey: ["reservation", reservationId],
    queryFn: async () => {
      const res: any =
        await DashboardAdminService.getBookingDetails(reservationId);

      return res.data;
    },
    enabled: !!reservationId,
    retry: false,
  });

  // Approve/Confirm mutation
  const approveMutation = useMutation<ApiResponse<unknown>, unknown, string>({
    mutationFn: async (comments: string) => {
      const formData = new FormData();
      formData.append("status", "confirmed");
      if (comments) formData.append("comments", comments);
      return DashboardAdminService.confirmBooking(reservationId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reservation", reservationId],
      });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking approved successfully!");
    },
    onError: (error: unknown) => {
      const axiosError = error as { message?: string };
      console.error(axiosError);
      toast.error(axiosError?.message || "Failed to approve booking");
    },
  });

  // Decline/Reject mutation
  const declineMutation = useMutation<ApiResponse<unknown>, unknown, string>({
    mutationFn: async (comments: string) => {
      const formData = new FormData();
      formData.append("status", "cancelled");
      if (comments) formData.append("comments", comments);
      return DashboardAdminService.declineBooking(reservationId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reservation", reservationId],
      });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking declined successfully!");
    },
    onError: (error: unknown) => {
      const axiosError = error as { message?: string };
      console.error(axiosError);
      toast.error(axiosError?.message || "Failed to decline booking");
    },
  });

  // Sales Offer upload mutation
  const uploadSalesOfferMutation = useMutation<
    ApiResponse<unknown>,
    unknown,
    { file: File; comments: string }
  >({
    mutationFn: async ({
      file,
      comments,
    }: {
      file: File;
      comments: string;
    }) => {
      const formData = new FormData();
      formData.append("reservation_id", String(reservationId));
      formData.append("file", file);
      formData.append("comments", comments);
      return DashboardAdminService.uploadSalesOffer(formData) as Promise<
        ApiResponse<unknown>
      >;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reservation", reservationId],
      });
      toast.success("Sales offer uploaded successfully!");
    },
    onError: (error: unknown) => {
      const axiosError = error as { message?: string };
      console.error(axiosError);
      toast.error(axiosError?.message || "Failed to upload sales offer");
    },
  });

  // SPA upload mutation
  const uploadSPAMutation = useMutation<
    ApiResponse<unknown>,
    unknown,
    { file: File; comments: string }
  >({
    mutationFn: async ({
      file,
      comments,
    }: {
      file: File;
      comments: string;
    }) => {
      const formData = new FormData();
      formData.append("reservation_id", String(reservationId));
      formData.append("file", file);
      formData.append("comments", comments);
      return DashboardAdminService.uploadSPA(formData) as Promise<
        ApiResponse<unknown>
      >;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reservation", reservationId],
      });
      toast.success("SPA uploaded successfully!");
    },
    onError: (error: unknown) => {
      const axiosError = error as { message?: string };
      console.error(axiosError);
      toast.error(axiosError?.message || "Failed to upload SPA");
    },
  });

  const currencyMap: Record<string, string> = {
    Dollar: "USD",
    Euro: "EUR",
    Pound: "GBP",
    EGP: "EGP",
  };

  const formatPrice = (price: string, currency: string = "Dollar") => {
    const isoCode = currencyMap[currency] || "USD";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: isoCode,
    }).format(Number(price));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Complete":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "Rejected":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "Pending":
        return <Clock className="h-5 w-5 text-orange-600" />;
      default:
        return <Clock className="h-5 w-5 text-orange-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Complete: "bg-green-50 text-green-700 border-green-200",
      Rejected: "bg-red-50 text-red-700 border-red-200",
      Pending: "bg-orange-50 text-orange-700 border-orange-200",
      Waiting: "bg-orange-50 text-orange-700 border-orange-200",
    };
    return (
      <Badge className={`${styles[status as keyof typeof styles]} text-xs`}>
        {status}
      </Badge>
    );
  };

  const getStages = () => {
    if (!bookingData) return [];

    return [
      {
        id: 1,
        name: "Identification",
        status: getStageStatus(
          "Identification",
          bookingData.reservation.reservation_status_type,
          bookingData.reservation.reservation_status,
        ),
        step: "Step 1 of 4",
        documents: bookingData.media.identification
          ? [{ name: "Identification", url: bookingData.media.identification }]
          : [],
        comments: bookingData.reservation.comments
          ? [
              {
                author: `${bookingData.user.first_name} ${bookingData.user.last_name}`,
                date: bookingData.reservation.reservation_date,
                text: bookingData.reservation.comments,
              },
            ]
          : [],
      },
      {
        id: 2,
        name: "Sales Offer",
        status: getStageStatus(
          "Sales Offer",
          bookingData.reservation.reservation_status_type,
          bookingData.reservation.reservation_status,
        ),
        step: "Step 2 of 4",
        documents: bookingData.media.sales_offer
          ? [{ name: "Sales Offer", url: bookingData.media.sales_offer }]
          : [],
      },
      {
        id: 3,
        name: "Down Payment",
        status: getStageStatus(
          "Down payment",
          bookingData.reservation.reservation_status_type,
          bookingData.reservation.reservation_status,
        ),
        step: "Step 3 of 4",
        documents: bookingData.media.down_payment
          ? [
              {
                name: "Down Payment Receipt",
                url: bookingData.media.down_payment,
              },
            ]
          : [],
      },
      {
        id: 4,
        name: "SPA",
        status: getStageStatus(
          "Sales Purchase",
          bookingData.reservation.reservation_status_type,
          bookingData.reservation.reservation_status,
        ),
        step: "Step 4 of 4",
        documents: bookingData.media.sales_purchase
          ? [{ name: "SPA Document", url: bookingData.media.sales_purchase }]
          : [],
      },
    ];
  };

  const getStageStatus = (
    stageType: string,
    currentStatusType: string,
    currentStatus: string,
  ): "Complete" | "Rejected" | "Pending" | "Waiting" => {
    const statusMap: Record<string, number> = {
      Identification: 1,
      "Sales Offer": 2,
      "Down payment": 3,
      "Sales Purchase": 4,
    };

    const currentStageNum = statusMap[currentStatusType] || 0;
    const thisStageNum = statusMap[stageType] || 0;

    if (thisStageNum < currentStageNum) {
      return "Complete";
    } else if (thisStageNum === currentStageNum) {
      if (currentStatus === "confirmed") return "Complete";
      if (currentStatus === "cancelled") return "Rejected";
      return "Pending";
    }
    return "Waiting";
  };

  const stages = getStages();

  return {
    bookingData,
    isLoading,
    isError,
    error,
    refetch,
    approveMutation,
    declineMutation,
    uploadSalesOfferMutation,
    uploadSPAMutation,
    formatPrice,
    stages,
    getStatusIcon,
    getStatusBadge,
  };
}
