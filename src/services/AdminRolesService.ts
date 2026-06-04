import { apiClient } from "@/lib/apiClient";

export const AdminRolesService = {

  getRoles: () => {
    return apiClient.get("/dashboard/roles");
  },


  getRole: (roleId: number) => {
    return apiClient.get(`/dashboard/roles/${roleId}`);
  },

  createRole: (data: Record<string, unknown>) => {
    return apiClient.post("/dashboard/roles", data);
  },


  updateRole: (roleId: number, data: Record<string, unknown>) => {
    return apiClient.post(`/dashboard/roles/${roleId}`, { ...data, _method: "PUT" });
  },


  deleteRole: (roleId: number) => {
    return apiClient.delete(`/dashboard/roles/${roleId}`);
  },


  addPermissions: (data: Record<string, unknown>) => {
    return apiClient.post("/dashboard/roles/permissions", data);
  },

  deletePermission: (roleId: number, permissionId: number) => {
    return apiClient.delete(`/dashboard/roles/${roleId}/permissions/${permissionId}`);
  },
};
