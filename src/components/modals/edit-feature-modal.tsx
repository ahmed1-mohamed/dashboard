"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/modal";
import { Button, Input } from "@/components/ui";
import { Label } from "@/components/ui/label";
import { Check, Loader2 } from "lucide-react";
import { useEditProjectFeatureData } from "@/hooks/use-edit-project-feature";
import { useProjectFeatureActions } from "@/hooks/use-project-feature-actions";
import {
  editProjectFeatureSchema,
  EditProjectFeatureInput,
} from "@/validators/project-features.schema";

interface Feature {
  feature_id: number;
  feature_name: string;
  value?: string;
  description?: string;
}

interface EditFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  feature: Feature | null;
}

export function EditFeatureModal({
  isOpen,
  onClose,
  projectId,
  feature,
}: EditFeatureModalProps) {
  // const featureId = feature?.feature_id || null;

  // const { data, isLoading } = useEditProjectFeatureData(projectId, featureId);
  // const { updateProjectFeature, isUpdating } = useProjectFeatureActions();

  // const {
  //   handleSubmit,
  //   formState: { errors },
  //   reset,
  // } = useForm<EditProjectFeatureInput>({
  //   resolver: zodResolver(editProjectFeatureSchema),
  //   defaultValues: {
  //     value: "",
  //     description: "",
  //   },
  // });

  // useEffect(() => {
  //   if (data) {
  //     reset({
  //       value: data.value || "",
  //       description: data.description || "",
  //     });
  //   }
  // }, [data, reset]);



  // const handleClose = () => {
  //   reset();
  //   onClose();
  // };

  // const handleFormSubmit = async (formData: EditProjectFeatureInput) => {
  //   const payload = {
  //     value: formData.value,
  //     description: formData.description,
  //   };
  //   console.log("Payload being sent to the server:", payload);
  //   await updateProjectFeature({ projectId, featureId: featureId!, data: payload });
  //   onClose();
  // };

  // if (!feature) return null;

  // return (
  //   <Modal
  //     isOpen={isOpen}
  //     onClose={handleClose}
  //     title="Edit Feature"
  //     size="md"
  //     showCloseButton={false}
  //   >
  //     {isLoading ? (
  //       <div className="flex justify-center py-8">
  //         <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
  //       </div>
  //     ) : (
  //       <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
  //         <div className="space-y-2">
  //           <Label>Feature Name</Label>
  //           <Input value={feature.feature_name} className="bg-gray-100" />
  //         </div>

  //         <div className="space-y-2">
  //           <Label>Value</Label>
  //           <Input
  //             placeholder="e.g. 5 bedrooms"
  //             value={feature.value}
  //             name="value"
  //           />
  //           {errors.value && (
  //             <p className="text-xs text-red-500">{errors.value.message}</p>
  //           )}
  //         </div>

  //         <div className="space-y-2">
  //           <Label>Description</Label>
  //           <Input
  //             placeholder="Optional description"
  //             value={feature.description}
  //             name="description"
  //           />
  //           {errors.description && (
  //             <p className="text-xs text-red-500">
  //               {errors.description.message}
  //             </p>
  //           )}
  //         </div>

  //         <div className="flex gap-3 justify-end pt-4 border-t">
  //           <Button type="button" variant="outline" onClick={handleClose}>
  //             Cancel
  //           </Button>
  //           <Button
  //             type="submit"
  //             className="bg-teal-600 hover:bg-teal-700 text-white"
  //             disabled={isUpdating}
  //           >
  //             {isUpdating ? (
  //               <>
  //                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
  //                 Saving...
  //               </>
  //             ) : (
  //               <>
  //                 <Check className="w-4 h-4 mr-2" />
  //                 Save Changes
  //               </>
  //             )}
  //           </Button>
  //         </div>
  //       </form>
  //     )}
  //   </Modal>
  // );
}
