"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  fetchCountries,
  fetchStatesByCountry,
  fetchCityDetails,
} from "@/data/api-client";

export function useEditCityData(
  cityId: number | null,
  isOpen: boolean,
  countryId?: string,
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const { data: countriesData, isLoading: countriesLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: () => fetchCountries(token!),
    enabled: !!token && isOpen,
  });

  const { data: cityData, isLoading: cityLoading } = useQuery({
    queryKey: ["CityDetails", cityId],
    queryFn: () => fetchCityDetails(cityId!, token!),
    enabled: !!token && !!cityId && isOpen,
  });

  const { data: statesData, isLoading: statesLoading } = useQuery({
    queryKey: ["states", countryId],
    queryFn: () => fetchStatesByCountry(countryId!, token!),
    enabled: !!token && !!countryId && isOpen,
  });

  const countries = countriesData! || [];
  const states = statesData! || [];
  const loading = countriesLoading || cityLoading || statesLoading;

  return {
    cityData,
    countries,
    states,
    loading,
  };
}
