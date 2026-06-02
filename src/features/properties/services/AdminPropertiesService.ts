import { apiClient } from "@/lib/apiClient";
import { PropertiesInput } from "@/validators/propertiesSchema";
import type {
  PropertyTypeDataType,
  PropertySubtypeDataType,
  ProjectsDataType,
} from "@/types";

export interface PropertiesFilterParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  project_id?: number | number[];
  country_id?: number | number[];
  developer_id?: number | number[];
  property_type_id?: number;
  sort_by?: string[];
  sort_order?: string[];
}

export const AdminPropertiesService = {
  /**
   * Get properties with pagination and filters
   */
  getProperties: async (params: PropertiesFilterParams) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.per_page)
      queryParams.append("per_page", params.per_page.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.status) queryParams.append("status", params.status);
    if (params.sort_by) {
      params.sort_by.forEach((s) => queryParams.append("sort_by[]", s));
    }
    if (params.sort_order) {
      params.sort_order.forEach((s) => queryParams.append("sort_order[]", s));
    }

    // Handle array params
    if (Array.isArray(params.project_id)) {
      params.project_id.forEach((id) =>
        queryParams.append("project_id[]", id.toString()),
      );
    } else if (params.project_id) {
      queryParams.append("project_id", params.project_id.toString());
    }
    if (Array.isArray(params.country_id)) {
      params.country_id.forEach((id) =>
        queryParams.append("country_id[]", id.toString()),
      );
    } else if (params.country_id) {
      queryParams.append("country_id", params.country_id.toString());
    }
    if (Array.isArray(params.developer_id)) {
      params.developer_id.forEach((id) =>
        queryParams.append("developer_id[]", id.toString()),
      );
    } else if (params.developer_id) {
      queryParams.append("developer_id", params.developer_id.toString());
    }
    if (params.property_type_id) {
      queryParams.append(
        "property_type_id",
        params.property_type_id.toString(),
      );
    }

    const response = await apiClient.get(
      `/dashboard/properties?${queryParams.toString()}`,
    );
    return response.data;
  },

  /**
   * Get property types
   */
  getPropertyTypes: async () => {
    const response = await apiClient.get("/dashboard/propertyTypes");
    return response.data as PropertyTypeDataType[];
  },

  /**
   * Get property subtypes
   */
  getPropertySubtypes: async () => {
    const response = await apiClient.get("/dashboard/propertySubtypes");
    return response.data as PropertySubtypeDataType[];
  },

  /**
   * Get projects with search and pagination
   */
  getProjects: async (page?: number, perPage?: number, search?: string) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append("page", page.toString());
    if (perPage !== undefined) params.append("per_page", perPage.toString());
    if (search) params.append("search", search);

    const response = await apiClient.get(`/projects?${params.toString()}`);
    return response.data as ProjectsDataType[];
  },

  /**
   * Create a new property
   */
  createProperty: async (data: PropertiesInput) => {
    const response = await apiClient.post("/dashboard/properties", data);
    return response.data;
  },

  /**
   * Delete a property
   */
  deleteProperty: async (propertyId: number) => {
    const response = await apiClient.delete(`/dashboard/properties/${propertyId}`);
    return response.data;
  },

  /**
   * Update a property
   */
  updateProperty: async (propertyId: number, data: any) => {
    const response = await apiClient.put(`/dashboard/properties/${propertyId}`, data);
    return response.data;
  },
};
