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
      const response = (await AdminDevelopersService.getDevelopersByCountry(
        1,
        100,
        undefined,
        undefined,
        countryId,
      )) as AxiosResponse<DeveloperDataType[]>;
      return response.data;
    },
    retry: false,
    enabled: !!token && !!countryId,
  });

  return {
    developersData,
  };
}
