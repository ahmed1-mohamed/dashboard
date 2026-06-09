"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectSchema, CreateProjectInput } from "@/validators/create-project.schema";
import useDashboardAdminProjectsCreateData from "@/hooks/use-dashboardAdminProjectsCreateData";
import useCreateProject, { CreateProjectWithMediaParams } from "@/hooks/use-create-project";

import { LocationData, MediaItem } from "./types";
import { ProjectLocationForm } from "./components/ProjectLocationForm";
import { ProjectBasicInfoForm } from "./components/ProjectBasicInfoForm";
import { ProjectUnitsForm } from "./components/ProjectUnitsForm";
import { ProjectPricingForm } from "./components/ProjectPricingForm";
import { ProjectMediaForm } from "./components/ProjectMediaForm";

export default function CreateProjectPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const roleId = session?.user?.role_id as number | undefined;

  const [country, setCountry] = useState("");
  const [countryId, setCountryId] = useState<number>();
  const [dateValidationError, setDateValidationError] = useState<string | null>(null);

  const [locationData, setLocationData] = useState<LocationData>({
    latitude: 0, longitude: 0, landmark: "", city_id: "",
    north_side: "", south_side: "", east_side: "", west_side: "",
    google_map_link: "", area_id: "",
  });

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      project_name: "", status: undefined, total_units: undefined,
      available_units: undefined, launch_date: "", completion_date: "",
      project_size: "", description: "", currency: "", price_min: "",
      price_max: "", price_sq_min: "", price_sq_max: "", price_range: "",
      price_range_SQ: "", project_type: undefined, developer_id: "",
      latitude: 0, longitude: 0, landmark: "", city_id: "", area_id: "",
      north_side: "", south_side: "", east_side: "", west_side: "",
      google_map_link: "", location_description: "",
    },
  });

  const { watch, setValue } = form;

  // Fetch developers
  const { developersData } = useDashboardAdminProjectsCreateData(countryId);

  const developersList = Array.isArray(developersData.data)
    ? developersData.data
    : Array.isArray((developersData.data as any)?.data)
    ? (developersData.data as any).data
    : Array.isArray((developersData.data as any)?.developers)
    ? (developersData.data as any).developers
    : [];

  // Auto-set developer_id based on roleId
  useEffect(() => {
    if (roleId === 3 && developersList?.[0]?.developer_id) {
      setValue("developer_id", String(developersList[0].developer_id), { shouldValidate: true });
    }
  }, [roleId, developersList, setValue]);

  // Sync locationData to form for validation
  useEffect(() => {
    setValue("latitude", locationData.latitude);
    setValue("longitude", locationData.longitude);
    setValue("city_id", locationData.city_id);
    setValue("area_id", locationData.area_id || "");
    setValue("landmark", locationData.landmark);
    setValue("north_side", locationData.north_side);
    setValue("south_side", locationData.south_side);
    setValue("east_side", locationData.east_side);
    setValue("west_side", locationData.west_side);
    setValue("google_map_link", locationData.google_map_link);
  }, [locationData, setValue]);

  // Real-time date validation
  useEffect(() => {
    const launchDate = watch("launch_date");
    const completionDate = watch("completion_date");
    if (launchDate && completionDate) {
      if (new Date(completionDate) < new Date(launchDate)) {
        setDateValidationError("Completion date must be after launch date");
        toast.error("Completion date must be after launch date");
      } else {
        setDateValidationError(null);
      }
    } else {
      setDateValidationError(null);
    }
  }, [watch]);

  const { createProject, isCreating } = useCreateProject();

  const handleSubmitForm = async () => {
    if (!locationData.city_id) { toast.error("Please select a valid city"); return; }
    if (!locationData.google_map_link) { toast.error("Please provide a Google Maps link"); return; }

    const formValues = form.getValues();
    const price_range = `${formValues.price_min}-${formValues.price_max}`;
    const price_range_SQ = `${formValues.price_sq_min}-${formValues.price_sq_max}`;

    const formData: CreateProjectWithMediaParams = {
      ...formValues,
      price_range,
      price_range_SQ,
      location: locationData as any,
      mediaItems: mediaItems.map((item) => ({
        file: item.file, description: item.description,
        is_primary: item.is_primary, my_order: item.my_order,
        media_type: item.media_type, media_url: item.media_url,
      })),
    };

    try {
      await createProject(formData);
      router.push("/admin/projects");
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button onClick={() => router.push("/admin/projects")} className="text-gray-600 hover:text-gray-900">←</button>
              <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
            </div>
            <p className="text-sm text-gray-500">Home &gt; Projects &gt; Create Project</p>
          </div>
          <Button 
            className="bg-teal-600 hover:bg-teal-700 text-white" 
            onClick={form.handleSubmit(handleSubmitForm, (errors) => {
              console.log("Validation errors:", errors);
              toast.error("Please fill in all required fields correctly.");
            })} 
            disabled={isCreating || !!dateValidationError}
          >
            {isCreating ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
          <ProjectLocationForm
            form={form}
            locationData={locationData}
            setLocationData={setLocationData}
            country={country}
            setCountry={setCountry}
            setCountryId={setCountryId}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProjectBasicInfoForm
              form={form}
              developersData={developersList}
              country={country}
              setCountry={setCountry}
            />
            <ProjectUnitsForm form={form} dateValidationError={dateValidationError} />
          </div>

          <ProjectPricingForm form={form} />
          
          <ProjectMediaForm mediaItems={mediaItems} setMediaItems={setMediaItems} />

          {form.formState.errors.root && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{form.formState.errors.root.message}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
