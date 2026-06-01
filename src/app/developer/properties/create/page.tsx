// "use client";

// import { useState, useRef, useCallback, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Upload, X } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { Controller, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import {
//   propertiesSchema,
//   PropertiesInput,
// } from "@/validators/propertiesSchema";
// import { AxiosError } from "axios";
// import {
//   addProperty,
//   fetchProjects,
//   fetchProjectsPaginated,
//   fetchPropertySubtype,
//   fetchPropertyTypes,
// } from "@/data/api-client";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Search } from "lucide-react";
// import {
//   BuildingDataType,
//   ProjectsDataType,
//   PropertySubtypeDataType,
//   PropertyTypeDataType,
// } from "@/types";
// import { useSession } from "next-auth/react";

// const constructionStatusOptions = [
//   { label: "Ready", value: "ready" },
//   { label: "Under Construction", value: "under-construction" },
//   { label: "Off Plan", value: "off-plan" },
// ];

// const availabilityStatus = [
//   { label: "Available", value: "available" },
//   { label: "Reserved", value: "reserved" },
//   { label: "Sold", value: "sold" },
// ];

// const statusOptions = [
//   { label: "Active", value: "active" },
//   { label: "Inactive", value: "inactive" },
// ];

// const furnishStatus = [
//   { label: "Furnished", value: "furnished" },
//   { label: "UnFurnished", value: "unfurnished" },
//   { label: "SemiFurnished", value: "semi-furnished" },
// ];

// const finishingStatus = [
//   { label: "Finished", value: "finished" },
//   { label: "SemiFinished", value: "semi-finished" },
//   { label: "UnFinished", value: "unfinished" },
// ];

// const ownershipType = [
//   { label: "Freehold", value: "freehold" },
//   { label: "Leasehold", value: "leasehold" },
// ];

// export default function CreatePropertyPage() {
//   const router = useRouter();
//   const queryClient = useQueryClient();
//   const { data: session } = useSession();
//   const token = session?.user?.accessToken;

//   const [images, setImages] = useState<File[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);

//   // Project select states
//   const [projectSearch, setProjectSearch] = useState("");
//   const [projectPerPage, setProjectPerPage] = useState(10);
//   const [isProjectOpen, setIsProjectOpen] = useState(false);
//   const projectListRef = useRef<HTMLDivElement>(null);

//   // Handle infinite scroll for projects
//   useEffect(() => {
//     const handleScroll = () => {
//       if (!isProjectOpen || !projectListRef.current) return;

//       const { scrollTop, scrollHeight, clientHeight } = projectListRef.current;
//       if (scrollTop + clientHeight >= scrollHeight - 10) {
//         // User scrolled to near bottom, load more
//         setProjectPerPage((prev) => prev + 10);
//       }
//     };

//     const listElement = projectListRef.current;
//     if (listElement) {
//       listElement.addEventListener("scroll", handleScroll);
//       return () => listElement.removeEventListener("scroll", handleScroll);
//     }
//   }, [isProjectOpen]);

//   // Reset per_page when search changes
//   const handleProjectSearch = (value: string) => {
//     setProjectSearch(value);
//     setProjectPerPage(10);
//   };

//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//     reset,
//     setError,
//     watch,
//   } = useForm({
//     resolver: zodResolver(propertiesSchema),
//     defaultValues: {
//       maid_room: false,
//     },
//   });

//   const { data: propertiesType = [] } = useQuery({
//     queryKey: ["PropertiesType"],
//     queryFn: () => fetchPropertyTypes(token!),
//     select: (data) => data! as PropertyTypeDataType[],
//     enabled: !!token,
//   });

//   const { data: propertiesSubtype = [] } = useQuery({
//     queryKey: ["PropertiesSubtype"],
//     queryFn: () => fetchPropertySubtype(token!),
//     select: (data) => data! as PropertySubtypeDataType[],
//     enabled: !!token,
//   });

//   const { data: projects = [] } = useQuery({
//     queryKey: ["Projects", projectPerPage, projectSearch],
//     queryFn: () =>
//       fetchProjectsPaginated(token!, 1, projectPerPage, projectSearch),
//     select: (data) => data! as ProjectsDataType[],
//     enabled: !!token,
//   });

