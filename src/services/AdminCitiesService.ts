import { apiClient } from "@/lib/apiClient";
import { CityInput } from "@/validators/city.schema";
import type { CitiesDataType } from "@/types";

export const AdminCitiesService = {
  /**
   * Get all cities (non-paginated)
   */
  getAllCities: async (): Promise<CitiesDataType[]> => {
    const response = await apiClient.get("/dashboard/cities/all");
    // API returns { data: CitiesDataType[] } envelope
    const envelope = response.data as { data: CitiesDataType[] };
    return envelope.data;
  },

  /**
   * Get all cities by country
   */
  getCitiesByCountry: (country: string) => {
    return apiClient.get(`/dashboard/cities/all?country=${country}`);
  },

  /**
   * Get cities with pagination and search
   */
  getCities: (page: number = 1, perPage: number = 10, search?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }

    return apiClient.get(`/dashboard/cities?${params.toString()}`);
  },

  /**
   * Get city by ID
   */
  getCity: (cityId: number) => {
    return apiClient.get(`/cities/${cityId}`);
  },

  /**
   * Create a new city
   */
  createCity: (data: CityInput) => {
    return apiClient.post("/cities", data);
  },

  /**
   * Update a city
   */
  updateCity: (cityId: number, data: CityInput) => {
    return apiClient.put(`/cities/${cityId}`, data);
  },

  /**
   * Delete a city
   */
  deleteCity: (cityId: number) => {
    return apiClient.delete(`/cities/${cityId}`);
  },
};
