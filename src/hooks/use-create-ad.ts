"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { fetchDevelopers, fetchProjectsByDeveloper, fetchPropertiesByDeveloper } from "@/data/api-client";

export function useCreateAdData(isOpen: boolean, developerSearch: string, country: string, projectSearch?: string, propertySearch?: string, developerId?: string) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [developers, setDevelopers] = useState<any[]>([]);
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);
  const [properties, setProperties] = useState<{ id: number; name: string }[]>([]);
  const [developerPage, setDeveloperPage] = useState(1);
  const [developerPerPage, setDeveloperPerPage] = useState(15);
  const [developerHasMore, setDeveloperHasMore] = useState(true);
  const developerHasMoreRef = useRef(true);
  useEffect(() => {
    developerHasMoreRef.current = developerHasMore;
  }, [developerHasMore]);
  const [loading, setLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [propertiesLoading, setPropertiesLoading] = useState(false);

  const loadDevelopers = useCallback(async (
    page: number,
    perPage: number,
    search?: string,
    isNewSearch = false,
  ) => {
    if (!token) return;
    if (!isNewSearch && !developerHasMoreRef.current) return;

    setLoading(true);
    try {
      const data:any = await fetchDevelopers(token, page, perPage, search, undefined, country);

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
      setLoading(false);
    }
  }, [token, country]);

  const loadProjects = useCallback(async (devId: number, search?: string) => {
    if (!token) return;
    setProjectsLoading(true);
    try {
      const data:any = await fetchProjectsByDeveloper(
        token,
        devId,
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
  }, [token]);

  const loadProperties = useCallback(async (devId: number, search?: string) => {
    if (!token) return;
    setPropertiesLoading(true);
    try {
      const data:any = await fetchPropertiesByDeveloper(
        token,
        devId,
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
  }, [token]);

  useEffect(() => {
    if (!isOpen) {
      setDeveloperPage(1);
      setDeveloperPerPage(15);
      setDeveloperHasMore(true);
      setDevelopers([]);
      setProjects([]);
      setProperties([]);
    }
  }, [isOpen]);



  useEffect(() => {
    if (isOpen && token) {
      loadDevelopers(1, 15, developerSearch || "", true);
    }
  }, [developerSearch, isOpen, token, loadDevelopers]);

  useEffect(() => {
    if (developerId && projectSearch !== undefined) {
      loadProjects(parseInt(developerId), projectSearch || "");
    }
  }, [developerId, projectSearch, loadProjects]);

  useEffect(() => {
    if (developerId && propertySearch !== undefined) {
      loadProperties(parseInt(developerId), propertySearch || "");
    }
  }, [developerId, propertySearch, loadProperties]);

  return {
    developers,
    projects,
    properties,
    loading,
    projectsLoading,
    propertiesLoading,
    developerPage,
    setDeveloperPage,
    developerPerPage,
    setDeveloperPerPage,
    developerHasMore,
    loadDevelopers,
    loadProjects,
    loadProperties,
  };
}