//   const mutation = useMutation({
//     mutationFn: (data: PropertiesInput) => addProperty(data, token!),
//     onSuccess: () => {
//       toast.success("Property created successfully!");
//       queryClient.invalidateQueries({ queryKey: ["Properties"] });
//       reset();
//       setImages([]);
//       setImagePreviews([]);
//       router.push("/developer/properties");
//     },
//     onError: (error) => {
//       const axiosError = error as AxiosError<{
//         status?: string;
//         errors?: Record<string, string>[];
//         message?: string;
//       }>;
//       const errorList = axiosError?.response?.data?.errors;

//       const flatMessages = errorList
//         ? Object.values(errorList)
//             .map((errObj) => Object.values(errObj))
//             .flat()
//             .join(", ")
//         : "";

//       const fallbackMessage =
//         axiosError.response?.data?.message ||
//         axiosError.message ||
//         "Failed to Create Property.";

//       toast.error(flatMessages || fallbackMessage);
//       setError("root", { message: flatMessages || fallbackMessage });
//     },
//   });

//   const handleFormSubmit = (formData: PropertiesInput) => {
//     const data = {
//       ...formData,
//       price: formData.price ? Number(formData.price) : undefined,
//       size: formData.size ? Number(formData.size) : undefined,
//       parking_spaces: formData.parking_spaces
//         ? Number(formData.parking_spaces)
//         : undefined,
//       bua_size: formData.bua_size ? Number(formData.bua_size) : undefined,
//       plot_size: formData.plot_size ? Number(formData.plot_size) : undefined,
//     };
//     console.log("data", data);
//     mutation.mutate(data);
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     setImages([...images, ...files]);

