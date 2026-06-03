"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { editProject } from "@/data/api-client";
import { ProjectData } from "../types";
import type { AxiosError } from "axios";

// If you want to use EditProjectModal, uncomment its import and usage
// import { EditProjectModal } from "@/components/modals/edit-project-modal";

interface ProjectHeaderProps {
  projectId: number;
  token: string;
  data: ProjectData;
}

export function ProjectHeader({ projectId, token, data }: ProjectHeaderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isActive = data.is_active === 1 || data.is_active === "1" as any;

  const statusMutation = useMutation({
    mutationFn: (updatedData: any) => editProject(projectId, updatedData, token),
    onSuccess: () => {
      toast.success("Project activation updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projectDetails", projectId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["Projects"] });
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{
        status?: string;
        errors?: Record<string, string>[];
        message?: string;
      }>;

      const errorList = axiosError?.response?.data?.errors;
      const flatMessages = errorList
        ? Object.values(errorList)
            .map((errObj) => Object.values(errObj))
            .flat()
            .join(", ")
        : "";

      const fallbackMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Failed to update project activation.";

      toast.error(flatMessages || fallbackMessage);
    },
  });

  const handleStatusToggle = () => {
    if (!data) return;

    const newIsActive = isActive ? "0" : "1";

    const payload = {
      available_units: data.available_units,
      completion_date: data.completion_date,
      description: data.description,
      developer_id: data.developer?.developer_id,
      is_active: newIsActive,
      launch_date: data.launch_date,
      location: {
        area_id: data.location?.area?.area_name,
        city_id: data.location?.city?.name,
        east_side: data.location?.east_side,
        google_map_link: data.location?.google_map_link,
        landmark: data.location?.landmark,
        latitude: data.location?.latitude,
        longitude: data.location?.longitude,
        north_side: data.location?.north_side,
        south_side: data.location?.south_side,
        west_side: data.location?.west_side,
      },
      price_range: data.price_range,
      price_range_SQ: data.price_range_SQ,
      project_name: data.project_name,
      project_size: data.project_size,
      project_type: data.project_type,
      status: data.status,
      total_units: data.total_units,
    };

    statusMutation.mutate(payload);
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <span>Home</span>
        <ChevronRight className="h-4 w-4" />
        <span>Projects</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">Project Details</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/projects")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {data.project_name}
          </h1>
          <div className="flex items-center gap-2">
            <Switch
              checked={isActive}
              onCheckedChange={handleStatusToggle}
              disabled={statusMutation.isPending}
            />
            <span className="text-sm text-gray-600">
              {statusMutation.isPending ? "Updating..." : "Active"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* 
        Uncomment when EditProjectModal is available and imported
        <EditProjectModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          projectId={projectId}
        /> 
      */}
    </>
  );
}
