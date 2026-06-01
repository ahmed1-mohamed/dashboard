"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEditBuildingData } from "@/hooks/use-edit-building";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Check } from "lucide-react";
import { buildingSchema, BuildingInputType } from "@/validators/buildingSchema";
import { editBuilding } from "@/data/api-client";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface EditBuildingModalProps {
  buildingId: number;
  projectId: number;
  isOpen: boolean;
  onClose: () => void;
}

const constructionStatusOptions = [
  { label: "Ready", value: "ready" },
  { label: "Under Construction", value: "under-construction" },
  { label: "Off Plan", value: "off-plan" },
];

const builtTypeOptions = [
  { label: "Building", value: "building" },
  { label: "Compound", value: "compound" },
];

const buildingTypeOptions = [
  { label: "Residential", value: "residential" },
  { label: "Commercial", value: "commercial" },
  { label: "Mixed Use", value: "mixed-use" },
];

export function EditBuildingModal({
  buildingId,
  projectId,
  isOpen,
  onClose,
}: EditBuildingModalProps) {
  // const queryClient = useQueryClient();
  // const { data: session } = useSession();
  // const token = session?.user.accessToken;

  // const {
  //   register,
  //   reset,
  //   handleSubmit,
  //   setValue,
  //   watch,
  //   formState: { errors },
  //   setError,
  // } = useForm<BuildingInputType>({
  //   resolver: zodResolver(buildingSchema),
  //   defaultValues: {
  //     project_id: projectId,
  //     building_name: "",
  //     total_floors: 1,
  //     total_units: 0,
  //     construction_status: "",
  //     completion_date: "",
  //     description: "",
  //     building_type: "",
  //     built_type: "",
  //     parking_spaces: 0,
  //   },
  // });

  // const { buildingData, projects, cities, areas, loading } = useEditBuildingData(buildingId, isOpen);

  // useEffect(() => {
  //   if (buildingData) {
  //     reset({
  //       building_name: data.building_name || "",
  //       construction_status: data.construction_status || "",
  //       built_type: data.built_type || "",
  //       building_type: data.building_type || "",
  //       total_floors: data.total_floors || 1,
  //       total_units: data.total_units || 0,
  //       completion_date: data.completion_date || "",
  //       description: data.description || "",
  //       parking_spaces: data.parking_spaces || 0,
  //     });
  //   }
  // }, [data, reset]);

  // const mutation = useMutation({
  //   mutationFn: (updatedData: BuildingInputType) =>
  //     editBuilding(buildingId, updatedData, token!),
  //   onSuccess: () => {
  //     toast.success("Building updated successfully!");
  //     queryClient.invalidateQueries({ queryKey: ["building", buildingId] });
  //     queryClient.invalidateQueries({ queryKey: ["projectDetails"] });
  //     handleClose();
  //   },
  //   onError: (error) => {
  //     const axiosError = error as AxiosError<{
  //       status?: string;
  //       errors?: Record<string, string[]>;
  //       message?: string;
  //     }>;
  //     const errorList = axiosError?.response?.data?.errors;

  //     const flatMessages = errorList
  //       ? Object.values(errorList)
  //           .map((errObj) => Object.values(errObj))
  //           .flat()
  //           .join(", ")
  //       : "";

  //     const fallbackMessage =
  //       axiosError.response?.data?.message ||
  //       axiosError.message ||
  //       "Failed to update building.";

  //     setError("root", { message: flatMessages || fallbackMessage });
  //   },
  // });

  // const handleFormSubmit = (formData: BuildingInputType) => {
  //   const submitData = {
  //     ...formData,
  //     project_id: projectId,
  //   };
  //   mutation.mutate(submitData);
  // };

  // const handleClose = () => {
  //   reset({
  //     project_id: projectId,
  //     building_name: "",
  //     total_floors: 1,
  //     total_units: 0,
  //     construction_status: "",
  //     completion_date: "",
  //     description: "",
  //     building_type: "",
  //     built_type: "",
  //     parking_spaces: 0,
  //   });
  //   onClose();
  // };

  // if (!isOpen) return null;

  // if (loading) {
  //   return (
  //     <Modal
  //       isOpen={isOpen}
  //       onClose={handleClose}
  //       title="Edit Building"
  //       size="xl"
  //       showCloseButton={false}
  //     >
  //       <div className="flex justify-center py-8">
  //         <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
  //       </div>
  //     </Modal>
  //   );
  // }

  // return (
  //   <Modal
  //     isOpen={isOpen}
  //     onClose={handleClose}
  //     title="Edit Building"
  //     size="xl"
  //     showCloseButton={false}
  //     footer={
  //       <div className="flex gap-3 justify-end w-full">
  //         <Button
  //           variant="outline"
  //           onClick={handleClose}
  //           disabled={mutation.isPending}
  //         >
  //           Close
  //         </Button>
  //         <Button
  //           className="bg-teal-600 hover:bg-teal-700 text-white"
  //           onClick={handleSubmit(handleFormSubmit)}
  //           disabled={mutation.isPending}
  //         >
  //           {mutation.isPending ? (
  //             <>
  //               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
  //               Saving...
  //             </>
  //           ) : (
  //             <>
  //               <Check className="w-4 h-4 mr-2" />
  //               Save Changes
  //             </>
  //           )}
  //         </Button>
  //       </div>
  //     }
  //   >
  //     <form
  //       onSubmit={handleSubmit(handleFormSubmit)}
  //       className="space-y-4 overflow-y-auto max-h-[calc(90vh-180px)] pr-2"
  //     >
  //       {errors.root && (
  //         <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">
  //           {errors.root.message}
  //         </div>
  //       )}

  //       {/* Building Name */}
  //       <div>
  //         <Label>
  //           Building Name <span className="text-red-500">*</span>
  //         </Label>
  //         <Input
  //           placeholder="e.g. Building A"
  //           {...register("building_name")}
  //           className="mt-1"
  //         />
  //         {errors.building_name && (
  //           <p className="text-red-500 text-sm mt-1">
  //             {errors.building_name.message}
  //           </p>
  //         )}
  //       </div>

  //       {/* Construction Status */}
  //       <div>
  //         <Label>
  //           Construction Status <span className="text-red-500">*</span>
  //         </Label>
  //         <Select
  //           value={watch("construction_status")}
  //           onValueChange={(value) =>
  //             setValue("construction_status", value, { shouldValidate: true })
  //           }
  //         >
  //           <SelectTrigger>
  //             <SelectValue placeholder="Select Status" />
  //           </SelectTrigger>
  //           <SelectContent>
  //             {constructionStatusOptions.map((status) => (
  //               <SelectItem key={status.value} value={status.value}>
  //                 {status.label}
  //               </SelectItem>
  //             ))}
  //           </SelectContent>
  //         </Select>
  //         {errors.construction_status && (
  //           <p className="text-red-500 text-sm mt-1">
  //             {errors.construction_status.message}
  //           </p>
  //         )}
  //       </div>

  //       {/* Building Type and Built Type Row */}
  //       <div className="grid grid-cols-2 gap-4">
  //         {/* Building Type */}
  //         <div>
  //           <Label>
  //             Building Type <span className="text-red-500">*</span>
  //           </Label>
  //           <Select
  //             value={watch("building_type")}
  //             onValueChange={(value) =>
  //               setValue("building_type", value, { shouldValidate: true })
  //             }
  //           >
  //             <SelectTrigger>
  //               <SelectValue placeholder="Select Type" />
  //             </SelectTrigger>
  //             <SelectContent>
  //               {buildingTypeOptions.map((type) => (
  //                 <SelectItem key={type.value} value={type.value}>
  //                   {type.label}
  //                 </SelectItem>
  //               ))}
  //             </SelectContent>
  //           </Select>
  //           {errors.building_type && (
  //             <p className="text-red-500 text-sm mt-1">
  //               {errors.building_type.message}
  //             </p>
  //           )}
  //         </div>

  //         {/* Built Type */}
  //         <div>
  //           <Label>
  //             Built Type <span className="text-red-500">*</span>
  //           </Label>
  //           <Select
  //             value={watch("built_type")}
  //             onValueChange={(value) =>
  //               setValue("built_type", value, { shouldValidate: true })
  //             }
  //           >
  //             <SelectTrigger>
  //               <SelectValue placeholder="Select Built Type" />
  //             </SelectTrigger>
  //             <SelectContent>
  //               {builtTypeOptions.map((type) => (
  //                 <SelectItem key={type.value} value={type.value}>
  //                   {type.label}
  //                 </SelectItem>
  //               ))}
  //             </SelectContent>
  //           </Select>
  //           {errors.built_type && (
  //             <p className="text-red-500 text-sm mt-1">
  //               {errors.built_type.message}
  //             </p>
  //           )}
  //         </div>
  //       </div>

  //       {/* Total Floors and Total Units Row */}
  //       <div className="grid grid-cols-2 gap-4">
  //         {/* Total Floors */}
  //         <div>
  //           <Label>
  //             Total Floors <span className="text-red-500">*</span>
  //           </Label>
  //           <Input
  //             type="number"
  //             {...register("total_floors", { valueAsNumber: true })}
  //             className="mt-1"
  //           />
  //           {errors.total_floors && (
  //             <p className="text-red-500 text-sm mt-1">
  //               {errors.total_floors.message}
  //             </p>
  //           )}
  //         </div>

  //         {/* Total Units */}
  //         <div>
  //           <Label>
  //             Total Units <span className="text-red-500">*</span>
  //           </Label>
  //           <Input
  //             type="number"
  //             {...register("total_units", { valueAsNumber: true })}
  //             className="mt-1"
  //           />
  //           {errors.total_units && (
  //             <p className="text-red-500 text-sm mt-1">
  //               {errors.total_units.message}
  //             </p>
  //           )}
  //         </div>
  //       </div>

  //       {/* Parking Spaces and Completion Date Row */}
  //       <div className="grid grid-cols-2 gap-4">
  //         {/* Parking Spaces */}
  //         <div>
  //           <Label>Parking Spaces</Label>
  //           <Input
  //             type="number"
  //             {...register("parking_spaces", { valueAsNumber: true })}
  //             className="mt-1"
  //           />
  //         </div>

  //         {/* Completion Date */}
  //         <div>
  //           <Label>
  //             Completion Date <span className="text-red-500">*</span>
  //           </Label>
  //           <Input
  //             type="date"
  //             {...register("completion_date")}
  //             className="mt-1"
  //           />
  //           {errors.completion_date && (
  //             <p className="text-red-500 text-sm mt-1">
  //               {errors.completion_date.message}
  //             </p>
  //           )}
  //         </div>
  //       </div>

  //       {/* Description */}
  //       <div>
  //         <Label>Description</Label>
  //         <Textarea
  //           placeholder="Write description here"
  //           {...register("description")}
  //           className="mt-1 min-h-[80px]"
  //         />
  //       </div>
  //     </form>
  //   </Modal>
  // );
}
