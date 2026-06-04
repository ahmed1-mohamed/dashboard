"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { AxiosResponse } from "axios";
import { AdminDevelopersService } from "@/features/developers/services/AdminDevelopersService";
import type { DeveloperDataType } from "@/types";

export default function useDashboardAdminProjectsCreateData(
  countryId?: number,
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const developersData = useQuery<DeveloperDataType[]>({
    queryKey: ["developers", countryId],
    queryFn: async () => {
      const response = (await AdminDevelopersService.getDevelopersPaginated(
        1,
        100,
        undefined,
        undefined,
        countryId ? countryId.toString() : undefined,
      )) as AxiosResponse<DeveloperDataType[]>;
      return response.data;
    },
    retry: false,
    enabled: !!token,
  });

  return {
    developersData,
  };
}
