"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AdminUsersService } from "@/features/users/services/AdminUsersService";

export default function useDashboardAdminUsers(
  page: number = 1,
  perPage: number = 15,
) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const usersQuery = useQuery({
    queryKey: ["users", page, perPage],
    queryFn: () => AdminUsersService.getUsers(page, perPage),
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  });

  return {
    usersData: usersQuery,
  };
}
