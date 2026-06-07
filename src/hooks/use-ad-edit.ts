"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
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
  ad: Ad | null,
  isOpen: boolean,
  country: string,
  developerId?: string,
  linkTo?: string,
) {
  const [loadingAd, setLoadingAd] = useState(false);
  const [adData, setAdData] = useState<any>(null);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [developerSearch, setDeveloperSearch] = useState("");
  const [developerPage, setDeveloperPage] = useState(1);
  const [developerPerPage, setDeveloperPerPage] = useState(15);
  const [developerHasMore, setDeveloperHasMore] = useState(true);
  const [developersLoading, setDevelopersLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const [propertySearch, setPropertySearch] = useState("");
  const [debouncedDeveloperSearch, setDebouncedDeveloperSearch] = useState("");
  const [debouncedProjectSearch, setDebouncedProjectSearch] = useState("");
  const [debouncedPropertySearch, setDebouncedPropertySearch] = useState("");

  const { data: session } = useSession();

  // Debounce developer search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDeveloperSearch(developerSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [developerSearch]);

  // Debounce project search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProjectSearch(projectSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [projectSearch]);

  // Debounce property search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPropertySearch(propertySearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [propertySearch]);

  // Load ad data when modal opens and ad changes
  useEffect(() => {
    if (isOpen && ad) {
      loadAdData(ad);
      loadDevelopers(1, 15, "", true, country);
    }
  }, [isOpen, ad]);

  // Load developers when country changes
  useEffect(() => {
    const countryId =
      country === "Egypt"
        ? "1"
        : country === "UAE"
          ? "2"
          : country === "Oman"
            ? "3"
            : "1";
    setDeveloperPage(1);
    setDeveloperHasMore(true);
    setDevelopers([]);
    loadDevelopers(1, 15, "", true, countryId);
  }, [country]);

  // Effect for debounced developer search
  useEffect(() => {
    const countryId =
      country === "Egypt"
        ? "1"
        : country === "UAE"
          ? "2"
          : country === "Oman"
            ? "3"
            : "1";
    if (debouncedDeveloperSearch !== "") {
      loadDevelopers(1, 15, debouncedDeveloperSearch, true, countryId);
    } else if (developerSearch === "") {
      loadDevelopers(1, 15, "", true, countryId);
    }
  }, [debouncedDeveloperSearch, developerSearch, country]);

  // Reset searches when linkTo changes
  useEffect(() => {
    setProjectSearch("");
    setPropertySearch("");
    setDebouncedProjectSearch("");
    setDebouncedPropertySearch("");
  }, [linkTo]);

  // Effect for debounced project search
  useEffect(() => {
    if (developerId && debouncedProjectSearch !== "") {
      loadProjects(parseInt(developerId), debouncedProjectSearch);
    } else if (developerId && projectSearch === "") {
      loadProjects(parseInt(developerId), "");
    }
  }, [debouncedProjectSearch, developerId, projectSearch]);

  // Effect for debounced property search
  useEffect(() => {
    if (developerId && debouncedPropertySearch !== "") {
      loadProperties(parseInt(developerId), debouncedPropertySearch);
    } else if (developerId && propertySearch === "") {
      loadProperties(parseInt(developerId), "");
    }
  }, [debouncedPropertySearch, developerId, propertySearch]);

  // Load ad details
  const loadAdData = useCallback(
    async (ad: any) => {
      if (!session?.user?.accessToken || !ad) return;

      setLoadingAd(true);
      try {
        const response = await fetchAd(ad.creative_id, session.user.accessToken);
        const actualAdData = response?.data || response;
        setAdData(actualAdData);
        return actualAdData;
      } catch (e: any) {
        console.error(e);
        throw e;
      } finally {
        setLoadingAd(false);
      }
    },
    [session],
  );

  // Load developers
  const loadDevelopers = useCallback(
    async (
      page: number,
      perPage: number,
      search?: string,
      isNewSearch = false,
      countryId?: string,
    ) => {
      if (!session?.user?.accessToken) return;
      if (!isNewSearch && !developerHasMore) return;

      setDevelopersLoading(true);
      try {
        const data: any = await fetchDevelopers(
          session.user.accessToken,
          page,
          perPage,
          search,
          undefined,
          countryId,
        );

        const devItems = Array.isArray(data) ? data : (data?.data || data?.developers || []);
        const mappedDevelopers = devItems.map((dev: any) => ({
          id: dev.developer_id,
          name: dev.developer_name || dev.name,
        }));

        if (isNewSearch) {
          setDevelopers(mappedDevelopers);
        } else {
          setDevelopers((prev) => [...prev, ...mappedDevelopers]);
        }

        setDeveloperHasMore(mappedDevelopers.length === perPage);
      } catch (error) {
        console.error("Error fetching developers:", error);
      } finally {
        setDevelopersLoading(false);
      }
    },
    [session, developerHasMore],
  );

  // Load projects
  const loadProjects = useCallback(
    async (developerId: number, search?: string) => {
      if (!session?.user?.accessToken) return;
      setProjectsLoading(true);
      try {
        const data: any = await fetchProjectsByDeveloper(
          session.user.accessToken,
          developerId,
          1,
          "100",
          search,
        );
        const projItems = Array.isArray(data) ? data : (data?.data || data?.projects || []);
        const mappedProjects = projItems.map((proj: any) => ({
          id: proj.project_id || proj.id,
          name: proj.project_name || proj.name || proj.title,
        }));
        setProjects(mappedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setProjectsLoading(false);
      }
    },
    [session],
  );

  // Load properties
  const loadProperties = useCallback(
    async (developerId: number, search?: string) => {
      if (!session?.user?.accessToken) return;
      setPropertiesLoading(true);
      try {
        const data: any = await fetchPropertiesByDeveloper(
          session.user.accessToken,
          developerId,
          "active",
          "100",
          search,
        );
        const propItems = Array.isArray(data) ? data : (data?.data || data?.properties || []);
        const mappedProperties = propItems.map((prop: any) => ({
          id: prop.property_no || prop.property_name || prop.id,
          name: prop.property_name || prop.title || prop.property_no,
        }));
        setProperties(mappedProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setPropertiesLoading(false);
      }
    },
    [session],
  );

  return {
    loadingAd,
    adData,
    developers,
    developerSearch,
    setDeveloperSearch,
    developerPage,
    setDeveloperPage,
    developerPerPage,
    setDeveloperPerPage,
    developerHasMore,
    developersLoading,
    projects,
    properties,
    projectsLoading,
    propertiesLoading,
    projectSearch,
    setProjectSearch,
    propertySearch,
    setPropertySearch,
    debouncedDeveloperSearch,
    debouncedProjectSearch,
    debouncedPropertySearch,
    loadAdData,
    loadDevelopers,
    loadProjects,
    loadProperties,
  };
}
