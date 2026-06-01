"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchPropertyDetails } from "@/data/api-client";

export default function usePropertyDetails(
  propertyId: number | null | undefined,
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const propertyData = useQuery({
    queryKey: ["propertyDetails", propertyId],
    queryFn: () => fetchPropertyDetails(propertyId!, token!),
    retry: false,
    enabled: !!token && !!propertyId,
  });

  return {
    propertyData,
  };
}
