"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAd,
  fetchDevelopers,
  fetchProjectsByDeveloper,
  fetchPropertiesByDeveloper,
} from "@/data/api-client";

interface Developer {
  id: number;
  name: string;
}

interface Project {
  id: number;
  name: string;
}

interface Property {
  id: number;
  name: string;
}

interface Ad {
  creative_id: string;
  creative_title: string;
  type: string;
  platform: "Web" | "Mobile" | "Both";
  country: string;
  location: string;
  views: number;
  clicks: number;
  ctr: string;
  status: string;
}

export function useAdEditData(
  adId: string | null,
  isOpen: boolean,
  country: string,
  developerId?: string,
  linkTo?: string,
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  // Local state for searches
  const [developerSearch, setDeveloperSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [propertySearch, setPropertySearch] = useState("");
  
  const [debouncedDeveloperSearch, setDebouncedDeveloperSearch] = useState("");
  const [debouncedProjectSearch, setDebouncedProjectSearch] = useState("");
  const [debouncedPropertySearch, setDebouncedPropertySearch] = useState("");

  // Debouncing logic
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedDeveloperSearch(developerSearch), 300);
    return () => clearTimeout(timer);
  }, [developerSearch]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedProjectSearch(projectSearch), 300);
    return () => clearTimeout(timer);
  }, [projectSearch]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedPropertySearch(propertySearch), 300);
    return () => clearTimeout(timer);
  }, [propertySearch]);

  // Reset dependent searches when linkTo changes
  useEffect(() => {
    setProjectSearch("");
    setPropertySearch("");
  }, [linkTo]);

  // Map country name to country ID expected by backend
  const countryId =
    country === "Egypt" ? "1" :
    country === "UAE" ? "2" :
    country === "Oman" ? "3" : "1";

  // 1. Fetch Ad Data
  const { data: adData, isLoading: loadingAd } = useQuery({
    queryKey: ["ad", adId],
    queryFn: async () => {
      const response = await fetchAd(adId!, token!);
      return (response as any)?.data || response;
    },
    enabled: !!adId && !!token && isOpen,
    staleTime: 5 * 60 * 1000,
  });

  // 2. Fetch Developers
  const { data: developersData, isLoading: developersLoading } = useQuery({
    queryKey: ["developers", countryId, debouncedDeveloperSearch],
    queryFn: async () => {
      const data: any = await fetchDevelopers(
        token!,
        1,
        100, // Fetch up to 100 for dropdown
        debouncedDeveloperSearch,
        undefined,
        countryId
      );
      const devItems = Array.isArray(data) ? data : (data?.data || data?.developers || []);
      return devItems.map((dev: any) => ({
        id: dev.developer_id,
        name: dev.developer_name || dev.name,
      })) as Developer[];
    },
    enabled: !!token && isOpen,
    staleTime: 5 * 60 * 1000,
  });

  // 3. Fetch Projects
  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects", developerId, debouncedProjectSearch],
    queryFn: async () => {
      const data: any = await fetchProjectsByDeveloper(
        token!,
        parseInt(developerId!),
        1,
        "100",
        debouncedProjectSearch
      );
      const projItems = Array.isArray(data) ? data : (data?.data || data?.projects || []);
      return projItems.map((proj: any) => ({
        id: proj.project_id || proj.id,
        name: proj.project_name || proj.name || proj.title,
      })) as Project[];
    },
    enabled: !!token && !!developerId && linkTo === "PROJECTS",
    staleTime: 5 * 60 * 1000,
  });

  // 4. Fetch Properties
  const { data: propertiesData, isLoading: propertiesLoading } = useQuery({
    queryKey: ["properties", developerId, debouncedPropertySearch],
    queryFn: async () => {
      const data: any = await fetchPropertiesByDeveloper(
        token!,
        parseInt(developerId!),
        "active",
        "100",
        debouncedPropertySearch
      );
      const propItems = Array.isArray(data) ? data : (data?.data || data?.properties || []);
      return propItems.map((prop: any) => ({
        id: prop.property_no || prop.property_name || prop.id,
        name: prop.property_name || prop.title || prop.property_no,
      })) as Property[];
    },
    enabled: !!token && !!developerId && linkTo === "PROPERTIES",
    staleTime: 5 * 60 * 1000,
  });

  return {
    loadingAd,
    adData,
    developers: developersData || [],
    developerSearch,
    setDeveloperSearch,
    developersLoading,
    developerHasMore: false, // Legacy fallback
    projects: projectsData || [],
    properties: propertiesData || [],
    projectsLoading,
    propertiesLoading,
    projectSearch,
    setProjectSearch,
    propertySearch,
    setPropertySearch,
  };
}
