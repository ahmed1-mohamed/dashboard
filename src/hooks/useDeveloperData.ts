"use client";

import { AdminDevelopersService } from "@/features/developers/services/AdminDevelopersService";
import { useQuery } from "@tanstack/react-query";

interface DeveloperData {
  developer_id: number;
  name: string;
  email: string;
  phone_number: string;
  website: string;
  logo: string;
  description: string;
  status: string;
  is_top: number;
}

interface DeveloperApiResponse {
  status: boolean;
  message?: string;
  data: DeveloperData;
}

export function useDeveloperData(developerId: number | null) {
  const developerQuery = useQuery<DeveloperApiResponse>({
    queryKey: ["developerDetails", developerId],
    queryFn: async (): Promise<DeveloperApiResponse> => {
      const response = await AdminDevelopersService.getDeveloper(
        Number(developerId),
      );
      return response as DeveloperApiResponse;
    },
    enabled: !!developerId,
    retry: false,
  });

  return {
    developer: developerQuery.data?.data ?? null,
    isLoading: developerQuery.isLoading,
    isError: developerQuery.isError,
    error: developerQuery.error,
  };
}
