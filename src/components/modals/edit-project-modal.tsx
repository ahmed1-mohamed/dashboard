"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { toast } from "sonner";
import { AdminProjectsService } from "@/features/projects/services/AdminProjectsService";
import useDashboardAdminProjectsCreateData from "@/hooks/use-dashboardAdminProjectsCreateData";

interface EditProjectFormValues {
  project_name: string;
  status: string;
  project_type: string;
  total_units: string;
  available_units: string;
  launch_date: string;
  completion_date: string;
  currency: string;
  project_size: string;
  description: string;
  developer_id: string;
}

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number | undefined;
}

const statusOptions = [
  { label: "Under Construction / Ongoing", value: "ongoing" },
  { label: "Completed", value: "completed" },
  { label: "Upcoming / Planned", value: "upcoming" },
];

const projectTypeOptions = [
  { label: "Residential", value: "residential" },
  { label: "Mixed Use", value: "mixed-use" },
  { label: "Commercial", value: "commercial" },
];

const currencyOptions = [
  { label: "AED", value: "AED" },
  { label: "USD", value: "USD" },
  { label: "EGP", value: "EGP" },
  { label: "OMR", value: "OMR" },
];

export function EditProjectModal({
  isOpen,
  onClose,
  projectId,
}: EditProjectModalProps) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<EditProjectFormValues>({
    defaultValues: {
      project_name: "",
      status: "",
      project_type: "",
      total_units: "",
      available_units: "",
      launch_date: "",
      completion_date: "",
      currency: "AED",
      project_size: "",
      description: "",
      developer_id: "",
    },
  });

  // Fetch project details
  const { data: projectData, isLoading: projectLoading } = useQuery({
    queryKey: ["project-detail-edit", projectId],
    queryFn: () => AdminProjectsService.getProject(projectId!),
    enabled: !!token && projectId != null && isOpen,
  });

  // Fetch developers
  const { developersData } = useDashboardAdminProjectsCreateData();
  const developersList = Array.isArray(developersData?.data)
    ? developersData.data
    : Array.isArray((developersData?.data as any)?.data)
      ? (developersData.data as any).data
      : Array.isArray((developersData?.data as any)?.developers)
        ? (developersData.data as any).developers
        : [];

  // Populate form when data arrives
  useEffect(() => {
    if (!projectData) return;
    const raw = (projectData as { data?: unknown }).data ?? projectData;
    const p = raw as Record<string, unknown>;
    let mappedProjectType = (p.project_type as string) ?? "";
    const lowerType = mappedProjectType.toLowerCase();
    if (lowerType === "mixed use" || lowerType === "mixed-use") mappedProjectType = "mixed-use";
    else if (lowerType === "residential") mappedProjectType = "residential";
    else if (lowerType === "commercial") mappedProjectType = "commercial";

    reset({
      project_name: (p.project_name as string) ?? "",
      status: (p.status as string) ?? "",
      project_type: mappedProjectType,
      total_units: p.total_units != null ? String(p.total_units) : "",
      available_units: p.available_units != null ? String(p.available_units) : "",
      launch_date: (p.launch_date as string) ?? "",
      completion_date: (p.completion_date as string) ?? "",
      currency: (p.currency as string) ?? "AED",
      project_size: (p.project_size as string) ?? "",
      description: p.description ? String(p.description).replace(/<[^>]*>?/gm, '') : "",
      developer_id: String((p.developer as any)?.developer_id || p.developer_id || ""),
    });
  }, [projectData, reset]);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const onSubmit = async (formValues: EditProjectFormValues) => {
    if (!projectId) return;
    setIsSubmitting(true);
    try {
      const raw = (projectData as { data?: any }).data ?? projectData;
      const cityId = String(raw?.location?.city?.id || (raw?.location as any)?.city_id || "");
      const areaId = String(raw?.location?.area?.area_id || (raw?.location as any)?.area_id || "");
      const finalDeveloperId = formValues.developer_id || String(raw?.developer?.developer_id || raw?.developer_id || "");

      const payload: Record<string, unknown> = {
        project_name: formValues.project_name,
        status: formValues.status,
        project_type: formValues.project_type,
        developer_id: String(finalDeveloperId),
        currency: formValues.currency || "AED",
        is_active: raw?.is_active ?? "1",
        is_visible: raw?.is_visible ?? "1",
      };

      if (formValues.total_units != null && formValues.total_units !== "") payload.total_units = String(formValues.total_units);
      if (formValues.available_units != null && formValues.available_units !== "") payload.available_units = String(formValues.available_units);
      if (formValues.launch_date) payload.launch_date = formValues.launch_date;
      if (formValues.completion_date) payload.completion_date = formValues.completion_date;
      if (formValues.project_size) payload.project_size = String(formValues.project_size);
      if (formValues.description) payload.description = formValues.description;
      if (raw?.price_range) payload.price_range = String(raw.price_range);
      if (raw?.price_range_SQ) payload.price_range_SQ = String(raw.price_range_SQ);

      payload.location = {
        latitude: raw?.location?.latitude ?? 0,
        longitude: raw?.location?.longitude ?? 0,
        landmark: raw?.location?.landmark || "",
        city_id: cityId || "1",
        area_id: areaId || "1",
        north_side: raw?.location?.north_side || "",
        south_side: raw?.location?.south_side || "",
        east_side: raw?.location?.east_side || "",
        west_side: raw?.location?.west_side || "",
        google_map_link: raw?.location?.google_map_link || "",
      };

      await AdminProjectsService.updateProject(projectId, payload);
      toast.success("Project updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project-detail-edit", projectId] });
      handleClose();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message ?? err.message ?? "Failed to update project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Project"
      size="xl"
      showCloseButton={false}
      footer={
        <div className="flex gap-3 justify-end w-full">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || projectLoading}
          >
            {isSubmitting ? "Updating..." : "Update Project"}
          </Button>
        </div>
      }
    >
      {projectLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent" />
        </div>
      ) : (
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Basic Info */}
            <h3 className="text-sm font-semibold text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ep-project-name">
                  Project Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ep-project-name"
                  {...register("project_name", { required: "Project name is required" })}
                  placeholder="e.g. Emaar Downtown"
                  className="mt-1"
                />
                {errors.project_name && (
                  <p className="text-xs text-red-500 mt-1">{errors.project_name.message}</p>
                )}
              </div>

              <div>
                <Label>Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <Label>Developer</Label>
                <Controller
                  name="developer_id"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select Developer" />
                      </SelectTrigger>
                      <SelectContent>
                        {developersList?.map((developer: any) => {
                          const id = String(developer.developer_id || developer.id);
                          const name = developer.developer_name || developer.name;
                          return (
                            <SelectItem key={id} value={id}>
                              {name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <Label>Project Type</Label>
                <Controller
                  name="project_type"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectTypeOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <Label>Currency</Label>
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencyOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Units */}
            <h3 className="text-sm font-semibold text-gray-900 mt-2">Units</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="ep-total-units">Total Units</Label>
                <Input id="ep-total-units" type="number" {...register("total_units")} placeholder="Total units" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="ep-available-units">Available Units</Label>
                <Input id="ep-available-units" type="number" {...register("available_units")} placeholder="Available units" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="ep-project-size">Project Size</Label>
                <Input id="ep-project-size" {...register("project_size")} placeholder="e.g. 50,000 sqm" className="mt-1" />
              </div>
            </div>

            {/* Dates */}
            <h3 className="text-sm font-semibold text-gray-900 mt-2">Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ep-launch-date">Launch Date</Label>
                <Input id="ep-launch-date" type="date" {...register("launch_date")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="ep-completion-date">Completion Date</Label>
                <Input id="ep-completion-date" type="date" {...register("completion_date")} className="mt-1" />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="ep-proj-desc">Description</Label>
              <Input id="ep-proj-desc" {...register("description")} placeholder="Project description" className="mt-1" />
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
}
