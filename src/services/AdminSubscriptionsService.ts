import { apiClient } from "@/lib/apiClient";

export const AdminSubscriptionsService = {

  getCustomerPlans: () => {
    return apiClient.get("/dashboard/subs/customerPlans");
  },

  getCustomerPlanById: (id: number | string) => {
    return apiClient.get(`/dashboard/subs/customerPlans/${id}`);
  },

  getPackages: () => {
    return apiClient.get("/dashboard/ad-credit-packages");
  },

  createPackage: (data: Record<string, unknown>) => {
    return apiClient.post("/dashboard/ad-credit-packages", data);
  },

  updatePackage: (id: number | string, data: Record<string, unknown>) => {
    return apiClient.put(`/dashboard/ad-credit-packages/${id}`, data);
  },

  getBadges: (params?: { is_active?: boolean; applies_to?: string; platform?: string }) => {
    return apiClient.get("/dashboard/badges", { params });
  },

  createBadge: (data: Record<string, unknown>) => {
    return apiClient.post("/dashboard/badges", data);
  },

  updateBadge: (id: number | string, data: Record<string, unknown>) => {
    return apiClient.put(`/dashboard/badges/${id}`, data);
  },

  deleteBadge: (id: number | string) => {
    return apiClient.delete(`/dashboard/badges/${id}`);
  },

  getAddons: (params?: Record<string, any>) => {
    return apiClient.get("/dashboard/subs/add-ons", { params });
  },

  getAddonTypes: () => {
    return apiClient.get("/dashboard/subs/add-ons/types");
  },

  createAddon: (data: Record<string, unknown>) => {
    return apiClient.post("/dashboard/subs/add-ons", data);
  },

  updateAddon: (id: number | string, data: Record<string, unknown>) => {
    return apiClient.put(`/dashboard/subs/add-ons/${id}`, data);
  },

  deleteAddon: (id: number | string) => {
    return apiClient.delete(`/dashboard/subs/add-ons/${id}`);
  },


  createCustomerPlan: (data: Record<string, unknown>) => {
    return apiClient.post("/dashboard/subs/customerPlans", data);
  },

  updateCustomerPlan: (id: number | string, data: Record<string, unknown>) => {
    return apiClient.put(`/dashboard/subs/customerPlans/${id}`, data);
  },


  deletePackage: (packageId: number) => {
    return apiClient.delete(`/dashboard/ad-credit-packages/${packageId}`);
  },

  deleteCustomerPlan: (id: number | string) => {
    return apiClient.delete(`/dashboard/subs/customerPlans/${id}`);
  },
};
