"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchDashboardStats } from "@/data/api-client";

export default function useDashboardAdminAnalyticsData() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const dashboardStatsData = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => fetchDashboardStats(token!),
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  return {
    dashboardStatsData,
  };
}
