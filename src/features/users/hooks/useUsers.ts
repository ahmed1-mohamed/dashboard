"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AdminUsersService } from "../services/AdminUsersService";
import { CreateNewUserInput } from "@/validators/create-new-user.schema";
import { unpackUsersResponse, mapUser } from "../utils/map-user";
import { useMemo } from "react";

export function useUsers(
  page: number = 1,
  perPage: number = 15,
  search?: string,
  status: string = "all",
  role_id: string = "all",
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const usersData = useQuery({
    queryKey: ["users", page, perPage, search, status, role_id],
    queryFn: () => AdminUsersService.getUsers(page, perPage, search, status, role_id),
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => AdminUsersService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const addUserMutation = useMutation({
    mutationFn: (userData: CreateNewUserInput) => AdminUsersService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const { itemsArray, totalItems } = useMemo(() => {
    return unpackUsersResponse(usersData.data);
  }, [usersData.data]);

  const users = useMemo(() => itemsArray.map(mapUser), [itemsArray]);

  return {
    usersData,
    users,
    totalUsers: totalItems,
    deleteUserMutation,
    addUserMutation,
  };
}