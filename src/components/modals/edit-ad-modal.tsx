"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  HelpCircle,
  Upload,
  Calendar,
  ChevronDown,
  Search,
} from "lucide-react";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAdActions } from "@/hooks/use-ad-actions";
import { useAdEditData } from "@/hooks/use-ad-edit";
import { toast } from "sonner";

const LOCATIONS = [
  "Home",
  "Search",
  "Featured Cards",
  "Project Listing",
  "Unit Listing",
  "Developer Listing",
  "Expert Listing",
  "Podcast Listing",
  "Shares",
  "Ai Feature",
];

interface Ad {
  creative_id: string;
  creative_title: string;
  type: string;
  platform: "Web" | "Mobile" | "Both";
  country: string;
  location: string;
  views: number;
  clicks: number;
  ctr: string;
  status: string;
}

interface AdData {
  title: string;
  placement?: {
    format: string;
    platform: string;
    location: string;
    billing_unit: string;
    width?: string;
    position?: string;
  };
  country_id: number;
  campaign?: {
    start_at: string | null;
    end_at: string | null;
    developer?: {
      developer_id: number;
    };
  };
  status: string;
  weight: number;
  entity_type: string;
  entity_id?: string;
  subtitle: string;
  cta_label?: string;
  cta_url?: string;
  image_url?: string;
}

interface EditAdFormData {
  title: string;
  type: string;
  platform: string;
  location: string[];
  country: string;
  startDate: string;
  endDate: string;
  status: string;
  priority: number;
  billing_unit: string;
  linkTo: string;
  projectId: string;
  description: string;
  handover: boolean;
  developer: boolean;
  price: boolean;
  rate: boolean;
  ctaButtonText: string;
  ctaUrl: string;
  width: string;
  position: string;
  developerId: string;
}

