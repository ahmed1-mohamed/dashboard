"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateFeature } from "@/hooks/use-create-feature";
import { Modal } from "@/components/ui/modal";
import { Button, Input, Checkbox } from "@/components/ui";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { featureSchema, FeatureInput } from "@/validators/feature.schema";
import { Edit, Trash2 } from "lucide-react";

interface AddFeatureModal2Props {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (feature: {
    id: number;
    featureName: string;
    isAmenity: boolean;
    icon: string;
  }) => void;
  onDelete?: (feature: {
    id: number;
    featureName: string;
    isAmenity: boolean;
    icon: string;
  }) => void;
}

export function AddFeatureModal2({
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: AddFeatureModal2Props) {
  const [selectedIcon, setSelectedIcon] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FeatureInput>({
    resolver: zodResolver(featureSchema),
    defaultValues: {
      feature_name: "",
      is_amenity: 0,
      icons: "",
    },
  });

  const { createFeature, isCreating } = useCreateFeature();

  const handleFormSubmit = async (formData: any) => {
    try {
      await createFeature(formData);
      handleClose();
    } catch (error) {
      console.error("Failed to create feature:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Feature"
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="feature_name" className="text-xs">
            Feature Name
          </Label>
          <Input
            id="feature_name"
            {...register("feature_name")}
            placeholder="Enter feature name"
            className="py-2"
          />
          {errors.feature_name && (
            <p className="text-xs text-red-500">
              {errors.feature_name.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 py-1">
          <Checkbox
            id="is_amenity"
            checked={watch("is_amenity") === 1}
            onCheckedChange={(checked) =>
              setValue("is_amenity", checked ? 1 : 0)
            }
          />
          <Label htmlFor="is_amenity" className="mb-0 text-xs">
            Is Amenity
          </Label>
          {errors.is_amenity && (
            <p className="text-xs text-red-500">{errors.is_amenity.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="icons" className="text-xs">
            Icon (add it as IoMdBook)
          </Label>
          <Input
            id="icons"
            {...register("icons")}
            placeholder="e.g, FaWifi, MdFitnessCenter"
            onChange={(e) => setSelectedIcon(e.target.value)}
            className="py-2"
          />
          {errors.icons && (
            <p className="text-xs text-red-500">{errors.icons.message}</p>
          )}
          {selectedIcon && (
            <p className="text-xs text-gray-500">Selected: {selectedIcon}</p>
          )}
        </div>

        <div className="flex justify-between gap-2 pt-2">
          <div className="flex gap-1.5">
            {onEdit && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const feature = {
                    id: 0,
                    featureName: "",
                    isAmenity: false,
                    icon: "",
                  };
                  onEdit(feature);
                }}
                className="gap-1.5 text-xs h-8"
              >
                <Edit className="h-3.5 w-3.5" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const feature = {
                    id: 0,
                    featureName: "",
                    isAmenity: false,
                    icon: "",
                  };
                  onDelete(feature);
                }}
                className="gap-1.5 text-xs h-8 text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              onClick={handleClose}
              className="text-xs h-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs h-8"
            >
              {isCreating ? "Creating..." : "Create Feature"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
