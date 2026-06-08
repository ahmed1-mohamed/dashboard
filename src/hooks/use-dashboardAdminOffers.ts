"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AdminOffersService } from "@/services/AdminOffersService";

export default function useDashboardAdminOffersData(
  page?: number,
  limit?: number,
  filters?: {
    status?: string;
    search?: string;
  },
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const offersData = useQuery<{ data: any[] }>({
    queryKey: ["offers", page, limit, filters],
    queryFn: async () => {
      const res: any = await AdminOffersService.getOffers(page!, limit!, filters!);
      return res.data;
    },
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const totalsData = useQuery<{
    total_offers?: number;
    active_offers?: number;
    total_views?: number;
    total_clicks?: number;
  }>({
    queryKey: ["offersTotals"],
    queryFn: async () => {
      const res: any = await AdminOffersService.getOffersTotals();
      return res.data;
    },
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  return {
    offersData,
    totalsData,
  };
}
