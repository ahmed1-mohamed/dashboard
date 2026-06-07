"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import { Button, Input } from "@/components/ui";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminSubscriptionsService } from "@/services/AdminSubscriptionsService";

interface UpdateCustomerPlanModalProps {
  open: boolean;
  onClose: () => void;
  planId: number | string | null;
  onSuccess?: () => void;
}

export default function UpdateCustomerPlanModal({
  open,
  onClose,
  planId,
  onSuccess,
}: UpdateCustomerPlanModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: "",
      name: "",
      description: "",
      price: 0,
      interval: "month",
      currency: "USD",
      is_active: "true",
      sort_order: 1,
      max_users: 10,
      storage_gb: 10,
    },
  });

  const { data: queryData, isLoading, isError } = useQuery({
    queryKey: ["subscriptions", "customerPlan", planId],
    queryFn: () => {
      if (planId == null) return null;
      return AdminSubscriptionsService.getCustomerPlanById(planId);
    },
    enabled: planId != null && open,
  });

  const responsePayload = (queryData as any)?.data || queryData;
  const plan = responsePayload?.data || responsePayload || null;

  useEffect(() => {
    if (plan) {
      reset({
        code: plan.code || "",
        name: plan.name || "",
        description: plan.description || "",
        price: plan.price || 0,
        interval: plan.interval || "month",
        currency: plan.currency || "USD",
        is_active: plan.is_active ? "true" : "false",
        sort_order: plan.sort_order || 1,
        max_users: plan.features?.max_users || 10,
        storage_gb: plan.features?.storage_gb || 10,
      });
    }
  }, [plan, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) => AdminSubscriptionsService.updateCustomerPlan(planId!, data),
    onSuccess: () => {
      toast.success("Customer plan updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "customerPlans"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "customerPlan", planId] });
      if (onSuccess) {
        onSuccess();
      }
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update plan");
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (formData: any) => {
    const apiData = {
      code: formData.code,
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      interval: formData.interval,
      currency: formData.currency,
      is_active: formData.is_active === "true",
      sort_order: Number(formData.sort_order),
      features: Array.isArray(plan?.features) ? plan.features : {
        ...(plan?.features || {}),
        max_users: Number(formData.max_users),
        storage_gb: Number(formData.storage_gb),
      },
    };
    mutation.mutate(apiData);
  };

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title="Update Customer Plan"
      size="md"
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-4" />
          <p className="text-gray-500">Loading plan details...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-500 mb-2">Failed to load plan details.</p>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Plan Code</Label>
              <Input placeholder="e.g. premium_monthly" {...register("code", { required: true })} />
            </div>
            
            <div className="space-y-1.5">
              <Label>Plan Name</Label>
              <Input placeholder="e.g. Premium Monthly" {...register("name", { required: true })} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <Input placeholder="e.g. Best plan for users" {...register("description")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Price</Label>
              <Input type="number" step="0.01" {...register("price", { required: true })} />
            </div>
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Input placeholder="USD" {...register("currency", { required: true })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Interval</Label>
              <select
                {...register("interval")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Active Status</Label>
              <select
                {...register("is_active")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Sort Order</Label>
              <Input type="number" {...register("sort_order")} />
            </div>
            <div className="space-y-1.5"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Max Users</Label>
              <Input type="number" {...register("max_users", { required: true })} />
            </div>
            <div className="space-y-1.5">
              <Label>Storage (GB)</Label>
              <Input type="number" {...register("storage_gb", { required: true })} />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={mutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
