"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface TypeRow {
  type_key: string;
  value: string;
  intervals: string;
  payment_plan_id: number;
  id?: number;
}

interface PaymentPlanItemData {
  payment_plan_id: number;
  type: string;
  percentage: number | string;
  intervals?: number;
}

export function usePaymentPlanItemActions() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Mutation for updating/creating payment plan items
  const updateItemsMutation = useMutation({
    mutationFn: async (
      typesData: {
        payment_plan_id: number;
        type: string;
        percentage: number | string;
        intervals?: number;
        id?: number;
      }[],
    ) => {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Not authenticated");

      const results = await Promise.all(
        typesData.map(async (row) => {
          const itemId = row.id;
          const data: PaymentPlanItemData = {
            payment_plan_id: Number(row.payment_plan_id) || 0,
            type: row.type,
            percentage: row.percentage,
            intervals: row.intervals || 1,
          };

          if (!itemId) {
            // Create new item
            return await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/paymentPlanItems`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
              },
            ).then(async (res) => {
              if (!res.ok) {
                throw new Error(
                  `Failed to create payment plan item: ${res.statusText}`,
                );
              }
              return res.json();
            });
          } else {
            // Update existing item
            return await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/paymentPlanItems/${itemId}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
              },
            ).then(async (res) => {
              if (!res.ok) {
                throw new Error(
                  `Failed to update payment plan item: ${res.statusText}`,
                );
              }
              return res.json();
            });
          }
        }),
      );

      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectDetails"] });
      toast.success("Payment plan items updated successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update payment plan items";
      toast.error(errorMessage);
    },
  });

  return {
    updatePaymentPlanItems: updateItemsMutation.mutateAsync,
    isUpdatingItems: updateItemsMutation.isPending,
  };
}
