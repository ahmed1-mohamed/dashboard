"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchProjectPaymentDetails } from "@/data/api-client";

export function useEditPaymentPlanData(paymentId: number | undefined, isOpen: boolean) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const { data, isLoading } = useQuery({
    queryKey: ["projectPaymentDetails", paymentId],
    queryFn: () => fetchProjectPaymentDetails(paymentId!, token!),
    enabled: !!paymentId && !!token && isOpen,
  });

  return {
    data,
    isLoading,
  };
}