"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/modal";
import { Button, Input, Checkbox } from "@/components/ui";
import { Label } from "@/components/ui/label";
import { editFeature } from "@/data/api-client";
import toast from "react-hot-toast";
import { featureSchema, FeatureInput } from "@/validators/feature.schema";
import { FeaturesDataType } from "@/types";

interface Feature {
  id: number;
  featureName: string;
  isAmenity: boolean;
  icon: string;
}

interface EditFeatureModal2Props {
  isOpen: boolean;
  onClose: () => void;
  feature: Feature | null;
}

export function EditFeatureModal2({
  isOpen,
  onClose,
  feature,
}: EditFeatureModal2Props) {
  // const queryClient = useQueryClient();
  // const { data: session } = useSession();
  // const token = session?.user?.accessToken;

  // const [selectedIcon, setSelectedIcon] = useState("");

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  //   reset,
  //   watch,
  //   setValue,
  // } = useForm<FeatureInput>({
  //   resolver: zodResolver(featureSchema),
  //   defaultValues: {
  //     feature_name: "",
  //     is_amenity: 0,
  //     icons: "",
  //   },
  // });

  // // Populate form when feature is provided
  // useEffect(() => {
  //   if (feature) {
  //     reset({
  //       feature_name: feature.featureName,
  //       is_amenity: feature.isAmenity ? 1 : 0,
  //       icons: feature.icon || "",
  //     });
  //     setSelectedIcon(feature.icon || "");
  //   }
  // }, [feature, reset]);

  // const mutation = useMutation({
  //   mutationFn: (data: FeatureInput) => {
  //     if (!feature || !token) throw new Error("Missing feature or token");
  //     // Cast to the expected type for the API
  //     const apiData: FeaturesDataType = {
  //       feature_id: feature.id,
  //       feature_name: data.feature_name,
  //       value: data.icons || "",
  //       is_amenity: data.is_amenity || 0,
  //       icons: data.icons || "",
  //     };
  //     return editFeature(feature.id, apiData, token);
  //   },
  //   onSuccess: () => {
  //     toast.success("Feature updated successfully!");
  //     queryClient.invalidateQueries({ queryKey: ["features"] });
  //     handleClose();
  //   },
  //   onError: () => {
  //     toast.error("Failed to update Feature. Please try again.");
  //   },
  // });

  // const handleFormSubmit = (formData: FeatureInput) => {
  //   mutation.mutate(formData);
  // };

  // const handleClose = () => {
  //   reset();
  //   setSelectedIcon("");
  //   onClose();
  // };

  // if (!isOpen || !feature) return null;

  // return (
  //   <Modal
  //     isOpen={isOpen}
  //     onClose={handleClose}
  //     title="Edit Feature"
  //     size="md"
  //   >
  //     <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
  //       <div className="space-y-2">
  //         <Label htmlFor="feature_name">Feature Name</Label>
  //         <Input
  //           id="feature_name"
  //           {...register("feature_name")}
  //           placeholder="Enter feature name"
  //         />
  //         {errors.feature_name && (
  //           <p className="text-sm text-red-500">{errors.feature_name.message}</p>
  //         )}
  //       </div>

  //       <div className="flex items-center gap-2">
  //         <Checkbox
  //           id="is_amenity"
  //           checked={watch("is_amenity") === 1}
  //           onCheckedChange={(checked) => setValue("is_amenity", checked ? 1 : 0)}
  //         />
  //         <Label htmlFor="is_amenity" className="mb-0">
  //           Is Amenity
  //         </Label>
  //         {errors.is_amenity && (
  //           <p className="text-sm text-red-500">{errors.is_amenity.message}</p>
  //         )}
  //       </div>

  //       <div className="space-y-2">
  //         <Label htmlFor="icons">Icon (add it as IoMdBook)</Label>
  //         <Input
  //           id="icons"
  //           {...register("icons")}
  //           placeholder="e.g, FaWifi, MdFitnessCenter"
  //           onChange={(e) => setSelectedIcon(e.target.value)}
  //         />
  //         {errors.icons && (
  //           <p className="text-sm text-red-500">{errors.icons.message}</p>
  //         )}
  //         {selectedIcon && (
  //           <p className="text-sm text-gray-500">Selected: {selectedIcon}</p>
  //         )}
  //       </div>

  //       <div className="flex justify-end gap-2">
  //         <Button variant="outline" onClick={handleClose}>
  //           Cancel
  //         </Button>
  //         <Button type="submit" disabled={mutation.isPending}>
  //           {mutation.isPending ? "Saving..." : "Save Changes"}
  //         </Button>
  //       </div>
  //     </form>
  //   </Modal>
  // );
}
