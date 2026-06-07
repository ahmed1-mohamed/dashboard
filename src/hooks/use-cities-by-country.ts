"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/apiClient";

export default function useCitiesByCountry(country: string) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const citiesData = useQuery({
    queryKey: ["cities", country],
    queryFn: () => apiClient.get(`/dashboard/cities?per_page=1000${country ? `&country=${country}` : ''}`),
    retry: false,
    enabled: !!token,
  });

  return citiesData;
}