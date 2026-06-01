"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AdminCitiesService } from "@/services/AdminCitiesService";

export default function useCitiesByCountry(country: string) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const citiesData = useQuery({
    queryKey: ["cities", country],
    queryFn: () => AdminCitiesService.getCitiesByCountry(country),
    retry: false,
    enabled: !!token && !!country,
  });

  return citiesData;
}