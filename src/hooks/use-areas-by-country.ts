"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/apiClient";

export default function useAreasByCountry(country: string) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const areasData = useQuery({
    queryKey: ["areas", country],
    queryFn: () => apiClient.get(`/dashboard/areas?per_page=1000${country ? `&country=${country}` : ''}`),
    retry: false,
    enabled: !!token,
  });

  return areasData;
}