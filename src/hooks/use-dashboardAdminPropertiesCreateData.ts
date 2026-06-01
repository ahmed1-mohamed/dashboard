"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchPropertyTypes, fetchPropertySubtype, fetchProjectsPaginated } from "@/data/api-client";

export default function useDashboardAdminPropertiesCreateData(token?: string) {
  const { data: session } = useSession();
  const authToken = token || session?.user?.accessToken;

  console.log("[useDashboardAdminPropertiesCreateData] token:", authToken);

  const propertyTypesData = useQuery({
    queryKey: ["PropertiesType"],
    queryFn: () => fetchPropertyTypes(authToken!),
    retry: false,
    enabled: !!authToken,
    select: (data:any) => data.data as any[],
  });

  const propertySubtypesData = useQuery({
    queryKey: ["PropertiesSubtype"],
    queryFn: () => fetchPropertySubtype(authToken!),
    retry: false,
    enabled: !!authToken,
    select: (data:any) => data.data as any[],
  });

  const projectsData = useQuery({
    queryKey: ["Projects"],
    queryFn: () => fetchProjectsPaginated(authToken!, 1, 100, ""),
    retry: false,
    enabled: !!authToken,
    select: (data:any) => data.data as any[],
  });

  return {
    propertyTypesData,
    propertySubtypesData,
    projectsData,
  };
}
