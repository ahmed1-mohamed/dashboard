"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { AdminUsersService } from "@/features/users/services/AdminUsersService";
import { apiClient } from "@/lib/apiClient";

export function useUserActions() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Create user mutation
  const createMutation = useMutation<any, Error, CreateUserInput>({
    mutationFn: async (userData: any) => {
      const token = session?.user?.accessToken;

      if (!token) {
        throw new Error("Not authenticated");
      }

      // ✅ FIX: correct service method name
      const res = await AdminUsersService.createUser(userData);

      // handle axios / api response safely
      return res?.data ?? res;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["roles"] });

      toast.success("User created successfully!");
    },

    onError: (error: unknown) => {
      const err = error as any;

      const errorMessage =
        err?.response?.data?.message || err?.message || "Failed to create user";

      toast.error(errorMessage);
    },
  });
  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      userId,
      userData,
    }: {
      userId: number;
      userData: EditUserInput;
    }) => {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Not authenticated");
      return AdminUsersService.updateUser(userId, userData as Record<string, unknown>);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update user";
      toast.error(errorMessage);
    },
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: async (userId: number) => {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Not authenticated");
      return AdminUsersService.deleteUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete user";
      toast.error(errorMessage);
    },
  });

  // Fetch developers for user assignment
  const fetchDevelopers = useMutation({
    mutationFn: async (token: string) => {
      // Use the apiClient directly since this is used for form data
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const expiresAt = Math.floor(Date.now() / 1000) + 3600;
      apiClient.setAuthToken(token, expiresAt);
      const response = await apiClient.get("/dashboard/developers");
      return response.data! || [];
    },
    onError: (error: any) => {
      console.error("Failed to fetch developers:", error);
    },
  });

  return {
    createUser: createMutation.mutateAsync,
    updateUser: updateMutation.mutateAsync,
    deleteUser: deleteMutation.mutateAsync,
    fetchDevelopers: fetchDevelopers.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export interface CreateUserInput {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  password_confirmation: string;
  role_id: number;
  status?: string;
  description?: string;
  profile_picture?: string;
  developer_id?: number;
  developer_role?: string;
}

export interface EditUserInput {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  role_id?: number;
  status?: string;
  description?: string;
  profile_picture?: string;
}
