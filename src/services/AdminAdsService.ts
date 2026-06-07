import { apiClient } from "@/lib/apiClient";

export const AdminAdsService = {

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


  getAdsTotals: async () => {
    const response = await apiClient.get("/dashboard/ads/totals");
    return response.data;
  },


  getAd: async (adId: string, token: string) => {
    return apiClient.get(`/dashboard/ads/${adId}`, token);
  },


  createAd: (data: FormData, token: string) => {
    return apiClient.post("/dashboard/ads", data, token);
  },


  updateAd: (adId: number, data: FormData, token: string) => {
    return apiClient.put(`/dashboard/ads/${adId}`, data, token);
  },


  deleteAd: (adId: number) => {
    return apiClient.delete(`/dashboard/ads/${adId}`);
  },


  toggleStatus: (adId: number, status: string) => {
    return apiClient.post(`/dashboard/ads/${adId}/toggle-status`, status);
  },
};
