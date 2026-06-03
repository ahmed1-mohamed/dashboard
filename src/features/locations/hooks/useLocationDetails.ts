"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AdminLocationsService } from "@/services/AdminLocationsService";

export function useLocationDetails(locationId: number) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const locationData = useQuery({
    queryKey: ["location", locationId],
    queryFn: () => AdminLocationsService.getLocation(locationId),
    enabled: !!token && !!locationId,
    staleTime: 5 * 60 * 1000,
  });

  return { locationData };
}
