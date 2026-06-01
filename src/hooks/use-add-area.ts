"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AdminCitiesService } from "@/services/AdminCitiesService";
import { AdminDldAreasService } from "@/services/AdminDldAreasService";
import { CitiesDataType, DldAreasDataType } from "@/types";

export function useAddAreaData(isOpen: boolean) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const { data: cities = [], isLoading: citiesLoading } = useQuery<CitiesDataType[]>({
    queryKey: ["cities"],
    queryFn: () => AdminCitiesService.getAllCities(),
    enabled: !!token && isOpen,
  });

  const { data: dldAreas = [], isLoading: dldAreasLoading } = useQuery<DldAreasDataType[]>({
    queryKey: ["dldAreas"],
    queryFn: () => AdminDldAreasService.getAllDldAreas(),
    enabled: !!token && isOpen,
  });

  return {
    cities,
    dldAreas,
    isLoading: citiesLoading || dldAreasLoading,
  };
}
