"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { AdminProjectsService } from "@/features/projects/services/AdminProjectsService";
import { ProjectData } from "../types";
import type { AxiosError } from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useDashboardAdminProjectsCreateData from "@/hooks/use-dashboardAdminProjectsCreateData";
import { EditProjectModal } from "@/components/modals/edit-project-modal";

interface ProjectHeaderProps {
  projectId: number;
  token: string;
  data: ProjectData;
}

export function ProjectHeader({ projectId, token, data }: ProjectHeaderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const initialDeveloperId = String(data.developer?.developer_id || (data as any).developer_id || "");
  const [selectedDeveloperId, setSelectedDeveloperId] = useState<string>(initialDeveloperId);

  const isActive = data.is_active === 1 || data.is_active === "1" as any;

  const { developersData } = useDashboardAdminProjectsCreateData();
  const developersList = Array.isArray(developersData?.data)
    ? developersData.data
    : Array.isArray((developersData?.data as any)?.data)
    ? (developersData.data as any).data
    : Array.isArray((developersData?.data as any)?.developers)
    ? (developersData.data as any).developers
    : [];

  const statusMutation = useMutation({
    mutationFn: (newIsActive: boolean) => {
      return AdminProjectsService.toggleActive(projectId, newIsActive);
    },
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
    if (!selectedDeveloperId) {
      toast.error("Please select a developer before updating the project status.");
      return;
    }
    statusMutation.mutate(!isActive);
  };

  return (
    <>
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm font-medium text-slate-500 mb-6 space-x-2">
        <button
          onClick={() => router.push("/admin/projects")}
          className="hover:text-teal-600 transition-colors"
        >
          Projects
        </button>
        <ChevronRight className="h-4 w-4 text-slate-400" />
        <span className="text-slate-800">{data.project_name || "Details"}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {data.project_name || "Project Details"}
          </h1>
        </div>

        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
          {/* Developer Selection */}
          <div className="flex items-center gap-2 pr-4 border-r border-slate-200 min-w-[150px]">
            <Select 
              value={selectedDeveloperId} 
              onValueChange={setSelectedDeveloperId}
            >
              <SelectTrigger className="h-8 border-none shadow-none focus:ring-0">
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
          </div>

          <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
            <span className={`text-sm font-semibold ${isActive ? "text-teal-600" : "text-slate-500"}`}>
              {isActive ? "Active" : "Inactive"}
            </span>
            <Switch
              checked={isActive}
              onCheckedChange={handleStatusToggle}
              className="data-[state=checked]:bg-teal-600"
            />
          </div>

          <Button
            onClick={() => setIsEditModalOpen(true)}
            variant="ghost"
            className="flex items-center gap-2 text-slate-700 hover:text-teal-700 hover:bg-teal-50 transition-colors rounded-full px-4"
          >
            <Edit className="h-4 w-4" />
            Edit Project
          </Button>
        </div>
      </div>

      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        projectId={projectId}
      />
    </>
  );
}
