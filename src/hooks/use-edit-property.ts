"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  fetchPropertyDetails,
  fetchProjectsPaginated,
  fetchPropertySubtype,
  fetchPropertyTypes,
} from "@/data/api-client";
import {
  ProjectsDataType,
  PropertiesDataType,
  PropertySubtypeDataType,
  PropertyTypeDataType,
} from "@/types";

export function useEditPropertyData(
  propertyId: number,
  isOpen: boolean,
  projectSearch: string,
  projectPerPage: number,
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [propertyData, setPropertyData] = useState<PropertiesDataType | null>(
    null,
  );
  const [propertyLoading, setPropertyLoading] = useState(false);
  const [propertiesType, setPropertiesType] = useState<PropertyTypeDataType[]>(
    [],
  );
  const [propertiesSubtype, setPropertiesSubtype] = useState<
    PropertySubtypeDataType[]
  >([]);
  const [projects, setProjects] = useState<ProjectsDataType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Fetch property data
  useEffect(() => {
    if (!token || !isOpen || !propertyId) return;

    const loadProperty = async () => {
      setPropertyLoading(true);
      try {
        const data: any = await fetchPropertyDetails(propertyId, token);
        setPropertyData(data);
      } catch (error) {
        console.error("Error fetching property details:", error);
      } finally {
        setPropertyLoading(false);
      }
    };

    loadProperty();
  }, [token, isOpen, propertyId]);

  // Fetch property types and subtypes
  useEffect(() => {
    if (!token || !isOpen) return;

    const loadTypes = async () => {
      setLoadingTypes(true);
      try {
        const [types, subtypes]: any[] = await Promise.all([
          fetchPropertyTypes(token),
          fetchPropertySubtype(token),
        ]);
        setPropertiesType(types.data || []);
        setPropertiesSubtype(subtypes.data || []);
      } catch (error) {
        console.error("Error fetching types:", error);
      } finally {
        setLoadingTypes(false);
      }
    };

    loadTypes();
  }, [token, isOpen]);

  // Fetch projects
  useEffect(() => {
    if (!token || !isOpen) return;

    const loadProjects = async () => {
      setLoadingProjects(true);
      try {
        const data: any = await fetchProjectsPaginated(
          token,
          1,
          projectPerPage,
          projectSearch,
        );
        setProjects(data.data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoadingProjects(false);
      }
    };

    loadProjects();
  }, [token, isOpen, projectSearch, projectPerPage]);

  return {
    propertyData,
    propertyLoading,
    propertiesType,
    propertiesSubtype,
    projects,
    loadingTypes,
    loadingProjects,
  };
}
