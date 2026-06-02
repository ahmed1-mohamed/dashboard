import { apiClient } from "@/lib/apiClient";

export const AdminDevelopersService = {

  getDevelopersPaginated: async (
    page: number = 1,
    perPage: number = 10,
    search?: string,
    status?: string,
    country?: string,
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    if (search) params.append("search", search);
    if (status && status !== "all") params.append("status", status);
    if (country && country !== "all") params.append("country", country);

    const response = await apiClient.get(
      `/dashboard/developers?${params.toString()}`,
    );
    return response.data;
  },

  /**
   * Get developer by ID
   */
  getDeveloper: async (developerId: number) => {
    const response = await apiClient.get(
      `/dashboard/developers/${developerId}`,
    );
    return response.data;
  },

  /**
   * Create a new developer
   */
  createDeveloper: (data: FormData) => {
    return apiClient.post("/dashboard/developers", data);
  },

  /**
   * Update a developer
   */
  updateDeveloper: (developerId: number, data: FormData) => {
    return apiClient.put(`/dashboard/developers/${developerId}`, data);
  },

  /**
   * Delete a developer
   */
  deleteDeveloper: (developerId: number) => {
    return apiClient.delete(`/dashboard/developers/${developerId}`);
  },

  /**
   * Toggle developer status
   */
  toggleStatus: (developerId: number, status: string) => {
    return apiClient.patch(
      `/dashboard/developers/${developerId}/toggle-status`,
      {
        status: status,
        is_active: status === "active" ? 1 : 0,
      },
    );
  },

  /**
   * Bulk import developers
   */
  bulkImportDevelopers: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/dashboard/developers/bulk-import", formData);
  },
};
