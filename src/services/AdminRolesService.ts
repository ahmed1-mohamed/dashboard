import { apiClient } from "@/lib/apiClient";

export const AdminRolesService = {
  /**
   * Get all roles
   */
  getRoles: () => {
    return apiClient.get("/dashboard/roles/all");
  },

  /**
   * Get role by ID
   */
  getRole: (roleId: number) => {
    return apiClient.get(`/roles/${roleId}`);
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
    return apiClient.put(`/roles/${roleId}`, data);
  },

  /**
   * Delete a role
   */
  deleteRole: (roleId: number) => {
    return apiClient.delete(`/roles/${roleId}`);
  },
};
