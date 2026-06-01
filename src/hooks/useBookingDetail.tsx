import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  fetchReservationDetails,
  confirmBooking,
  declineBooking,
} from "@/data/api-client";
import { toast } from "sonner";

interface Stage {
  id: number;
  name: string;
  status: "Complete" | "Rejected" | "Pending" | "Waiting";
  step: string;
  documents?: { name: string; url: string }[];
  offers?: { name: string; status: string; date: string }[];
  receipts?: { name: string; status: string; date: string }[];
  comments?: { author: string; date: string; text: string; reply?: string }[];
}

export default function useBookingDetail(reservationId: number | null) {
  const { data: session } = useSession();
  const token = session?.user.accessToken;
  const queryClient = useQueryClient();

  // Fetch reservation details using React Query
  const {
    data: reservationData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["reservation", reservationId],
    queryFn: () => fetchReservationDetails(token!, reservationId!),
    enabled: !!token && !!reservationId,
    retry: false,
  });

  // Approve mutation
  const mutationApprove = useMutation({
    mutationFn: async (data: { reservationId: number; comments: string }) => {
      await confirmBooking(data.reservationId, token!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reservation", reservationId],
      });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking approved successfully!");
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to approve booking",
      );
    },
  });

  // Decline mutation
  const mutationDecline = useMutation({
    mutationFn: async (data: { reservationId: number; comments: string }) => {
      await declineBooking(data.reservationId, token!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reservation", reservationId],
      });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking declined successfully!");
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to decline booking",
      );
    },
  });

  // Sales Offer upload mutation
  const mutationSalesOffer = useMutation({
    mutationFn: async (data: {
      reservationId: number;
      file: File;
      comments: string;
    }) => {
      const formData = new FormData();
      formData.append("reservation_id", String(data.reservationId));
      formData.append("file", data.file);
      formData.append("comments", data.comments);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_WITHOUT_DASHBOARD}/make-sales-offer`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to upload sales offer");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reservation", reservationId],
      });
      toast.success("Sales offer uploaded successfully!");
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload sales offer",
      );
    },
  });

  // SPA upload mutation
  const mutationSPA = useMutation({
    mutationFn: async (data: {
      reservationId: number;
      file: File;
      comments: string;
    }) => {
      const formData = new FormData();
      formData.append("reservation_id", String(data.reservationId));
      formData.append("file", data.file);
      formData.append("comments", data.comments);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_WITHOUT_DASHBOARD}/upload-sales-purchase`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to upload SPA");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reservation", reservationId],
      });
      toast.success("SPA uploaded successfully!");
    },
    onError: (error: unknown) => {
      console.error(
        error instanceof Error ? error.message : "Failed to upload SPA",
      );
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const isExpired = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    return expiry < now;
  };

  const getFileType = (file: File): "image" | "document" => {
    return file.type.startsWith("image/") ? "image" : "document";
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

  const getStages = (): Stage[] => {
    if (!reservationData) return [];

    return [
      {
        id: 1,
        name: "Identification",
        status: getStageStatus(
          "Identification",
          reservationData.reservation.reservation_status_type,
          reservationData.reservation.reservation_status,
        ),
        step: "Step 1 of 4",
        documents: reservationData.media.identification
          ? [
              {
                name: "Identification",
                url: reservationData.media.identification,
              },
            ]
          : [],
        comments: reservationData.reservation.comments
          ? [
              {
                author: `${reservationData.user.first_name} ${reservationData.user.last_name}`,
                date: reservationData.reservation.reservation_date,
                text: reservationData.reservation.comments,
              },
            ]
          : [],
      },
      {
        id: 2,
        name: "Sales Offer",
        status: getStageStatus(
          "Sales Offer",
          reservationData.reservation.reservation_status_type,
          reservationData.reservation.reservation_status,
        ),
        step: "Step 2 of 4",
        documents: reservationData.media.sales_offer
          ? [{ name: "Sales Offer", url: reservationData.media.sales_offer }]
          : [],
      },
      {
        id: 3,
        name: "Down Payment",
        status: getStageStatus(
          "Down payment",
          reservationData.reservation.reservation_status_type,
          reservationData.reservation.reservation_status,
        ),
        step: "Step 3 of 4",
        documents: reservationData.media.down_payment
          ? [
              {
                name: "Down Payment Receipt",
                url: reservationData.media.down_payment,
              },
            ]
          : [],
      },
      {
        id: 4,
        name: "SPA",
        status: getStageStatus(
          "Sales Purchase",
          reservationData.reservation.reservation_status_type,
          reservationData.reservation.reservation_status,
        ),
        step: "Step 4 of 4",
        documents: reservationData.media.sales_purchase
          ? [
              {
                name: "SPA Document",
                url: reservationData.media.sales_purchase,
              },
            ]
          : [],
      },
    ];
  };

  const stages = getStages();

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

  return {
    reservationData,
    isLoading,
    isError,
    error,
    refetch,
    mutationApprove,
    mutationDecline,
    mutationSalesOffer,
    mutationSPA,
    formatPrice,
    formatDate,
    getStatusColor,
    isExpiringSoon,
    isExpired,
    getFileType,
    stages,
    getStatusIcon,
    getStatusBadge,
    isApproving: mutationApprove.isPending,
    isRejecting: mutationDecline.isPending,
    isSalesOfferUploading: mutationSalesOffer.isPending,
    isSpaUploading: mutationSPA.isPending,
  };
}

// export default useBookingDetail;
