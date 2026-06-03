"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { deleteProjectFeature } from "@/data/api-client";
import { PaymentPlan } from "../../types";
import { AddPaymentPlanModal } from "@/components/modals/add-payment-plan-modal";
import { DeleteFeatureModal } from "@/components/modals/delete-feature-modal";
import type { AxiosError } from "axios";

// import { EditPaymentPlanModal } from "@/components/modals/edit-payment-plan-modal";

interface PaymentPlansTabProps {
  projectId: number;
  developerId: number;
  token: string;
  paymentPlans: PaymentPlan[];
  currency: string;
}

export function PaymentPlansTab({
  projectId,
  developerId,
  token,
  paymentPlans,
  currency,
}: PaymentPlansTabProps) {
  const queryClient = useQueryClient();

  const [isPaymentPlanModalOpen, setIsPaymentPlanModalOpen] = useState(false);
  // const [editingPaymentPlan, setEditingPaymentPlan] = useState<PaymentPlan | null>(null);
  // const [isEditPaymentPlanModalOpen, setIsEditPaymentPlanModalOpen] = useState(false);
  const [paymentPlanToDelete, setPaymentPlanToDelete] = useState<PaymentPlan | null>(null);
  const [isDeletePaymentPlanModalOpen, setIsDeletePaymentPlanModalOpen] = useState(false);

  // Mutation for deleting payment plan
  // Using deleteProjectFeature as it was originally used in page.tsx for payment plans
  const deletePaymentPlanMutation = useMutation({
    mutationFn: (planId: number) => deleteProjectFeature(projectId, planId, token),
    onSuccess: () => {
      toast.success("Payment plan deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["projectDetails", projectId.toString()] });
      setIsDeletePaymentPlanModalOpen(false);
      setPaymentPlanToDelete(null);
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(
        axiosError?.response?.data?.message || "Failed to delete payment plan."
      );
    },
  });

  const handleDeletePaymentPlan = (plan: PaymentPlan) => {
    setPaymentPlanToDelete(plan);
    setIsDeletePaymentPlanModalOpen(true);
  };

  const confirmDeletePaymentPlan = () => {
    if (paymentPlanToDelete) {
      deletePaymentPlanMutation.mutate(paymentPlanToDelete.payment_plan_id);
    }
  };

  const handleEditPaymentPlan = (plan: PaymentPlan) => {
    // setEditingPaymentPlan(plan);
    // setIsEditPaymentPlanModalOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Payment Plans</h3>
        <div className="flex gap-2">
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
            onClick={() => setIsPaymentPlanModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Payment Plan
          </Button>
        </div>
      </div>
      <div className="space-y-6">
        {paymentPlans.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No payment plans available
          </div>
        ) : (
          paymentPlans.map((plan, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {plan.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {plan.description}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditPaymentPlan(plan)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeletePaymentPlan(plan)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {plan.total_cost && (
                <div className="bg-gray-50 rounded-lg p-6 mb-4">
                  <p className="text-3xl font-bold text-gray-900 text-center">
                    {plan.total_cost} {currency}
                  </p>
                  <p className="text-sm text-gray-600 text-center mt-1">
                    Total Cost
                  </p>
                </div>
              )}
              {plan.paymentplanitems && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3">
                    Payment Schedule
                  </p>
                  <div className="space-y-2">
                    {plan.paymentplanitems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-600">
                          {item.type}
                        </span>
                        <span className="font-medium text-gray-900">
                          {item.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <AddPaymentPlanModal
        isOpen={isPaymentPlanModalOpen}
        onClose={() => setIsPaymentPlanModalOpen(false)}
        projectId={projectId}
        developerId={developerId}
        status="active"
      />
      
      {/* <EditPaymentPlanModal
        isOpen={isEditPaymentPlanModalOpen}
        onClose={() => {
          setIsEditPaymentPlanModalOpen(false);
          setEditingPaymentPlan(null);
        }}
        paymentPlan={editingPaymentPlan}
        projectId={projectId}
        developerId={developerId}
      /> */}

      <DeleteFeatureModal
        isOpen={isDeletePaymentPlanModalOpen}
        onClose={() => {
          setIsDeletePaymentPlanModalOpen(false);
          setPaymentPlanToDelete(null);
        }}
        onConfirm={confirmDeletePaymentPlan}
        feature={
          paymentPlanToDelete
            ? {
                feature_id: paymentPlanToDelete.payment_plan_id,
                feature_name: paymentPlanToDelete.name,
                value: paymentPlanToDelete.total_cost?.toString() || "",
                description: paymentPlanToDelete.description,
                is_amenity: 0,
              }
            : null
        }
        isDeleting={deletePaymentPlanMutation.isPending}
      />
    </div>
  );
}
