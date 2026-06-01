"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  fetchBuildingsDetails,
  fetchProjectsPaginated,
  fetchCities,
  fetchAreas,
} from "@/data/api-client";

export function useEditBuildingData(
  buildingId: number | null,
  isOpen: boolean,
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [buildingData, setBuildingData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !isOpen) return;

    const loadData = async () => {
      try {
        const [projectsData, citiesData, areasData]: any[] = await Promise.all([
          fetchProjectsPaginated(token, 1, 100, ""),
          fetchCities(token),
          fetchAreas(token),
        ]);
        setProjects(projectsData.data || []);
        setCities(citiesData.data || []);
        setAreas(areasData.data || []);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [token, isOpen]);

  useEffect(() => {
    if (!token || !isOpen || !buildingId) return;

    const loadBuilding = async () => {
      setLoading(true);
      try {
        const data = await fetchBuildingsDetails(buildingId, token);
        setBuildingData(data);
      } catch (error) {
        console.error("Error loading building:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBuilding();
  }, [token, isOpen, buildingId]);

  return {
    buildingData,
    projects,
    cities,
    areas,
    loading,
  };
}
