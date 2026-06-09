"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import { Button, Input } from "@/components/ui";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCustomerPlans } from "@/hooks/use-dashboardAdminSubscriptions";
import { AdminFeaturesService } from "@/services/AdminFeaturesService";
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
  const [selectedFeatures, setSelectedFeatures] = useState<{ feature_id: number, limit: number | null }[]>([]);

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
    },
  });

  const { data: featuresQuery, isLoading: loadingFeatures } = useQuery({
    queryKey: ["dashboard", "badges"],
    queryFn: () => AdminSubscriptionsService.getBadges(),
    enabled: open,
  });

  const featuresResponse = (featuresQuery as any)?.data;
  let availableFeatures: any[] = [];

  if (Array.isArray(featuresResponse)) {
    availableFeatures = featuresResponse;
  } else if (featuresResponse && typeof featuresResponse === 'object') {
    const topLevelArrays = Object.values(featuresResponse).filter(Array.isArray);
    if (topLevelArrays.length > 0) {
      availableFeatures = topLevelArrays[0] as any[];
    } else if (featuresResponse.data && typeof featuresResponse.data === 'object') {
      const nestedArrays = Object.values(featuresResponse.data).filter(Array.isArray);
      if (nestedArrays.length > 0) {
        availableFeatures = nestedArrays[0] as any[];
      }
    }
  }

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
    setSelectedFeatures([]);
    onClose();
  };

  const toggleFeature = (featureId: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedFeatures([...selectedFeatures, { feature_id: featureId, limit: null }]);
    } else {
      setSelectedFeatures(selectedFeatures.filter(f => f.feature_id !== featureId));
    }
  };

  const updateFeatureLimit = (featureId: number, limitVal: string) => {
    setSelectedFeatures(
      selectedFeatures.map(f =>
        f.feature_id === featureId ? { ...f, limit: limitVal ? Number(limitVal) : null } : f
      )
    );
  };

  const onSubmit = (formData: any) => {
    const formattedFeatures = selectedFeatures.map(f => {
      const obj: any = { feature_id: f.feature_id };
      if (f.limit !== null) obj.limit = f.limit;
      return obj;
    });

    const apiData = {
      code: formData.code,
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      interval: formData.interval,
      currency: formData.currency,
      is_active: formData.is_active === "true",
      sort_order: Number(formData.sort_order),
      features: formattedFeatures,
    };
    mutation.mutate(apiData);
  };

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title="Create New Customer Plan"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto px-1 pb-2">
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
          <Input placeholder="Plan description" {...register("description")} />
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
        </div>

        <div className="space-y-3 mt-6 border-t pt-4">
          <Label className="text-base font-semibold">Included Features</Label>
          {loadingFeatures ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading features...
            </div>
          ) : availableFeatures.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No features found in the system.</p>
          ) : (
            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100 max-h-60 overflow-y-auto">
              {availableFeatures.map((feature: any) => {
                const fId = feature.feature_id || feature.badge_id || feature.id;
                const isSelected = selectedFeatures.some(f => f.feature_id === fId);
                const selectedData = selectedFeatures.find(f => f.feature_id === fId);

                return (
                  <div key={fId} className={`flex flex-col gap-2 p-3 rounded-lg border ${isSelected ? 'border-teal-200 bg-teal-50/30' : 'border-gray-200 bg-white'}`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <div className="flex h-5 items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-600 cursor-pointer"
                          checked={isSelected}
                          onChange={(e) => toggleFeature(fId, e.target.checked)}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-black">{feature.feature_name || feature.name || feature.code}</span>
                        <span className="text-xs text-black">{feature.description || feature.applies_to}</span>
                      </div>
                    </label>

                    {isSelected && (
                      <div className="ml-7 pl-1">
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">Limit (optional):</Label>
                          <Input
                            type="number"
                            className="h-7 w-24 text-xs"
                            placeholder="Unlimited"
                            value={selectedData?.limit || ''}
                            onChange={(e) => updateFeatureLimit(fId, e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end pt-4 sticky bottom-0 bg-white border-t mt-4 py-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending} className="bg-teal-600 hover:bg-teal-700 text-white">
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Plan
          </Button>
        </div>
      </form>
    </Modal>
  );
}