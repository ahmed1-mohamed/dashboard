"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAddProjectFeatureData } from "@/hooks/use-add-project-feature";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/modal";
import { Button, Input } from "@/components/ui";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Check, Loader2, HelpCircle } from "lucide-react";
import { addProjectFeature } from "@/data/api-client";
import { toast } from "sonner";
import { z } from "zod";
import { useState } from "react";

interface FeatureOption {
  feature_id: number;
  feature_name: string;
  is_amenity: number;
}

interface AddProjectFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  projectId: number;
}

const projectFeatureSchema = z.object({
  feature_id: z.number().min(1, "Feature is required"),
  value: z.string().min(1, "Value is required"),
  is_amenity: z.number().min(0).max(1).optional(),
});

type ProjectFeatureFormData = z.infer<typeof projectFeatureSchema>;

export function AddProjectFeatureModal({
  isOpen,
  onClose,
  onSuccess,
  projectId,
}: AddProjectFeatureModalProps) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const { features, loading: featuresLoading } =
    useAddProjectFeatureData(isOpen);

  const [addAnother, setAddAnother] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    setError,
    watch,
  } = useForm<ProjectFeatureFormData>({
    resolver: zodResolver(projectFeatureSchema),
    defaultValues: {
      feature_id: undefined,
      value: "",
      is_amenity: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: any) => addProjectFeature(data, token!),
    onSuccess: () => {
      toast.success("Project feature added successfully!");
      queryClient.invalidateQueries({ queryKey: ["projectDetails"] });
      handleClose();
    },
    onError: (error: any) => {
      setError("root", {
        message: error.message || "Failed to Create Project Feature.",
      });
    },
  });

  const handleClose = () => {
    reset();
    setAddAnother(false);
    onClose();
  };

  const onSubmit = (formData: ProjectFeatureFormData) => {
    const data = {
      project_id: projectId,
      features: [
        {
          feature_id: formData.feature_id,
          value: formData.value,
          description: "",
        },
      ],
    };

    console.log("Data being sent to the server:", data);
    mutation.mutate(data);
  };

  const isAmenityValue = watch("is_amenity");

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Project Feature"
      size="md"
      showCloseButton={false}
      scrollable
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-1">
        {errors.root && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
            {errors.root.message}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <div className="p-1.5 bg-blue-100 rounded-md">
            <Sparkles className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">
              Add Project Feature
            </p>
            <p className="text-xs text-blue-600">
              Assign features to this project
            </p>
          </div>
        </div>

        {/* Feature Selection */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs">
            <Sparkles className="h-3 w-3 text-blue-500" />
            Feature name <span className="text-red-500">*</span>
            <HelpCircle className="h-3 w-3 text-gray-400 ml-auto" />
          </Label>
          <Controller
            name="feature_id"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value?.toString() || ""}
                onValueChange={(val) => field.onChange(Number(val))}
              >
                <SelectTrigger className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 py-3">
                  <SelectValue
                    placeholder={
                      featuresLoading
                        ? "Loading features..."
                        : "Select a feature"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {featuresLoading ? (
                    <div className="p-2 text-sm text-gray-500 text-center">
                      Loading features...
                    </div>
                  ) : features.length === 0 ? (
                    <div className="p-2 text-sm text-gray-500 text-center">
                      No features available
                    </div>
                  ) : (
                    features.map((feature) => (
                      <SelectItem
                        key={feature.feature_id}
                        value={feature.feature_id.toString()}
                      >
                        <div className="flex items-center gap-2">
                          <span>{feature.feature_name}</span>
                          {feature.is_amenity === 1 && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                              Amenity
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.feature_id && (
            <p className="text-xs text-red-500">{errors.feature_id.message}</p>
          )}
        </div>

        {/* Value Input */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs">
            <Sparkles className="h-3 w-3 text-blue-500" />
            Value <span className="text-red-500">*</span>
            <HelpCircle className="h-3 w-3 text-gray-400 ml-auto" />
          </Label>
          <Input
            placeholder="Enter feature value (e.g., Yes, No, 10, etc.)"
            {...register("value")}
            className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 py-3"
          />
          {errors.value && (
            <p className="text-xs text-red-500">{errors.value.message}</p>
          )}
        </div>

        {/* Is Amenity Toggle - This will set the amenity status for the feature assignment */}
        {/* <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-blue-100 rounded">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Mark as Amenity</Label>
              <p className="text-xs text-gray-500">Indicates if this feature is an amenity</p>
            </div>
          </div>
          <Controller
            name="is_amenity"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value === 1}
                onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                className="data-[state=checked]:bg-blue-600"
              />
            )}
          />
        </div> */}

        {/* Footer */}
        <div className="space-y-3 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="addAnother"
              checked={addAnother}
              onChange={(e) => setAddAnother(e.target.checked)}
              disabled={mutation.isPending}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />

            <label htmlFor="addAnother" className="text-sm text-gray-700">
              Add another item
            </label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={mutation.isPending}
              className="hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Add Feature
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
