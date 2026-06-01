"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AdminAreasService } from "@/services/AdminAreasService";

export default function useAreasByCountry(country: string) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const areasData = useQuery({
    queryKey: ["areas", country],
    queryFn: () => AdminAreasService.getAreasByCountry(country),
    retry: false,
    enabled: !!token && !!country,
  });

  return areasData;
}