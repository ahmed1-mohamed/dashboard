"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminPropertiesService } from "@/services/AdminPropertiesService";
import type {
  PropertyTypeDataType,
  PropertySubtypeDataType,
  ProjectsDataType,
} from "@/types";

export function usePropertyTypes() {
  return useQuery({
    queryKey: ["PropertiesType"],
    queryFn: () => AdminPropertiesService.getPropertyTypes(),
    select: (response: any) => response.data as PropertyTypeDataType[],
  });
}

export function usePropertySubtypes() {
  return useQuery({
    queryKey: ["PropertiesSubtype"],
    queryFn: () => AdminPropertiesService.getPropertySubtypes(),
    select: (response: any) => response.data as PropertySubtypeDataType[],
  });
}

export function useProjectsForSelect(
  page: number = 1,
  perPage: number = 10,
  search: string = "",
) {
  return useQuery({
    queryKey: ["Projects", page, perPage, search],
    queryFn: () => AdminPropertiesService.getProjects(page, perPage, search),
    select: (response: any) => {
      // Extract the data array and flatten nested project structure
      const projectsArray = response?.data || [];
      return projectsArray.map((item: any) => item.data) as ProjectsDataType[];
    },
  });
}
