"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchNotifications, searchNotifications } from "@/data/api-client";
// import { ApiNotification } from "@/types";

interface FetchNotificationsResult {
  status: string;
  message: string;
  data: any[];
  next_cursor: string | null;
  previous_cursor: string | null;
}

export default function useDashboardAdminNotificationsData() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const notificationsData = useQuery<FetchNotificationsResult>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res: any = await fetchNotifications(token!);
      return res.data;
    },
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const searchNotificationsData = {
    async mutate(keyword: string, perPage: number) {
      const res: any = await searchNotifications(
        { keyword, per_page: perPage },
        token!,
      );

      return res.data;
    },
  };

  return {
    notificationsData,
    searchNotificationsData,
  };
}
