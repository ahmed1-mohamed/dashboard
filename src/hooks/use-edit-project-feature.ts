"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchProjectFeatureDetails } from "@/data/api-client";

export function useEditProjectFeatureData(
  projectId: number,
  featureId: number | null,
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const { data, isLoading } = useQuery({
    queryKey: ["projectFeatureDetails", projectId, featureId],
    queryFn: () => fetchProjectFeatureDetails(projectId, featureId!, token!),
    select: (response: any) => response.data,
    enabled: !!featureId && !!token,
  });

  return {
    data,
    isLoading,
  };
}
