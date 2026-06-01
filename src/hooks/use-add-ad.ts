"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  fetchProjectsByDeveloper,
  fetchPropertiesByDeveloper,
  fetchDeveloperDetails,
} from "@/data/api-client";

export function useAddAdData(isOpen: boolean) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [developerName, setDeveloperName] = useState<string>("");
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);
  const [properties, setProperties] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const [propertySearch, setPropertySearch] = useState("");
  const [debouncedProjectSearch, setDebouncedProjectSearch] = useState("");
  const [debouncedPropertySearch, setDebouncedPropertySearch] = useState("");

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

  const developerId = session?.user?.user_developer_relationship?.developer_id;

  // Fetch developer name
  useEffect(() => {
    if (!token || !isOpen || !developerId) return;

    const fetchDeveloper = async () => {
      try {
        const developer: any = await fetchDeveloperDetails(developerId, token);
        setDeveloperName(developer.developer_name || "");
      } catch (error) {
        console.error("Error fetching developer:", error);
      }
    };

    fetchDeveloper();
  }, [token, isOpen, developerId]);

  // Fetch projects
  useEffect(() => {
    if (!token || !isOpen || !developerId) return;

    const loadProjects = async () => {
      setProjectsLoading(true);
      try {
        const data:any = await fetchProjectsByDeveloper(
          token,
          developerId,
          1,
          "100",
          debouncedProjectSearch || "",
        );
        const mappedProjects = data!.map((proj: any) => ({
          id: proj.project_id || proj.id,
          name: proj.project_name || proj.name || proj.title,
        }));
        setProjects(mappedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setProjectsLoading(false);
      }
    };

    loadProjects();
  }, [token, isOpen, developerId, debouncedProjectSearch]);

  // Fetch properties
  useEffect(() => {
    if (!token || !isOpen || !developerId) return;

    const loadProperties = async () => {
      setPropertiesLoading(true);
      try {
        const data:any = await fetchPropertiesByDeveloper(
          token,
          developerId,
          "active",
          "100",
          debouncedPropertySearch || "",
        );
        const mappedProperties = data.map((prop: any) => ({
          id: prop.property_no || prop.property_name || prop.id,
          name: prop.property_name || prop.title || prop.property_no,
        }));
        setProperties(mappedProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setPropertiesLoading(false);
      }
    };

    loadProperties();
  }, [token, isOpen, developerId, debouncedPropertySearch]);

  return {
    developerName,
    projects,
    properties,
    projectsLoading,
    propertiesLoading,
    projectSearch,
    setProjectSearch,
    propertySearch,
    setPropertySearch,
  };
}
