"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  fetchUserProfile,
  updateUserProfile,
  changePassword,
} from "@/data/api-client";
// import { UserProfile } from "@/types";

export default function useDashboardAdminSettingsData() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const userProfileData = useQuery<any>({
    queryKey: ["userProfile"],
    queryFn: () => fetchUserProfile(token!),
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const updateUserProfileMutation = {
    async mutate(data: any) {
      await updateUserProfile(data, token!);
    },
  };

  const changePasswordMutation = {
    async mutate(data: any) {
      await changePassword(data, token!);
    },
  };

  return {
    userProfileData,
    updateUserProfileMutation,
    changePasswordMutation,
  };
}
