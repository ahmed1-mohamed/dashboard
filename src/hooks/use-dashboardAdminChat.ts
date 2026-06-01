"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchAiConversations } from "@/data/api-client";

export default function useDashboardAdminChatData() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const aiConversationsData = useQuery({
    queryKey: ["aiConversations"],
    queryFn: () => fetchAiConversations(token!),
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  return {
    aiConversationsData,
  };
}
