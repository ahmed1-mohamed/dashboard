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
import { createAd } from "@/data/api-client";
import { useCreateAdData } from "@/hooks/use-create-ad";
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

interface CreateAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateAdModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateAdModalProps) {
  return <>page</>;
  // const [step, setStep] = useState(1);
  // const [adImage, setAdImage] = useState<File | null>(null);
  // const [adImagePreview, setAdImagePreview] = useState<string>("");
  // const [developerSearch, setDeveloperSearch] = useState("");
  // const [developerPerPage, setDeveloperPerPage] = useState(15);
  // const developerScrollRef = useRef<HTMLDivElement>(null);
  // const [debouncedDeveloperSearch, setDebouncedDeveloperSearch] = useState("");

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setDebouncedDeveloperSearch(developerSearch);
  //   }, 300);
  //   return () => clearTimeout(timer);
  // }, [developerSearch]);
  // const [projectSearch, setProjectSearch] = useState("");
  // const [propertySearch, setPropertySearch] = useState("");
  // const [debouncedProjectSearch, setDebouncedProjectSearch] = useState("");
  // const [debouncedPropertySearch, setDebouncedPropertySearch] = useState("");

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setDebouncedProjectSearch(projectSearch);
  //   }, 300);
  //   return () => clearTimeout(timer);
  // }, [projectSearch]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setDebouncedPropertySearch(propertySearch);
  //   }, 300);
  //   return () => clearTimeout(timer);
  // }, [propertySearch]);

  // const { data: session } = useSession();

  // const getCountryId = (countryName: string): string => {
  //   const countryMap: Record<string, string> = {
  //     Egypt: "1",
  //     UAE: "2",
  //     Oman: "3",
  //   };
  //   return countryMap[countryName] || "1";
  // };

  // const { register, handleSubmit, setValue, watch, trigger } = useForm({
  //   defaultValues: {
  //     title: "",
  //     type: "Banner",
  //     platform: "Web Only",
  //     location: [] as string[],
  //     country: "",
  //     startDate: "",
  //     endDate: "",
  //     status: "Draft",
  //     priority: 1,
  //     billing_unit: "impression",
  //     linkTo: "PROJECTS", // Changed from "Project" to "PROJECTS"
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
  //     image_url: "",
  //   },
  // });

  // const {
  //   developers,
  //   projects,
  //   properties,
  //   loading: developersLoading,
  //   projectsLoading,
  //   propertiesLoading,
  //   developerHasMore,
  //   setDeveloperPage,
  //   loadDevelopers,
  // } = useCreateAdData(
  //   isOpen,
  //   debouncedDeveloperSearch,
  //   getCountryId(watch("country")),
  //   debouncedProjectSearch,
  //   debouncedPropertySearch,
  //   watch("developerId"),
  // );

  // // Date validation state
  // const [dateErrors, setDateErrors] = useState<{
  //   startDate?: string;
  //   endDate?: string;
  //   general?: string;
  // }>({});

  // // Validate date format is YYYY-MM-DD
  // const isValidDateFormat = (dateStr: string): boolean => {
  //   const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  //   return datePattern.test(dateStr);
  // };

  // // Convert date string to ISO 8601 DateTime format in UTC
  // const convertToUTCDateTime = (
  //   dateStr: string,
  //   isEndDate: boolean = false,
  // ): string => {
  //   if (!dateStr) return "";
  //   // Parse the date string (YYYY-MM-DD format)
  //   const date = new Date(dateStr);
  //   // Set time to end of day for end date, start of day for start date
  //   if (isEndDate) {
  //     date.setUTCHours(23, 59, 59, 999);
  //   } else {
  //     date.setUTCHours(0, 0, 0, 0);
  //   }
  //   // Return ISO 8601 format in UTC
  //   return date.toISOString();
  // };

  // // Validate that end DateTime is after start DateTime
  // const validateDateTimeRange = useCallback(
  //   (startDate: string, endDate: string): boolean => {
  //     // Validate start date format
  //     if (startDate && !isValidDateFormat(startDate)) {
  //       setDateErrors((prev) => ({
  //         ...prev,
  //         startDate: "Date must be in YYYY-MM-DD format",
  //         general: undefined,
  //       }));
  //       return false;
  //     }

  //     // Validate end date format if provided
  //     if (endDate && !isValidDateFormat(endDate)) {
  //       setDateErrors((prev) => ({
  //         ...prev,
  //         endDate: "Date must be in YYYY-MM-DD format",
  //         general: undefined,
  //       }));
  //       return false;
  //     }

