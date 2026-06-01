"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchTenants } from "@/data/api-client";
import { TenantDataType } from "@/types";

export default function useDashboardAdminTenantsData() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const tenantsData = useQuery<TenantDataType[]>({
    queryKey: ["tenants"],
    queryFn: async () => {
      const res: any = await fetchTenants(token!);
      return res.data;
    },
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  return {
    tenantsData,
  };
}
