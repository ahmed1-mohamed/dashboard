import { apiClient } from "@/lib/apiClient";
import { AreaInput } from "@/validators/area.schema";

export const AdminAreasService = {
  /**
   * Get areas with pagination
   */
  getAreas: (page: number = 1, perPage: number = 15) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    return apiClient.get(`/dashboard/areas/all?${params.toString()}`);
  },

  /**
   * Get all areas by country
   */
  getAreasByCountry: (country: string) => {
    return apiClient.get(`/dashboard/areas/all?country=${country}`);
  },

  /**
   * Get area by ID
   */
  getArea: (areaId: number) => {
    return apiClient.get(`/areas/${areaId}`);
  },

  /**
   * Create a new area
   */
  createArea: (data: AreaInput) => {
    return apiClient.post("/dashboard/areas", data);
  },

  /**
   * Update an area
   */
  updateArea: (areaId: number, data: AreaInput) => {
    return apiClient.put(`/areas/${areaId}`, data);
  },

  /**
   * Delete an area
   */
  deleteArea: (areaId: number) => {
    return apiClient.delete(`/areas/${areaId}`);
  },
};
