"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchDeveloperDetails } from "@/data/api-client";

export default function useDeveloperDetails(
  developerId: number | null | undefined,
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const developerData = useQuery({
    queryKey: ["developerDetails", developerId],
    queryFn: () => fetchDeveloperDetails(developerId!, token!),
    retry: false,
    enabled: !!token && !!developerId,
  });

  return {
    developerData,
  };
}
