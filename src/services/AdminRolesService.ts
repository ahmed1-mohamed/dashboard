import { apiClient } from "@/lib/apiClient";

export const AdminRolesService = {
  /**
   * Get all roles
   */
  getRoles: () => {
    return apiClient.get("/dashboard/roles");
  },

  /**
   * Get role by ID
   */
  getRole: (roleId: number) => {
    return apiClient.get(`/dashboard/roles/${roleId}`);
  },

  /**
   * Create a new role
   */
  createRole: (data: Record<string, unknown>) => {
    return apiClient.post("/dashboard/roles", data);
  },

  /**
   * Update a role
   */
  updateRole: (roleId: number, data: Record<string, unknown>) => {
    return apiClient.put(`/dashboard/roles/${roleId}`, data);
  },

  /**
   * Delete a role
   */
  deleteRole: (roleId: number) => {
    return apiClient.delete(`/dashboard/roles/${roleId}`);
  },

  /**
   * Add permissions to a role
   */
  addPermissions: (data: Record<string, unknown>) => {
    return apiClient.post("/dashboard/roles/permissions", data);
  },

  /**
   * Delete a permission from a role
   */
  deletePermission: (roleId: number, permissionId: number) => {
    return apiClient.delete(`/dashboard/roles/${roleId}/permissions/${permissionId}`);
  },
};
