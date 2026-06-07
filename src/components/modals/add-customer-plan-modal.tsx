"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import { Button, Input } from "@/components/ui";
import { Label } from "@/components/ui/label";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminSubscriptionsService } from "@/services/AdminSubscriptionsService";

interface AddCustomerPlanModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddCustomerPlanModal({
  open,
  onClose,
  onSuccess,
}: AddCustomerPlanModalProps) {
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
      price: 0,
      interval: "month",
      currency: "USD",
      is_active: "true",
      max_users: 10,
      storage_gb: 10,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: any) => AdminSubscriptionsService.createCustomerPlan(data),
    onSuccess: () => {
      toast.success("Customer plan created successfully!");
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "customerPlans"] });
      if (onSuccess) {
        onSuccess();
      }
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create plan");
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
      price: Number(formData.price),
      interval: formData.interval,
      currency: formData.currency,
      is_active: formData.is_active === "true",
      features: {
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
      title="Create New Customer Plan"
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label>Plan Code</Label>
          <Input placeholder="e.g. premium_monthly" {...register("code", { required: true })} />
        </div>
        
        <div className="space-y-1.5">
          <Label>Plan Name</Label>
          <Input placeholder="e.g. Premium Monthly" {...register("name", { required: true })} />
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
            <Label>Max Users</Label>
            <Input type="number" {...register("max_users", { required: true })} />
          </div>
          <div className="space-y-1.5">
            <Label>Storage (GB)</Label>
            <Input type="number" {...register("storage_gb", { required: true })} />
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Plan
          </Button>
        </div>
      </form>
    </Modal>
  );
}
