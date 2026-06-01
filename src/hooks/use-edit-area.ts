"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchAreaDetails, fetchDldAreas } from "@/data/api-client";

export function useEditAreaData(areaId: number | null, isOpen: boolean) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const { data: dldAreasData, isLoading: dldLoading } = useQuery({
    queryKey: ["dldAreas"],
    queryFn: () => fetchDldAreas(token!),
    enabled: !!token && isOpen,
  });

  const { data: areaData, isLoading: areaLoading } = useQuery({
    queryKey: ["AreaDetails", areaId],
    queryFn: () => fetchAreaDetails(areaId!, token!),
    enabled: !!token && !!areaId && isOpen,
  });

  const dldAreas = dldAreasData || [];
  const loading = areaLoading || dldLoading;

  return {
    areaData,
    dldAreas,
    loading,
  };
}