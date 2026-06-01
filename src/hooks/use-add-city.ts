"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { fetchCountries, fetchStatesByCountry } from "@/data/api-client";

export function useAddCityData(isOpen: boolean) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !isOpen) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const countriesData:any = await fetchCountries(token);
        setCountries(countriesData.data || []);
      } catch (error) {
        console.error("Error loading countries:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, isOpen]);

  const loadStates = async (countryName: string) => {
    if (!token) return;
    try {
      const statesData:any = await fetchStatesByCountry(countryName, token);
      // Deduplicate states by ID to fix React key error
      const uniqueStates = statesData.data.filter(
        (state: any, index: number, self: any[]) =>
          index === self.findIndex((s: any) => s.id === state.id),
      );
      setStates(uniqueStates);
    } catch (error) {
      console.error("Error loading states:", error);
    }
  };

  return {
    countries,
    states,
    loading,
    loadStates,
  };
}