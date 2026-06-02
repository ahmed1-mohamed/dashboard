"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download, Settings2, AlertCircle, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { useServerPagination } from "@/hooks/useServerPagination";
import useProjects from "@/features/projects/hooks/useProjects";
import { ProjectsTable } from "@/features/projects/components/ProjectsTable";
import { ProjectsFilters } from "@/features/projects/components/ProjectsFilters";
import { Project } from "@/features/projects/types";
import { EditProjectModal } from "@/components/modals/edit-project-modal";

export default function ProjectsPage() {
  const router = useRouter();

  const {
    page,
    perPage,
    searchQuery,
    debouncedSearch,
    filters,
    setPage,
    setPerPage,
    setSearchQuery,
    setFilter,
  } = useServerPagination({
    initialPage: 1,
    initialPerPage: 10,
    initialFilters: {
      status: "all",
      projectType: "all",
    },
  });

  const {
    paginatedProjectsData,
    deleteProjectMutation,
    toggleVisibilityMutation,
  } = useProjects(
    page,
    perPage,
    debouncedSearch || undefined,
    filters.status !== "all" ? filters.status : undefined,
    filters.projectType !== "all" ? filters.projectType : undefined,
  );

  const { data: rawData, isLoading, isError, error, refetch } = paginatedProjectsData;

  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<number | undefined>(undefined);

  const itemsArray: unknown[] = useMemo(() => {
    if (Array.isArray(rawData)) return rawData;
    if (rawData && Array.isArray((rawData as { data: unknown[] }).data)) {
      return (rawData as { data: unknown[] }).data;
    }
    if (
      rawData &&
      (rawData as { data: { data: unknown[] } }).data &&
      Array.isArray((rawData as { data: { data: unknown[] } }).data.data)
    ) {
      return (rawData as { data: { data: unknown[] } }).data.data;
    }
    return [];
  }, [rawData]);

  const totalProjects: number = useMemo(() => {
    if (Array.isArray(rawData)) return rawData.length;
    if (rawData && (rawData as { total: number }).total !== undefined) {
      return (rawData as { total: number }).total;
    }
    if (
      rawData &&
      (rawData as { data: { total: number } }).data?.total !== undefined
    ) {
      return (rawData as { data: { total: number } }).data.total;
    }
    return itemsArray.length;
  }, [rawData, itemsArray]);

  const projects: Project[] = useMemo(() => {
    return itemsArray.map((prop: unknown) => {
      const p = prop as Record<string, unknown>;
      return {
        id: p.project_id as number,
        name: (p.project_name as string) || "N/A",
        developer_name: (p.developer_name as string) || "N/A",
        total_units: Number(p.total_units) || 0,
        available_units: Number(p.available_units) || 0,
        launch_date: (p.launch_date as string) || "N/A",
        completion_date: (p.completion_date as string) || "N/A",
        price_range: (p.price_range as string) || "N/A",
        slug: (p.slug as string) || "",
        project_size: (p.project_size as string) || "N/A",
        area_name: (p.area_name as string) || "N/A",
        city_name: (p.city_name as string) || "N/A",
        country_name: (p.country_name as string) || "N/A",
        whatsapp: (p.whatsapp_no as string) || "N/A",
        currency: (p.currency as string) || "AED",
        latitude: Number(p.latitude) || 0,
        longitude: Number(p.longitude) || 0,
        media_urls: (p.media_urls as string) || "",
        rating: Number(p.rating) || 0,
        rating_count: Number(p.rating_count) || 0,
        badge: (p.badge as { color: string; name: string }) || null,
        offer: p.offer ?? null,
        is_favourite: Boolean(p.is_favourite),
        price_after_discount: (p.price_after_discount as string) || "N/A",
        status: (p.status as string) || "Upcoming",
        projectType: (p.project_type as string) || "N/A",
        is_visible: Boolean(p.is_visible),
      };
    });
  }, [itemsArray]);

  const totalPages = Math.max(1, Math.ceil(totalProjects / perPage));

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedProjects(checked ? projects.map((p) => p.id) : []);
    },
    [projects],
  );

  const handleSelectProject = useCallback((id: number, checked: boolean) => {
    setSelectedProjects((prev) =>
      checked ? [...prev, id] : prev.filter((pid) => pid !== id),
    );
  }, []);

  const handleVisibilityToggle = useCallback(
    (id: number, isVisible: boolean) => {
      toggleVisibilityMutation.mutate(
        { id, isVisible },
        {
          onSuccess: () => {
            toast.success("Project visibility updated successfully");
          },
          onError: (err) => {
            toast.error(
              err instanceof Error ? err.message : "Failed to update visibility",
            );
          },
        },
      );
    },
    [toggleVisibilityMutation],
  );

  const handleDeleteClick = useCallback((id: number) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleEditClick = useCallback((id: number) => {
    setProjectToEdit(id);
    setEditModalOpen(true);
  }, []);

  const handleExport = useCallback(() => {
    if (projects.length === 0) {
      toast.info("No projects to export");
      return;
    }
    const headers = ["ID","Name","Developer","Status","Type","Total Units","Available","Launch Date","Completion Date"];
    const rows = projects.map((p) => [
      p.id, `"${p.name}"`, `"${p.developer_name}"`,
      p.status, p.projectType, p.total_units,
      p.available_units, p.launch_date, p.completion_date,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `projects_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Projects exported!");
  }, [projects]);

  const handleConfirmDelete = useCallback(() => {
    if (!projectToDelete) return;
    deleteProjectMutation.mutate(projectToDelete, {
      onSuccess: () => {
        toast.success("Project deleted successfully!");
        setDeleteDialogOpen(false);
        setProjectToDelete(null);
        setSelectedProjects((prev) =>
          prev.filter((id) => id !== projectToDelete),
        );
      },
      onError: () => toast.error("Failed to delete project"),
    });
  }, [projectToDelete, deleteProjectMutation]);

  return (
    <div className="p-4 px-3 space-y-4 max-w-full overflow-hidden">
      <PageHeader
        title="Projects"
        totalItems={totalProjects}
        actionButtonText="Add New Project"
        onActionClick={() => router.push("/admin/projects/create")}
      />

      {isLoading ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-10 w-[120px]" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[60px]" />
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-4 w-[70px]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-800">
              <strong>Error:</strong>{" "}
              {error instanceof Error
                ? error.message
                : "Failed to load projects"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="mt-2 border-red-200 text-red-700 hover:bg-red-100"
          >
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <ProjectsFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={filters.status}
              onStatusChange={(val) => setFilter("status", val)}
              projectTypeFilter={filters.projectType}
              onProjectTypeChange={(val) => setFilter("projectType", val)}
            />
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2 border-gray-200" onClick={handleExport}>
                <Download className="h-4 w-4" /> Export
              </Button>
              <Button variant="outline" className="gap-2 border-gray-200">
                <Settings2 className="h-4 w-4" /> Table settings
              </Button>
            </div>
          </div>

          <ProjectsTable
            projects={projects}
            selectedProjects={selectedProjects}
            onSelectAll={handleSelectAll}
            onSelectProject={handleSelectProject}
            onVisibilityToggle={handleVisibilityToggle}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            perPage={perPage}
            totalItems={totalProjects}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
          />
        </>
      )}

      {/* Delete Modal */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" /> Delete Project
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteProjectMutation.isPending}
            >
              {deleteProjectMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <EditProjectModal
        isOpen={editModalOpen}
        onClose={() => { setEditModalOpen(false); setProjectToEdit(undefined); }}
        projectId={projectToEdit}
      />
    </div>
  );
}
