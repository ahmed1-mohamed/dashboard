import { apiClient } from "@/lib/apiClient";

export const AdminLocationsService = {
  /**
   * Get locations with pagination
   */
  getLocations: (page: number = 1, perPage: number = 10, search?: string, city?: string, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }

    if (city && city !== "all") {
      params.append("city_name", city);
    }

    if (status && status !== "all") {
      params.append("status", status);
    }

    return apiClient.get(`/dashboard/locations?${params.toString()}`);
  },

  /**
   * Get location by ID
   */
  getLocation: (locationId: number) => {
    return apiClient.get(`/dashboard/locations/${locationId}`);
  },

  /**
   * Create a new location
   */
  createLocation: (data: FormData | Record<string, unknown>) => {
    return apiClient.post("/dashboard/locations", data);
  },

  /**
   * Update a location
   */
  updateLocation: (locationId: number, data: FormData) => {
    return apiClient.put(`/dashboard/locations/${locationId}`, data);
  },

  /**
   * Delete a location
   */
  deleteLocation: (locationId: number) => {
    return apiClient.delete(`/dashboard/locations/${locationId}`);
  },
};
