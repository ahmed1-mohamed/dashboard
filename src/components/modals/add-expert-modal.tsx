"use client";

import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAddExpertData } from "@/hooks/use-add-expert";
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
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, ChevronRight, Plus, X, Upload } from "lucide-react";
import { toast } from "sonner";
import { useExpertActions } from "@/hooks/use-expert-actions";
import { AdminExpertsService } from "@/services/AdminExpertsService";

interface AddExpertModalProps {
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

const STEPS = [
  { id: 1, title: "Basic Info" },
  { id: 2, title: "Professional Details" },
];

export function AddExpertModal({ isOpen, onClose }: AddExpertModalProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { createExpert, isCreating } = useExpertActions();

  const [currentStep, setCurrentStep] = useState(1);
  const [certifications, setCertifications] = useState<Certifications[]>([
    { cert_name: "" },
  ]);
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<number[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: languagesData } = useQuery({
    queryKey: ["expert-languages"],
    queryFn: async () => {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(
        "https://demoapi.p-adviser.com/api/experts/languages",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch languages");
      }

      return response.json();
    },
    enabled: !!session?.user?.accessToken && isOpen,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["expert-categories"],
    queryFn: async () => {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(
        "https://demoapi.p-adviser.com/api/experts/categories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      return response.json();
    },
    enabled: !!session?.user?.accessToken && isOpen,
  });

  const { data: countriesData } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(
        "https://demoapi.p-adviser.com/api/dashboard/countries",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch countries");
      }

      return response.json();
    },
    enabled: !!session?.user?.accessToken && isOpen,
  });

  const languages = languagesData?.data || [];
  const categories = categoriesData?.data || [];
  const countries = countriesData || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<ExpertFormData>({
    defaultValues: {
      image: null,
      display_name: "",
      title: "",
      email: "",
      phone_number: "",
      bio: "",
      years_experience: 0,
      certifications: [],
      website: "",
      linkedin: "",
      languages: [],
      categories: [],
      countries: [],
      podcast: false,
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addCertification = () => {
    setCertifications([...certifications, { cert_name: "" }]);
  };

  const removeCertification = (index: number) => {
    if (certifications.length > 1) {
      setCertifications(certifications.filter((_, i) => i !== index));
    }
  };

  const updateCertification = (index: number, value: string) => {
    const updated = [...certifications];
    updated[index].cert_name = value;
    setCertifications(updated);
  };

  const handleClose = () => {
    reset();
    setCertifications([{ cert_name: "" }]);
    setSelectedLanguages([]);
    setSelectedCategories([]);
    setSelectedCountries([]);
    setImagePreview(null);
    setCurrentStep(1);
    onClose();
  };

  const onSubmit = async (data: ExpertFormData) => {
    try {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Not authenticated");

      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("phone_number", data.phone_number);
      formData.append("display_name", data.display_name);
      if (data.title) formData.append("title", data.title);
      if (data.bio) formData.append("bio", data.bio);
      formData.append("years_experience", data.years_experience.toString());

      const filteredCerts = certifications.filter(
        (c) => c.cert_name.trim() !== "",
      );
      if (filteredCerts.length > 0) {
        filteredCerts.forEach((cert, index) => {
          formData.append(
            `certifications[${index}][cert_name]`,
            cert.cert_name,
          );
        });
      }

      if (data.website) formData.append("website", data.website);
      if (data.linkedin) formData.append("linkedin", data.linkedin);

      if (data.languages.length > 0) {
        data.languages.forEach((lang, index) => {
          formData.append(`languages[${index}]`, lang.toString());
        });
      }

      if (data.categories.length > 0) {
        data.categories.forEach((cat, index) => {
          formData.append(`categories[${index}]`, cat.toString());
        });
      }

      if (data.countries.length > 0) {
        data.countries.forEach((country, index) => {
          formData.append(`countries[${index}]`, country.toString());
        });
      }

      formData.append("podcast", data.podcast ? "1" : "0");

      if (data.image) {
        formData.append("photo", data.image);
      }

      await createExpert(formData);
      handleClose();
    } catch (error) {
      // Error is handled by the hook's toast notification
      console.error("Failed to create expert:", error);
    }
  };

  const nextStep = () => {
    setCurrentStep(2);
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Expert"
      size="xl"
      showCloseButton={false}
      footer={
        <div className="flex gap-3 justify-between w-full">
          <div>
            {currentStep === 2 && (
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={isCreating}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
            >
              Cancel
            </Button>
            {currentStep === 1 ? (
              <Button
                className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
                onClick={nextStep}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="bg-teal-600 hover:bg-teal-700 text-white"
                onClick={handleSubmit(onSubmit)}
                disabled={isCreating}
              >
                {isCreating ? "Adding..." : "Add Expert"}
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Image Upload */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="file"
                      id="image-upload"
                      ref={fileInputRef}
                      className="sr-only"
                      accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif"
                      onChange={handleImageUpload}
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      Choose files
                    </label>
                    <span className="ml-3 text-sm text-gray-500">
                      {watch("image")
                        ? (watch("image") as File).name
                        : "No file chosen"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    SVG, PNG, JPG or GIF (MAX. 800x400px).
                  </p>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <Label htmlFor="display_name" className="required">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="display_name"
                  placeholder="Dr. Sarah Johnson"
                  {...register("display_name", {
                    required: "Full name is required",
                  })}
                  className="mt-1"
                />
                {errors.display_name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.display_name.message}
                  </p>
                )}
              </div>

              {/* Email and Phone Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="required">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="expert@email.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="mt-1"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone_number" className="required">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone_number"
                    placeholder="+211099530315"
                    {...register("phone_number", {
                      required: "Phone number is required",
                    })}
                    className="mt-1"
                  />
                  {errors.phone_number && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.phone_number.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Professional Bio */}
              <div>
                <Label htmlFor="bio" className="required">
                  Professional Bio <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Write about your professional background..."
                  {...register("bio", {
                    required: "Professional bio is required",
                  })}
                  className="mt-1"
                  rows={4}
                />
                {errors.bio && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.bio.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Professional Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Years of Experience */}
              <div>
                <Label htmlFor="years_experience" className="required">
                  Years of Experience <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="years_experience"
                  type="number"
                  min="0"
                  placeholder="15"
                  {...register("years_experience", {
                    required: "Years of experience is required",
                    valueAsNumber: true,
                  })}
                  className="mt-1"
                />
                {errors.years_experience && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.years_experience.message}
                  </p>
                )}
              </div>

              {/* Certifications */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="certifications" className="required">
                    Certifications <span className="text-red-500">*</span>
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCertification}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="e.g., CFA"
                        value={cert.cert_name}
                        onChange={(e) =>
                          updateCertification(index, e.target.value)
                        }
                        className="flex-1"
                      />
                      {certifications.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCertification(index)}
                          className="h-10 w-10 text-gray-500 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Website and LinkedIn Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website" className="required">
                    Website <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="website"
                    placeholder="https://www.example.com"
                    {...register("website", {
                      required: "Website is required",
                    })}
                    className="mt-1"
                  />
                  {errors.website && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.website.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="linkedin" className="required">
                    LinkedIn <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/in/username"
                    {...register("linkedin", {
                      required: "LinkedIn is required",
                    })}
                    className="mt-1"
                  />
                  {errors.linkedin && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.linkedin.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Specializations */}
              <div>
                <Label htmlFor="categories" className="required">
                  Specializations <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="categories"
                  control={control}
                  render={() => (
                    <Select
                      onValueChange={(value) => {
                        const catId = parseInt(value);
                        if (!isNaN(catId)) {
                          const newCategories = selectedCategories.includes(
                            catId,
                          )
                            ? selectedCategories.filter(
                                (id: number) => id !== catId,
                              )
                            : [...selectedCategories, catId];
                          setSelectedCategories(newCategories);
                          setValue("categories", newCategories);
                        }
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(
                          (cat: { category_id: number; name: string }) => (
                            <SelectItem
                              key={cat.category_id}
                              value={cat.category_id.toString()}
                              className={
                                selectedCategories.includes(cat.category_id)
                                  ? "bg-teal-50"
                                  : ""
                              }
                            >
                              {cat.name}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {selectedCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCategories.map((specId) => {
                      const spec = categories.find(
                        (c: { category_id: number; name: string }) =>
                          c.category_id === specId,
                      );
                      return spec ? (
                        <span
                          key={specId}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full"
                        >
                          {spec.name}
                          <button
                            type="button"
                            onClick={() => {
                              const newSpecs = selectedCategories.filter(
                                (id) => id !== specId,
                              );
                              setSelectedCategories(newSpecs);
                              setValue("categories", newSpecs);
                            }}
                            className="hover:text-teal-600"
                            aria-label="Remove category"
                            title="Remove category"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
                {errors.categories && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.categories.message}
                  </p>
                )}
              </div>

              {/* Languages */}
              <div>
                <Label htmlFor="languages" className="required">
                  Languages <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="languages"
                  control={control}
                  render={() => (
                    <Select
                      onValueChange={(value) => {
                        const langId = parseInt(value);
                        if (!isNaN(langId)) {
                          const newLanguages = selectedLanguages.includes(
                            langId,
                          )
                            ? selectedLanguages.filter((id) => id !== langId)
                            : [...selectedLanguages, langId];
                          setSelectedLanguages(newLanguages);
                          setValue("languages", newLanguages);
                        }
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select languages" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map(
                          (lang: { language_id: number; name: string }) => (
                            <SelectItem
                              key={lang.language_id}
                              value={lang.language_id.toString()}
                              className={
                                selectedLanguages.includes(lang.language_id)
                                  ? "bg-teal-50"
                                  : ""
                              }
                            >
                              {lang.name}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {selectedLanguages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedLanguages.map((langId) => {
                      const lang = languages.find(
                        (l: { language_id: number; name: string }) =>
                          l.language_id === langId,
                      );
                      return lang ? (
                        <span
                          key={langId}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full"
                        >
                          {lang.name}
                          <button
                            type="button"
                            onClick={() => {
                              const newLanguages = selectedLanguages.filter(
                                (id) => id !== langId,
                              );
                              setSelectedLanguages(newLanguages);
                              setValue("languages", newLanguages);
                            }}
                            className="hover:text-teal-600"
                            aria-label="Remove language"
                            title="Remove language"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
                {errors.languages && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.languages.message}
                  </p>
                )}
              </div>

              {/* Service Areas */}
              <div>
                <Label htmlFor="countries" className="required">
                  Service Area (Select at least one){" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="countries"
                  control={control}
                  rules={{ required: "Service area is required" }}
                  render={() => (
                    <Select
                      onValueChange={(value) => {
                        const countryId = parseInt(value);
                        if (!isNaN(countryId)) {
                          const newServiceAreas = selectedCountries.includes(
                            countryId,
                          )
                            ? selectedCountries.filter((id) => id !== countryId)
                            : [...selectedCountries, countryId];
                          setSelectedCountries(newServiceAreas);
                          setValue("countries", newServiceAreas);
                        }
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select service areas" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(
                          (country: { id: number; name: string }) => (
                            <SelectItem
                              key={country.id}
                              value={country.id.toString()}
                              className={
                                selectedCountries.includes(country.id)
                                  ? "bg-teal-50"
                                  : ""
                              }
                            >
                              {country.name}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {selectedCountries.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCountries.map((areaId) => {
                      const area = countries.find(
                        (c: { id: number; name: string }) => c.id === areaId,
                      );
                      return area ? (
                        <span
                          key={areaId}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full"
                        >
                          {area.name}
                          <button
                            type="button"
                            onClick={() => {
                              const newAreas = selectedCountries.filter(
                                (id) => id !== areaId,
                              );
                              setSelectedCountries(newAreas);
                              setValue("countries", newAreas);
                            }}
                            className="hover:text-teal-600"
                            aria-label="Remove country"
                            title="Remove country"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
                {errors.countries && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.countries.message}
                  </p>
                )}
              </div>

              {/* Podcast Module Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="podcast" className="font-medium">
                    Podcast Module
                  </Label>
                  <p className="text-sm text-gray-500">
                    Enable if expert has a podcast
                  </p>
                </div>
                <Controller
                  name="podcast"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="podcast"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-teal-600"
                    />
                  )}
                />
              </div>
            </div>
          )}
        </form>
      </div>
    </Modal>
  );
}
