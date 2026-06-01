import { apiClient } from "@/lib/apiClient";
import { DldAreasDataType } from "@/types";

export const AdminDldAreasService = {
  /**
   * Get all DLD areas
   */
  getAllDldAreas: async (): Promise<DldAreasDataType[]> => {
    const response = await apiClient.get("/dashboard/areas");
    // API returns { data: DldAreasDataType[] } envelope
    const envelope = response.data as { data: DldAreasDataType[] };
    return envelope.data;
  },

  /**
   * Get DLD area by ID
   */
  getDldArea: (dldAreaId: number) => {
    return apiClient.get(`/dldAreas/${dldAreaId}`);
  },

  /**
   * Create a new DLD area
   */
  createDldArea: (data: DldAreasDataType) => {
    return apiClient.post("/dldAreas", data);
  },

  /**
   * Update a DLD area
   */
  updateDldArea: (dldAreaId: number, data: DldAreasDataType) => {
    return apiClient.put(`/dldAreas/${dldAreaId}`, data);
  },

  /**
   * Delete a DLD area
   */
  deleteDldArea: (dldAreaId: number) => {
    return apiClient.delete(`/dldAreas/${dldAreaId}`);
  },
};
