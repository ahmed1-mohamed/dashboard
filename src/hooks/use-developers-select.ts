"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AdminDevelopersService } from "@/features/developers/services/AdminDevelopersService";
import type { AxiosResponse } from "axios";
import type { DeveloperDataType } from "@/types";

export function useDevelopersSelect() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const { data: developers = [], isLoading } = useQuery<DeveloperDataType[]>({
    queryKey: ["developers", "all"],
    queryFn: async () => {
      // Fetch with high perPage to get all developers
      const response = await AdminDevelopersService.getDevelopersPaginated(
        1,
        1000,
        "",
        "",
      );
      // AxiosResponse with envelope { data: DeveloperDataType[], total, ... }
      const axiosResponse = response as AxiosResponse<{
        data: DeveloperDataType[];
        total: number;
        page: number;
        per_page: number;
        total_pages: number;
      }>;
      return axiosResponse?.data?.data || [];
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { developers, isLoading };
}
