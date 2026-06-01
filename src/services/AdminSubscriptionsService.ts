import { apiClient } from "@/lib/apiClient";

export const AdminSubscriptionsService = {
  /**
   * Get all packages
   */
  getPackages: () => {
    return apiClient.get("/dashboard/ad-credit-packages");
  },

  /**
   * Get all features
   */
  getFeatures: () => {
    return apiClient.get("/dashboard/badge-features");
  },

  /**
   * Delete a package
   */
  deletePackage: (packageId: number) => {
    return apiClient.delete(`/ad-credit-packages/${packageId}`);
  },

  /**
   * Create a feature
   */
  createFeature: (data: Record<string, unknown>) => {
    return apiClient.post("/dashboard/badge-features", data);
  },

  /**
   * Delete a feature
   */
  deleteFeature: (featureId: number) => {
    return apiClient.delete(`/dashboard/badge-features/${featureId}`);
  },
};
