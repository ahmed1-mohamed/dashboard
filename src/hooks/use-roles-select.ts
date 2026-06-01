"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AdminRolesService } from "@/services/AdminRolesService";
import type { AxiosResponse } from "axios";
import type { RolesDataType } from "@/types";

export function useRolesSelect() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const { data: roles = [], isLoading } = useQuery<RolesDataType[]>({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await AdminRolesService.getRoles();
      const axiosResponse = response as AxiosResponse<{ data: RolesDataType[] }>;
      if (Array.isArray(axiosResponse?.data)) {
        return axiosResponse.data;
      }
      return axiosResponse?.data?.data || [];
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { roles, isLoading };
}
