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
