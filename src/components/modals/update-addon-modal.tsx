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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Loader2, Info } from "lucide-react";
import useDashboardAdminSubscriptions from "@/hooks/use-dashboardAdminSubscriptions";

type FormValues = {
  feature_id: string;
  name: string;
  code: string;
  amount: number;
  price_cents: number;
  is_active: boolean;
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  addonData?: any;
}

export default function UpdateAddonModal({ open, onClose, onSuccess, addonData }: Props) {
  const { updateAddonMutation, addonTypesQuery } = useDashboardAdminSubscriptions();
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
      feature_id: "",
      name: "",
      code: "",
      amount: 0,
      price_cents: 0,
      is_active: true,
    },
  });

  const selectedFeatureId = watch("feature_id");
  const addonTypesData = addonTypesQuery.data?.data;
  const addonTypes = Array.isArray(addonTypesData) ? addonTypesData : (addonTypesData?.data || []);

  const selectedFeature = addonTypes.find((t: any) => String(t.feature_id) === String(selectedFeatureId));

  useEffect(() => {
    if (open && addonData) {
      reset({
        feature_id: String(addonData.feature_id || ""),
        name: addonData.name || "",
        code: addonData.code || "",
        amount: addonData.amount || 0,
        price_cents: addonData.price_cents ? addonData.price_cents / 100 : 0, // converting from cents to display
        is_active: addonData.is_active !== undefined ? addonData.is_active : true,
      });
      setApiError(null);
    }
  }, [open, addonData, reset]);

  const submitHandler = async (data: FormValues) => {
    setApiError(null);

    try {
      const payload = {
        name: data.name.trim(),
        code: data.code.trim(),
        amount: data.amount,
        price_cents: data.price_cents * 100, // converting to cents
        feature_id: Number(data.feature_id),
        is_active: data.is_active,
        currency: addonData?.currency || "AED"
      };

      const id = addonData?.id || addonData?.addon_id;
      await updateAddonMutation.mutateAsync({ id, data: payload });

      toast.success("Add-on updated successfully", {
        description: `Add-on "${data.name}" has been updated.`,
      });

      reset();
      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update add-on. Please try again.";
      setApiError(errorMessage);

      toast.error("Failed to update add-on", {
        description: errorMessage,
      });
    }
  };

  const handleClose = () => {
    if (!updateAddonMutation.isPending) {
      reset();
      setApiError(null);
      onClose();
    }
  };

  const isLoading = updateAddonMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-100">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Update Add-on
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

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-800">Add-on Type <span className="text-red-500">*</span></Label>
            <Controller
              name="feature_id"
              control={control}
              rules={{ required: "Add-on type is required" }}
              render={({ field }) => (
                <Select
                  disabled={isLoading || addonTypesQuery.isLoading}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="bg-gray-50 border-gray-200 h-11">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {addonTypes.map((type: any) => (
                      <SelectItem key={type.feature_id} value={String(type.feature_id)}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.feature_id && (
              <p className="text-xs text-red-500">{errors.feature_id.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-800">Add-on name <span className="text-red-500">*</span></Label>
              <Input
                placeholder="e.g Text package"
                className="bg-gray-50 border-gray-200 h-11"
                disabled={isLoading}
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-800">Unique Code <span className="text-red-500">*</span></Label>
              <Input
                placeholder="e.g text_pkg_01"
                className="bg-gray-50 border-gray-200 h-11"
                disabled={isLoading}
                {...register("code", { required: "Code is required" })}
              />
              {errors.code && (
                <p className="text-xs text-red-500">{errors.code.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-800">
                {selectedFeature?.unit || "Tokens"} <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                min="0"
                className="bg-gray-50 border-gray-200 h-11"
                disabled={isLoading}
                {...register("amount", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Cannot be negative" },
                })}
              />
              <p className="text-xs text-gray-500 mt-1">Number of {selectedFeature?.unit || "tokens"}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-800">Price ( {addonData?.currency || "AED"} ) <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                className="bg-gray-50 border-gray-200 h-11"
                disabled={isLoading}
                {...register("price_cents", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Cannot be negative" },
                })}
              />
              <p className="text-xs text-gray-500 mt-1">One-time purchase price</p>
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
                  className="data-[state=checked]:bg-purple-500"
                />
              )}
            />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </div>

          {selectedFeature && (
            <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 mt-6">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">{selectedFeature.name}:</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    • {selectedFeature.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:justify-end pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="h-11 px-6 rounded-lg font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white h-11 px-6 rounded-lg font-medium"
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
