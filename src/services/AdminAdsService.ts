import { apiClient } from "@/lib/apiClient";

export const AdminAdsService = {
  /**
   * Get ads with pagination and filters
   */
  getAds: async (
    page: number = 1,
    perPage: number = 15,
    filters?: {
      status?: string;
      platform?: string;
      format?: string;
      search?: string;
    },
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    if (filters?.status && filters.status !== "all") {
      params.append("status", filters.status);
    }
    if (filters?.platform && filters.platform !== "all") {
      params.append("platform", filters.platform);
    }
    if (filters?.format && filters.format !== "all") {
      params.append("format", filters.format);
    }
    if (filters?.search && filters.search.trim() !== "") {
      params.append("search", filters.search.trim());
    }

    const response = await apiClient.get(`/dashboard/ads?${params.toString()}`);
    return response;
  },

  /**
   * Get ads totals
   */
  getAdsTotals: async () => {
    const response = await apiClient.get("/dashboard/ads/totals");
    return response.data;
  },

  /**
   * Get ad by ID
   */
  getAd: async (adId: string, token: string) => {
    return apiClient.get(`/ads/${adId}`, token);
  },

  /**
   * Create a new ad
   */
  createAd: (data: FormData, token: string) => {
    return apiClient.post("/ads", data, token);
  },

  /**
   * Update an ad
   */
  updateAd: (adId: number, data: FormData, token: string) => {
    return apiClient.put(`/ads/${adId}`, data, token);
  },

  /**
   * Delete an ad
   */
  deleteAd: (adId: number) => {
    return apiClient.delete(`/ads/${adId}`);
  },

  /**
   * Toggle ad status
   */
  toggleStatus: (adId: number, status: string) => {
    return apiClient.post(`/ads/${adId}/toggle-status`, status);
  },
};
