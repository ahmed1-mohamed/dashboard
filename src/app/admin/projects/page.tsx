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

  const isFiltering = filters.status !== "all" || filters.projectType !== "all" || debouncedSearch !== "";
  const fetchPerPage = isFiltering ? 1000 : perPage;
  const fetchPage = isFiltering ? 1 : page;

  const {
    paginatedProjectsData,
    deleteProjectMutation,
    toggleVisibilityMutation,
  } = useProjects(
    fetchPage,
    fetchPerPage,
    undefined, // Handle search locally
    undefined, // Handle status locally
    undefined  // Handle projectType locally
  );

  const { data: rawData, isLoading, isError, error, refetch } = paginatedProjectsData;

  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

  let itemsArray: any[] = [];
  let totalProjects = 0;

  if (Array.isArray(rawData)) {
    itemsArray = rawData;
    totalProjects = rawData.length;
  } else if (rawData && Array.isArray((rawData as any).data)) {
    itemsArray = (rawData as any).data;
    totalProjects = (rawData as any).total || itemsArray.length;
  } else if (rawData && (rawData as any).data && Array.isArray((rawData as any).data.data)) {
    itemsArray = (rawData as any).data.data;
    totalProjects = (rawData as any).data.total || itemsArray.length;
  }

  // Local filtering
  if (isFiltering && itemsArray.length > 0) {
    if (debouncedSearch) {
      itemsArray = itemsArray.filter((p: any) => 
        p.project_name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.developer_name?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }
    if (filters.status !== "all") {
      itemsArray = itemsArray.filter((p: any) => {
        const pStatus = p.status?.toLowerCase() || "";
        const fStatus = filters.status.toLowerCase();
        
        if (fStatus === "ongoing") {
          return pStatus === "ongoing" || pStatus === "under construction";
        } else if (fStatus === "upcoming") {
          return pStatus === "upcoming" || pStatus === "planned";
        } else if (fStatus === "completed") {
          return pStatus === "completed" || pStatus === "ready for handover";
        }
        
        return pStatus === fStatus;
      });
    }
    if (filters.projectType !== "all") {
      itemsArray = itemsArray.filter((p: any) => 
        p.project_type?.toLowerCase() === filters.projectType.toLowerCase()
      );
    }
    totalProjects = itemsArray.length;
    
    // Local Pagination
    const startIndex = (page - 1) * perPage;
    itemsArray = itemsArray.slice(startIndex, startIndex + perPage);
  }

  const projects: Project[] = useMemo(() => {
    return itemsArray.map((prop: any) => {
      if (itemsArray.indexOf(prop) === 0) {
        console.log("DEBUG FIRST PROJECT API STATUS:", prop.status, prop.project_type);
      }
      return {
        id: prop.project_id,
        name: prop.project_name || "N/A",
        developer_name: prop.developer_name || "N/A",
        total_units: Number(prop.total_units) || 0,
        available_units: Number(prop.available_units) || 0,
        launch_date: prop.launch_date || "N/A",
        completion_date: prop.completion_date || "N/A",
        price_range: prop.price_range || "N/A",
        slug: prop.slug || "",
        project_size: prop.project_size || "N/A",
        area_name: prop.area_name || "N/A",
        city_name: prop.city_name || "N/A",
        country_name: prop.country_name || "N/A",
        whatsapp: prop.whatsapp_no || "N/A",
        currency: prop.currency || "AED",
        latitude: Number(prop.latitude) || 0,
        longitude: Number(prop.longitude) || 0,
        media_urls: prop.media_urls || "",
        rating: Number(prop.rating) || 0,
        rating_count: Number(prop.rating_count) || 0,
        badge: prop.badge || null,
        offer: prop.offer || null,
        is_favourite: Boolean(prop.is_favourite),
        price_after_discount: prop.price_after_discount || "N/A",
        status: prop.status || "Upcoming",
        projectType: prop.project_type || "N/A",
        is_visible: Boolean(prop.is_visible),
      };
    });
  }, [itemsArray]);

  const totalPages = Math.max(1, Math.ceil(totalProjects / perPage));

  const handleSelectAll = useCallback((checked: boolean) => {
    setSelectedProjects(checked ? projects.map((p) => p.id) : []);
  }, [projects]);

  const handleSelectProject = useCallback((id: number, checked: boolean) => {
    setSelectedProjects((prev) =>
      checked ? [...prev, id] : prev.filter((pid) => pid !== id)
    );
  }, []);

  const handleVisibilityToggle = useCallback((id: number, isVisible: boolean) => {
    toggleVisibilityMutation.mutate(
      { id, isVisible },
      {
        onSuccess: () => {
          toast.success("Project visibility updated successfully");
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Failed to update visibility");
        }
      }
    );
  }, [toggleVisibilityMutation]);

  const handleEditClick = useCallback((id: number) => {
    router.push(`/admin/projects/${id}/edit`);
  }, [router]);

  const handleDeleteClick = useCallback((id: number) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!projectToDelete) return;
    deleteProjectMutation.mutate(projectToDelete, {
      onSuccess: () => {
        toast.success("Project deleted successfully!");
        setDeleteDialogOpen(false);
        setProjectToDelete(null);
        setSelectedProjects((prev) => prev.filter((id) => id !== projectToDelete));
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
              <strong>Error:</strong> {error instanceof Error ? error.message : "Failed to load projects"}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2 border-red-200 text-red-700 hover:bg-red-100">
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
              <Button variant="outline" className="gap-2 border-gray-200">
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
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleteProjectMutation.isPending}>
              {deleteProjectMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