  //     if (!startDate) {
  //       setDateErrors((prev) => ({
  //         ...prev,
  //         startDate: "Start date is required",
  //         general: undefined,
  //       }));
  //       return false;
  //     }

  //     // Clear start date error if present
  //     setDateErrors((prev) => ({
  //       ...prev,
  //       startDate: undefined,
  //     }));

  //     // If no end date, clear all errors
  //     if (!endDate) {
  //       setDateErrors((prev) => ({
  //         ...prev,
  //         endDate: undefined,
  //         general: undefined,
  //       }));
  //       return true;
  //     }

  //     // Convert to UTC DateTime for comparison
  //     const startDateTime = new Date(convertToUTCDateTime(startDate, false));
  //     const endDateTime = new Date(convertToUTCDateTime(endDate, true));

  //     if (startDateTime >= endDateTime) {
  //       setDateErrors((prev) => ({
  //         ...prev,
  //         endDate: "End DateTime must be after start DateTime",
  //         general: "Please select an end date that is after the start date",
  //       }));
  //       return false;
  //     }

  //     // Valid date range
  //     setDateErrors((prev) => ({
  //       ...prev,
  //       endDate: undefined,
  //       general: undefined,
  //     }));
  //     return true;
  //   },
  //   [],
  // );

  // // Real-time validation when dates change
  // const startDate = watch("startDate");
  // const endDate = watch("endDate");

  // useEffect(() => {
  //   if (startDate || endDate) {
  //     validateDateTimeRange(startDate, endDate);
  //   }
  // }, [startDate, endDate, validateDateTimeRange]);

  // // Clear date errors when modal closes
  // useEffect(() => {
  //   if (!isOpen) {
  //     setDateErrors({});
  //   }
  // }, [isOpen]);

  // const selectedLocations = (watch("location") || []) as string[];

