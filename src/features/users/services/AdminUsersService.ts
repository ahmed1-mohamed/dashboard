import { apiClient } from "@/lib/apiClient";
import { GetUserDataType } from "@/types";
import { CreateNewUserInput } from "@/validators/create-new-user.schema";

export const AdminUsersService = {

  getUsers: (
    page: number = 1,
    perPage: number = 15,
    search?: string,
    status?: string,
    role_id?: string,
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
    if (role_id && role_id !== "all") {
      params.append("role_id", role_id);
    }
    return apiClient.get<{ data: GetUserDataType[]; total: number }>(
      `/dashboard/users?${params.toString()}`,
    );
  },

  getUser: (userId: number) => {
    return apiClient.get<GetUserDataType>(`/dashboard/users/${userId}`);
  },

  getRoles: () => {
    return apiClient.get("/dashboard/roles/all").then((res) => res.data);
  },

  createUser: (data: CreateNewUserInput) => {
    return apiClient.post<GetUserDataType>("/dashboard/users", data);
  },

  updateUser: (userId: number, data: Record<string, unknown>) => {
    return apiClient
      .put<GetUserDataType>(`/dashboard/users/${userId}`, data)
      .then((res) => res.data);
  },

  deleteUser: (userId: number) => {
    return apiClient.delete(`/dashboard/users/${userId}`);
  },
};
