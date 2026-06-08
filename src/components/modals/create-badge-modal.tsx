"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Loader2 } from "lucide-react";
import { useFeatures } from "@/hooks/use-dashboardAdminSubscriptions";

type FormValues = {
  name: string;
  applies_to: string;
  monthly_price_credits: number;
  max_entities: number;
  priority_boost: number;
  is_active: boolean;
  has_placement: boolean;
  placement_platform: string;
  placement_location: string;
  placement_format: string;
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateBadgeModal({ open, onClose, onSuccess }: Props) {
  const { createBadgeMutation } = useFeatures();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      applies_to: "developer",
      monthly_price_credits: 0,
      max_entities: 1,
      priority_boost: 0,
      is_active: true,
      has_placement: false,
      placement_platform: "web",
      placement_location: "",
      placement_format: "icon",
    },
  });

  const hasPlacement = watch("has_placement");

  const submitHandler = async (data: FormValues) => {
    setApiError(null);

    try {
      const payload: any = {
        name: data.name.trim(),
        applies_to: data.applies_to,
        monthly_price_credits: data.monthly_price_credits,
        max_entities: data.max_entities,
        priority_boost: data.priority_boost,
        is_active: data.is_active,
      };

      if (data.has_placement) {
        payload.placement = {
          platform: data.placement_platform,
          location: data.placement_location.trim(),
          format: data.placement_format,
        };
      }

      await createBadgeMutation.mutateAsync(payload);

      toast.success("Feature created successfully", {
        description: `Feature "${data.name}" has been created.`,
      });

      reset();
      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create feature. Please try again.";
      setApiError(errorMessage);

      toast.error("Failed to create feature", {
        description: errorMessage,
      });
    }
  };

  const handleClose = () => {
    if (!createBadgeMutation.isPending) {
      reset();
      setApiError(null);
      onClose();
    }
  };

  const isLoading = createBadgeMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-lg font-semibold">
            Add Feature / Badge
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6 mt-4">
          {apiError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              <div className="flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>{apiError}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                placeholder="e.g Verified Agent"
                disabled={isLoading}
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Applies To *</Label>
              <Controller
                name="applies_to"
                control={control}
                rules={{ required: "Applies to is required" }}
                render={({ field }) => (
                  <Select
                    disabled={isLoading}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="property">Property</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Monthly Price (Credits) *</Label>
              <Input
                type="number"
                min="0"
                disabled={isLoading}
                {...register("monthly_price_credits", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Cannot be negative" },
                })}
              />
              {errors.monthly_price_credits && (
                <p className="text-xs text-red-500">{errors.monthly_price_credits.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Max Entities *</Label>
              <Input
                type="number"
                min="1"
                disabled={isLoading}
                {...register("max_entities", {
                  valueAsNumber: true,
                  min: { value: 1, message: "Min 1" },
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>Priority Boost</Label>
              <Input
                type="number"
                min="0"
                disabled={isLoading}
                {...register("priority_boost", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Min 0" },
                })}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              )}
            />
            <span className="text-sm font-medium">Active Configuration</span>
          </div>

          <div className="border-t border-gray-100 pt-6 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <Controller
                name="has_placement"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                )}
              />
              <span className="text-sm font-medium">Include UI Placement?</span>
            </div>

            {hasPlacement && (
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Controller
                    name="placement_platform"
                    control={control}
                    render={({ field }) => (
                      <Select
                        disabled={isLoading}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="web">Web</SelectItem>
                          <SelectItem value="mobile">Mobile</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="e.g Profile Header"
                    className="bg-white"
                    disabled={isLoading}
                    {...register("placement_location", {
                      required: hasPlacement ? "Location required" : false,
                    })}
                  />
                  {errors.placement_location && (
                    <p className="text-xs text-red-500">{errors.placement_location.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Format</Label>
                  <Controller
                    name="placement_format"
                    control={control}
                    render={({ field }) => (
                      <Select
                        disabled={isLoading}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="icon">Icon</SelectItem>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="ribbon">Ribbon</SelectItem>
                          <SelectItem value="badge">Badge</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Feature"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
