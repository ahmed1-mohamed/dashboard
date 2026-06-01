import { apiClient } from "@/lib/apiClient";
import { FeaturesDataType } from "@/types";

export const AdminFeaturesService = {
  /**
   * Get all features
   */
  getFeatures: () => {
    return apiClient.get<any>("/dashboard/features");
  },

  /**
   * Get feature by ID
   */
  getFeature: (featureId: number) => {
    return apiClient.get<FeaturesDataType>(`/dashboard/features/${featureId}`);
  },

  /**
   * Create a new feature
   */
  createFeature: (data: FeaturesDataType) => {
    return apiClient.post<FeaturesDataType>("/dashboard/features", data);
  },

  /**
   * Update a feature
   */
  updateFeature: (featureId: number, data: FeaturesDataType) => {
    return apiClient.put<FeaturesDataType>(
      `/dashboard/features/${featureId}`,
      data,
    );
  },

  /**
   * Delete a feature
   */
  deleteFeature: (featureId: number) => {
    return apiClient.delete(`/dashboard/features/${featureId}`);
  },
};
