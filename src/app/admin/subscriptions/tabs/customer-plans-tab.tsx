"use client";

import { useState, useCallback } from "react";
import { Plus, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomerPlans } from "@/hooks/use-dashboardAdminSubscriptions";

import { CustomerPlanCard } from "../components/customer-plan-card";
import { LoadingSkeleton } from "../components/loading-skeleton";
import { ErrorState } from "../components/error-state";
import { EmptyState } from "../components/empty-state";

import AddCustomerPlanModal from "@/components/modals/add-customer-plan-modal";
import UpdateCustomerPlanModal from "@/components/modals/update-customer-plan-modal";
import ViewCustomerPlanModal from "@/components/modals/view-customer-plan-modal";

export function CustomerPlansTab() {
  const {
    customerPlansQuery,
    deleteCustomerPlanMutation,
  } = useCustomerPlans();

  const [searchQuery, setSearchQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updatePlanId, setUpdatePlanId] = useState<number | string | null>(null);
  const [viewPlanId, setViewPlanId] = useState<number | string | null>(null);

  const handleDeleteCustomerPlan = useCallback(
    (planId: number | string) => {
      deleteCustomerPlanMutation.mutate(planId, {
        onSuccess: () => {
          toast.success("Customer plan deleted successfully");
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : "Failed to delete customer plan";
          toast.error(message);
        },
      });
    },
    [deleteCustomerPlanMutation],
  );

  const customerPlans = (customerPlansQuery.data?.data as any)?.data || [];

  const filteredCustomerPlans = customerPlans.filter(
    (plan: any) =>
      plan.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.code?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search plans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => customerPlansQuery.refetch()}
            disabled={customerPlansQuery.isFetching}
            className="gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${customerPlansQuery.isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Content */}
      {customerPlansQuery.isLoading ? (
        <LoadingSkeleton />
      ) : customerPlansQuery.isError ? (
        <ErrorState
          error={
            customerPlansQuery.error instanceof Error
              ? customerPlansQuery.error.message
              : "Failed to load customer plans"
          }
          onRetry={() => customerPlansQuery.refetch()}
        />
      ) : filteredCustomerPlans.length === 0 ? (
        <EmptyState
          title="No customer plans found"
          message="There are no customer plans available at the moment."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCustomerPlans.map((plan: any, index: number) => (
            <CustomerPlanCard
              key={plan.id || plan.code || `plan-${index}`}
              plan={plan}
              onView={(id) => setViewPlanId(id)}
              onEdit={(id) => setUpdatePlanId(id)}
              onDelete={handleDeleteCustomerPlan}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddCustomerPlanModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          customerPlansQuery.refetch();
          setCreateModalOpen(false);
        }}
      />

      <UpdateCustomerPlanModal
        open={!!updatePlanId}
        onClose={() => setUpdatePlanId(null)}
        onSuccess={() => {
          customerPlansQuery.refetch();
          setUpdatePlanId(null);
        }}
        planId={updatePlanId}
      />

      <ViewCustomerPlanModal
        open={!!viewPlanId}
        onClose={() => setViewPlanId(null)}
        planId={viewPlanId}
      />
    </div>
  );
}