  // // Intersection Observer for infinite scroll
  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (
  //         entries[0].isIntersecting &&
  //         developerHasMore &&
  //         !developersLoading
  //       ) {
  //         const newPerPage = developerPerPage + 15;
  //         setDeveloperPerPage(newPerPage);
  //         loadDevelopers(1, newPerPage, "", true);
  //       }
  //     },
  //     { threshold: 0.1 },
  //   );

  //   if (developerScrollRef.current) {
  //     observer.observe(developerScrollRef.current);
  //   }

  //   return () => observer.disconnect();
  // }, [developerHasMore, developersLoading, developerPerPage, loadDevelopers]);

  // // Clear search when linkTo changes
  // useEffect(() => {
  //   setProjectSearch("");
  //   setPropertySearch("");
  //   setDebouncedProjectSearch("");
  //   setDebouncedPropertySearch("");
  // }, [watch("linkTo")]);

  // // Handle developer selection
  // const handleDeveloperChange = (val: string) => {
  //   setValue("developerId", val);
  //   setValue("projectId", ""); // Reset project/property selection
  // };

  // const toggleLocation = (location: string) => {
  //   const current = Array.isArray(selectedLocations) ? selectedLocations : [];
  //   const updated = current.includes(location)
  //     ? current.filter((l) => l !== location)
  //     : [...current, location];
  //   setValue("location", updated);
  // };

  // const handleNext = async () => {
  //   // Validate date range first
  //   if (!validateDateTimeRange(watch("startDate"), watch("endDate"))) {
  //     return;
  //   }

  //   // Validate first step fields
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
  //   if (isValid) {
  //     setStep(2);
  //   }
  // };

  // const handleBack = () => {
  //   setStep(1);
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

  // const onSubmit = async (data: Record<string, unknown>) => {
  //   try {
  //     if (!session?.user?.accessToken) {
  //       toast.error("Authentication required");
  //       return;
  //     }

  //     // Final date validation before submission
  //     if (!validateDateTimeRange(data.startDate, data.endDate)) {
  //       toast.error("Please fix the date errors before submitting");
  //       return;
  //     }

  //     // Validate CTA Link - required if CTA Button Text is filled AND linkTo is NONE
  //     if (data.linkTo === "NONE" && data.ctaButtonText && !data.ctaUrl) {
  //       toast.error(
  //         "Call-to-Action Link is required when CTA Button Text is provided and Link To is None",
  //       );
  //       return;
  //     }

  //     // Validate CTA Link format - must be a valid URL if provided
  //     if (data.ctaUrl) {
  //       try {
  //         new URL(data.ctaUrl);
  //       } catch {
  //         toast.error("Please enter a valid URL for Call-to-Action Link");
  //         return;
  //       }
  //     }

  //     // Create FormData object for multipart/form-data submission
  //     const formData = new FormData();

  //     // Append campaign fields (send as date string, not datetime)
  //     formData.append("campaign[start_at]", data.startDate);
  //     if (data.endDate) {
  //       formData.append("campaign[end_at]", data.endDate);
  //     }
  //     formData.append("campaign[daily_cap_credits]", "");
  //     formData.append("campaign[status]", data.status);

  //     // Append placement fields
  //     formData.append(
  //       "placement[platform]",
  //       data.platform.toLowerCase().replace(" only", ""),
  //     );
  //     formData.append(
  //       "placement[location]",
  //       data.location[0]?.toLowerCase().replace(" ", "") || "home",
  //     );
  //     formData.append("placement[format]", data.type.toLowerCase());
  //     formData.append("placement[billing_unit]", data.billing_unit);

  //     // Append width and position for pop-up ads
  //     if (data.type === "pop_up") {
  //       formData.append("placement[width]", data.width || "medium");
  //       formData.append("placement[position]", data.position || "bottom_right");
  //     }

  //     // Append other fields
  //     const countryId =
  //       data.country === "Egypt"
  //         ? 1
  //         : data.country === "UAE"
  //           ? 2
  //           : data.country === "Oman"
  //             ? 3
  //             : 1;
  //     formData.append("country_id", countryId.toString());

  //     // Handle entity_type and entity_id based on linkTo
  //     if (data.linkTo !== "NONE") {
  //       formData.append("entity_type", data.linkTo);

  //       if (data.linkTo === "PROJECTS" && data.projectId) {
  //         formData.append("entity_id", data.projectId);
  //       } else if (data.linkTo === "PROPERTIES" && data.projectId) {
  //         formData.append("entity_id", data.projectId);
  //       }
  //       // If PROJECTS/PROPERTIES but no project/property selected, don't send entity_id
  //     }
  //     // If linkTo is NONE, don't send entity_type or entity_id

  //     // Append developer_id in campaign
  //     if (data.developerId) {
  //       formData.append("campaign[developer_id]", data.developerId);
  //     }

  //     formData.append("title", data.title);
  //     formData.append("subtitle", data.description || "");
  //     if (data.ctaButtonText) {
  //       formData.append("cta_label", data.ctaButtonText);
  //     }
  //     if (data.ctaUrl) {
  //       formData.append("cta_url", data.ctaUrl);
  //     }
  //     formData.append("weight", data.priority.toString());

  //     // Append image file if present
  //     if (adImage) {
  //       formData.append("image_url", adImage);
  //     }

  //     console.log("Sending FormData:", formData);
  //     await createAd(formData, session.user.accessToken);

  //     toast.success("Advertisement created successfully!");
  //     onSuccess?.();
  //     onClose();
  //   } catch (error: unknown) {
  //     console.error("Error creating ad:", error);
  //     toast.error(
  //       error?.response?.data?.message || "Failed to create advertisement",
  //     );
  //   }
  // };

  // return (
  //   <Modal
  //     isOpen={isOpen}
  //     onClose={onClose}
  //     title="Create New Advertisement"
  //     size="lg"
  //     showCloseButton={true}
  //     footer={
  //       <div className="flex gap-3 justify-end w-full">
  //         {step === 2 && (
  //           <Button variant="outline" onClick={handleBack} className="gap-2">
  //             Back
  //           </Button>
  //         )}
  //         {step === 1 ? (
  //           <Button
  //             className="bg-teal-600 hover:bg-teal-700 text-white"
  //             onClick={handleNext}
  //           >
  //             Next
  //           </Button>
  //         ) : (
  //           <Button
  //             className="bg-teal-600 hover:bg-teal-700 text-white"
  //             onClick={handleSubmit(onSubmit)}
  //           >
  //             Create Ad
  //           </Button>
  //         )}
  //       </div>
  //     }
  //   >
  //     <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2">
  //       {step === 1 ? (
  //         <>
  //           {/* Step 1 Fields */}
  //           <div>
  //             <Label className="flex items-center gap-1 mb-1.5">
  //               Ad Title <span className="text-red-500">*</span>
  //               <HelpCircle className="h-3 w-3 text-gray-400" />
  //             </Label>
  //             <Input
  //               placeholder="e.g., Luxury Beachfront Villas - Summer Sale"
  //               {...register("title", { required: true })}
  //               className="bg-gray-50 border-gray-200"
  //             />
  //           </div>

  //           <div className="grid grid-cols-2 gap-4">
  //             <div>
  //               <Label className="flex items-center gap-1 mb-1.5">
  //                 Ad Type <span className="text-red-500">*</span>
  //                 <HelpCircle className="h-3 w-3 text-gray-400" />
  //               </Label>
  //               <Select
  //                 value={watch("type")}
  //                 onValueChange={(val) => setValue("type", val)}
  //               >
  //                 <SelectTrigger className="bg-gray-50 border-gray-200">
  //                   <SelectValue placeholder="Select Type" />
  //                 </SelectTrigger>
  //                 <SelectContent>
  //                   <SelectItem value="banner">Banner</SelectItem>
  //                   <SelectItem value="card">Card</SelectItem>
  //                   {/* <SelectItem value="native">Native</SelectItem> */}
  //                   <SelectItem value="pop_up">Pop-up</SelectItem>
  //                   {/* <SelectItem value="slider">Slider</SelectItem>
  //                   <SelectItem value="half_page">Half Page</SelectItem> */}
  //                   <SelectItem value="full_page">Full Page</SelectItem>
  //                   {/* <SelectItem value="badge">Badge</SelectItem>
  //                   <SelectItem value="status">Status</SelectItem> */}
  //                 </SelectContent>
  //               </Select>
  //             </div>
  //             <div>
  //               <Label className="flex items-center gap-1 mb-1.5">
  //                 Platform <span className="text-red-500">*</span>
  //                 <HelpCircle className="h-3 w-3 text-gray-400" />
  //               </Label>
  //               <Select
  //                 value={watch("platform")}
  //                 onValueChange={(val) => setValue("platform", val)}
  //               >
  //                 <SelectTrigger className="bg-gray-50 border-gray-200">
  //                   <SelectValue placeholder="Select Platform" />
  //                 </SelectTrigger>
  //                 <SelectContent>
  //                   <SelectItem value="all">All</SelectItem>
  //                   <SelectItem value="mobile">Mobile App Only</SelectItem>
  //                   <SelectItem value="web">Web</SelectItem>
  //                   <SelectItem value="android">Android</SelectItem>
  //                   <SelectItem value="ios">IOS</SelectItem>
  //                 </SelectContent>
  //               </Select>
  //             </div>
  //           </div>

  //           {watch("type") === "pop_up" && (
  //             <div className="grid grid-cols-2 gap-4">
  //               <div>
  //                 <Label className="flex items-center gap-1 mb-1.5">
  //                   Width
  //                   <HelpCircle className="h-3 w-3 text-gray-400" />
  //                 </Label>
  //                 <Select
  //                   value={watch("width")}
  //                   onValueChange={(val) => setValue("width", val)}
  //                 >
  //                   <SelectTrigger className="bg-gray-50 border-gray-200">
  //                     <SelectValue placeholder="Select Width" />
  //                   </SelectTrigger>
  //                   <SelectContent>
  //                     <SelectItem value="full_screen">Full Screen</SelectItem>
  //                     <SelectItem value="large">Large</SelectItem>
  //                     <SelectItem value="medium">Medium</SelectItem>
  //                     <SelectItem value="small">Small</SelectItem>
  //                     <SelectItem value="custom">Custom</SelectItem>
  //                   </SelectContent>
  //                 </Select>
  //               </div>
  //               <div>
  //                 <Label className="flex items-center gap-1 mb-1.5">
  //                   Position
  //                   <HelpCircle className="h-3 w-3 text-gray-400" />
  //                 </Label>
  //                 <Select
  //                   value={watch("position")}
  //                   onValueChange={(val) => setValue("position", val)}
  //                 >
  //                   <SelectTrigger className="bg-gray-50 border-gray-200">
  //                     <SelectValue placeholder="Select Position" />
  //                   </SelectTrigger>
  //                   <SelectContent>
  //                     <SelectItem value="top_left">Top left</SelectItem>
  //                     <SelectItem value="top_center">Top center</SelectItem>
  //                     <SelectItem value="top_right">Top right</SelectItem>
  //                     <SelectItem value="middle_left">Middle left</SelectItem>
  //                     <SelectItem value="middle_center">
  //                       Middle center
  //                     </SelectItem>
  //                     <SelectItem value="middle_right">Middle right</SelectItem>
  //                     <SelectItem value="bottom_left">Bottom left</SelectItem>
  //                     <SelectItem value="bottom_center">
  //                       Bottom center
  //                     </SelectItem>
  //                     <SelectItem value="bottom_right">Bottom right</SelectItem>
  //                   </SelectContent>
  //                 </Select>
  //               </div>
  //             </div>
  //           )}

  //           <div className="grid grid-cols-2 gap-4">
  //             <div>
  //               <Label className="flex items-center gap-1 mb-1.5">
  //                 Location <span className="text-red-500">*</span>
  //                 <HelpCircle className="h-3 w-3 text-gray-400" />
  //               </Label>
  //               <DropdownMenu>
  //                 <DropdownMenuTrigger asChild>
  //                   <Button
  //                     variant="outline"
  //                     className="w-full justify-between bg-gray-50 border-gray-200 font-normal hover:bg-gray-50 text-left"
  //                   >
  //                     <span className="truncate">
  //                       {selectedLocations.length > 0
  //                         ? selectedLocations.join(", ")
  //                         : "Select Location"}
  //                     </span>
  //                     <ChevronDown className="h-4 w-4 opacity-50" />
  //                   </Button>
  //                 </DropdownMenuTrigger>
  //                 <DropdownMenuContent className="w-56" align="start">
  //                   {LOCATIONS.map((loc) => (
  //                     <DropdownMenuCheckboxItem
  //                       key={loc}
  //                       checked={selectedLocations.includes(loc)}
  //                       onCheckedChange={() => toggleLocation(loc)}
  //                     >
  //                       {loc}
  //                     </DropdownMenuCheckboxItem>
  //                   ))}
  //                 </DropdownMenuContent>
  //               </DropdownMenu>
  //             </div>
  //             <div>
  //               <Label className="flex items-center gap-1 mb-1.5">
  //                 Country <span className="text-red-500">*</span>
  //                 <HelpCircle className="h-3 w-3 text-gray-400" />
  //               </Label>
  //               <Select
  //                 value={watch("country")}
  //                 onValueChange={(val) => setValue("country", val)}
  //               >
  //                 <SelectTrigger className="bg-gray-50 border-gray-200">
  //                   <SelectValue placeholder="Select Country" />
  //                 </SelectTrigger>
  //                 <SelectContent>
  //                   <SelectItem value="Egypt">Egypt</SelectItem>
  //                   <SelectItem value="Oman">Oman</SelectItem>
  //                   <SelectItem value="UAE">UAE</SelectItem>
  //                 </SelectContent>
  //               </Select>
  //             </div>
  //           </div>

  //           <div className="grid grid-cols-2 gap-4">
  //             <div>
  //               <Label
  //                 className="flex items-center gap-1 mb-1.5"
  //                 htmlFor="startDate"
  //               >
  //                 Start Date <span className="text-red-500">*</span>
  //               </Label>
  //               <div className="relative">
  //                 <Input
  //                   id="startDate"
  //                   type="date"
  //                   {...register("startDate", { required: true })}
  //                   className={`bg-gray-50 pl-10 ${
  //                     dateErrors.startDate
  //                       ? "border-red-500 focus-visible:ring-red-500"
  //                       : "border-gray-200"
  //                   }`}
  //                   aria-invalid={!!dateErrors.startDate}
  //                   aria-describedby={
  //                     dateErrors.startDate ? "startDate-error" : undefined
  //                   }
  //                   onChange={(e) => {
  //                     register("startDate").onChange(e);
  //                     // Immediate validation on change
  //                     validateDateTimeRange(e.target.value, watch("endDate"));
  //                   }}
  //                 />
  //                 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
  //               </div>
  //               {dateErrors.startDate && (
  //                 <p
  //                   id="startDate-error"
  //                   className="text-xs text-red-500 mt-1"
  //                   role="alert"
  //                   aria-live="polite"
  //                 >
  //                   {dateErrors.startDate}
  //                 </p>
  //               )}
  //             </div>
  //             <div>
  //               <Label
  //                 className="flex items-center gap-1 mb-1.5"
  //                 htmlFor="endDate"
  //               >
  //                 End Date
  //               </Label>
  //               <div className="relative">
  //                 <Input
  //                   id="endDate"
  //                   type="date"
  //                   {...register("endDate")}
  //                   className={`bg-gray-50 pl-10 ${
  //                     dateErrors.endDate
  //                       ? "border-red-500 focus-visible:ring-red-500"
  //                       : "border-gray-200"
  //                   }`}
  //                   aria-invalid={!!dateErrors.endDate}
  //                   aria-describedby={
  //                     dateErrors.endDate ? "endDate-error" : undefined
  //                   }
  //                   min={watch("startDate") || undefined}
  //                   onChange={(e) => {
  //                     register("endDate").onChange(e);
  //                     // Immediate validation on change
  //                     validateDateTimeRange(watch("startDate"), e.target.value);
  //                   }}
  //                 />
  //                 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
  //               </div>
  //               <p className="text-xs text-gray-500 mt-1">
  //                 Leave empty for ongoing campaigns
  //               </p>
  //               {dateErrors.endDate && (
  //                 <p
  //                   id="endDate-error"
  //                   className="text-xs text-red-500 mt-1"
  //                   role="alert"
  //                   aria-live="polite"
  //                 >
  //                   {dateErrors.endDate}
  //                 </p>
  //               )}
  //             </div>
  //           </div>
  //           {dateErrors.general && (
  //             <div
  //               className="p-3 rounded-md bg-red-50 border border-red-200"
  //               role="alert"
  //               aria-live="polite"
  //             >
  //               <p className="text-sm text-red-600">{dateErrors.general}</p>
  //             </div>
  //           )}

  //           <div className="grid grid-cols-3 gap-4">
  //             <div>
  //               <Label className="flex items-center gap-1 mb-1.5">
  //                 Status <span className="text-red-500">*</span>
  //                 <HelpCircle className="h-3 w-3 text-gray-400" />
  //               </Label>
  //               <Select
  //                 value={watch("status")}
  //                 onValueChange={(val) => setValue("status", val)}
  //               >
  //                 <SelectTrigger className="bg-gray-50 border-gray-200">
  //                   <SelectValue placeholder="Select Status" />
  //                 </SelectTrigger>
  //                 <SelectContent>
  //                   <SelectItem value="active">Active</SelectItem>
  //                   <SelectItem value="paused">Paused</SelectItem>
  //                   <SelectItem value="draft">Draft</SelectItem>
  //                   <SelectItem value="ended">Ended</SelectItem>
  //                 </SelectContent>
  //               </Select>
  //             </div>
  //             <div>
  //               <Label className="flex items-center gap-1 mb-1.5">
  //                 Priority Level ( 1 - 10 ){" "}
  //                 <span className="text-red-500">*</span>
  //                 <HelpCircle className="h-3 w-3 text-gray-400" />
  //               </Label>
  //               <Input
  //                 type="number"
  //                 min="1"
  //                 max="10"
  //                 placeholder="1"
  //                 {...register("priority", { required: true, min: 1, max: 10 })}
  //                 className="bg-gray-50 border-gray-200"
  //               />
  //             </div>
  //             <div>
  //               <Label className="flex items-center gap-1 mb-1.5">
  //                 Billing Unit <span className="text-red-500">*</span>
  //                 <HelpCircle className="h-3 w-3 text-gray-400" />
  //               </Label>
  //               <Select
  //                 value={watch("billing_unit")}
  //                 onValueChange={(val) => setValue("billing_unit", val)}
  //               >
  //                 <SelectTrigger className="bg-gray-50 border-gray-200">
  //                   <SelectValue placeholder="Select Billing Unit" />
  //                 </SelectTrigger>
  //                 <SelectContent>
  //                   <SelectItem value="month">Month</SelectItem>
  //                   <SelectItem value="click">Click</SelectItem>
  //                   <SelectItem value="view">View</SelectItem>
  //                   <SelectItem value="impression">Impression</SelectItem>
  //                 </SelectContent>
  //               </Select>
  //             </div>
  //           </div>
  //         </>
  //       ) : (
  //         <>
  //           <div className="grid grid-cols-1 gap-4">
  //             <div>
  //               <Label className="flex items-center gap-1 mb-1.5">
  //                 Select Developer
  //                 <span className="text-red-500">*</span>
  //                 <HelpCircle className="h-3 w-3 text-gray-400" />
  //               </Label>
  //               <div className="flex gap-2">
  //                 <div className="relative flex-1">
  //                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
  //                   <Input
  //                     placeholder="Search developers..."
  //                     value={developerSearch}
  //                     onChange={(e) => {
  //                       setDeveloperSearch(e.target.value);
  //                     }}
  //                     className="bg-gray-50 border-gray-200 pl-10"
  //                   />
  //                 </div>
  //               </div>
  //               <Select
  //                 value={watch("developerId")}
  //                 onValueChange={handleDeveloperChange}
  //               >
  //                 <SelectTrigger className="bg-gray-50 border-gray-200 mt-2">
  //                   <SelectValue placeholder="Select Developer" />
  //                 </SelectTrigger>
  //                 <SelectContent className="max-h-60 overflow-y-auto">
  //                   {developersLoading && developers.length === 0 ? (
  //                     <div className="p-2 text-sm text-gray-500 text-center">
  //                       Loading developers...
  //                     </div>
  //                   ) : developers.length === 0 ? (
  //                     <div className="p-2 text-sm text-gray-500 text-center">
  //                       No developers found
  //                     </div>
  //                   ) : (
  //                     <>
  //                       {developers
  //                         .filter((dev) =>
  //                           dev.name
  //                             .toLowerCase()
  //                             .includes(developerSearch.toLowerCase()),
  //                         )
  //                         .map((dev) => (
  //                           <SelectItem key={dev.id} value={dev.id.toString()}>
  //                             {dev.name}
  //                           </SelectItem>
  //                         ))}
  //                       <div ref={developerScrollRef} className="h-4" />
  //                       {developersLoading && developers.length > 0 && (
  //                         <div className="p-2 text-sm text-gray-500 text-center">
  //                           Loading more...
  //                         </div>
  //                       )}
  //                       {!developersLoading && developerHasMore && (
  //                         <div className="p-2 text-sm text-gray-400 text-center text-xs">
  //                           Scroll for more
  //                         </div>
  //                       )}
  //                     </>
  //                   )}
  //                 </SelectContent>
  //               </Select>
  //             </div>
  //           </div>

  //           {/* Link To and Position in Grid */}
  //           <div className="grid grid-cols-2 gap-4">
  //             <div>
  //               <Label className="flex items-center gap-1 mb-1.5">
  //                 Link To <span className="text-red-500">*</span>
  //                 <HelpCircle className="h-3 w-3 text-gray-400" />
  //               </Label>
  //               <Select
  //                 value={watch("linkTo")}
  //                 onValueChange={(val) => {
  //                   setValue("linkTo", val);
  //                   if (val === "NONE") {
  //                     setValue("projectId", "");
  //                   }
  //                 }}
  //               >
  //                 <SelectTrigger className="bg-gray-50 border-gray-200">
  //                   <SelectValue placeholder="Select Link Type" />
  //                 </SelectTrigger>
  //                 <SelectContent>
  //                   <SelectItem value="NONE">None</SelectItem>
  //                   <SelectItem value="PROJECTS">Project</SelectItem>
  //                   <SelectItem value="PROPERTIES">Property</SelectItem>
  //                 </SelectContent>
  //               </Select>
  //             </div>
  //           </div>

  //           {watch("linkTo") !== "NONE" && (
  //             <>
  //               <Label className="flex items-center gap-1 mb-1.5">
  //                 Select{" "}
  //                 {watch("linkTo") === "PROJECTS" ? "Project" : "Property"}{" "}
  //                 <span className="text-red-500">*</span>
  //                 <HelpCircle className="h-3 w-3 text-gray-400" />
  //               </Label>
  //               <div className="flex gap-2">
  //                 <div className="relative flex-1">
  //                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
  //                   <Input
  //                     placeholder={`Search ${watch("linkTo") === "PROJECTS" ? "projects" : "properties"}...`}
  //                     value={
  //                       watch("linkTo") === "PROJECTS"
  //                         ? projectSearch
  //                         : propertySearch
  //                     }
  //                     onChange={(e) => {
  //                       if (watch("linkTo") === "PROJECTS") {
  //                         setProjectSearch(e.target.value);
  //                       } else {
  //                         setPropertySearch(e.target.value);
  //                       }
  //                     }}
  //                     className="bg-gray-50 border-gray-200 pl-10"
  //                     disabled={
  //                       !watch("developerId") ||
  //                       (watch("linkTo") === "PROJECTS"
  //                         ? projectsLoading
  //                         : propertiesLoading)
  //                     }
  //                   />
  //                 </div>
  //               </div>
  //               <Select
  //                 value={watch("projectId")}
  //                 onValueChange={(val) => setValue("projectId", val)}
  //               >
  //                 <SelectTrigger className="bg-gray-50 border-gray-200 mt-2">
  //                   <SelectValue
  //                     placeholder={`Select ${watch("linkTo") === "PROJECTS" ? "Project" : "Property"}`}
  //                   />
  //                 </SelectTrigger>
  //                 <SelectContent>
  //                   {watch("linkTo") === "PROJECTS" ? (
  //                     projectsLoading ? (
  //                       <div className="p-2 text-sm text-gray-500 text-center">
  //                         Loading projects...
  //                       </div>
  //                     ) : projects.length === 0 ? (
  //                       <div className="p-2 text-sm text-gray-500 text-center">
  //                         No projects available
  //                       </div>
  //                     ) : (
  //                       projects
  //                         .filter((proj) =>
  //                           proj.name
  //                             .toLowerCase()
  //                             .includes(projectSearch.toLowerCase()),
  //                         )
  //                         .map((proj) => (
  //                           <SelectItem
  //                             key={proj.id}
  //                             value={proj.id.toString()}
  //                           >
  //                             {proj.name}
  //                           </SelectItem>
  //                         ))
  //                     )
  //                   ) : propertiesLoading ? (
  //                     <div className="p-2 text-sm text-gray-500 text-center">
  //                       Loading properties...
  //                     </div>
  //                   ) : properties.length === 0 ? (
  //                     <div className="p-2 text-sm text-gray-500 text-center">
  //                       No properties available
  //                     </div>
  //                   ) : (
  //                     properties
  //                       .filter((prop) =>
  //                         prop.name
  //                           .toLowerCase()
  //                           .includes(propertySearch.toLowerCase()),
  //                       )
  //                       .map((prop, index) => (
  //                         <SelectItem key={index} value={prop.id.toString()}>
  //                           {prop.name}
  //                         </SelectItem>
  //                       ))
  //                   )}
  //                 </SelectContent>
  //               </Select>
  //             </>
  //           )}

  //           <div>
  //             <Label className="flex items-center gap-1 mb-1.5">
  //               Ad Image <span className="text-red-500">*</span>
  //               <HelpCircle className="h-3 w-3 text-gray-400" />
  //             </Label>
  //             <div
  //               className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
  //               onClick={() =>
  //                 document.getElementById("ad-image-upload")?.click()
  //               }
  //             >
  //               {adImagePreview ? (
  //                 <img
  //                   src={adImagePreview}
  //                   alt="Preview"
  //                   className="max-h-48 object-contain mb-4"
  //                 />
  //               ) : (
  //                 <Upload className="h-8 w-8 text-gray-400 mb-3" />
  //               )}
  //               <div className="text-sm text-gray-600 font-medium">
  //                 Click to upload or drag and drop
  //               </div>
  //               <div className="text-xs text-gray-500 mt-1">
  //                 PNG, JPG or WEBP (MAX. 2MB)
  //               </div>
  //               <Button
  //                 type="button"
  //                 variant="outline"
  //                 className="mt-4 bg-teal-600 text-white border-transparent hover:bg-teal-700 hover:text-white"
  //                 onClick={(e) => {
  //                   e.stopPropagation();
  //                   document.getElementById("ad-image-upload")?.click();
  //                 }}
  //               >
  //                 Browse file
  //               </Button>
  //               <input
  //                 id="ad-image-upload"
  //                 type="file"
  //                 accept="image/png, image/jpeg, image/webp"
  //                 className="hidden"
  //                 onChange={handleImageUpload}
  //               />
  //             </div>
  //           </div>

  //           <div>
  //             <Label className="flex items-center gap-1 mb-1.5">
  //               Short Description <span className="text-red-500">*</span>
  //               <HelpCircle className="h-3 w-3 text-gray-400" />
  //             </Label>
  //             <RichTextEditor
  //               content={watch("description")}
  //               onChange={(content) => setValue("description", content)}
  //               // className="min-h-[150px]"
  //             />
  //           </div>

  //           {/* Toggle Switches */}
  //           <div className="grid grid-cols-4 gap-4">
  //             <div className="flex items-center gap-2">
  //               <Switch
  //                 checked={watch("handover")}
  //                 onCheckedChange={(checked) => setValue("handover", checked)}
  //               />
  //               <Label className="cursor-pointer">Handover</Label>
  //             </div>
  //             <div className="flex items-center gap-2">
  //               <Switch
  //                 checked={watch("developer")}
  //                 onCheckedChange={(checked) => setValue("developer", checked)}
  //               />
  //               <Label className="cursor-pointer">Developer</Label>
  //             </div>
  //             <div className="flex items-center gap-2">
  //               <Switch
  //                 checked={watch("price")}
  //                 onCheckedChange={(checked) => setValue("price", checked)}
  //               />
  //               <Label className="cursor-pointer">Price</Label>
  //             </div>
  //             <div className="flex items-center gap-2">
  //               <Switch
  //                 checked={watch("rate")}
  //                 onCheckedChange={(checked) => setValue("rate", checked)}
  //               />
  //               <Label className="cursor-pointer">Rate</Label>
  //             </div>
  //           </div>

  //           {/* Call-to-Action Button Text */}
  //           <div>
  //             <Label className="flex items-center gap-1 mb-1.5">
  //               Call-to-Action Button Text
  //               <HelpCircle className="h-3 w-3 text-gray-400" />
  //             </Label>
  //             <Input
  //               placeholder="hurry Up !"
  //               {...register("ctaButtonText")}
  //               className="bg-gray-50 border-gray-200"
  //             />
  //           </div>
  //           <div>
  //             <Label className="flex items-center gap-1 mb-1.5">
  //               Call-to-Action Link
  //               <HelpCircle className="h-3 w-3 text-gray-400" />
  //             </Label>
  //             <Input
  //               placeholder="https://example.com"
  //               {...register("ctaUrl")}
  //               className="bg-gray-50 border-gray-200"
  //             />
  //           </div>
  //         </>
  //       )}
  //     </div>
  //   </Modal>
  // );
}
