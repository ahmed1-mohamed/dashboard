import { apiClient } from "@/lib/apiClient";
import { GetUserDataType } from "@/types";
import { CreateNewUserInput } from "@/validators/create-new-user.schema";

export const AdminUsersService = {

  getUsers: (
    page: number = 1,
    perPage: number = 15,
    search?: string,
    status?: string,
    role?: string,
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }
    if (status && status !== "all") {
      params.append("status", status.toLowerCase());
    }
    if (role && role !== "all") {
      params.append("role", role);
    }
    return apiClient.get<{ data: GetUserDataType[]; total: number }>(
      `/dashboard/users?${params.toString()}`,
    );
  },

  /**
   * Get user by ID (admin endpoint)
   */
  getUser: (userId: number) => {
    return apiClient.get<GetUserDataType>(`/dashboard/users/${userId}`);
  },

  /**
   * Get all roles
   */
  getRoles: () => {
    return apiClient.get("/dashboard/roles").then((res) => res.data);
  },

  /**
   * Create a new user
   */
  createUser: (data: CreateNewUserInput) => {
    return apiClient.post<GetUserDataType>("/dashboard/users", data);
  },

  /**
   * Update a user
   */
  updateUser: (userId: number, data: Record<string, unknown>) => {
    return apiClient
      .put<GetUserDataType>(`/dashboard/users/${userId}`, data)
      .then((res) => res.data);
  },

  /**
   * Delete a user
   */
  deleteUser: (userId: number) => {
    return apiClient.delete(`/dashboard/users/${userId}`);
  },
};