//     files.forEach((file) => {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreviews((prev) => [...prev, reader.result as string]);
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const removeImage = (index: number) => {
//     setImages(images.filter((_, i) => i !== index));
//     setImagePreviews(imagePreviews.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 px-6 py-4">
//         <div className="flex items-center justify-between max-w-7xl mx-auto">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               Create New Property
//             </h1>
//             <p className="text-sm text-gray-500 mt-1">
//               Home &gt; Properties &gt; Create Property
//             </p>
//           </div>
//           <Button
//             className="bg-teal-600 hover:bg-teal-700 text-white"
//             onClick={() => router.push("/admin/properties")}
//           >
//             Cancel
//           </Button>
//         </div>
//       </div>

//       {/* Form Content */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
//           {/* Basic Information */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-6">
//               Basic Information
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               <div>
//                 <Label htmlFor="property_name">
//                   Property Name <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="property_name"
//                   {...register("property_name")}
//                   placeholder="Property Name"
//                   className="mt-1"
//                 />
//                 {errors.property_name && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {errors.property_name.message as string}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <Label htmlFor="unit-number">Unit Number</Label>
//                 <Input
//                   id="unit-number"
//                   {...register("unit_number")}
//                   placeholder="e.g. Unit 101"
//                   className="mt-1"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="project_id">
//                   Project <span className="text-red-500">*</span>
//                 </Label>
//                 <Controller
//                   name="project_id"
//                   control={control}
//                   render={({ field }) => (
//                     <Select
//                       onValueChange={field.onChange}
//                       value={String(field.value || "")}
//                       onOpenChange={(open) => {
//                         setIsProjectOpen(open);
//                         if (open) {
//                           // Reset to initial state when opening
//                           setProjectPerPage(10);
//                         }
//                       }}
//                     >
//                       <SelectTrigger className="mt-1">
//                         <SelectValue placeholder="Select Project" />
//                       </SelectTrigger>
//                       <SelectContent className="max-h-80">
//                         <div
//                           className="flex items-center border-b px-3"
//                           cmdk-input-wrapper=""
//                         >
//                           <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
//                           <input
//                             className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
//                             placeholder="Search projects..."
//                             value={projectSearch}
//                             onChange={(e) =>
//                               handleProjectSearch(e.target.value)
//                             }
//                           />
//                         </div>
//                         <div
//                           ref={projectListRef}
//                           className="max-h-[200px] overflow-y-auto"
//                         >
//                           {projects.map((project) => (
//                             <SelectItem
//                               key={project.project_id}
//                               value={String(project.project_id)}
//                             >
//                               {project.project_name}
//                             </SelectItem>
//                           ))}
//                           {projects.length > 0 && (
//                             <div className="flex items-center justify-center p-2 text-xs text-gray-400">
//                               Scroll for more
//                             </div>
//                           )}
//                           {projects.length === 0 && (
//                             <div className="flex items-center justify-center p-2 text-sm text-gray-500">
//                               No projects found
//                             </div>
//                           )}
//                         </div>
//                       </SelectContent>
//                     </Select>
//                   )}
//                 />
//                 {errors.project_id && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {errors.project_id.message as string}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <Label htmlFor="property_type_id">
//                   Property Type <span className="text-red-500">*</span>
//                 </Label>
//                 <Controller
//                   name="property_type_id"
//                   control={control}
//                   render={({ field }) => (
//                     <Select
//                       onValueChange={field.onChange}
//                       value={String(field.value || "")}
//                     >
//                       <SelectTrigger className="mt-1">
//                         <SelectValue placeholder="Select Property Type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {propertiesType.map((type) => (
//                           <SelectItem key={type.id} value={String(type.id)}>
//                             {type.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   )}
//                 />
//                 {errors.property_type_id && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {errors.property_type_id.message as string}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <Label htmlFor="property_subtype_id">
//                   Unit Sub Type <span className="text-red-500">*</span>
//                 </Label>
//                 <Controller
//                   name="property_subtype_id"
//                   control={control}
//                   render={({ field }) => (
//                     <Select
//                       onValueChange={field.onChange}
//                       value={String(field.value || "")}
//                     >
//                       <SelectTrigger className="mt-1">
//                         <SelectValue placeholder="Select Sub Type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {propertiesSubtype.map((subtype) => (
//                           <SelectItem
//                             key={subtype.id}
//                             value={String(subtype.id)}
//                           >
//                             {subtype.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   )}
//                 />
//                 {errors.property_subtype_id && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {errors.property_subtype_id.message as string}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <Label htmlFor="building_name">
//                   Building Name <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="building_name"
//                   {...register("building_name")}
//                   placeholder="Enter Building Name"
//                   className="mt-1"
//                 />
//                 {errors.building_name && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {errors.building_name.message as string}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <Label htmlFor="construction_status">
//                   Construction Status <span className="text-red-500">*</span>
//                 </Label>
//                 <Controller
//                   name="construction_status"
//                   control={control}
//                   render={({ field }) => (
//                     <Select
//                       onValueChange={field.onChange}
//                       value={field.value || ""}
//                     >
//                       <SelectTrigger className="mt-1">
//                         <SelectValue placeholder="Select Status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {constructionStatusOptions.map((option) => (
//                           <SelectItem key={option.value} value={option.value}>
//                             {option.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   )}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="availability_status">
//                   Availability Status <span className="text-red-500">*</span>
//                 </Label>
//                 <Controller
//                   name="availability_status"
//                   control={control}
//                   render={({ field }) => (
//                     <Select
//                       onValueChange={field.onChange}
//                       value={field.value || ""}
//                     >
//                       <SelectTrigger className="mt-1">
//                         <SelectValue placeholder="Select Status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {availabilityStatus.map((option) => (
//                           <SelectItem key={option.value} value={option.value}>
//                             {option.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   )}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="status">
//                   Status <span className="text-red-500">*</span>
//                 </Label>
//                 <Controller
//                   name="status"
//                   control={control}
//                   render={({ field }) => (
//                     <Select
//                       onValueChange={field.onChange}
//                       value={field.value || ""}
//                     >
//                       <SelectTrigger className="mt-1">
//                         <SelectValue placeholder="Select Status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {statusOptions.map((option) => (
//                           <SelectItem key={option.value} value={option.value}>
//                             {option.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   )}
//                 />
//                 {errors.status && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {errors.status.message as string}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="mt-6">
//               <Label htmlFor="description">Description</Label>
//               <Textarea
//                 id="description"
//                 {...register("description")}
//                 placeholder="Write description here"
//                 className="mt-1 min-h-[80px]"
//               />
//             </div>
//           </div>

//           {/* Pricing Options */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-6">
//               Pricing Options
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               <div>
//                 <Label htmlFor="currency">Currency</Label>
//                 <Controller
//                   name="currency"
//                   control={control}
//                   render={({ field }) => (
//                     <Select
//                       onValueChange={field.onChange}
//                       value={field.value || ""}
//                     >
//                       <SelectTrigger className="mt-1">
//                         <SelectValue placeholder="Select Currency" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="aed">AED</SelectItem>
//                         <SelectItem value="usd">USD</SelectItem>
//                         <SelectItem value="egp">EGP</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   )}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="price">
//                   Price <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="price"
//                   type="number"
//                   {...register("price", { valueAsNumber: true })}
//                   placeholder="Price"
//                   className="mt-1"
//                 />
//                 {errors.price && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {errors.price.message as string}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <Label htmlFor="price-per-m2">Price per (m²)</Label>
//                 <Input
//                   id="price-per-m2"
//                   type="number"
//                   {...register("price_per_m2", { valueAsNumber: true })}
//                   placeholder="Include/Exclude"
//                   className="mt-1"
//                 />
//               </div>
//             </div>
//             <div className="mt-6">
//               <Label htmlFor="price-description">
//                 Price terms or description
//               </Label>
//               <Textarea
//                 id="price-description"
//                 {...register("price_description")}
//                 placeholder="Write description here"
//                 className="mt-1 min-h-[80px]"
//               />
//             </div>
//           </div>

//           {/* Unit Images */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-6">
//               Unit Images
//             </h2>
//             <div>
//               <Label>Unit Images</Label>
//               <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//                 <input
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   className="sr-only"
//                   id="file-upload"
//                 />
//                 <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
//                 <label
//                   htmlFor="file-upload"
//                   className="cursor-pointer text-sm text-gray-600"
//                 >
//                   Click to upload or drag and drop
//                 </label>
//                 <p className="text-xs text-gray-500 mt-2">
//                   SVG, PNG, JPG or GIF (MAX. 800x400px)
//                 </p>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="mt-4"
//                   onClick={() =>
//                     document.getElementById("file-upload")?.click()
//                   }
//                 >
//                   Browse file
//                 </Button>
//               </div>
//             </div>
//             {imagePreviews.length > 0 && (
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
//                 {imagePreviews.map((preview, index) => (
//                   <div key={index} className="relative group">
//                     <img
//                       src={preview}
//                       alt={`Preview ${index + 1}`}
//                       className="w-full h-32 object-cover rounded-lg"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeImage(index)}
//                       className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                       aria-label="Remove image"
//                     >
//                       <X className="h-4 w-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Unit Details */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-6">
//               Unit Details
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               <div>
//                 <Label htmlFor="size">
//                   Unit (m²) <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="size"
//                   type="number"
//                   {...register("size", { valueAsNumber: true })}
//                   placeholder="10 m size"
//                   className="mt-1"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="bedrooms">
//                   Number of bedrooms <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="bedrooms"
//                   type="number"
//                   {...register("bedrooms", { valueAsNumber: true })}
//                   placeholder="Number of bedrooms"
//                   className="mt-1"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="bathrooms">
//                   Number of bathrooms <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="bathrooms"
//                   type="number"
//                   {...register("bathrooms", { valueAsNumber: true })}
//                   placeholder="Number of bathrooms"
//                   className="mt-1"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="floor">Floor</Label>
//                 <Input
//                   id="floor"
//                   {...register("floor")}
//                   placeholder="Floor"
//                   className="mt-1"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="view">View</Label>
//                 <Controller
//                   name="view"
//                   control={control}
//                   render={({ field }) => (
//                     <Select
//                       onValueChange={field.onChange}
//                       value={field.value || ""}
//                     >
//                       <SelectTrigger className="mt-1">
//                         <SelectValue placeholder="Select View" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="sea">Sea View</SelectItem>
//                         <SelectItem value="city">City View</SelectItem>
//                         <SelectItem value="garden">Garden View</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   )}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="finishing_status">Finishing Type</Label>
//                 <Controller
//                   name="finishing_status"
//                   control={control}
//                   render={({ field }) => (
//                     <Select
//                       onValueChange={field.onChange}
//                       value={field.value || ""}
//                     >
//                       <SelectTrigger className="mt-1">
//                         <SelectValue placeholder="Select Finishing" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {finishingStatus.map((option) => (
//                           <SelectItem key={option.value} value={option.value}>
//                             {option.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   )}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="furnish_status">Furnish Status</Label>
//                 <Controller
//                   name="furnish_status"
//                   control={control}
//                   render={({ field }) => (
//                     <Select
//                       onValueChange={field.onChange}
//                       value={field.value || ""}
//                     >
//                       <SelectTrigger className="mt-1">
//                         <SelectValue placeholder="Select Furnish Status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {furnishStatus.map((option) => (
//                           <SelectItem key={option.value} value={option.value}>
//                             {option.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   )}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="ownership_type">Ownership Type</Label>
//                 <Controller
//                   name="ownership_type"
//                   control={control}
//                   render={({ field }) => (
//                     <Select
//                       onValueChange={field.onChange}
//                       value={field.value || ""}
//                     >
//                       <SelectTrigger className="mt-1">
//                         <SelectValue placeholder="Select Ownership Type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {ownershipType.map((option) => (
//                           <SelectItem key={option.value} value={option.value}>
//                             {option.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   )}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="plot_size">Plot size</Label>
//                 <Input
//                   id="plot_size"
//                   type="number"
//                   {...register("plot_size", { valueAsNumber: true })}
//                   placeholder="Plot Size"
//                   className="mt-1"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="bua_size">Built size</Label>
//                 <Input
//                   id="bua_size"
//                   type="number"
//                   {...register("bua_size", { valueAsNumber: true })}
//                   placeholder="Built Size"
//                   className="mt-1"
//                 />
//               </div>

//               <div className="flex items-center space-x-2 mt-8">
//                 <Controller
//                   name="maid_room"
//                   control={control}
//                   render={({ field }) => (
//                     <div className="flex items-center space-x-2">
//                       <Checkbox
//                         id="maid_room"
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                       />
//                       <label
//                         htmlFor="maid_room"
//                         className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                       >
//                         Maid Room
//                       </label>
//                     </div>
//                   )}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Unit License */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-6">
//               Unit License
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               <div>
//                 <Label htmlFor="broker_license">Broker License</Label>
//                 <Input
//                   id="broker_license"
//                   {...register("broker_license")}
//                   placeholder="Broker License"
//                   className="mt-1"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="agent_license">Agent License</Label>
//                 <Input
//                   id="agent_license"
//                   {...register("agent_license")}
//                   placeholder="Agent License"
//                   className="mt-1"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="dld_permit_number">DLD Permit Number</Label>
//                 <Input
//                   id="dld_permit_number"
//                   {...register("dld_permit_number")}
//                   placeholder="DLD Permit Number"
//                   className="mt-1"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="dld_barcode">DLD Barcode</Label>
//                 <Input
//                   id="dld_barcode"
//                   {...register("dld_barcode")}
//                   placeholder="DLD Barcode"
//                   className="mt-1"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="reference_listed">Reference Listed</Label>
//                 <Input
//                   id="reference_listed"
//                   {...register("reference_listed")}
//                   placeholder="Reference Listed"
//                   className="mt-1"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="zone_name">Zone Name</Label>
//                 <Input
//                   id="zone_name"
//                   {...register("zone_name")}
//                   placeholder="Zone Name"
//                   className="mt-1"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="parking_spaces">Parking Spaces</Label>
//                 <Input
//                   id="parking-spaces"
//                   type="number"
//                   {...register("parking_spaces", { valueAsNumber: true })}
//                   placeholder="Parking Spaces"
//                   className="mt-1"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Form Actions */}
//           <div className="flex items-center justify-end gap-4">
//             {errors.root && (
//               <div className="text-red-500 text-sm">{errors.root.message}</div>
//             )}
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => router.push("/admin/properties")}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               className="bg-teal-600 hover:bg-teal-700 text-white"
//               disabled={mutation.isPending}
//             >
//               {mutation.isPending ? "Creating..." : "Create"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
import React from 'react'

export default function Page() {
  return <div>page</div>;
}
