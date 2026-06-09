import { apiClient } from "@/lib/apiClient";

interface OffersFilters {
  status?: string;
  search?: string;
}

interface CreateOfferPayload {
  entity_type: "DEVELOPERS" | "PROJECTS" | "PROPERTIES";
  entity_id: number;
  name: string;
  description?: string;
  banner_image?: string;
  discount_type: "percentage" | "fixed_amount" | "special_deal" | "join_offers" | "discount_events";
  discount_pct?: number;
  is_active?: boolean;
  starts_at?: string;
  ends_at?: string;
  clicks?: number;
  views?: number;
}

export interface OfferUpdateFields {
  entity_type: string;
  entity_id: number;
  discount_type: string;
  name?: string;
  is_active: boolean;
  description?: string;
  starts_at?: string;
  ends_at?: string;
  discount_pct?: number;
}

export const AdminOffersService = {
  getOffers: async (
    page: number = 1,
    perPage: number = 15,
    filters?: OffersFilters,
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    if (filters?.status && filters.status !== "all") {
      params.append("status", filters.status);
    }
    if (filters?.search && filters.search.trim()) {
      params.append("search", filters.search.trim());
    }
    const response = await apiClient.get(`/dashboard/offers?${params.toString()}`);
    return response;
  },

  getOffersTotals: async () => {
    const response = await apiClient.get("/dashboard/offers/totals");
    return response.data;
  },

  getOffer: async (offerId: string) => {
    return apiClient.get(`/dashboard/offers/${offerId}`);
  },

  createOffer: (data: CreateOfferPayload) => {
    return apiClient.post("/dashboard/offers", data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  updateOffer: (offerId: number, data: FormData) => {
    return apiClient.post(`/dashboard/offers/${offerId}`, data);
  },

  deleteOffer: (offerId: number) => {
    return apiClient.delete(`/dashboard/offers/${offerId}`);
  },


  toggleStatus: (offerId: number, fields: OfferUpdateFields) => {
    const formData = new FormData();
    formData.append("entity_type", fields.entity_type);
    formData.append("entity_id", String(fields.entity_id));
    formData.append("discount_type", fields.discount_type);
    formData.append("is_active", fields.is_active ? "1" : "0");
    if (fields.name) formData.append("name", fields.name);
    if (fields.description) formData.append("description", fields.description);
    if (fields.starts_at) formData.append("starts_at", fields.starts_at);
    if (fields.ends_at) formData.append("ends_at", fields.ends_at);
    if (fields.discount_pct != null) formData.append("discount_pct", String(fields.discount_pct));
    return apiClient.post(`/dashboard/offers/${offerId}`, formData);
  },
};