import { apiClient } from "@/lib/apiClient";

export const AdminExpertsService = {
  /**
   * Get expert languages
   */
  getLanguages: () => {
    return apiClient.get(`/experts/languages`);
  },

  /**
   * Get expert categories
   */
  getCategories: () => {
    return apiClient.get(`/experts/categories`);
  },

  /**
   * Get countries
   */
  getCountries: () => {
    return apiClient.get(`/dashboard/countries`);
  },

  /**
   * Get expert by ID
   */
  getExpert: (expertId: number) => {
    return apiClient.get(`/dashboard/experts/${expertId}`);
  },

  /**
   * Get experts with pagination and filters
   */
  getExpertsPaginated: async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: limit.toString(),
    });

    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }
    if (status && status !== "all") {
      params.append("status", status);
    }

    const response = await apiClient.get(
      `/dashboard/experts?${params.toString()}`,
    );
    return response.data;
  },

  /**
   * Create a new expert
   */
  createExpert: (data: any) => {
    return apiClient.post("/experts", data);
  },

  /**
   * Update an expert
   */
  updateExpert: (expertId: number, data: any) => {
    return apiClient.put(`/experts/${expertId}`, data);
  },

  /**
   * Delete an expert
   */
  deleteExpert: (expertId: number) => {
    return apiClient.delete(`/experts/${expertId}`);
  },

  /**
   * Toggle expert status
   */
  toggleExpertStatus: (expertId: number, status: string) => {
    return apiClient.patch(`/experts/${expertId}/toggle-status`, status);
  },
};
