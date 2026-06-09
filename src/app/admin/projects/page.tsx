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
import dynamic from "next/dynamic";

const EditProjectModal = dynamic(() => import("@/components/modals/edit-project-modal").then(mod => mod.EditProjectModal));
const BulkImportProjectsModal = dynamic(() => import("@/components/modals/bulk-import-projects-modal").then(mod => mod.BulkImportProjectsModal));
import { projectsExportToExcel } from "@/lib/exports/export-projects";
import { AdminProjectsService } from "@/features/projects/services/AdminProjectsService";
import { TableSettings } from "@/components/table/table-settings";
import { useTableSettings } from "@/hooks/use-table-settings";

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ProjectsPageContent />
    </Suspense>
  );
}

const INITIAL_FILTERS = {
  status: "all",
  projectType: "all",
};

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
    initialFilters: INITIAL_FILTERS,
  });

  const {
    paginatedProjectsData,
    projects,
    totalProjects,
    deleteProjectMutation,
    toggleActiveMutation,
  } = useProjects(
    page,
    perPage,
    debouncedSearch || undefined,
    filters.status !== "all" ? filters.status : undefined,
    filters.projectType !== "all" ? filters.projectType : undefined,
  );

  const { isLoading, isError, error, refetch } = paginatedProjectsData;

  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<number | undefined>(undefined);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [bulkImportProjectId, setBulkImportProjectId] = useState<number | undefined>(undefined);
  const [bulkImportProjectName, setBulkImportProjectName] = useState<string | undefined>(undefined);

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

  const handleExport = useCallback(async () => {
    toast.info("Preparing export... This might take a moment.", { duration: 3000 });
    try {
      let allExportedProjects: unknown[] = [];
      let currentPage = 1;
      let totalPagesToFetch = 1;
      const batchSize = 100; // Safe limit that backend definitely accepts

      do {
        const response = await AdminProjectsService.getProjectsPaginated(
          currentPage,
          batchSize,
          debouncedSearch || undefined,
          filters.status !== "all" ? filters.status : undefined,
          filters.projectType !== "all" ? filters.projectType : undefined
        );

        let batch: unknown[] = [];
        const rawData = response;
        let currentTotal = 0;

        if (Array.isArray(rawData)) {
          batch = rawData;
          totalPagesToFetch = 1;
        } else {
          const nested = (rawData as { data?: unknown; total?: number; meta?: any } | undefined);
          if (Array.isArray(nested?.data)) {
            batch = nested.data;
            currentTotal = nested.total ?? nested.meta?.total ?? batch.length;
          } else {
            const doublyNested = (nested?.data as { data?: unknown; total?: number } | undefined);
            if (Array.isArray(doublyNested?.data)) {
              batch = doublyNested.data;
              currentTotal = doublyNested.total ?? batch.length;
            }
          }

          if (currentTotal > 0) {
            totalPagesToFetch = Math.ceil(currentTotal / batchSize);
          } else {
            totalPagesToFetch = 1;
          }
        }

        allExportedProjects = [...allExportedProjects, ...batch];
        currentPage++;
      } while (currentPage <= totalPagesToFetch);

      if (allExportedProjects.length === 0) {
        toast.info("No projects to export");
        return;
      }

      projectsExportToExcel(allExportedProjects);
      toast.success("Projects exported successfully!");
    } catch (error) {
      toast.error("Failed to fetch data for export");
    }
  }, [debouncedSearch, filters.status, filters.projectType]);

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

  const DEFAULT_COLUMNS = [
    { id: "project", label: "Project", visible: true },
    { id: "developer", label: "Developer", visible: true },
    { id: "units", label: "Units", visible: true },
    { id: "city", label: "City", visible: true },
    { id: "type", label: "Type", visible: true },
    { id: "price", label: "Price", visible: true },
    { id: "visibility", label: "Visibility", visible: true },
    { id: "status", label: "Status", visible: true },
    { id: "import", label: "Import", visible: true },
    { id: "actions", label: "Actions", visible: true },
  ];

  const tableSettings = useTableSettings("projects", DEFAULT_COLUMNS);

  useEffect(() => {
    setPerPage(String(tableSettings.settings.itemsPerPage));
  }, [tableSettings.settings.itemsPerPage, setPerPage]);

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
              <TableSettings
                settings={tableSettings}
                onExportExcel={handleExport}
              />
            </div>
          </div>

          <ProjectsTable
            settings={tableSettings}
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

      {editModalOpen && (
        <EditProjectModal
          isOpen={editModalOpen}
          onClose={() => { setEditModalOpen(false); setProjectToEdit(undefined); }}
          projectId={projectToEdit}
        />
      )}

      {importModalOpen && (
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
      )}
    </div>
  );
}