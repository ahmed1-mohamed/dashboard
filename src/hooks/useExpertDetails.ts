"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface ExpertReviewsResponse {
  data: any[];
}

interface ExpertTransactionsResponse {
  data: any[];
}

interface ExpertBookingsResponse {
  data: any[];
}

interface ExpertDetailsResponse {
  status: boolean;
  message: string;
  data: {
    expert_id: number;
    user_id: number;
    status: string;
    display_name: string;
    title: string | null;
    bio: string;
    years_experience: number;
    certifications: any[];
    website: string;
    linkedin: string;
    rate_per_30min_cents: number;
    currency: string;
    languages: any[];
    rating_avg: string;
    rating_count: number;
    photo_url: string | null;
    podcast: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    consultions: number;
    user: {
      user_id: number;
      first_name: string;
      last_name: string;
      email: string;
      phone_number: string;
      profile_picture: string | null;
    };
    countries: any[];
    categories: any[];
    availability_rules: unknown[];
    availability_exceptions: unknown[];
    packages: unknown[];
    wallet: unknown | null;
    reviews: unknown[];
    bookings: unknown[];
    experiences: any[];
  };
}

export default function useExpertDetails(
  expertId: number | null | undefined,
  activeTab?: string,
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const expertQuery = useQuery<ExpertDetailsResponse>({
    queryKey: ["expertDetails", expertId],
    queryFn: async () => {
      if (!token || !expertId) throw new Error("Not authenticated");
      const response = await fetch(
        `https://demoapi.p-adviser.com/api/dashboard/experts/${expertId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch expert details");
      return response.json();
    },
    enabled: !!token && !!expertId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const reviewsQuery = useQuery<ExpertReviewsResponse>({
    queryKey: ["expertReviews", expertId],
    queryFn: async () => {
      if (!token || !expertId) throw new Error("Not authenticated");
      const response = await fetch(
        `https://demoapi.p-adviser.com/api/dashboard/experts/${expertId}/reviews`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch reviews");
      return response.json();
    },
    enabled: !!token && !!expertId && activeTab === "reviews",
    staleTime: Infinity,
  });

  const transactionsQuery = useQuery<ExpertTransactionsResponse>({
    queryKey: ["expertTransactions", expertId],
    queryFn: async () => {
      if (!token || !expertId) throw new Error("Not authenticated");
      const response = await fetch(
        `https://demoapi.p-adviser.com/api/dashboard/experts/${expertId}/transactions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch transactions");
      return response.json();
    },
    enabled: !!token && !!expertId && activeTab === "transactions",
    staleTime: Infinity,
  });

  const bookingsQuery = useQuery<ExpertBookingsResponse>({
    queryKey: ["expertBookings", expertId],
    queryFn: async () => {
      if (!token || !expertId) throw new Error("Not authenticated");
      const response = await fetch(
        `https://demoapi.p-adviser.com/api/dashboard/experts/${expertId}/bookings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch bookings");
      return response.json();
    },
    enabled: !!token && !!expertId && activeTab === "upcoming-meetings",
    staleTime: Infinity,
  });

  return {
    expertData: expertQuery.data?.data,
    isLoading: expertQuery.isLoading,
    isError: expertQuery.isError,
    error: expertQuery.error,
    refetch: expertQuery.refetch,
    reviewsData: reviewsQuery.data,
    isLoadingReviews: reviewsQuery.isLoading,
    transactionsData: transactionsQuery.data,
    isLoadingTransactions: transactionsQuery.isLoading,
    bookingsData: bookingsQuery.data,
    isLoadingBookings: bookingsQuery.isLoading,
  };
}
