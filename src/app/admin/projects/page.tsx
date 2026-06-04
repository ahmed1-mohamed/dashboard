"use client";

import { useState, useCallback, useMemo, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { ProjectsLoading } from "@/features/projects/components/ProjectsLoading";
import { ProjectsError } from "@/features/projects/components/ProjectsError";
import { DeleteProjectDialog } from "@/features/projects/components/DeleteProjectDialog";
import { Button } from "@/components/ui/button";
import { Download, Settings2, Plus, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { useServerPagination } from "@/hooks/useServerPagination";
import useProjects from "@/features/projects/hooks/useProjects";
import { ProjectsTable } from "@/features/projects/components/ProjectsTable";
import { ProjectsFilters } from "@/features/projects/components/ProjectsFilters";
import { Project } from "@/features/projects/types";
import { EditProjectModal } from "@/components/modals/edit-project-modal";
import { BulkImportProjectsModal } from "@/components/modals/bulk-import-projects-modal";
import { projectsExportToExcel } from "@/lib/exports/export-projects";

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ProjectsPageContent />
    </Suspense>
  );
}

function ProjectsPageContent() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    toggleActiveMutation,
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
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [bulkImportProjectId, setBulkImportProjectId] = useState<number | undefined>(undefined);
  const [bulkImportProjectName, setBulkImportProjectName] = useState<string | undefined>(undefined);

  const itemsArray = useMemo(() => {
    let arr: unknown[] = [];
    if (Array.isArray(rawData)) {
      arr = rawData;
    } else {
      const nested = (rawData as { data?: unknown } | undefined)?.data;
      if (Array.isArray(nested)) {
        arr = nested;
      } else {
        const doublyNested = (nested as { data?: unknown } | undefined)?.data;
        if (Array.isArray(doublyNested)) {
          arr = doublyNested;
        }
      }
    }
    return arr;
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
  }, [rawData, itemsArray.length]);

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
        country_dimension_unit: (p.country_dimension_unit as string) || "N/A",
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
        is_active: Boolean(p.is_active),
      };
    });
  }, [itemsArray]);

  const filteredProjects: Project[] = projects;

  const totalPages = Math.max(1, Math.ceil(totalProjects / perPage));

  const handleImport = useCallback((id?: number, name?: string) => {
    setBulkImportProjectId(id);
    setBulkImportProjectName(name);
    setImportModalOpen(true);
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedProjects(checked ? filteredProjects.map((p) => p.id) : []);
    },
    [filteredProjects],
  );

  const handleSelectProject = useCallback((id: number, checked: boolean) => {
    setSelectedProjects((prev) =>
      checked ? [...prev, id] : prev.filter((pid) => pid !== id),
    );
  }, []);

  const handleActiveToggle = useCallback(
    (id: number, isActive: boolean) => {
      toggleActiveMutation.mutate(
        { id, isActive },
        {
          onSuccess: () => {
            toast.success("Project status updated successfully");
          },
          onError: (err) => {
            toast.error(
              err instanceof Error ? err.message : "Failed to update status",
            );
          },
        },
      );
    },
    [toggleActiveMutation],
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
    if (itemsArray.length === 0) {
      toast.info("No projects to export");
      return;
    }
    projectsExportToExcel(itemsArray);
    toast.success("Projects exported successfully!");
  }, [itemsArray]);

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
        <ProjectsLoading />
      ) : isError ? (
        <ProjectsError error={error} onRetry={refetch} />
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
              <Button variant="outline" className="gap-2 border-gray-200" onClick={() => handleImport()}>
                <UploadCloud className="h-4 w-4" /> Import
              </Button>
              <Button variant="outline" className="gap-2 border-gray-200" onClick={handleExport}>
                <Download className="h-4 w-4" /> Export
              </Button>
              <Button variant="outline" className="gap-2 border-gray-200">
                <Settings2 className="h-4 w-4" /> Table settings
              </Button>
            </div>
          </div>

          <ProjectsTable
            projects={filteredProjects}
            selectedProjects={selectedProjects}
            onSelectAll={handleSelectAll}
            onSelectProject={handleSelectProject}
            onActiveToggle={handleActiveToggle}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onImport={handleImport}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            perPage={perPage}
            totalItems={filteredProjects.length}
            currentItemsCount={filteredProjects.length}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
          />
        </>
      )}

      <DeleteProjectDialog
        isOpen={deleteDialogOpen}
        onClose={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isPending={deleteProjectMutation.isPending}
      />

      <EditProjectModal
        isOpen={editModalOpen}
        onClose={() => { setEditModalOpen(false); setProjectToEdit(undefined); }}
        projectId={projectToEdit}
      />

      <BulkImportProjectsModal
        isOpen={importModalOpen}
        projectId={bulkImportProjectId}
        projectName={bulkImportProjectName}
        onClose={() => {
          setImportModalOpen(false);
          setBulkImportProjectId(undefined);
          setBulkImportProjectName(undefined);
        }}
      />
    </div>
  );
}