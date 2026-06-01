import { apiClient } from "@/lib/apiClient";
import { MeetingRequestsDataType } from "@/types";

export interface MeetingFilters {
  country?: string;
  status?: string;
  search?: string;
}

export const AdminMeetingsService = {
  /**
   * Get meeting requests with pagination
   */
  getMeetingRequests: (
    page: number = 1,
    perPage: number = 10,
    filters?: MeetingFilters,
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    if (filters) {
      if (filters.country && filters.country !== "all") {
        params.append("country", filters.country);
      }
      if (filters.status && filters.status !== "all") {
        params.append("status", filters.status);
      }
      if (filters.search && filters.search.trim() !== "") {
        params.append("search", filters.search.trim());
      }
    }

    return apiClient.get(`/dashboard/meeting-requests?${params.toString()}`);
  },

  /**
   * Get meeting request by ID
   */
  getMeetingRequest: (meetingId: number) => {
    return apiClient.get<MeetingRequestsDataType>(
      `/meeting-requests/${meetingId}`,
    );
  },

  /**
   * Confirm/approve a meeting request
   */
  confirmMeeting: (meetingId: number) => {
    return apiClient.post(`/meeting-requests/${meetingId}/confirm`);
  },

  /**
   * Cancel/reject a meeting request
   */
  cancelMeeting: (meetingId: number) => {
    return apiClient.post(`/meeting-requests/${meetingId}/cancel`);
  },
};
