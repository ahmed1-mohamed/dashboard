"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AdminRolesService } from "@/services/AdminRolesService";

export default function useDashboardAdminRolesData() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const rolesData = useQuery({
    queryKey: ["roles_admin"],
    queryFn: async () => {
      const res = await AdminRolesService.getRoles();
      return res || { data: [] };
    },
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (id: number) => AdminRolesService.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["roles_admin"] });
    },
  });

  return {
    rolesData,
    deleteRoleMutation,
  };
}
