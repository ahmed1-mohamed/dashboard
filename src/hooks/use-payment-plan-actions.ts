"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { editProjectPayment } from "@/data/api-client";

interface EditPaymentData {
  name: string;
  description?: string;
  payment_plan_type?: string;
  period_by_years?: number;
  total_cost?: string;
  status?: string;
  type?: string;
  paymentplanitems?: Array<{
    id?: number;
    payment_plan_item_id?: number;
    type: string;
    percentage: string | number;
    intervals?: number;
  }>;
}

export function usePaymentPlanActions() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Update payment plan mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      projectId,
      paymentId,
      data,
    }: {
      projectId: number;
      paymentId: number;
      data: any;
    }) => {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Not authenticated");
      return editProjectPayment(projectId, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectDetails"] });
      toast.success("Payment plan updated successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update payment plan";
      toast.error(errorMessage);
    },
  });

  return {
    updatePaymentPlan: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
