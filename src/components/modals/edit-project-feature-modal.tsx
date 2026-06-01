"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/modal";
import { Button, Input } from "@/components/ui";
import { Label } from "@/components/ui/label";

import { Sparkles, Check, Loader2, HelpCircle } from "lucide-react";
import { useEditProjectFeatureData } from "@/hooks/use-edit-project-feature";
import { useProjectFeatureActions } from "@/hooks/use-project-feature-actions";
import { toast } from "sonner";
import { z } from "zod";
import { useEffect } from "react";

interface Feature {
  feature_id: number;
  feature_name: string;
  value?: string;
  description?: string;
}

interface EditProjectFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  projectId: number;
  feature: Feature | null;
}

const editProjectFeatureSchema = z.object({
  value: z.string().min(1, "Value is required"),
  description: z.string().optional(),
});

type EditProjectFeatureFormData = z.infer<typeof editProjectFeatureSchema>;

export function EditProjectFeatureModal({
  isOpen,
  onClose,
  onSuccess,
  projectId,
  feature,
}: EditProjectFeatureModalProps) {
  // const featureId = feature?.feature_id as number;
  // const featureName = feature?.feature_name || "";

  // const {
  //   register,
  //   handleSubmit,
  //   control,
  //   formState: { errors },
  //   reset,
  //   setError,
  //   setValue,
  //   watch,
  // } = useForm<EditProjectFeatureFormData>({
  //   resolver: zodResolver(editProjectFeatureSchema),
  //   defaultValues: {
  //     value: "",
  //     description: "",
  //   },
  // });

  // const { data: featureData, isLoading } = useEditProjectFeatureData(projectId, featureId);

  // useEffect(() => {
  //   if (featureData?.data) {
  //     reset({
  //       value: featureData.data.value || "",
  //       description: featureData.data.description || "",
  //     });
  //   }
  // }, [featureData, reset]);

  // const { updateProjectFeature, isUpdating } = useProjectFeatureActions();

  // const handleClose = () => {
  //   reset();
  //   onClose();
  // };

  // const onSubmit = async (formData: EditProjectFeatureFormData) => {
  //   const data = {
  //     value: formData.value,
  //     description: formData.description || "",
  //   };

  //   console.log("Data being sent to the server:", data);
  //   await updateProjectFeature({ projectId, featureId, data });
  //   onClose();
  // };

  // if (!feature) return null;

  // return (
  //   <Modal
  //     isOpen={isOpen}
  //     onClose={handleClose}
  //     title="Edit Project Feature"
  //     size="md"
  //     showCloseButton={false}
  //     scrollable
  //   >
  //     {isLoading ? (
  //       <div className="flex justify-center py-8">
  //         <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
  //       </div>
  //     ) : (
  //       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-1">
  //         {errors.root && (
  //           <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
  //             {errors.root.message}
  //           </div>
  //         )}

  //         {/* Header */}
  //         <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
  //           <div className="p-1.5 bg-blue-100 rounded-md">
  //             <Sparkles className="h-4 w-4 text-blue-600" />
  //           </div>
  //           <div>
  //             <p className="text-sm font-medium text-blue-900">
  //               Edit Project Feature
  //             </p>
  //             <p className="text-xs text-blue-600">
  //               Update feature for this project
  //             </p>
  //           </div>
  //         </div>

  //         {/* Feature Name (read-only) */}
  //         <div className="space-y-1.5">
  //           <Label className="flex items-center gap-1.5 text-xs">
  //             <Sparkles className="h-3 w-3 text-blue-500" />
  //             Feature name <span className="text-red-500">*</span>
  //             <HelpCircle className="h-3 w-3 text-gray-400 ml-auto" />
  //           </Label>
  //           <Input
  //             value={featureName}
  //             className="bg-gray-100 border-gray-200 py-3"
  //             disabled
  //           />
  //         </div>

  //         {/* Value Input */}
  //         <div className="space-y-1.5">
  //           <Label className="flex items-center gap-1.5 text-xs">
  //             <Sparkles className="h-3 w-3 text-blue-500" />
  //             Value <span className="text-red-500">*</span>
  //             <HelpCircle className="h-3 w-3 text-gray-400 ml-auto" />
  //           </Label>
  //           <Input
  //             placeholder="Enter feature value (e.g., Yes, No, 10, etc.)"
  //             {...register("value")}
  //             className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 py-3"
  //           />
  //           {errors.value && (
  //             <p className="text-xs text-red-500">{errors.value.message}</p>
  //           )}
  //         </div>

  //         {/* Description Input */}
  //         {/* <div className="space-y-1.5">
  //           <Label className="flex items-center gap-1.5 text-xs">
  //             <Sparkles className="h-3 w-3 text-blue-500" />
  //             Description <span className="text-gray-400">(Optional)</span>
  //             <HelpCircle className="h-3 w-3 text-gray-400 ml-auto" />
  //           </Label>
  //           <Input
  //             placeholder="Enter feature description"
  //             {...register("description")}
  //             className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 py-3"
  //           />
  //           {errors.description && (
  //             <p className="text-xs text-red-500">
  //               {errors.description.message}
  //             </p>
  //           )}
  //         </div> */}

  //         {/* Footer */}
  //         <div className="space-y-3 pt-3 border-t border-gray-200">
  //           <div className="flex gap-2 justify-end">
  //             <Button
  //               type="button"
  //               variant="outline"
  //               onClick={handleClose}
  //               disabled={isUpdating}
  //               className="hover:bg-gray-50"
  //             >
  //               Cancel
  //             </Button>
  //             <Button
  //               type="submit"
  //               className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
  //               disabled={isUpdating}
  //             >
  //               {isUpdating ? (
  //                 <>
  //                   <Loader2 className="w-4 h-4 animate-spin" />
  //                   Saving...
  //                 </>
  //               ) : (
  //                 <>
  //                   <Check className="w-4 h-4" />
  //                   Save Changes
  //                 </>
  //               )}
  //             </Button>
  //           </div>
  //         </div>
  //       </form>
  //     )}
  //   </Modal>
  // );
}
