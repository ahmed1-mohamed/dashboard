"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  propertiesSchema,
  PropertiesInput,
} from "@/validators/propertiesSchema";
import {
  editProperty,
  fetchPropertyDetails,
  fetchProjectsPaginated,
  fetchPropertySubtype,
  fetchPropertyTypes,
} from "@/data/api-client";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  ProjectsDataType,
  PropertiesDataType,
  PropertySubtypeDataType,
  PropertyTypeDataType,
} from "@/types";

interface EditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
}

const constructionStatusOptions = [
  { label: "Ready", value: "ready" },
  { label: "Under Construction", value: "under-construction" },
  { label: "Off Plan", value: "off-plan" },
];

const availabilityStatus = [
  { label: "Available", value: "available" },
  { label: "Reserved", value: "reserved" },
  { label: "Sold", value: "sold" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const furnishStatus = [
  { label: "Furnished", value: "furnished" },
  { label: "UnFurnished", value: "unfurnished" },
  { label: "SemiFurnished", value: "semi-furnished" },
];

const finishingStatus = [
  { label: "Finished", value: "finished" },
  { label: "SemiFinished", value: "semi-finished" },
  { label: "UnFinished", value: "unfinished" },
];

const viewOptions = [
  { label: "Sea View", value: "sea" },
  { label: "City View", value: "city" },
  { label: "Garden View", value: "garden" },
];

const ownershipType = [
  { label: "Freehold", value: "freehold" },
  { label: "Leasehold", value: "leasehold" },
];

export function EditPropertyModal({
  isOpen,
  onClose,
  propertyId,
}: EditPropertyModalProps) {
  // const queryClient = useQueryClient();
  // const { data: session } = useSession();
  // const token = session?.user?.accessToken;
  // const [projectSearch, setProjectSearch] = useState("");
  // const [projectPerPage, setProjectPerPage] = useState(10);
  // const {
  //   register,
  //   handleSubmit,
  //   setValue,
  //   watch,
  //   reset,
  //   control,
  //   setError,
  //   formState: { errors },
  // } = useForm<PropertiesInput>({
  //   resolver: zodResolver(propertiesSchema),
  // });
  // // Fetch property data
  // const { data: propertyData, isLoading: propertyLoading } = useQuery({
  //   queryKey: ["property", propertyId],
  //   queryFn: () => fetchPropertyDetails(propertyId, token!),
  //   enabled: !!token && isOpen && !!propertyId,
  // });
  // // Fetch property types
  // const { data: propertiesType = [] } = useQuery({
  //   queryKey: ["PropertiesType"],
  //   queryFn: () => fetchPropertyTypes(token!),
  //    select: (data) => data.data as PropertyTypeDataType[],
  //   enabled: !!token && isOpen,
  // });
  // // Fetch property subtypes
  // const { data: propertiesSubtype = [] } = useQuery({
  //   queryKey: ["PropertiesSubtype"],
  //   queryFn: () => fetchPropertySubtype(token!),
  //    select: (data) => data.data as PropertySubtypeDataType[],
  //   enabled: !!token && isOpen,
  // });
  // // Fetch projects
  // const { data: projects = [] } = useQuery({
  //   queryKey: ["Projects", projectPerPage, projectSearch],
  //   queryFn: () => fetchProjectsPaginated(token!, 1, projectPerPage, projectSearch),
  //   select: (data) => data.data as ProjectsDataType[],
  //   enabled: !!token && isOpen,
  // });
  // // Set form values when property data is loaded
  // useEffect(() => {
  //   console.log(propertyData);
  //   if (propertyData) {
  //     const data = propertyData;
  //     reset({
  //       property_name: data.property_name || "",
  //       status: data.status || "active",
  //       building_name: data.building_name || "",
  //       project_id: data.project_id || undefined,
  //       property_type_id: data.property_type_id || undefined,
  //       property_subtype_id: data.property_subtype_id || undefined,
  //       unit_number: data.unit_number || "",
  //       floor: data.floor || "",
  //       price: data.price || undefined,
  //       size: data.size || undefined,
  //       bedrooms: data.bedrooms || undefined,
  //       bathrooms: data.bathrooms || undefined,
  //       parking_spaces: data.parking_spaces || undefined,
  //       description: data.description || "",
  //       construction_status: data.construction_status || "",
  //       availability_status: data.availability_status || "",
  //       furnish_status: data.furnish_status || "",
  //       finishing_status: data.finishing_status || "",
  //       view: data.view || "",
  //       ownership_type: data.ownership_type || "",
  //     });
  //   }
  // }, [propertyData, reset]);
  // const mutation = useMutation({
  //   mutationFn: async (data: PropertiesInput) => {
  //     if (!token) throw new Error("Not authenticated");
  //     return editProperty(propertyId, data as unknown as PropertiesDataType, token);
  //   },
  //   onSuccess: () => {
  //     toast.success("Property updated successfully!");
  //     queryClient.invalidateQueries({ queryKey: ["Properties"] });
  //     queryClient.invalidateQueries({ queryKey: ["property", propertyId] });
  //     handleClose();
  //   },
  //   onError: (error) => {
  //     const axiosError = error as AxiosError<{
  //       status?: string;
  //       errors?: Record<string, string>[];
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
  //       "Failed to update Property.";
  //     toast.error(flatMessages || fallbackMessage);
  //     setError("root", { message: flatMessages || fallbackMessage });
  //   },
  // });
  // const handleClose = () => {
  //   reset();
  //   onClose();
  // };
  // const onSubmitForm = (data: PropertiesInput) => {
  //   mutation.mutate(data);
  // };
  // return (
  //   <Modal
  //     isOpen={isOpen}
  //     onClose={handleClose}
  //     title="Edit Property"
  //     size="xl"
  //     scrollable={true}
  //     footer={
  //       <div className="flex gap-3 justify-end w-full">
  //         <Button
  //           variant="outline"
  //           onClick={handleClose}
  //           disabled={mutation.isPending}
  //         >
  //           Cancel
  //         </Button>
  //         <Button
  //           className="bg-teal-600 hover:bg-teal-700 text-white"
  //           onClick={handleSubmit(onSubmitForm)}
  //           disabled={mutation.isPending}
  //         >
  //           {mutation.isPending ? "Updating..." : "Update Property"}
  //         </Button>
  //       </div>
  //     }
  //   >
  //     {propertyLoading ? (
  //       <div className="flex items-center justify-center py-8">
  //         <div className="text-gray-500">Loading property data...</div>
  //       </div>
  //     ) : (
  //       <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
  //         {/* Basic Information */}
  //         <div>
  //           <h3 className="text-sm font-semibold text-gray-900 mb-3">Basic Information</h3>
  //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //             <div>
  //               <Label htmlFor="property_name">
  //                 Property Name <span className="text-red-500">*</span>
  //               </Label>
  //               <Input
  //                 id="property_name"
  //                 {...register("property_name")}
  //                 placeholder="Property Name"
  //                 className="mt-1"
  //               />
  //               {errors.property_name && (
  //                 <p className="text-red-500 text-xs mt-1">
  //                   {errors.property_name.message as string}
  //                 </p>
  //               )}
  //             </div>
  //             <div>
  //               <Label htmlFor="unit-number">Unit Number</Label>
  //               <Input
  //                 id="unit-number"
  //                 {...register("unit_number")}
  //                 placeholder="e.g. Unit 101"
  //                 className="mt-1"
  //               />
  //             </div>
  //             <div>
  //               <Label htmlFor="project_id">Project</Label>
  //               <Controller
  //                 name="project_id"
  //                 control={control}
  //                 render={({ field }) => (
  //                   <Select
  //                     onValueChange={(value) => field.onChange(Number(value))}
  //                     value={field.value?.toString() || ""}
  //                   >
  //                     <SelectTrigger className="mt-1">
  //                       <SelectValue placeholder="Select Project" />
  //                     </SelectTrigger>
  //                     <SelectContent>
  //                       {projects.map((project: any) => (
  //                         <SelectItem key={project.project_id} value={String(project.project_id)}>
  //                           {project.project_name}
  //                         </SelectItem>
  //                       ))}
  //                     </SelectContent>
  //                   </Select>
  //                 )}
  //               />
  //             </div>
  //             <div>
  //               <Label htmlFor="building_name">
  //                 Building Name <span className="text-red-500">*</span>
  //               </Label>
  //               <Input
  //                 id="building_name"
  //                 {...register("building_name")}
  //                 placeholder="Enter Building Name"
  //                 className="mt-1"
  //               />
  //               {errors.building_name && (
  //                 <p className="text-red-500 text-xs mt-1">
  //                   {errors.building_name.message as string}
  //                 </p>
  //               )}
  //             </div>
  //             <div>
  //               <Label htmlFor="property_type_id">Property Type <span className="text-red-500">*</span></Label>
  //               <Controller
  //                 name="property_type_id"
  //                 control={control}
  //                 render={({ field }) => (
  //                   <Select
  //                     onValueChange={(value) => field.onChange(Number(value))}
  //                     value={field.value?.toString() || ""}
  //                   >
  //                     <SelectTrigger className="mt-1">
  //                       <SelectValue placeholder="Select Property Type" />
  //                     </SelectTrigger>
  //                     <SelectContent>
  //                       {propertiesType.map((type: any) => (
  //                         <SelectItem key={type.property_type_id} value={String(type.property_type_id)}>
  //                           {type.property_type_name}
  //                         </SelectItem>
  //                       ))}
  //                     </SelectContent>
  //                   </Select>
  //                 )}
  //               />
  //             </div>
  //             <div>
  //               <Label htmlFor="property_subtype_id">Property Subtype <span className="text-red-500">*</span></Label>
  //               <Controller
  //                 name="property_subtype_id"
  //                 control={control}
  //                 render={({ field }) => (
  //                   <Select
  //                     onValueChange={(value) => field.onChange(Number(value))}
  //                     value={field.value?.toString() || ""}
  //                   >
  //                     <SelectTrigger className="mt-1">
  //                       <SelectValue placeholder="Select Subtype" />
  //                     </SelectTrigger>
  //                     <SelectContent>
  //                       {propertiesSubtype.map((subtype: any) => (
  //                         <SelectItem key={subtype.property_subtype_id} value={String(subtype.property_subtype_id)}>
  //                           {subtype.property_subtype_name}
  //                         </SelectItem>
  //                       ))}
  //                     </SelectContent>
  //                   </Select>
  //                 )}
  //               />
  //             </div>
  //           </div>
  //         </div>
  //         {/* Status Information */}
  //         <div>
  //           <h3 className="text-sm font-semibold text-gray-900 mb-3">Status</h3>
  //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //             <div>
  //               <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
  //               <Controller
  //                 name="status"
  //                 control={control}
  //                 render={({ field }) => (
  //                   <Select
  //                     onValueChange={field.onChange}
  //                     value={field.value || ""}
  //                   >
  //                     <SelectTrigger className="mt-1">
  //                       <SelectValue placeholder="Select Status" />
  //                     </SelectTrigger>
  //                     <SelectContent>
  //                       {statusOptions.map((option) => (
  //                         <SelectItem key={option.value} value={option.value}>
  //                           {option.label}
  //                         </SelectItem>
  //                       ))}
  //                     </SelectContent>
  //                   </Select>
  //                 )}
  //               />
  //             </div>
  //             <div>
  //               <Label htmlFor="availability_status">Availability Status</Label>
  //               <Controller
  //                 name="availability_status"
  //                 control={control}
  //                 render={({ field }) => (
  //                   <Select
  //                     onValueChange={field.onChange}
  //                     value={field.value || ""}
  //                   >
  //                     <SelectTrigger className="mt-1">
  //                       <SelectValue placeholder="Select Availability" />
  //                     </SelectTrigger>
  //                     <SelectContent>
  //                       {availabilityStatus.map((option) => (
  //                         <SelectItem key={option.value} value={option.value}>
  //                           {option.label}
  //                         </SelectItem>
  //                       ))}
  //                     </SelectContent>
  //                   </Select>
  //                 )}
  //               />
  //             </div>
  //             <div>
  //               <Label htmlFor="construction_status">Construction Status</Label>
  //               <Controller
  //                 name="construction_status"
  //                 control={control}
  //                 render={({ field }) => (
  //                   <Select
  //                     onValueChange={field.onChange}
  //                     value={field.value || ""}
  //                   >
  //                     <SelectTrigger className="mt-1">
  //                       <SelectValue placeholder="Select Construction Status" />
  //                     </SelectTrigger>
  //                     <SelectContent>
  //                       {constructionStatusOptions.map((option) => (
  //                         <SelectItem key={option.value} value={option.value}>
  //                           {option.label}
  //                         </SelectItem>
  //                       ))}
  //                     </SelectContent>
  //                   </Select>
  //                 )}
  //               />
  //             </div>
  //           </div>
  //         </div>
  //         {/* Size & Pricing */}
  //         <div>
  //           <h3 className="text-sm font-semibold text-gray-900 mb-3">Size & Pricing</h3>
  //           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //             <div>
  //               <Label htmlFor="price">Price</Label>
  //               <Input
  //                 id="price"
  //                 type="number"
  //                 {...register("price", { valueAsNumber: true })}
  //                 placeholder="Price"
  //                 className="mt-1"
  //               />
  //             </div>
  //             <div>
  //               <Label htmlFor="size">Size (sq ft)</Label>
  //               <Input
  //                 id="size"
  //                 type="number"
  //                 {...register("size", { valueAsNumber: true })}
  //                 placeholder="Size"
  //                 className="mt-1"
  //               />
  //             </div>
  //             <div>
  //               <Label htmlFor="plot_size">Plot Size</Label>
  //               <Input
  //                 id="plot_size"
  //                 type="number"
  //                 {...register("plot_size", { valueAsNumber: true })}
  //                 placeholder="Plot Size"
  //                 className="mt-1"
  //               />
  //             </div>
  //           </div>
  //         </div>
  //         {/* Rooms & Facilities */}
  //         <div>
  //           <h3 className="text-sm font-semibold text-gray-900 mb-3">Rooms & Facilities</h3>
  //           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //             <div>
  //               <Label htmlFor="bedrooms">Bedrooms</Label>
  //               <Input
  //                 id="bedrooms"
  //                 type="number"
  //                 {...register("bedrooms", { valueAsNumber: true })}
  //                 placeholder="Bedrooms"
  //                 className="mt-1"
  //               />
  //             </div>
  //             <div>
  //               <Label htmlFor="bathrooms">Bathrooms</Label>
  //               <Input
  //                 id="bathrooms"
  //                 type="number"
  //                 {...register("bathrooms", { valueAsNumber: true })}
  //                 placeholder="Bathrooms"
  //                 className="mt-1"
  //               />
  //             </div>
  //             <div>
  //               <Label htmlFor="parking_spaces">Parking Spaces</Label>
  //               <Input
  //                 id="parking_spaces"
  //                 type="number"
  //                 {...register("parking_spaces", { valueAsNumber: true })}
  //                 placeholder="Parking Spaces"
  //                 className="mt-1"
  //               />
  //             </div>
  //             <div>
  //               <Label htmlFor="floor">Floor</Label>
  //               <Input
  //                 id="floor"
  //                 {...register("floor")}
  //                 placeholder="Floor"
  //                 className="mt-1"
  //               />
  //             </div>
  //             <div>
  //               <Label htmlFor="view">View</Label>
  //               <Controller
  //                 name="view"
  //                 control={control}
  //                 render={({ field }) => (
  //                   <Select
  //                     onValueChange={field.onChange}
  //                     value={field.value || ""}
  //                   >
  //                     <SelectTrigger className="mt-1">
  //                       <SelectValue placeholder="Select View" />
  //                     </SelectTrigger>
  //                     <SelectContent>
  //                       {viewOptions.map((option) => (
  //                         <SelectItem key={option.value} value={option.value}>
  //                           {option.label}
  //                         </SelectItem>
  //                       ))}
  //                     </SelectContent>
  //                   </Select>
  //                 )}
  //               />
  //             </div>
  //             <div>
  //               <Label htmlFor="finishing_status">Finishing Type</Label>
  //               <Controller
  //                 name="finishing_status"
  //                 control={control}
  //                 render={({ field }) => (
  //                   <Select
  //                     onValueChange={field.onChange}
  //                     value={field.value || ""}
  //                   >
  //                     <SelectTrigger className="mt-1">
  //                       <SelectValue placeholder="Select Finishing" />
  //                     </SelectTrigger>
  //                     <SelectContent>
  //                       {finishingStatus.map((option) => (
  //                         <SelectItem key={option.value} value={option.value}>
  //                           {option.label}
  //                         </SelectItem>
  //                       ))}
  //                     </SelectContent>
  //                   </Select>
  //                 )}
  //               />
  //             </div>
  //             <div>
  //               <Label htmlFor="furnish_status">Furnish Status</Label>
  //               <Controller
  //                 name="furnish_status"
  //                 control={control}
  //                 render={({ field }) => (
  //                   <Select
  //                     onValueChange={field.onChange}
  //                     value={field.value || ""}
  //                   >
  //                     <SelectTrigger className="mt-1">
  //                       <SelectValue placeholder="Select Furnish Status" />
  //                     </SelectTrigger>
  //                     <SelectContent>
  //                       {furnishStatus.map((option) => (
  //                         <SelectItem key={option.value} value={option.value}>
  //                           {option.label}
  //                         </SelectItem>
  //                       ))}
  //                     </SelectContent>
  //                   </Select>
  //                 )}
  //               />
  //             </div>
  //             <div>
  //               <Label htmlFor="ownership_type">Ownership Type</Label>
  //               <Controller
  //                 name="ownership_type"
  //                 control={control}
  //                 render={({ field }) => (
  //                   <Select
  //                     onValueChange={field.onChange}
  //                     value={field.value || ""}
  //                   >
  //                     <SelectTrigger className="mt-1">
  //                       <SelectValue placeholder="Select Ownership Type" />
  //                     </SelectTrigger>
  //                     <SelectContent>
  //                       {ownershipType.map((option) => (
  //                         <SelectItem key={option.value} value={option.value}>
  //                           {option.label}
  //                         </SelectItem>
  //                       ))}
  //                     </SelectContent>
  //                   </Select>
  //                 )}
  //               />
  //             </div>
  //           </div>
  //         </div>
  //         {/* Description */}
  //         <div>
  //           <Label htmlFor="description">Description</Label>
  //           <Input
  //             id="description"
  //             {...register("description")}
  //             placeholder="Property description"
  //             className="mt-1"
  //           />
  //         </div>
  //         {/* Root Error */}
  //         {errors.root && (
  //           <p className="text-red-500 text-xs mt-1">
  //             {errors.root.message as string}
  //           </p>
  //         )}
  //       </form>
  //     )}
  //   </Modal>
  // );
}
