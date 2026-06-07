"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdActions } from "@/hooks/use-ad-actions";
import { useAdEditData } from "@/hooks/use-ad-edit";
import { toast } from "sonner";
import { AdData } from "@/types";

// Import the modular cards
import { AdBasicInfoCard } from "@/features/ads/components/form/AdBasicInfoCard";
import { AdPlacementCard } from "@/features/ads/components/form/AdPlacementCard";
import { AdTargetLinksCard } from "@/features/ads/components/form/AdTargetLinksCard";
import { AdCreativeContentCard } from "@/features/ads/components/form/AdCreativeContentCard";

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

export default function EditAdPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const isOpen = true;
  const onClose = () => router.push("/admin/ads");
  const onSuccess = () => {
    toast.success("Ad updated successfully!");
    router.push("/admin/ads");
  };

  const [adImage, setAdImage] = useState<File | null>(null);
  const [adImagePreview, setAdImagePreview] = useState<string>("");

  const methods = useForm<EditAdFormData>({
    defaultValues: {
      title: "",
      type: "banner",
      platform: "web",
      location: [] as string[],
      country: "Egypt",
      startDate: "",
      endDate: "",
      status: "draft",
      priority: 1,
      billing_unit: "impression",
      linkTo: "PROJECTS",
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
    },
  });

  const { handleSubmit, watch, setValue } = methods;

  const {
    loadingAd,
    adData,
    developers,
    developerSearch,
    setDeveloperSearch,
    developersLoading,
    projects,
    properties,
    projectsLoading,
    propertiesLoading,
    projectSearch,
    setProjectSearch,
    propertySearch,
    setPropertySearch,
  } = useAdEditData(
    id,
    isOpen,
    watch("country"),
    watch("developerId"),
    watch("linkTo")
  );

  const [dateErrors, setDateErrors] = useState<{
    startDate?: string;
    endDate?: string;
    general?: string;
  }>({});

  const isValidDateFormat = (dateStr: string): boolean => {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  };

  const convertToUTCDateTime = (dateStr: string, isEndDate = false): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isEndDate) {
      date.setUTCHours(23, 59, 59, 999);
    } else {
      date.setUTCHours(0, 0, 0, 0);
    }
    return date.toISOString();
  };

  const validateDateTimeRange = useCallback(
    (startDate: string, endDate: string): boolean => {
      if (startDate && !isValidDateFormat(startDate)) {
        setDateErrors({ startDate: "Invalid format" });
        return false;
      }
      if (endDate && !isValidDateFormat(endDate)) {
        setDateErrors({ endDate: "Invalid format" });
        return false;
      }
      if (!startDate) {
        setDateErrors({ startDate: "Required" });
        return false;
      }

      if (!endDate) return true;

      const start = new Date(convertToUTCDateTime(startDate));
      const end = new Date(convertToUTCDateTime(endDate, true));

      if (start >= end) {
        setDateErrors({ endDate: "End must be after start" });
        return false;
      }

      setDateErrors({});
      return true;
    },
    []
  );

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  useEffect(() => {
    if (startDate || endDate) {
      validateDateTimeRange(startDate, endDate);
    }
  }, [startDate, endDate, validateDateTimeRange]);

  // Load ad data into form when available
  useEffect(() => {
    if (adData) {
      setValue("title", adData.title || "");
      setValue("type", adData.placement?.format || "banner");
      setValue("platform", adData.placement?.platform || "web");
      setValue(
        "location",
        adData.placement?.location ? [adData.placement.location] : []
      );

      const countryMap: Record<number, string> = {
        1: "Egypt",
        2: "UAE",
        3: "Oman",
      };
      setValue("country", countryMap[adData.country_id] || "Egypt");

      const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return "";
        if (dateStr.includes("T")) {
          return dateStr.split("T")[0];
        }
        return dateStr.split(" ")[0];
      };

      setValue("startDate", formatDate(adData.campaign?.start_at));
      setValue("endDate", formatDate(adData.campaign?.end_at));
      setValue("status", adData.status || "draft");
      setValue("priority", adData.weight || 1);
      setValue("billing_unit", adData.placement?.billing_unit || "impression");
      setValue("linkTo", adData.entity_type || "PROJECTS");
      setValue("projectId", adData.entity_id?.toString() || "");
      setValue("description", adData.subtitle || "");
      setValue("ctaButtonText", adData.cta_label || "");
      setValue("ctaUrl", adData.cta_url || "");
      setValue("width", adData.placement?.width || "medium");
      setValue("position", adData.placement?.position || "bottom_right");

      if (adData.campaign?.developer?.developer_id) {
        setValue(
          "developerId",
          adData.campaign.developer.developer_id.toString()
        );
      }

      if (adData.image_url) setAdImagePreview(adData.image_url);
    }
  }, [adData, setValue]);

  const { updateAd, isUpdating } = useAdActions();

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

  const onSubmit = async (data: EditAdFormData) => {
    if (!validateDateTimeRange(watch("startDate"), watch("endDate"))) return;

    const formData = new FormData();

    formData.append(
      "campaign[start_at]",
      data.startDate.includes(":") ? data.startDate : data.startDate + " 00:00:00"
    );
    if (data.endDate) {
      formData.append(
        "campaign[end_at]",
        data.endDate.includes(":") ? data.endDate : data.endDate + " 23:59:59"
      );
    }
    formData.append("campaign[status]", data.status);

    if (data.developerId) {
      const devId = parseInt(data.developerId);
      if (!isNaN(devId)) {
        formData.append("campaign[developer_id]", devId.toString());
      }
    }

    formData.append(
      "placement[platform]",
      data.platform.toLowerCase().replace(" only", "")
    );
    
    // Ensure location is an array and safely get the first item
    const locArray = Array.isArray(data.location) ? data.location : [data.location];
    formData.append(
      "placement[location]",
      locArray[0]?.toLowerCase().replace(/\s+/g, "_") || "home"
    );
    
    formData.append("placement[format]", data.type.toLowerCase());
    formData.append("placement[billing_unit]", data.billing_unit);

    if (data.type === "pop_up") {
      formData.append("placement[width]", data.width || "medium");
      formData.append("placement[position]", data.position || "bottom_right");
    }

    const countryId =
      data.country === "Egypt"
        ? 1
        : data.country === "UAE"
        ? 2
        : data.country === "Oman"
        ? 3
        : 1;
    formData.append("country_id", countryId.toString());

    if (data.linkTo !== "NONE") {
      formData.append("entity_type", data.linkTo);

      if (data.linkTo === "PROJECTS" && data.projectId) {
        formData.append("entity_id", data.projectId);
      } else if (data.linkTo === "PROPERTIES" && data.projectId) {
        formData.append("entity_id", data.projectId);
      }
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

    if (adImage) {
      formData.append("image_url", adImage);
    }

    try {
      await updateAd({ adId: Number(id), formData });

      toast.success("Advertisement updated successfully!");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error updating ad:", error);
    }
  };

  if (loadingAd) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="flex items-center gap-3">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-64 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between sticky top-0 bg-gray-50/90 backdrop-blur-sm py-4 z-10 -mt-4 border-b border-gray-100">
          <Button variant="outline" onClick={() => router.back()} type="button">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Ads
          </Button>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 hidden sm:block">
              Edit Advertisement
            </h2>
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
              onClick={handleSubmit(onSubmit)}
              disabled={isUpdating}
            >
              {isUpdating && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent" />
              )}
              {isUpdating ? "Updating..." : "Update Ad"}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <AdBasicInfoCard
            dateErrors={dateErrors}
            validateDateTimeRange={validateDateTimeRange}
          />

          <AdPlacementCard />

          <AdTargetLinksCard
            developersLoading={developersLoading}
            projectsLoading={projectsLoading}
            propertiesLoading={propertiesLoading}
            developers={developers}
            projects={projects}
            properties={properties}
            developerSearch={developerSearch}
            setDeveloperSearch={setDeveloperSearch}
            projectSearch={projectSearch}
            setProjectSearch={setProjectSearch}
            propertySearch={propertySearch}
            setPropertySearch={setPropertySearch}
          />

          <AdCreativeContentCard
            adImagePreview={adImagePreview}
            handleImageUpload={handleImageUpload}
          />
        </div>
      </div>
    </FormProvider>
  );
}