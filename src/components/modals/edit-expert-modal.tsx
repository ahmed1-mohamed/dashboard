"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, ChevronRight, Plus, X, Upload } from "lucide-react";
import { useEditExpertData } from "@/hooks/use-edit-expert";
import { useExpertActions } from "@/hooks/use-expert-actions";
import { toast } from "sonner";

interface EditExpertModalProps {
  expertId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Certifications {
  cert_name: string;
}

interface ExpertFormData {
  image: File | null;
  email: string;
  phone_number: string;
  display_name: string;
  title: string;
  bio: string;
  years_experience: number;
  certifications: Certifications[];
  website: string;
  linkedin: string;
  languages: number[];
  categories: number[];
  countries: number[];
  podcast: boolean;
}

interface ExpertDetail {
  expert_id: number;
  user_id: number;
  status: string;
  display_name: string;
  title: string | null;
  bio: string;
  years_experience: number;
  certifications: { cert_name: string }[];
  website: string;
  linkedin: string;
  photo_url: string | null;
  podcast: number;
  languages: { language_id: number }[];
  categories: { category_id: number }[];
  countries: { id: number }[];
  user: {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: ExpertDetail;
}

const STEPS = [
  { id: 1, title: "Basic Info" },
  { id: 2, title: "Professional Details" },
];

export function EditExpertModal({
  expertId,
  isOpen,
  onClose,
}: EditExpertModalProps) {
  // const [currentStep, setCurrentStep] = useState(1);
  // const [certifications, setCertifications] = useState<Certifications[]>([
  //   { cert_name: "" },
  // ]);
  // const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  // const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  // const [selectedCountries, setSelectedCountries] = useState<number[]>([]);
  // const [imagePreview, setImagePreview] = useState<string | null>(null);
  // const [existingImage, setExistingImage] = useState<string | null>(null);
  // const fileInputRef = useRef<HTMLInputElement>(null);
  // // Fetch data
  // const { languages, categories, countries, expertData, loading } = useEditExpertData(expertId, isOpen);
  // const { updateExpert, isUpdating } = useExpertActions();
  // const {
  //   register,
  //   handleSubmit,
  //   setValue,
  //   watch,
  //   reset,
  //   control,
  //   formState: { errors },
  // } = useForm<ExpertFormData>({
  //   defaultValues: {
  //     image: null,
  //     display_name: "",
  //     title: "",
  //     email: "",
  //     phone_number: "",
  //     bio: "",
  //     years_experience: 0,
  //     certifications: [],
  //     website: "",
  //     linkedin: "",
  //     languages: [],
  //     categories: [],
  //     countries: [],
  //     podcast: false,
  //   },
  // });
  // useEffect(() => {
  //   if (expertData?.data) {
  //     const expert = expertData.data;
  //     setValue("display_name", expert.display_name);
  //     setValue("title", expert.title || "");
  //     setValue("bio", expert.bio);
  //     setValue("years_experience", expert.years_experience);
  //     setValue("website", expert.website);
  //     setValue("linkedin", expert.linkedin);
  //     setValue("podcast", expert.podcast === 1);
  //     setValue("email", expert.user?.email || "");
  //     setValue("phone_number", expert.user?.phone_number || "");
  //     if (expert.certifications && expert.certifications.length > 0) {
  //       setCertifications(expert.certifications);
  //     }
  //     if (expert.languages) {
  //       const langIds = expert.languages.map((l) => l.language_id);
  //       setSelectedLanguages(langIds);
  //       setValue("languages", langIds);
  //     }
  //     if (expert.categories) {
  //       const catIds = expert.categories.map((c) => c.category_id);
  //       setSelectedCategories(catIds);
  //       setValue("categories", catIds);
  //     }
  //     if (expert.countries) {
  //       const countryIds = expert.countries.map((c) => c.id);
  //       setSelectedCountries(countryIds);
  //       setValue("countries", countryIds);
  //     }
  //     if (expert.photo_url) {
  //       setExistingImage(expert.photo_url);
  //       setImagePreview(expert.photo_url);
  //     }
  //   }
  // }, [expertData, setValue]);
  // const handleClose = () => {
  //   reset();
  //   setCertifications([{ cert_name: "" }]);
  //   setSelectedLanguages([]);
  //   setSelectedCategories([]);
  //   setSelectedCountries([]);
  //   setImagePreview(null);
  //   setExistingImage(null);
  //   setCurrentStep(1);
  //   onClose();
  // };
  // const onSubmit = async (data: ExpertFormData) => {
  //   const formData = new FormData();
  //   formData.append("email", data.email);
  //   formData.append("phone_number", data.phone_number);
  //   formData.append("display_name", data.display_name);
  //   if (data.title) formData.append("title", data.title);
  //   if (data.bio) formData.append("bio", data.bio);
  //   formData.append("years_experience", data.years_experience.toString());
  //   const filteredCerts = certifications.filter(
  //     (c) => c.cert_name.trim() !== "",
  //   );
  //   if (filteredCerts.length > 0) {
  //     filteredCerts.forEach((cert, index) => {
  //       formData.append(
  //         `certifications[${index}][cert_name]`,
  //         cert.cert_name,
  //       );
  //     });
  //   }
  //   if (data.website) formData.append("website", data.website);
  //   if (data.linkedin) formData.append("linkedin", data.linkedin);
  //   if (data.languages.length > 0) {
  //     data.languages.forEach((lang, index) => {
  //       formData.append(`languages[${index}]`, lang.toString());
  //     });
  //   }
  //   if (data.categories.length > 0) {
  //     data.categories.forEach((cat) => {
  //       formData.append("categories[]", cat.toString());
  //     });
  //   }
  //   if (data.countries.length > 0) {
  //     data.countries.forEach((country, index) => {
  //       formData.append(`countries[${index}]`, country.toString());
  //     });
  //   }
  //   formData.append("podcast", data.podcast ? "1" : "0");
  //   if (data.image) {
  //     formData.append("photo", data.image);
  //   }
  //   await updateExpert({ expertId: expertId!, formData });
  //   handleClose();
  // };
  // const addCertification = () => {
  //   setCertifications([...certifications, { cert_name: "" }]);
  // };
  // const removeCertification = (index: number) => {
  //   if (certifications.length > 1) {
  //     setCertifications(certifications.filter((_, i) => i !== index));
  //   }
  // };
  // const updateCertification = (index: number, value: string) => {
  //   const updated = [...certifications];
  //   updated[index].cert_name = value;
  //   setCertifications(updated);
  // };
  // const nextStep = () => {
  //   setCurrentStep(2);
  // };
  // const prevStep = () => {
  //   setCurrentStep(1);
  // };
  // if (!isOpen) return null;
  // return (
  //   <Modal
  //     isOpen={isOpen}
  //     onClose={handleClose}
  //     title="Edit Expert"
  //     size="xl"
  //     showCloseButton={false}
  //     footer={
  //       <div className="flex gap-3 justify-between w-full">
  //         <div>
  //           {currentStep === 2 && (
  //             <Button
  //               variant="outline"
  //               onClick={prevStep}
  //               disabled={isUpdating}
  //               className="gap-2"
  //             >
  //               <ChevronLeft className="h-4 w-4" />
  //               Previous
  //             </Button>
  //           )}
  //         </div>
  //         <div className="flex gap-3">
  //           <Button
  //             variant="outline"
  //             onClick={handleClose}
  //             disabled={isUpdating}
  //           >
  //             Cancel
  //           </Button>
  //           {currentStep === 1 ? (
  //             <Button
  //               className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
  //               onClick={nextStep}
  //             >
  //               Next
  //               <ChevronRight className="h-4 w-4" />
  //             </Button>
  //           ) : (
  //             <Button
  //               className="bg-teal-600 hover:bg-teal-700 text-white"
  //               onClick={handleSubmit(onSubmit)}
  //               disabled={isUpdating}
  //             >
  //               {isUpdating ? "Updating..." : "Update Expert"}
  //             </Button>
  //           )}
  //         </div>
  //       </div>
  //     }
  //   >
  //     {loading ? (
  //       <div className="flex items-center justify-center py-12">
  //         <div className="text-center">
  //           <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
  //           <p className="mt-4 text-sm text-gray-600">Loading expert data...</p>
  //         </div>
  //       </div>
  //     ) : (
  //       <div className="max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
  //         <div className="flex items-center justify-center gap-4 mb-6">
  //           {STEPS.map((step, index) => (
  //             <div key={step.id} className="flex items-center">
  //               <div
  //                 className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
  //                   currentStep === step.id
  //                     ? "bg-teal-600 text-white"
  //                     : currentStep > step.id
  //                       ? "bg-teal-600 text-white"
  //                       : "bg-gray-200 text-gray-600"
  //                 }`}
  //               >
  //                 {currentStep > step.id ? (
  //                   <svg
  //                     className="w-4 h-4"
  //                     fill="none"
  //                     stroke="currentColor"
  //                     viewBox="0 0 24 24"
  //                   >
  //                     <path
  //                       strokeLinecap="round"
  //                       strokeLinejoin="round"
  //                       strokeWidth={2}
  //                       d="M5 13l4 4L19 7"
  //                     />
  //                   </svg>
  //                 ) : (
  //                   step.id
  //                 )}
  //               </div>
  //               <span
  //                 className={`ml-2 text-sm font-medium ${
  //                   currentStep === step.id ? "text-teal-600" : "text-gray-500"
  //                 }`}
  //               >
  //                 {step.title}
  //               </span>
  //               {index < STEPS.length - 1 && (
  //                 <div
  //                   className={`w-12 h-0.5 mx-2 ${
  //                     currentStep > step.id ? "bg-teal-600" : "bg-gray-200"
  //                   }`}
  //                 />
  //               )}
  //             </div>
  //           ))}
  //         </div>
  //         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
  //           {currentStep === 1 && (
  //             <div className="space-y-6">
  //               <div className="flex items-center gap-4">
  //                 <div className="w-20 h-20 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
  //                   {imagePreview ? (
  //                     <img
  //                       src={imagePreview}
  //                       alt="Preview"
  //                       className="w-full h-full object-cover"
  //                     />
  //                   ) : (
  //                     <Upload className="h-8 w-8 text-gray-400" />
  //                   )}
  //                 </div>
  //                 <div className="flex-1">
  //                   <div className="relative">
  //                     <input
  //                       type="file"
  //                       id="image-upload-edit"
  //                       ref={fileInputRef}
  //                       className="sr-only"
  //                       accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif"
  //                       onChange={(e) => {
  //                         const file = e.target.files?.[0];
  //                         if (file) {
  //                           setValue("image", file);
  //                           const reader = new FileReader();
  //                           reader.onloadend = () => {
  //                             setImagePreview(reader.result as string);
  //                           };
  //                           reader.readAsDataURL(file);
  //                         }
  //                       }}
  //                     />
  //                     <label
  //                       htmlFor="image-upload-edit"
  //                       className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
  //                     >
  //                       Choose files
  //                     </label>
  //                     <span className="ml-3 text-sm text-gray-500">
  //                       {watch("image")
  //                         ? (watch("image") as File).name
  //                         : existingImage
  //                           ? "Current image"
  //                           : "No file chosen"}
  //                     </span>
  //                   </div>
  //                   <p className="text-xs text-gray-500 mt-2">
  //                     SVG, PNG, JPG or GIF (MAX. 800x400px).
  //                   </p>
  //                 </div>
  //               </div>
  //               <div>
  //                 <Label htmlFor="display_name" className="required">
  //                   Full Name <span className="text-red-500">*</span>
  //                 </Label>
  //                 <Input
  //                   id="display_name"
  //                   placeholder="Dr. Sarah Johnson"
  //                   {...register("display_name", {
  //                     required: "Full name is required",
  //                   })}
  //                   className="mt-1"
  //                 />
  //                 {errors.display_name && (
  //                   <p className="text-xs text-red-500 mt-1">
  //                     {errors.display_name.message}
  //                   </p>
  //                 )}
  //               </div>
  //               <div className="grid grid-cols-2 gap-4">
  //                 <div>
  //                   <Label htmlFor="email" className="required">
  //                     Email Address <span className="text-red-500">*</span>
  //                   </Label>
  //                   <Input
  //                     id="email"
  //                     type="email"
  //                     placeholder="expert@email.com"
  //                     {...register("email", {
  //                       required: "Email is required",
  //                       pattern: {
  //                         value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  //                         message: "Invalid email address",
  //                       },
  //                     })}
  //                     className="mt-1"
  //                   />
  //                   {errors.email && (
  //                     <p className="text-xs text-red-500 mt-1">
  //                       {errors.email.message}
  //                     </p>
  //                   )}
  //                 </div>
  //                 <div>
  //                   <Label htmlFor="phone_number" className="required">
  //                     Phone Number <span className="text-red-500">*</span>
  //                   </Label>
  //                   <Input
  //                     id="phone_number"
  //                     placeholder="+211099530315"
  //                     {...register("phone_number", {
  //                       required: "Phone number is required",
  //                     })}
  //                     className="mt-1"
  //                   />
  //                   {errors.phone_number && (
  //                     <p className="text-xs text-red-500 mt-1">
  //                       {errors.phone_number.message}
  //                     </p>
  //                   )}
  //                 </div>
  //               </div>
  //               <div>
  //                 <Label htmlFor="bio" className="required">
  //                   Professional Bio <span className="text-red-500">*</span>
  //                 </Label>
  //                 <Textarea
  //                   id="bio"
  //                   placeholder="Write about your professional background..."
  //                   {...register("bio", {
  //                     required: "Professional bio is required",
  //                   })}
  //                   className="mt-1"
  //                   rows={4}
  //                 />
  //                 {errors.bio && (
  //                   <p className="text-xs text-red-500 mt-1">
  //                     {errors.bio.message}
  //                   </p>
  //                 )}
  //               </div>
  //             </div>
  //           )}
  //           {currentStep === 2 && (
  //             <div className="space-y-6">
  //               <div>
  //                 <Label htmlFor="years_experience" className="required">
  //                   Years of Experience <span className="text-red-500">*</span>
  //                 </Label>
  //                 <Input
  //                   id="years_experience"
  //                   type="number"
  //                   min="0"
  //                   placeholder="15"
  //                   {...register("years_experience", {
  //                     required: "Years of experience is required",
  //                     valueAsNumber: true,
  //                   })}
  //                   className="mt-1"
  //                 />
  //                 {errors.years_experience && (
  //                   <p className="text-xs text-red-500 mt-1">
  //                     {errors.years_experience.message}
  //                   </p>
  //                 )}
  //               </div>
  //               <div>
  //                 <div className="flex items-center justify-between mb-2">
  //                   <Label htmlFor="certifications" className="required">
  //                     Certifications <span className="text-red-500">*</span>
  //                   </Label>
  //                   <Button
  //                     type="button"
  //                     variant="outline"
  //                     size="sm"
  //                     onClick={addCertification}
  //                     className="gap-2"
  //                   >
  //                     <Plus className="h-4 w-4" />
  //                     Add
  //                   </Button>
  //                 </div>
  //                 <div className="space-y-3">
  //                   {certifications.map((cert, index) => (
  //                     <div key={index} className="flex items-center gap-2">
  //                       <Input
  //                         placeholder="e.g., CFA"
  //                         value={cert.cert_name}
  //                         onChange={(e) =>
  //                           updateCertification(index, e.target.value)
  //                         }
  //                         className="flex-1"
  //                       />
  //                       {certifications.length > 1 && (
  //                         <Button
  //                           type="button"
  //                           variant="ghost"
  //                           size="icon"
  //                           onClick={() => removeCertification(index)}
  //                           className="h-10 w-10 text-gray-500 hover:text-red-500"
  //                         >
  //                           <X className="h-4 w-4" />
  //                         </Button>
  //                       )}
  //                     </div>
  //                   ))}
  //                 </div>
  //               </div>
  //               <div className="grid grid-cols-2 gap-4">
  //                 <div>
  //                   <Label htmlFor="website" className="required">
  //                     Website <span className="text-red-500">*</span>
  //                   </Label>
  //                   <Input
  //                     id="website"
  //                     placeholder="https://www.example.com"
  //                     {...register("website", {
  //                       required: "Website is required",
  //                     })}
  //                     className="mt-1"
  //                   />
  //                   {errors.website && (
  //                     <p className="text-xs text-red-500 mt-1">
  //                       {errors.website.message}
  //                     </p>
  //                   )}
  //                 </div>
  //                 <div>
  //                   <Label htmlFor="linkedin" className="required">
  //                     LinkedIn <span className="text-red-500">*</span>
  //                   </Label>
  //                   <Input
  //                     id="linkedin"
  //                     placeholder="https://linkedin.com/in/username"
  //                     {...register("linkedin", {
  //                       required: "LinkedIn is required",
  //                     })}
  //                     className="mt-1"
  //                   />
  //                   {errors.linkedin && (
  //                     <p className="text-xs text-red-500 mt-1">
  //                       {errors.linkedin.message}
  //                     </p>
  //                   )}
  //                 </div>
  //               </div>
  //               <div>
  //                 <Label htmlFor="categories" className="required">
  //                   Specializations <span className="text-red-500">*</span>
  //                 </Label>
  //                 <Controller
  //                   name="categories"
  //                   control={control}
  //                   render={() => (
  //                     <Select
  //                       onValueChange={(value) => {
  //                         const catId = parseInt(value);
  //                         if (!isNaN(catId)) {
  //                           const newCategories = selectedCategories.includes(
  //                             catId,
  //                           )
  //                             ? selectedCategories.filter(
  //                                 (id: number) => id !== catId,
  //                               )
  //                             : [...selectedCategories, catId];
  //                           setSelectedCategories(newCategories);
  //                           setValue("categories", newCategories);
  //                         }
  //                       }}
  //                     >
  //                       <SelectTrigger className="mt-1">
  //                         <SelectValue placeholder="Select categories" />
  //                       </SelectTrigger>
  //                       <SelectContent>
  //                         {categories.map(
  //                           (cat: { category_id: number; name: string }) => (
  //                             <SelectItem
  //                               key={cat.category_id}
  //                               value={cat.category_id.toString()}
  //                               className={
  //                                 selectedCategories.includes(cat.category_id)
  //                                   ? "bg-teal-50"
  //                                   : ""
  //                               }
  //                             >
  //                               {cat.name}
  //                             </SelectItem>
  //                           ),
  //                         )}
  //                       </SelectContent>
  //                     </Select>
  //                   )}
  //                 />
  //                 {selectedCategories.length > 0 && (
  //                   <div className="flex flex-wrap gap-2 mt-2">
  //                     {selectedCategories.map((specId) => {
  //                       const spec = categories.find(
  //                         (c: { category_id: number; name: string }) =>
  //                           c.category_id === specId,
  //                       );
  //                       return spec ? (
  //                         <span
  //                           key={specId}
  //                           className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full"
  //                         >
  //                           {spec.name}
  //                           <button
  //                             type="button"
  //                             onClick={() => {
  //                               const newSpecs = selectedCategories.filter(
  //                                 (id) => id !== specId,
  //                               );
  //                               setSelectedCategories(newSpecs);
  //                               setValue("categories", newSpecs);
  //                             }}
  //                             className="hover:text-teal-600"
  //                           >
  //                             <X className="h-3 w-3" />
  //                           </button>
  //                         </span>
  //                       ) : null;
  //                     })}
  //                   </div>
  //                 )}
  //                 {errors.categories && (
  //                   <p className="text-xs text-red-500 mt-1">
  //                     {errors.categories.message}
  //                   </p>
  //                 )}
  //               </div>
  //               <div>
  //                 <Label htmlFor="languages" className="required">
  //                   Languages <span className="text-red-500">*</span>
  //                 </Label>
  //                 <Controller
  //                   name="languages"
  //                   control={control}
  //                   render={() => (
  //                     <Select
  //                       onValueChange={(value) => {
  //                         const langId = parseInt(value);
  //                         if (!isNaN(langId)) {
  //                           const newLanguages = selectedLanguages.includes(
  //                             langId,
  //                           )
  //                             ? selectedLanguages.filter((id) => id !== langId)
  //                             : [...selectedLanguages, langId];
  //                           setSelectedLanguages(newLanguages);
  //                           setValue("languages", newLanguages);
  //                         }
  //                       }}
  //                     >
  //                       <SelectTrigger className="mt-1">
  //                         <SelectValue placeholder="Select languages" />
  //                       </SelectTrigger>
  //                       <SelectContent>
  //                         {languages.map(
  //                           (lang: { language_id: number; name: string }) => (
  //                             <SelectItem
  //                               key={lang.language_id}
  //                               value={lang.language_id.toString()}
  //                               className={
  //                                 selectedLanguages.includes(lang.language_id)
  //                                   ? "bg-teal-50"
  //                                   : ""
  //                               }
  //                             >
  //                               {lang.name}
  //                             </SelectItem>
  //                           ),
  //                         )}
  //                       </SelectContent>
  //                     </Select>
  //                   )}
  //                 />
  //                 {selectedLanguages.length > 0 && (
  //                   <div className="flex flex-wrap gap-2 mt-2">
  //                     {selectedLanguages.map((langId) => {
  //                       const lang = languages.find(
  //                         (l: { language_id: number; name: string }) =>
  //                           l.language_id === langId,
  //                       );
  //                       return lang ? (
  //                         <span
  //                           key={langId}
  //                           className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full"
  //                         >
  //                           {lang.name}
  //                           <button
  //                             type="button"
  //                             onClick={() => {
  //                               const newLanguages = selectedLanguages.filter(
  //                                 (id) => id !== langId,
  //                               );
  //                               setSelectedLanguages(newLanguages);
  //                               setValue("languages", newLanguages);
  //                             }}
  //                             className="hover:text-teal-600"
  //                           >
  //                             <X className="h-3 w-3" />
  //                           </button>
  //                         </span>
  //                       ) : null;
  //                     })}
  //                   </div>
  //                 )}
  //                 {errors.languages && (
  //                   <p className="text-xs text-red-500 mt-1">
  //                     {errors.languages.message}
  //                   </p>
  //                 )}
  //               </div>
  //               <div>
  //                 <Label htmlFor="countries" className="required">
  //                   Service Area (Select at least one){" "}
  //                   <span className="text-red-500">*</span>
  //                 </Label>
  //                 <Controller
  //                   name="countries"
  //                   control={control}
  //                   rules={{ required: "Service area is required" }}
  //                   render={() => (
  //                     <Select
  //                       onValueChange={(value) => {
  //                         const countryId = parseInt(value);
  //                         if (!isNaN(countryId)) {
  //                           const newServiceAreas = selectedCountries.includes(
  //                             countryId,
  //                           )
  //                             ? selectedCountries.filter(
  //                                 (id) => id !== countryId,
  //                               )
  //                             : [...selectedCountries, countryId];
  //                           setSelectedCountries(newServiceAreas);
  //                           setValue("countries", newServiceAreas);
  //                         }
  //                       }}
  //                     >
  //                       <SelectTrigger className="mt-1">
  //                         <SelectValue placeholder="Select service areas" />
  //                       </SelectTrigger>
  //                       <SelectContent>
  //                         {countries.map(
  //                           (country: { id: number; name: string }) => (
  //                             <SelectItem
  //                               key={country.id}
  //                               value={country.id.toString()}
  //                               className={
  //                                 selectedCountries.includes(country.id)
  //                                   ? "bg-teal-50"
  //                                   : ""
  //                               }
  //                             >
  //                               {country.name}
  //                             </SelectItem>
  //                           ),
  //                         )}
  //                       </SelectContent>
  //                     </Select>
  //                   )}
  //                 />
  //                 {selectedCountries.length > 0 && (
  //                   <div className="flex flex-wrap gap-2 mt-2">
  //                     {selectedCountries.map((areaId) => {
  //                       const area = countries.find(
  //                         (c: { id: number; name: string }) => c.id === areaId,
  //                       );
  //                       return area ? (
  //                         <span
  //                           key={areaId}
  //                           className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full"
  //                         >
  //                           {area.name}
  //                           <button
  //                             type="button"
  //                             onClick={() => {
  //                               const newAreas = selectedCountries.filter(
  //                                 (id) => id !== areaId,
  //                               );
  //                               setSelectedCountries(newAreas);
  //                               setValue("countries", newAreas);
  //                             }}
  //                             className="hover:text-teal-600"
  //                           >
  //                             <X className="h-3 w-3" />
  //                           </button>
  //                         </span>
  //                       ) : null;
  //                     })}
  //                   </div>
  //                 )}
  //                 {errors.countries && (
  //                   <p className="text-xs text-red-500 mt-1">
  //                     {errors.countries.message}
  //                   </p>
  //                 )}
  //               </div>
  //               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
  //                 <div>
  //                   <Label htmlFor="podcast" className="font-medium">
  //                     Podcast Module
  //                   </Label>
  //                   <p className="text-sm text-gray-500">
  //                     Enable if expert has a podcast
  //                   </p>
  //                 </div>
  //                 <Controller
  //                   name="podcast"
  //                   control={control}
  //                   render={({ field }) => (
  //                     <Switch
  //                       id="podcast"
  //                       checked={field.value}
  //                       onCheckedChange={field.onChange}
  //                       className="data-[state=checked]:bg-teal-600"
  //                     />
  //                   )}
  //                 />
  //               </div>
  //             </div>
  //           )}
  //         </form>
  //       </div>
  //     )}
  //   </Modal>
  // );
}
