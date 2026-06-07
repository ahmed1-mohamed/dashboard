import { apiClient } from "@/lib/apiClient";
import { AreaInput } from "@/validators/area.schema";

export const AdminAreasService = {

  getAreas: (page: number = 1, perPage: number = 15) => {
    const params = new URLSearchParams({
      page: page.toString(),
      request: perPage.toString(),
    });
    return apiClient.get(`/dashboard/dldAreas?${params.toString()}`);
  },


  getAreasByCountry: (country: string) => {
    return apiClient.get(`/dashboard/areas/all?country=${country}`);
  },

  getArea: (areaId: number) => {
    return apiClient.get(`/dashboard/dldAreas/${areaId}`);
  },

  createArea: (data: AreaInput) => {
    return apiClient.post("/dashboard/dldAreas", data);
  },


  updateArea: (areaId: number, data: AreaInput) => {
    return apiClient.put(`/dashboard/dldAreas/${areaId}`, data);
  },

  deleteArea: (areaId: number) => {
    return apiClient.delete(`/dashboard/dldAreas/${areaId}`);
  },
};
