"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AdminActivityService } from "../services/AdminActivityService";

export default function useActivityLogs(
  page: number = 1,
  perPage: number = 10,
  search?: string,
  action?: string,
  entityType?: string,
  dateRange?: string,
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const paginatedActivityData = useQuery({
    queryKey: ["activity", page, perPage, search, action, entityType, dateRange],
    queryFn: () =>
      AdminActivityService.getActivityLogs(
        page,
        perPage,
        search,
        action,
        entityType,
        dateRange,
      ),
    retry: false,
    enabled: !!token,
  });

  return {
    paginatedActivityData,
  };
}