interface EditAdModalProps {
  ad: Ad | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditAdModal({
  ad,
  isOpen,
  onClose,
  onSuccess,
}: EditAdModalProps) {

  // const [adImage, setAdImage] = useState<File | null>(null);
  // const [adImagePreview, setAdImagePreview] = useState<string>("");

  // const { register, handleSubmit, setValue, watch, trigger } = useForm({
  //   defaultValues: {
  //     title: "",
  //     type: "banner",
  //     platform: "web",
  //     location: [] as string[],
  //     country: "Egypt",
  //     startDate: "",
  //     endDate: "",
  //     status: "draft",
  //     priority: 1,
  //     billing_unit: "impression",
  //     linkTo: "PROJECTS",
  //     projectId: "",
  //     description: "",
  //     handover: false,
  //     developer: false,
  //     price: false,
  //     rate: false,
  //     ctaButtonText: "",
  //     ctaUrl: "",
  //     width: "medium",
  //     position: "bottom_right",
  //     developerId: "",
  //   },
  // });

  // const {
  //   adData,
  //   developers,
  //   developerSearch,
  //   setDeveloperSearch,
  //   developersLoading,
  //   projects,
  //   properties,
  //   projectsLoading,
  //   propertiesLoading,
  //   projectSearch,
  //   setProjectSearch,
  //   propertySearch,
  //   setPropertySearch,
  //   developerHasMore,
  // }: {
  //   adData: AdData | null;
  //   developers: any[];
  //   developerSearch: string;
  //   setDeveloperSearch: (value: string) => void;
  //   developersLoading: boolean;
  //   projects: any[];
  //   properties: any[];
  //   projectsLoading: boolean;
  //   propertiesLoading: boolean;
  //   projectSearch: string;
  //   setProjectSearch: (value: string) => void;
  //   propertySearch: string;
  //   setPropertySearch: (value: string) => void;
  //   developerHasMore: boolean;
  // } = useAdEditData(
  //   ad,
  //   isOpen,
  //   watch("country"),
  //   watch("developerId"),
  //   watch("linkTo"),
  // );

  // const [dateErrors, setDateErrors] = useState<{
  //   startDate?: string;
  //   endDate?: string;
  //   general?: string;
  // }>({});

  // const isValidDateFormat = (dateStr: string): boolean => {
  //   return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  // };

  // const convertToUTCDateTime = (dateStr: string, isEndDate = false): string => {
  //   if (!dateStr) return "";
  //   const date = new Date(dateStr);
  //   if (isEndDate) {
  //     date.setUTCHours(23, 59, 59, 999);
  //   } else {
  //     date.setUTCHours(0, 0, 0, 0);
  //   }
  //   return date.toISOString();
  // };

  // const validateDateTimeRange = useCallback(
  //   (startDate: string, endDate: string): boolean => {
  //     if (startDate && !isValidDateFormat(startDate)) {
  //       setDateErrors({ startDate: "Invalid format" });
  //       return false;
  //     }
  //     if (endDate && !isValidDateFormat(endDate)) {
  //       setDateErrors({ endDate: "Invalid format" });
  //       return false;
  //     }
  //     if (!startDate) {
  //       setDateErrors({ startDate: "Required" });
  //       return false;
  //     }

  //     if (!endDate) return true;

  //     const start = new Date(convertToUTCDateTime(startDate));
  //     const end = new Date(convertToUTCDateTime(endDate, true));

  //     if (start >= end) {
  //       setDateErrors({ endDate: "End must be after start" });
  //       return false;
  //     }

  //     setDateErrors({});
  //     return true;
  //   },
  //   [],
  // );

  // const startDate = watch("startDate");
  // const endDate = watch("endDate");

  // useEffect(() => {
  //   if (startDate || endDate) {
  //     validateDateTimeRange(startDate, endDate);
  //   }
  // }, [startDate, endDate, validateDateTimeRange]);

  // // Load ad data into form when available
  // useEffect(() => {
  //   if (adData) {
  //     setValue("title", adData.title || "");
  //     setValue("type", adData.placement?.format || "banner");
  //     setValue("platform", adData.placement?.platform || "web");
  //     setValue(
  //       "location",
  //       adData.placement?.location ? [adData.placement.location] : [],
  //     );

  //     const countryMap: Record<number, string> = {
  //       1: "Egypt",
  //       2: "UAE",
  //       3: "Oman",
  //     };
  //     setValue("country", countryMap[adData.country_id] || "Egypt");

  //     const formatDate = (dateStr: string | null | undefined) => {
  //       if (!dateStr) return "";
  //       if (dateStr.includes("T")) {
  //         return dateStr.split("T")[0];
  //       }
  //       return dateStr.split(" ")[0];
  //     };

  //     setValue("startDate", formatDate(adData.campaign?.start_at));
  //     setValue("endDate", formatDate(adData.campaign?.end_at));
  //     setValue("status", adData.status || "draft");
  //     setValue("priority", adData.weight || 1);
  //     setValue("billing_unit", adData.placement?.billing_unit || "impression");
  //     setValue("linkTo", adData.entity_type || "PROJECTS");
  //     setValue("projectId", adData.entity_id?.toString() || "");
  //     setValue("description", adData.subtitle || "");
  //     setValue("ctaButtonText", adData.cta_label || "");
  //     setValue("ctaUrl", adData.cta_url || "");
  //     setValue("width", adData.placement?.width || "medium");
  //     setValue("position", adData.placement?.position || "bottom_right");

  //     if (adData.campaign?.developer?.developer_id) {
  //       setValue(
  //         "developerId",
  //         adData.campaign.developer.developer_id.toString(),
  //       );
  //     }

  //     if (adData.image_url) setAdImagePreview(adData.image_url);
  //   }
  // }, [adData, setValue]);

  // const { updateAd, isUpdating } = useAdActions();

  // const selectedLocations = (watch("location") || []) as string[];

  // const handleDeveloperChange = (val: string) => {
  //   setValue("developerId", val);
  //   setValue("projectId", "");
  // };

  // const toggleLocation = (location: string) => {
  //   const current = Array.isArray(selectedLocations) ? selectedLocations : [];
  //   const updated = current.includes(location)
  //     ? current.filter((l) => l !== location)
  //     : [...current, location];
  //   setValue("location", updated);
  // };

  // const renderSelectOptions = () => {
  //   if (watch("linkTo") === "PROJECTS") {
  //     if (projectsLoading) {
  //       return (
  //         <div className="p-2 text-sm text-gray-500 text-center">
  //           Loading projects...
  //         </div>
  //       );
  //     }
  //     if (projects.length === 0) {
  //       return (
  //         <div className="p-2 text-sm text-gray-500 text-center">
  //           No projects available
  //         </div>
  //       );
  //     }
  //     return (
  //       <>
  //         {projects
  //           .filter((proj) =>
  //             proj.name.toLowerCase().includes(projectSearch.toLowerCase()),
  //           )
  //           .map((proj) => (
  //             <SelectItem key={proj.id} value={proj.id.toString()}>
  //               {proj.name}
  //             </SelectItem>
  //           ))}
  //       </>
  //     );
  //   } else {
  //     if (propertiesLoading) {
  //       return (
  //         <div className="p-2 text-sm text-gray-500 text-center">
  //           Loading properties...
  //         </div>
  //       );
  //     }
  //     if (properties.length === 0) {
  //       return (
  //         <div className="p-2 text-sm text-gray-500 text-center">
  //           No properties available
  //         </div>
  //       );
  //     }
  //     return (
  //       <>
  //         {properties
  //           .filter((prop) =>
  //             prop.name.toLowerCase().includes(propertySearch.toLowerCase()),
  //           )
  //           .map((prop) => (
  //             <SelectItem key={prop.id} value={prop.id.toString()}>
  //               {prop.name}
  //             </SelectItem>
  //           ))}
  //       </>
  //     );
  //   }
  // };

  // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setAdImage(file);
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setAdImagePreview(reader.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const onSubmit = async (data: EditAdFormData) => {
  //   if (!validateDateTimeRange(watch("startDate"), watch("endDate"))) return;

  //   const isValid = await trigger([
  //     "title",
  //     "type",
  //     "platform",
  //     "location",
  //     "country",
  //     "startDate",
  //     "status",
  //     "priority",
  //     "billing_unit",
  //   ]);
  //   if (!isValid) return;

  //   // Validate CTA Link - required if CTA Button Text is filled AND linkTo is NONE
  //   if (data.linkTo === "NONE" && data.ctaButtonText && !data.ctaUrl) {
  //     toast.error(
  //       "Call-to-Action Link is required when CTA Button Text is provided and Link To is None",
  //     );
  //     return;
  //   }

  //   // Validate CTA Link format - must be a valid URL if provided
  //   if (data.ctaUrl) {
  //     try {
  //       new URL(data.ctaUrl);
  //     } catch {
  //       toast.error("Please enter a valid URL for Call-to-Action Link");
  //       return;
  //     }
  //   }

  //   const formData = new FormData();

  //   formData.append("campaign[start_at]", data.startDate);
  //   if (data.endDate) formData.append("campaign[end_at]", data.endDate);
  //   formData.append("campaign[daily_cap_credits]", "");
  //   formData.append("campaign[status]", data.status);

  //   formData.append(
  //     "placement[platform]",
  //     data.platform.toLowerCase().replace(" only", ""),
  //   );
  //   formData.append(
  //     "placement[location]",
  //     data.location?.[0]?.toLowerCase().replace(/\s+/g, "") || "home",
  //   );
  //   formData.append("placement[format]", data.type.toLowerCase());
  //   formData.append("placement[billing_unit]", data.billing_unit);

  //   if (data.type === "pop_up") {
  //     formData.append("placement[width]", data.width || "medium");
  //     formData.append("placement[position]", data.position || "bottom_right");
  //   }

  //   const countryId =
  //     data.country === "Egypt"
  //       ? 1
  //       : data.country === "UAE"
  //         ? 2
  //         : data.country === "Oman"
  //           ? 3
  //           : 1;
  //   formData.append("country_id", countryId.toString());

  //   if (data.linkTo !== "NONE") {
  //     formData.append("entity_type", data.linkTo);

  //     if (data.linkTo === "PROJECTS" && data.projectId) {
  //       formData.append("entity_id", data.projectId);
  //     } else if (data.linkTo === "PROPERTIES" && data.projectId) {
  //       formData.append("entity_id", data.projectId);
  //     }
  //   }

  //   if (data.developerId) {
  //     formData.append("campaign[developer_id]", data.developerId);
  //   }

  //   formData.append("title", data.title);
  //   formData.append("subtitle", data.description || "");
  //   if (data.ctaButtonText) {
  //     formData.append("cta_label", data.ctaButtonText);
  //   }
  //   if (data.ctaUrl) {
  //     formData.append("cta_url", data.ctaUrl);
  //   }
  //   formData.append("weight", data.priority.toString());

  //   if (adImage) {
  //     formData.append("image_url", adImage);
  //   }

  //   try {
  //     await updateAd(ad!.creative_id, formData);

  //     toast.success("Advertisement updated successfully!");
  //     onSuccess?.();
  //     onClose();
  //   } catch (error) {
  //     console.error("Error updating ad:", error);
  //   }
  // };

  // return (
  //   <Modal
  //     isOpen={isOpen}
  //     onClose={onClose}
  //     title="Edit Advertisement"
  //     size="lg"
  //     showCloseButton={true}
  //     footer={
  //       <div className="flex gap-3 justify-end w-full">
  //         <Button
  //           className="bg-teal-600 hover:bg-teal-700 text-white"
  //           onClick={handleSubmit(onSubmit)}
  //           disabled={isUpdating}
  //         >
  //           {isUpdating ? "Updating..." : "Update Ad"}
  //         </Button>
  //       </div>
  //     }
  //   >
  //     <div>
  //       <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2">
  //         <div className="grid grid-cols-2 gap-4">
  //           <div>
  //             <Label className="flex items-center gap-1 mb-1.5">
  //               Ad Type <span className="text-red-500">*</span>
  //               <HelpCircle className="h-3 w-3 text-gray-400" />
  //             </Label>
  //             <Select
  //               value={watch("type")}
  //               onValueChange={(val) => setValue("type", val)}
  //             >
  //               <SelectTrigger className="bg-gray-50 border-gray-200">
  //                 <SelectValue placeholder="Select Type" />
  //               </SelectTrigger>
  //               <SelectContent>
  //                 <SelectItem value="banner">Banner</SelectItem>
  //                 <SelectItem value="card">Card</SelectItem>
  //                 {/* <SelectItem value="native">Native</SelectItem> */}
  //                 <SelectItem value="pop_up">Pop-up</SelectItem>
  //                 {/* <SelectItem value="slider">Slider</SelectItem>
  //                     <SelectItem value="half_page">Half Page</SelectItem> */}
  //                 <SelectItem value="full_page">Full Page</SelectItem>
  //                 {/* <SelectItem value="badge">Badge</SelectItem>
  //                     <SelectItem value="status">Status</SelectItem> */}
  //               </SelectContent>
  //             </Select>
  //           </div>
  //           <div>
  //             <Label className="flex items-center gap-1 mb-1.5">
  //               Platform <span className="text-red-500">*</span>
  //               <HelpCircle className="h-3 w-3 text-gray-400" />
  //             </Label>
  //             <Select
  //               value={watch("platform")}
  //               onValueChange={(val) => setValue("platform", val)}
  //             >
  //               <SelectTrigger className="bg-gray-50 border-gray-200">
  //                 <SelectValue placeholder="Select Platform" />
  //               </SelectTrigger>
  //               <SelectContent>
  //                 <SelectItem value="all">All</SelectItem>
  //                 <SelectItem value="mobile">Mobile App Only</SelectItem>
  //                 <SelectItem value="web">Web</SelectItem>
  //                 <SelectItem value="android">Android</SelectItem>
  //                 <SelectItem value="ios">IOS</SelectItem>
  //               </SelectContent>
  //             </Select>
  //           </div>
  //         </div>

  //         {watch("type") === "pop_up" && (
  //           <div className="grid grid-cols-2 gap-4">
  //             <div>
  //               <Label className="flex items-center gap-1 mb-1.5">
  //                 Width
  //                 <HelpCircle className="h-3 w-3 text-gray-400" />
  //               </Label>

  //               <Select
  //                 value={watch("width")}
  //                 onValueChange={(val) => setValue("width", val)}
  //               >
  //                 <SelectTrigger className="bg-gray-50 border-gray-200">
  //                   <SelectValue placeholder="Select Width" />
  //                 </SelectTrigger>

  //                 <SelectContent>
  //                   <SelectItem value="full_screen">Full Screen</SelectItem>
  //                   <SelectItem value="large">Large</SelectItem>
  //                   <SelectItem value="medium">Medium</SelectItem>
  //                   <SelectItem value="small">Small</SelectItem>
  //                   <SelectItem value="custom">Custom</SelectItem>
  //                 </SelectContent>
  //               </Select>
  //             </div>

  //             <div>
  //               <Label className="flex items-center gap-1 mb-1.5">
  //                 Position
  //                 <HelpCircle className="h-3 w-3 text-gray-400" />
  //               </Label>

  //               <Select
  //                 value={watch("position")}
  //                 onValueChange={(val) => setValue("position", val)}
  //               >
  //                 <SelectTrigger className="bg-gray-50 border-gray-200">
  //                   <SelectValue placeholder="Select Position" />
  //                 </SelectTrigger>

  //                 <SelectContent>
  //                   <SelectItem value="top_left">Top left</SelectItem>
  //                   <SelectItem value="top_center">Top center</SelectItem>
  //                   <SelectItem value="top_right">Top right</SelectItem>
  //                   <SelectItem value="middle_left">Middle left</SelectItem>
  //                   <SelectItem value="middle_center">Middle center</SelectItem>
  //                   <SelectItem value="middle_right">Middle right</SelectItem>
  //                   <SelectItem value="bottom_left">Bottom left</SelectItem>
  //                   <SelectItem value="bottom_center">Bottom center</SelectItem>
  //                   <SelectItem value="bottom_right">Bottom right</SelectItem>
  //                 </SelectContent>
  //               </Select>
  //             </div>
  //           </div>
  //         )}

  //         <div className="grid grid-cols-2 gap-4">
  //           <div>
  //             <Label className="flex items-center gap-1 mb-1.5">
  //               Location <span className="text-red-500">*</span>
  //               <HelpCircle className="h-3 w-3 text-gray-400" />
  //             </Label>

  //             <DropdownMenu>
  //               <DropdownMenuTrigger asChild>
  //                 <Button
  //                   variant="outline"
  //                   className="w-full justify-between bg-gray-50 border-gray-200 font-normal hover:bg-gray-50 text-left"
  //                 >
  //                   <span className="truncate">
  //                     {selectedLocations.length > 0
  //                       ? selectedLocations.join(", ")
  //                       : "Select Location"}
  //                   </span>

  //                   <ChevronDown className="h-4 w-4 opacity-50" />
  //                 </Button>
  //               </DropdownMenuTrigger>

  //               <DropdownMenuContent className="w-56" align="start">
  //                 {LOCATIONS.map((loc) => (
  //                   <DropdownMenuCheckboxItem
  //                     key={loc}
  //                     checked={selectedLocations.includes(loc)}
  //                     onCheckedChange={() => toggleLocation(loc)}
  //                   >
  //                     {loc}
  //                   </DropdownMenuCheckboxItem>
  //                 ))}
  //               </DropdownMenuContent>
  //             </DropdownMenu>
  //           </div>

  //           <div>
  //             <Label className="flex items-center gap-1 mb-1.5">
  //               Country <span className="text-red-500">*</span>
  //               <HelpCircle className="h-3 w-3 text-gray-400" />
  //             </Label>

  //             <Select
  //               value={watch("country")}
  //               onValueChange={(val) => setValue("country", val)}
  //             >
  //               <SelectTrigger className="bg-gray-50 border-gray-200">
  //                 <SelectValue placeholder="Select Country" />
  //               </SelectTrigger>

  //               <SelectContent>
  //                 <SelectItem value="Egypt">Egypt</SelectItem>
  //                 <SelectItem value="Oman">Oman</SelectItem>
  //                 <SelectItem value="UAE">UAE</SelectItem>
  //               </SelectContent>
  //             </Select>
  //           </div>
  //         </div>

  //         <div className="grid grid-cols-2 gap-4">
  //           <div>
  //             <Label
  //               className="flex items-center gap-1 mb-1.5"
  //               htmlFor="startDate"
  //             >
  //               Start Date <span className="text-red-500">*</span>
  //             </Label>

  //             <div className="relative">
  //               <Input
  //                 id="startDate"
  //                 type="date"
  //                 {...register("startDate", { required: true })}
  //                 className={`bg-gray-50 pl-10 ${
  //                   dateErrors.startDate
  //                     ? "border-red-500 focus-visible:ring-red-500"
  //                     : "border-gray-200"
  //                 }`}
  //                 onChange={(e) => {
  //                   register("startDate").onChange(e);
  //                   validateDateTimeRange(e.target.value, watch("endDate"));
  //                 }}
  //               />

  //               <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
  //             </div>

  //             {dateErrors.startDate && (
  //               <p className="text-xs text-red-500 mt-1">
  //                 {dateErrors.startDate}
  //               </p>
  //             )}
  //           </div>

  //           <div>
  //             <Label
  //               className="flex items-center gap-1 mb-1.5"
  //               htmlFor="endDate"
  //             >
  //               End Date
  //             </Label>

  //             <div className="relative">
  //               <Input
  //                 id="endDate"
  //                 type="date"
  //                 {...register("endDate")}
  //                 className={`bg-gray-50 pl-10 ${
  //                   dateErrors.endDate
  //                     ? "border-red-500 focus-visible:ring-red-500"
  //                     : "border-gray-200"
  //                 }`}
  //                 min={watch("startDate") || undefined}
  //                 onChange={(e) => {
  //                   register("endDate").onChange(e);
  //                   validateDateTimeRange(watch("startDate"), e.target.value);
  //                 }}
  //               />

  //               <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
  //             </div>

  //             <p className="text-xs text-gray-500 mt-1">
  //               Leave empty for ongoing campaigns
  //             </p>

  //             {dateErrors.endDate && (
  //               <p className="text-xs text-red-500 mt-1">
  //                 {dateErrors.endDate}
  //               </p>
  //             )}
  //           </div>
  //         </div>
  //         {dateErrors.general && (
  //           <div
  //             className="p-3 rounded-md bg-red-50 border border-red-200"
  //             role="alert"
  //             aria-live="polite"
  //           >
  //             <p className="text-sm text-red-600">{dateErrors.general}</p>
  //           </div>
  //         )}

  //         <div className="grid grid-cols-3 gap-4">
  //           <div>
  //             <Label className="flex items-center gap-1 mb-1.5">
  //               Status <span className="text-red-500">*</span>
  //               <HelpCircle className="h-3 w-3 text-gray-400" />
  //             </Label>
  //             <Select
  //               value={watch("status")}
  //               onValueChange={(val) => setValue("status", val)}
  //             >
  //               <SelectTrigger className="bg-gray-50 border-gray-200">
  //                 <SelectValue placeholder="Select Status" />
  //               </SelectTrigger>
  //               <SelectContent>
  //                 <SelectItem value="active">Active</SelectItem>
  //                 <SelectItem value="paused">Paused</SelectItem>
  //                 <SelectItem value="draft">Draft</SelectItem>
  //                 <SelectItem value="ended">Ended</SelectItem>
  //               </SelectContent>
  //             </Select>
  //           </div>
  //           <div>
  //             <Label className="flex items-center gap-1 mb-1.5">
  //               Priority Level ( 1 - 10 ){" "}
  //               <span className="text-red-500">*</span>
  //               <HelpCircle className="h-3 w-3 text-gray-400" />
  //             </Label>
  //             <Input
  //               type="number"
  //               min="1"
  //               max="10"
  //               placeholder="1"
  //               {...register("priority", {
  //                 required: true,
  //                 min: 1,
  //                 max: 10,
  //               })}
  //               className="bg-gray-50 border-gray-200"
  //             />
  //           </div>
  //           <div>
  //             <Label className="flex items-center gap-1 mb-1.5">
  //               Billing Unit <span className="text-red-500">*</span>
  //               <HelpCircle className="h-3 w-3 text-gray-400" />
  //             </Label>
  //             <Select
  //               value={watch("billing_unit")}
  //               onValueChange={(val) => setValue("billing_unit", val)}
  //             >
  //               <SelectTrigger className="bg-gray-50 border-gray-200">
  //                 <SelectValue placeholder="Select Billing Unit" />
  //               </SelectTrigger>
  //               <SelectContent>
  //                 <SelectItem value="month">Month</SelectItem>
  //                 <SelectItem value="click">Click</SelectItem>
  //                 <SelectItem value="view">View</SelectItem>
  //                 <SelectItem value="impression">Impression</SelectItem>
  //               </SelectContent>
  //             </Select>
  //           </div>
  //         </div>
  //       </div>

  //       <div>
  //         <Label className="flex items-center gap-1 mb-1.5">
  //           Select Developer
  //           <span className="text-red-500">*</span>
  //           <HelpCircle className="h-3 w-3 text-gray-400" />
  //         </Label>
  //         <div className="flex gap-2">
  //           <div className="relative flex-1">
  //             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
  //             <Input
  //               placeholder="Search developers..."
  //               value={developerSearch}
  //               onChange={(e) => {
  //                 setDeveloperSearch(e.target.value);
  //               }}
  //               className="bg-gray-50 border-gray-200 pl-10"
  //             />
  //           </div>
  //         </div>
  //         <Select
  //           value={watch("developerId")}
  //           onValueChange={handleDeveloperChange}
  //         >
  //           <SelectTrigger className="bg-gray-50 border-gray-200 mt-2">
  //             <SelectValue placeholder="Select Developer" />
  //           </SelectTrigger>
  //           <SelectContent className="max-h-60 overflow-y-auto">
  //             {developersLoading && developers.length === 0 ? (
  //               <div className="p-2 text-sm text-gray-500 text-center">
  //                 Loading developers...
  //               </div>
  //             ) : developers.length === 0 ? (
  //               <div className="p-2 text-sm text-gray-500 text-center">
  //                 No developers found
  //               </div>
  //             ) : (
  //               <>
  //                 {developers
  //                   .filter((dev) =>
  //                     dev.name
  //                       .toLowerCase()
  //                       .includes(developerSearch.toLowerCase()),
  //                   )
  //                   .map((dev) => (
  //                     <SelectItem key={dev.id} value={dev.id.toString()}>
  //                       {dev.name}
  //                     </SelectItem>
  //                   ))}
  //               </>
  //             )}
  //           </SelectContent>
  //         </Select>
  //       </div>

  //       <div className="grid grid-cols-2 gap-4">
  //         <div>
  //           <Label className="flex items-center gap-1 mb-1.5">
  //             Link To <span className="text-red-500">*</span>
  //             <HelpCircle className="h-3 w-3 text-gray-400" />
  //           </Label>
  //           <Select
  //             value={watch("linkTo")}
  //             onValueChange={(val) => {
  //               setValue("linkTo", val);
  //               if (val === "NONE") {
  //                 setValue("projectId", "");
  //               }
  //             }}
  //           >
  //             <SelectTrigger className="bg-gray-50 border-gray-200">
  //               <SelectValue placeholder="Select Link Type" />
  //             </SelectTrigger>
  //             <SelectContent>
  //               <SelectItem value="NONE">None</SelectItem>
  //               <SelectItem value="PROJECTS">Project</SelectItem>
  //               <SelectItem value="PROPERTIES">Property</SelectItem>
  //             </SelectContent>
  //           </Select>
  //         </div>
  //       </div>

  //       {watch("linkTo") !== "NONE" && (
  //         <>
  //           <Label className="flex items-center gap-1 mb-1.5">
  //             Select {watch("linkTo") === "PROJECTS" ? "Project" : "Property"}{" "}
  //             <span className="text-red-500">*</span>
  //             <HelpCircle className="h-3 w-3 text-gray-400" />
  //           </Label>
  //           <div className="flex gap-2">
  //             <div className="relative flex-1">
  //               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
  //               <Input
  //                 placeholder={`Search ${watch("linkTo") === "PROJECTS" ? "projects" : "properties"}...`}
  //                 value={
  //                   watch("linkTo") === "PROJECTS"
  //                     ? projectSearch
  //                     : propertySearch
  //                 }
  //                 onChange={(e) => {
  //                   if (watch("linkTo") === "PROJECTS") {
  //                     setProjectSearch(e.target.value);
  //                   } else {
  //                     setPropertySearch(e.target.value);
  //                   }
  //                 }}
  //                 className="bg-gray-50 border-gray-200 pl-10"
  //                 disabled={
  //                   !watch("developerId") ||
  //                   (watch("linkTo") === "PROJECTS"
  //                     ? projectsLoading
  //                     : propertiesLoading)
  //                 }
  //               />
  //             </div>
  //           </div>
  //           <Select
  //             value={watch("projectId")}
  //             onValueChange={(val) => setValue("projectId", val)}
  //           >
  //             <SelectTrigger className="bg-gray-50 border-gray-200 mt-2">
  //               <SelectValue
  //                 placeholder={`Select ${watch("linkTo") === "PROJECTS" ? "Project" : "Property"}`}
  //               />
  //             </SelectTrigger>
  //             <SelectContent>{renderSelectOptions()}</SelectContent>
  //           </Select>
  //         </>
  //       )}

  //       <div>
  //         <Label className="flex items-center gap-1 mb-1.5">
  //           Ad Image <span className="text-red-500">*</span>
  //           <HelpCircle className="h-3 w-3 text-gray-400" />
  //         </Label>
  //         <div
  //           className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
  //           onClick={() =>
  //             document.getElementById("ad-image-upload-edit")?.click()
  //           }
  //         >
  //           {adImagePreview ? (
  //             <img
  //               src={adImagePreview}
  //               alt="Preview"
  //               className="max-h-48 object-contain mb-4"
  //             />
  //           ) : (
  //             <Upload className="h-8 w-8 text-gray-400 mb-3" />
  //           )}
  //           <div className="text-sm text-gray-600 font-medium">
  //             Click to upload or drag and drop
  //           </div>
  //           <div className="text-xs text-gray-500 mt-1">
  //             PNG, JPG or WEBP (MAX. 2MB)
  //           </div>
  //           <Button
  //             type="button"
  //             variant="outline"
  //             className="mt-4 bg-teal-600 text-white border-transparent hover:bg-teal-700 hover:text-white"
  //             onClick={(e) => {
  //               e.stopPropagation();
  //               document.getElementById("ad-image-upload-edit")?.click();
  //             }}
  //           >
  //             Browse file
  //           </Button>
  //           <input
  //             id="ad-image-upload-edit"
  //             type="file"
  //             accept="image/png, image/jpeg, image/webp"
  //             className="hidden"
  //             onChange={handleImageUpload}
  //           />
  //         </div>
  //       </div>

  //       <div>
  //         <Label className="flex items-center gap-1 mb-1.5">
  //           Short Description <span className="text-red-500">*</span>
  //           <HelpCircle className="h-3 w-3 text-gray-400" />
  //         </Label>
  //         <RichTextEditor
  //           content={watch("description")}
  //           onChange={(content) => setValue("description", content)}
  //         />
  //       </div>

  //       <div className="grid grid-cols-4 gap-4">
  //         <div className="flex items-center gap-2">
  //           <Switch
  //             checked={watch("handover")}
  //             onCheckedChange={(checked) => setValue("handover", checked)}
  //           />
  //           <Label className="cursor-pointer">Handover</Label>
  //         </div>
  //         <div className="flex items-center gap-2">
  //           <Switch
  //             checked={watch("developer")}
  //             onCheckedChange={(checked) => setValue("developer", checked)}
  //           />
  //           <Label className="cursor-pointer">Developer</Label>
  //         </div>
  //         <div className="flex items-center gap-2">
  //           <Switch
  //             checked={watch("price")}
  //             onCheckedChange={(checked) => setValue("price", checked)}
  //           />
  //           <Label className="cursor-pointer">Price</Label>
  //         </div>
  //         <div className="flex items-center gap-2">
  //           <Switch
  //             checked={watch("rate")}
  //             onCheckedChange={(checked) => setValue("rate", checked)}
  //           />
  //           <Label className="cursor-pointer">Rate</Label>
  //         </div>
  //       </div>

  //       <div>
  //         <Label className="flex items-center gap-1 mb-1.5">
  //           Call-to-Action Button Text
  //           <HelpCircle className="h-3 w-3 text-gray-400" />
  //         </Label>
  //         <Input
  //           placeholder="hurry Up !"
  //           {...register("ctaButtonText")}
  //           className="bg-gray-50 border-gray-200"
  //         />
  //       </div>
  //       <div>
  //         <Label className="flex items-center gap-1 mb-1.5">
  //           Call-to-Action Link
  //           <HelpCircle className="h-3 w-3 text-gray-400" />
  //         </Label>
  //         <Input
  //           placeholder="https://example.com"
  //           {...register("ctaUrl")}
  //           className="bg-gray-50 border-gray-200"
  //         />
  //       </div>
  //     </div>
  //   </Modal>
  // );
}
