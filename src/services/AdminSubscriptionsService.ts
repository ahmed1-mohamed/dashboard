import { apiClient } from "@/lib/apiClient";

export const AdminSubscriptionsService = {

  getCustomerPlans: () => {
    return apiClient.get("/dashboard/subs/customerPlans");
  },

  getCustomerPlanById: (id: number | string) => {
    return apiClient.get(`/subs/customerPlans/${id}`);
  },

  getPackages: () => {
    return apiClient.get("/ad-credit-packages");
  },


  createCustomerPlan: (data: Record<string, unknown>) => {
    return apiClient.post("/subs/customerPlans", data);
  },

  updateCustomerPlan: (id: number | string, data: Record<string, unknown>) => {
    return apiClient.put(`/subs/customerPlans/${id}`, data);
  },


  deletePackage: (packageId: number) => {
    return apiClient.delete(`/ad-credit-packages/${packageId}`);
  },
};
