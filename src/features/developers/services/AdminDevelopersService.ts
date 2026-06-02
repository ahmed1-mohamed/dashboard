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


  getDevelopersByCountry: async (
    page: number = 1,
    perPage: number = 100,
    search?: string,
    status?: string,
    countryId?: number,
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    if (search) params.append("search", search);
    if (status) params.append("status", status);
    if (countryId) params.append("country_id", countryId.toString());

    const response = await apiClient.get(
      `/dashboard/developers/all?${params.toString()}`,
    );
    return response.data;
  },


  getDeveloper: async (developerId: number) => {
    const response = await apiClient.get(
      `/dashboard/developers/${developerId}`,
    );
    return response.data;
  },

  createDeveloper: (data: FormData) => {
    return apiClient.post("/dashboard/developers", data);
  },


  updateDeveloper: (developerId: number, data: FormData) => {
    return apiClient.put(`/dashboard/developers/${developerId}`, data);
  },

  deleteDeveloper: (developerId: number) => {
    return apiClient.delete(`/dashboard/developers/${developerId}`);
  },


  toggleStatus: (developerId: number, status: string) => {
    return apiClient.patch(
      `/dashboard/developers/${developerId}/toggle-status`,
      {
        status: status,
        is_active: status === "active" ? 1 : 0
      },
    );
  },


  bulkImportDevelopers: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/dashboard/developers/bulk-import", formData);
  },
};
