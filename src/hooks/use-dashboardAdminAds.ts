"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AdminAdsService } from "@/services/AdminAdsService";

export default function useDashboardAdminAdsData(
  page?: number,
  limit?: number,
  filters?: {
    status?: string;
    platform?: string;
    format?: string;
    search?: string;
  },
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const adsData = useQuery<{ data: any[] }>({
    queryKey: ["ads", page, limit, filters],
    queryFn: async () => {
      const res: any = await AdminAdsService.getAds(page!, limit!, filters!);

      return res.data;
    },
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const totalsData = useQuery<{
    total_ads?: number;
    active_ads?: number;
  }>({
    queryKey: ["adsTotals"],
    queryFn: async () => {
      const res: any = await AdminAdsService.getAdsTotals();
      return res.data;
    },
    retry: false,
    enabled: !!token,
  });

  return {
    adsData,
    totalsData,
  };
}
