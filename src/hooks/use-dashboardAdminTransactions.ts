"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchTransactions } from "@/data/api-client";

export default function useDashboardAdminTransactionsData() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const transactionsData = useQuery<any[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res: any = await fetchTransactions(token!);
      return res.data;
    },
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  return {
    transactionsData,
  };
}
