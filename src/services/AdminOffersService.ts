import { apiClient } from "@/lib/apiClient";

export const AdminOffersService = {
  getOffers: async (
    page: number = 1,
    perPage: number = 15,
    filters?: {
      status?: string;
      search?: string;
    },
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    // The API documentation only specifies per_page, so we don't send status/search 
    // to avoid potential 422/500 errors. (page is kept as it's standard for Laravel pagination)

    const response = await apiClient.get(`/dashboard/offers?${params.toString()}`);
    return response;
  },

  getOffersTotals: async () => {
    const response = await apiClient.get("/dashboard/offers/totals");
    return response.data;
  },

  getOffer: async (offerId: string, token: string) => {
    return apiClient.get(`/dashboard/offers/${offerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  createOffer: (data: any, token: string) => {
    return apiClient.post("/dashboard/offers", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  updateOffer: (offerId: number, data: FormData, token: string) => {
    return apiClient.post(`/dashboard/offers/${offerId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  deleteOffer: (offerId: number) => {
    return apiClient.delete(`/dashboard/offers/${offerId}`);
  },

  toggleStatus: (offerId: number, payload: any) => {
    return apiClient.patch(`/dashboard/offers/${offerId}/toggle-status`, payload);
  },
};