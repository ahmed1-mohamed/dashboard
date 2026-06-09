"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
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
import { useCreateAdData } from "@/hooks/use-create-ad";
import { toast } from "sonner";
import { CreateAdStepOne } from "./create-ad-components/CreateAdStepOne";
import { CreateAdStepTwo } from "./create-ad-components/CreateAdStepTwo";

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
  const { createAd, isCreating } = useAdActions();
  const [step, setStep] = useState(1);
  const [adImage, setAdImage] = useState<File | null>(null);
  const [adImagePreview, setAdImagePreview] = useState<string>("");
  const [developerSearch, setDeveloperSearch] = useState("");
  const [developerPerPage, setDeveloperPerPage] = useState(15);
  const developerScrollRef = useRef<HTMLDivElement | null>(null);
  const projectScrollRef = useRef<HTMLDivElement | null>(null);
  const propertyScrollRef = useRef<HTMLDivElement | null>(null);
  const [debouncedDeveloperSearch, setDebouncedDeveloperSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDeveloperSearch(developerSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [developerSearch]);
  const [projectSearch, setProjectSearch] = useState("");
  const [propertySearch, setPropertySearch] = useState("");
  const [debouncedProjectSearch, setDebouncedProjectSearch] = useState("");
  const [debouncedPropertySearch, setDebouncedPropertySearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProjectSearch(projectSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [projectSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPropertySearch(propertySearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [propertySearch]);

  const { data: session } = useSession();

  const getCountryId = (countryName: string): string => {
    const countryMap: Record<string, string> = {
      Egypt: "1",
      UAE: "2",
      Oman: "3",
    };
    return countryMap[countryName] || "1";
  };

  const methods = useForm({
    defaultValues: {
      title: "",
      type: "Banner",
      platform: "Web Only",
      location: [] as string[],
      country: "",
      startDate: "",
      endDate: "",
      status: "Draft",
      priority: 1,
      billing_unit: "impression",
      linkTo: "PROJECTS", // Changed from "Project" to "PROJECTS"
      projectId: "",
      description: "",
      handover: false,
      developer: false,
      price: false,
      rate: false,
      ctaButtonText: "",
      ctaUrl: "",
      width: "medium",
      position: "bottom_right",
      developerId: "",
      image_url: "",
    },
  });

  const { register, handleSubmit, setValue, watch, trigger } = methods;

  const {
    developers,
    projects,
    properties,
    loading: developersLoading,
    projectsLoading,
    propertiesLoading,
    developerHasMore,
    setDeveloperPage,
    loadDevelopers,
  } = useCreateAdData(
    isOpen,
    debouncedDeveloperSearch,
    getCountryId(watch("country")),
    debouncedProjectSearch,
    debouncedPropertySearch,
    watch("developerId"),
  );

  // Date validation state
  const [dateErrors, setDateErrors] = useState<{
    startDate?: string;
    endDate?: string;
    general?: string;
  }>({});

  // Validate date format is YYYY-MM-DD
  const isValidDateFormat = (dateStr: string): boolean => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    return datePattern.test(dateStr);
  };

  // Convert date string to ISO 8601 DateTime format in UTC
  const convertToUTCDateTime = (
    dateStr: string,
    isEndDate: boolean = false,
  ): string => {
    if (!dateStr) return "";
    // Parse the date string (YYYY-MM-DD format)
    const date = new Date(dateStr);
    // Set time to end of day for end date, start of day for start date
    if (isEndDate) {
      date.setUTCHours(23, 59, 59, 999);
    } else {
      date.setUTCHours(0, 0, 0, 0);
    }
    // Return ISO 8601 format in UTC
    return date.toISOString();
  };

  // Validate that end DateTime is after start DateTime
  const validateDateTimeRange = useCallback(
    (startDate: string, endDate: string): boolean => {
      // Validate start date format
      if (startDate && !isValidDateFormat(startDate)) {
        setDateErrors((prev) => ({
          ...prev,
          startDate: "Date must be in YYYY-MM-DD format",
          general: undefined,
        }));
        return false;
      }

      // Validate end date format if provided
      if (endDate && !isValidDateFormat(endDate)) {
        setDateErrors((prev) => ({
          ...prev,
          endDate: "Date must be in YYYY-MM-DD format",
          general: undefined,
        }));
        return false;
      }

      if (!startDate) {
        setDateErrors((prev) => ({
          ...prev,
          startDate: "Start date is required",
          general: undefined,
        }));
        return false;
      }

      // Clear start date error if present
      setDateErrors((prev) => ({
        ...prev,
        startDate: undefined,
      }));

      // If no end date, clear all errors
      if (!endDate) {
        setDateErrors((prev) => ({
          ...prev,
          endDate: undefined,
          general: undefined,
        }));
        return true;
      }

      // Convert to UTC DateTime for comparison
      const startDateTime = new Date(convertToUTCDateTime(startDate, false));
      const endDateTime = new Date(convertToUTCDateTime(endDate, true));

      if (startDateTime >= endDateTime) {
        setDateErrors((prev) => ({
          ...prev,
          endDate: "End DateTime must be after start DateTime",
          general: "Please select an end date that is after the start date",
        }));
        return false;
      }

      // Valid date range
      setDateErrors((prev) => ({
        ...prev,
        endDate: undefined,
        general: undefined,
      }));
      return true;
    },
    [],
  );

  // Real-time validation when dates change
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  useEffect(() => {
    if (startDate || endDate) {
      validateDateTimeRange(startDate, endDate);
    }
  }, [startDate, endDate, validateDateTimeRange]);

  // Clear date errors when modal closes
  useEffect(() => {
    if (!isOpen) {
      setDateErrors({});
    }
  }, [isOpen]);

  const selectedLocations = (watch("location") || []) as string[];

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          developerHasMore &&
          !developersLoading
        ) {
          const newPerPage = developerPerPage + 15;
          setDeveloperPerPage(newPerPage);
          loadDevelopers(1, newPerPage, "", true);
        }
      },
      { threshold: 0.1 },
    );

    if (developerScrollRef.current) {
      observer.observe(developerScrollRef.current);
    }

    return () => observer.disconnect();
  }, [developerHasMore, developersLoading, developerPerPage, loadDevelopers]);

  // Clear search when linkTo changes
  useEffect(() => {
    setProjectSearch("");
    setPropertySearch("");
    setDebouncedProjectSearch("");
    setDebouncedPropertySearch("");
  }, [watch("linkTo")]);

  // Handle developer selection
  const handleDeveloperChange = (val: string) => {
    setValue("developerId", val);
    setValue("projectId", ""); // Reset project/property selection
  };

  const toggleLocation = (location: string) => {
    const current = Array.isArray(selectedLocations) ? selectedLocations : [];
    const updated = current.includes(location)
      ? current.filter((l) => l !== location)
      : [...current, location];
    setValue("location", updated);
  };

  const handleNext = async () => {
    // Validate date range first
    if (!validateDateTimeRange(watch("startDate"), watch("endDate"))) {
      return;
    }

    // Validate first step fields
    const isValid = await trigger([
      "title",
      "type",
      "platform",
      "location",
      "country",
      "startDate",
      "status",
      "priority",
      "billing_unit",
    ]);
    if (isValid) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAdImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (!session?.user?.accessToken) {
        toast.error("Authentication required");
        return;
      }

      // Final date validation before submission
      if (!validateDateTimeRange(data.startDate, data.endDate)) {
        toast.error("Please fix the date errors before submitting");
        return;
      }

      // Validate CTA Link - required if CTA Button Text is filled AND linkTo is NONE
      if (data.linkTo === "NONE" && data.ctaButtonText && !data.ctaUrl) {
        toast.error(
          "Call-to-Action Link is required when CTA Button Text is provided and Link To is None",
        );
        return;
      }

      // Validate CTA Link format - must be a valid URL if provided
      if (data.ctaUrl) {
        try {
          new URL(data.ctaUrl);
        } catch {
          toast.error("Please enter a valid URL for Call-to-Action Link");
          return;
        }
      }

      // Create FormData object for multipart/form-data submission
      const formData = new FormData();

      // Append campaign fields (send as date string, not datetime)
      formData.append("campaign[start_at]", data.startDate.includes(':') ? data.startDate : data.startDate + " 00:00:00");
      if (data.endDate) {
        formData.append("campaign[end_at]", data.endDate.includes(':') ? data.endDate : data.endDate + " 23:59:59");
      }
      formData.append("campaign[daily_cap_credits]", "");
      formData.append("campaign[status]", data.status);

      // Append placement fields
      formData.append(
        "placement[platform]",
        data.platform.toLowerCase().replace(" only", ""),
      );
      formData.append(
        "placement[location]",
        data.location[0]?.toLowerCase().replace(/\s+/g, "_") || "home",
      );
      formData.append("placement[format]", data.type.toLowerCase());
      formData.append("placement[billing_unit]", data.billing_unit);

      // Append width and position for pop-up ads
      if (data.type === "pop_up") {
        formData.append("placement[width]", data.width || "medium");
        formData.append("placement[position]", data.position || "bottom_right");
      }

      // Append other fields
      const countryId =
        data.country === "Egypt"
          ? 1
          : data.country === "UAE"
            ? 2
            : data.country === "Oman"
              ? 3
              : 1;
      formData.append("country_id", countryId.toString());

      // Handle entity_type and entity_id based on linkTo
      if (data.linkTo !== "NONE") {
        formData.append("entity_type", data.linkTo);

        if (data.linkTo === "PROJECTS" && data.projectId) {
          const id = parseInt(data.projectId);
          if (!isNaN(id)) formData.append("entity_id", id.toString());
        } else if (data.linkTo === "PROPERTIES" && data.projectId) {
          const id = parseInt(data.projectId);
          if (!isNaN(id)) formData.append("entity_id", id.toString());
        }
        // If PROJECTS/PROPERTIES but no project/property selected, don't send entity_id
      }
      // If linkTo is NONE, don't send entity_type or entity_id

      // Append developer_id in campaign
      if (data.developerId) {
        const devId = parseInt(data.developerId);
        if (!isNaN(devId)) formData.append("campaign[developer_id]", devId.toString());
      }

      formData.append("title", data.title);
      formData.append("subtitle", data.description || "");
      if (data.ctaButtonText) {
        formData.append("cta_label", data.ctaButtonText);
      }
      if (data.ctaUrl) {
        formData.append("cta_url", data.ctaUrl);
      }
      formData.append("weight", data.priority.toString());

      // Append image file if present
      if (adImage) {
        formData.append("image_url", adImage);
      }

      console.log("Sending FormData:", formData);
      await createAd(formData);

      toast.success("Advertisement created successfully!");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Error creating ad:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Advertisement"
      size="lg"
      showCloseButton={true}
      footer={
        <div className="flex gap-3 justify-end w-full">
          {step === 2 && (
            <Button variant="outline" onClick={handleBack} className="gap-2">
              Back
            </Button>
          )}
          {step === 1 ? (
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={handleNext}
            >
              Next
            </Button>
          ) : (
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
              onClick={handleSubmit(onSubmit)}
              disabled={isCreating}
            >
              {isCreating && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent" />
              )}
              {isCreating ? "Creating..." : "Create Ad"}
            </Button>
          )}
        </div>
      }
    >
      <FormProvider {...methods}>
        <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2">
          {step === 1 ? (
            <CreateAdStepOne
              dateErrors={dateErrors}
              validateDateTimeRange={validateDateTimeRange}
            />
          ) : (
            <CreateAdStepTwo
              developerSearch={developerSearch}
              setDeveloperSearch={setDeveloperSearch}
              developersLoading={developersLoading}
              developers={developers}
              developerHasMore={developerHasMore}
              developerScrollRef={developerScrollRef}
              handleDeveloperChange={handleDeveloperChange}
              projectSearch={projectSearch}
              setProjectSearch={setProjectSearch}
              projectsLoading={projectsLoading}
              projects={projects}
              propertySearch={propertySearch}
              setPropertySearch={setPropertySearch}
              propertiesLoading={propertiesLoading}
              properties={properties}
              adImagePreview={adImagePreview}
              handleImageUpload={handleImageUpload}
            />
          )}
        </div>
      </FormProvider>
    </Modal>
  );
}
