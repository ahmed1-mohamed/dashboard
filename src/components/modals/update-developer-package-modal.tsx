"use client";

import { useState, useEffect } from "react";
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
import { AlertCircle, Loader2, X } from "lucide-react";
import useDashboardAdminSubscriptions from "@/hooks/use-dashboardAdminSubscriptions";

type FormValues = {
  code: string;
  name: string;
  price_dollars: number;
  credits: number;
  is_active: boolean;
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  packageData?: any;
}

export default function UpdateDeveloperPackageModal({
  open,
  onClose,
  onSuccess,
  packageData,
}: Props) {
  const { updatePackageMutation } = useDashboardAdminSubscriptions();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      code: "",
      name: "",
      price_dollars: 0,
      credits: 1,
      is_active: true,
    },
  });

  useEffect(() => {
    if (open && packageData) {
      reset({
        code: packageData.code || "",
        name: packageData.name || "",
        price_dollars: packageData.price_cents ? packageData.price_cents / 100 : (packageData.price || 0),
        credits: packageData.credits || 1,
        is_active: packageData.is_active !== undefined ? packageData.is_active : (packageData.status !== undefined ? packageData.status : true),
      });
      setApiError(null);
    }
  }, [open, packageData, reset]);

  const validateForm = (
    data: FormValues,
  ): { valid: boolean; errors: string[] } => {
    const validationErrors: string[] = [];

    if (!data.code || data.code.trim() === "") {
      validationErrors.push("Package code is required");
    }

    if (!data.name || data.name.trim() === "") {
      validationErrors.push("Package name is required");
    }

    if (data.price_dollars < 0) {
      validationErrors.push("Price must be non-negative");
    }

    if (data.credits < 1) {
      validationErrors.push("Credits must be at least 1");
    }

    return {
      valid: validationErrors.length === 0,
      errors: validationErrors,
    };
  };

  const submitHandler = async (data: FormValues) => {
    setApiError(null);

    // Client-side validation
    const validation = validateForm(data);
    if (!validation.valid) {
      setApiError(validation.errors.join(". "));
      return;
    }

    try {
      // Convert price from dollars to cents
      const payload = {
        code: data.code.trim(),
        name: data.name.trim(),
        price_cents: Math.round(data.price_dollars * 100),
        credits: data.credits,
        is_active: data.is_active,
        currency: "AED",
      };

      await updatePackageMutation.mutateAsync({ id: packageData.id, data: payload });

      toast.success("Package updated successfully", {
        description: `Package "${data.name}" has been updated.`,
      });

      // Reset form and close modal
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      // Handle error with user-friendly message
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update package. Please try again.";
      setApiError(errorMessage);

      toast.error("Failed to update package", {
        description: errorMessage,
      });
    }
  };

  const handleClose = () => {
    if (!updatePackageMutation.isPending) {
      reset();
      setApiError(null);
      onClose();
    }
  };

  const isLoading = updatePackageMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px] rounded-2xl">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-lg font-semibold">
            Update Developer Package
          </DialogTitle>
        </DialogHeader>

        {/* FORM */}
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-5 mt-2">
          {/* API Error Display */}
          {apiError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              <div className="flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>{apiError}</p>
              </div>
            </div>
          )}

          {/* Package Name and Code */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Package Code *</Label>
              <Input
                placeholder="e.g. standard_pkg"
                disabled={isLoading}
                {...register("code", {
                  required: "Package code is required",
                  minLength: {
                    value: 2,
                    message: "Code must be at least 2 characters",
                  },
                })}
              />
              {errors.code && (
                <p className="text-xs text-red-500">{errors.code.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Package Name *</Label>
              <Input
                placeholder="e.g Standard"
                disabled={isLoading}
                {...register("name", {
                  required: "Package name is required",
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
          </div>

          {/* Price & Credits */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price ( AED ) *</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                disabled={isLoading}
                {...register("price_dollars", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Price must be non-negative",
                  },
                })}
              />
              <p className="text-xs text-muted-foreground">
                One-time payment for credit package
              </p>
              {errors.price_dollars && (
                <p className="text-xs text-red-500">
                  {errors.price_dollars.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Credits *</Label>
              <Input
                type="number"
                min="1"
                placeholder="1"
                disabled={isLoading}
                {...register("credits", {
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: "Credits must be at least 1",
                  },
                })}
              />
              <p className="text-xs text-muted-foreground">
                Total credits developers will receive
              </p>
              {errors.credits && (
                <p className="text-xs text-red-500">{errors.credits.message}</p>
              )}
            </div>
          </div>

          {/* Active Switch */}
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
            <span className="text-sm font-medium">Active</span>
          </div>

          {/* Alert Box */}
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 space-y-1">
            <div className="flex gap-2 items-start">
              <AlertCircle className="w-4 h-4 mt-0.5" />
              <div className="space-y-1">
                <p>• Price per Credit: N/A</p>
                <p>
                  • Developers can use credits to purchase features, ads, and
                  status upgrades
                </p>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <DialogFooter className="gap-2 sm:justify-end pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Close
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update package"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
