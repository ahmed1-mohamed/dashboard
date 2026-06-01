"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export function useAddExpertData(isOpen: boolean) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [languages, setLanguages] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !isOpen) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [languagesRes, categoriesRes, countriesRes] = await Promise.all([
          fetch("https://demoapi.p-adviser.com/api/experts/languages", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://demoapi.p-adviser.com/api/experts/categories", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://demoapi.p-adviser.com/api/dashboard/countries", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!languagesRes.ok || !categoriesRes.ok || !countriesRes.ok) {
          throw new Error("Failed to fetch expert data");
        }

        const [languagesData, categoriesData, countriesData] = await Promise.all([
          languagesRes.json(),
          categoriesRes.json(),
          countriesRes.json(),
        ]);

        setLanguages(languagesData.data || []);
        setCategories(categoriesData.data || []);
        setCountries(countriesData.data || []);
      } catch (error) {
        console.error("Error loading expert data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, isOpen]);

  return {
    languages,
    categories,
    countries,
    loading,
  };
}