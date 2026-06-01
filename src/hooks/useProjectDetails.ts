"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchProjectsDetails } from "@/data/api-client";

export default function useProjectDetails(
  projectId: number | null | undefined,
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const projectData = useQuery({
    queryKey: ["projectDetails", projectId],
    queryFn: () => fetchProjectsDetails(projectId!, token!),
    retry: false,
    enabled: !!token && !!projectId,
  });

  return {
    projectData,
  };
}
