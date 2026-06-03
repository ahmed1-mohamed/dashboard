import { apiClient } from "@/lib/apiClient";
import { ActivityLogResponse } from "../types";

export const AdminActivityService = {
  getActivityLogs: async (
    page: number = 1,
    perPage: number = 10,
    search?: string,
    action?: string,
    entityType?: string,
    dateRange?: string,
  ) => {
    const payload: Record<string, any> = {
      keyword: search?.trim() || "",
      per_page: perPage,
      page: page,
    };

    if (action && action !== "all" && action.trim() !== "") {
      payload.action = action;
    }

    if (entityType && entityType !== "all" && entityType.trim() !== "") {
      payload.entity_type = entityType;
    }

    if (dateRange && dateRange !== "all" && dateRange.trim() !== "") {
      payload.date_range = dateRange;
    }

    const response = await apiClient.post<{
      status: boolean;
      message: string;
      data: ActivityLogResponse[];
      meta?: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
      };
      total?: number;
    }>(`/dashboard/activityLogs/search`, payload);

    if (response.data.status === false) {
      throw new Error(response.data.message || "Failed to retrieve activity logs.");
    }

    return response.data;
  },

  getActivityLog: async (id: number) => {
    const response = await apiClient.get<{
      status: boolean;
      message: string;
      data: ActivityLogResponse;
    }>(`/dashboard/activityLogs/${id}`);

    if (response.data.status === false) {
      throw new Error(response.data.message || "Failed to retrieve activity log.");
    }

    return response.data.data;
  },
};
