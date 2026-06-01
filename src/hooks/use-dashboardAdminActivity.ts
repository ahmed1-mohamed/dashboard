"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchActivityLogs, searchActivityLogs } from "@/data/api-client";

export default function useDashboardAdminActivityData() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const activityLogsData = useQuery({
    queryKey: ["activityLogs"],
    queryFn: () => fetchActivityLogs(token!),
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const searchActivityLogsData = {
    async mutate(searchData: any) {
      return searchActivityLogs(searchData, token!);
    },
  };

  return {
    activityLogsData,
    searchActivityLogsData,
  };
}
