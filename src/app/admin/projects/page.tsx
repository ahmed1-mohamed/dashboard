"use client";

import { useState, useCallback, useEffect } from "react";
import useDashboardAdminData from "@/hooks/use-dashboardAdmin";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableActions } from "@/components/table/table-actions";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Download,
  Settings2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { fetchProjectsPaginated, deleteProject } from "@/data/api-client";
import { BulkImportProjectsModal } from "@/components/modals/bulk-import-projects-modal";
import { EditProjectModal } from "@/components/modals/edit-project-modal";

// Type definitions matching the actual API response
interface ProjectApiResponse {
  project_id: number;
  project_name: string | null;
  developer_name: string;
  total_units: number | string;
  available_units: number | string;
  launch_date: string | null;
  completion_date: string | null;
  price_range: string | null;
  slug: string | null;
  project_size: string | null;
  area_name: string | null;
  city_name: string | null;
  country_name: string;
  whatsapp_no: string | null;
  currency: string | null;
  latitude: string | null;
  longitude: string | null;
  media_urls: string | null;
  rating: string | null;
  rating_count: number;
  badge: {
    project_id: number;
    color: string;
    name: string;
  } | null;
  offer: any | null;
  is_favourite: number;
  price_after_discount: string | null;
  status?: string;
  is_visible?: boolean;
  project_type?: string;
}

interface Project {
  id: number;
  name: string;
  developer_name: string;
  total_units: number;
  available_units: number;
  launch_date: string;
  completion_date: string;
  price_range: string;
  slug: string;
  project_size: string;
  area_name: string;
  city_name: string;
  country_name: string;
  whatsapp: string;
  currency: string;
  latitude: number;
  longitude: number;
  media_urls: string;
  rating: number;
  rating_count: number;
  badge: { color: string; name: string } | null;
  offer: any | null;
  is_favourite: boolean;
  price_after_discount: string;
  status: string;
  projectType: "residential" | "mixed use" | "commercial";
  is_visible: boolean;
}

interface PaginatedProjectsResponse {
  status: boolean;
  data: ProjectApiResponse[];
  current_page: number;
  per_page: number;
  total: number;
}

interface ProjectsPageProps {
  initialPage?: number;
  itemsPerPage?: number;
}

export default function ProjectsPage({
  initialPage = 1,
  itemsPerPage = 10,
}: ProjectsPageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectTypeFilter, setProjectTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [selectedProject, setSelectedProject] = useState<number>();
  const [projectVisibility, setProjectVisibility] = useState<
    Record<number, boolean>
  >({});

  // Bulk import modal state
  const [bulkImportModalOpen, setBulkImportModalOpen] = useState(false);
  const [bulkImportProjectId, setBulkImportProjectId] = useState<number>();
  const [bulkImportProjectName, setBulkImportProjectName] = useState<string>();

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Fetch projects with pagination using TanStack Query
  // const {
  //   data: response,
  //   isLoading,
  //   isError,
  //   error,
  //   isFetching,
  //   refetch,
  // } = useQuery<PaginatedProjectsResponse>({
  //   queryKey: [
  //     "projects",
  //     currentPage,
  //     itemsPerPage,
  //     debouncedSearch,
  //     statusFilter,
  //     projectTypeFilter,
  //   ],
  //   queryFn: async () => {
  //     if (!token) throw new Error("No access token available");

  //     const res = await fetchProjectsPaginated(
  //       token,
  //       currentPage,
  //       itemsPerPage,
  //       debouncedSearch || undefined,
  //       statusFilter !== "all" ? statusFilter : undefined,
  //       projectTypeFilter !== "all" ? projectTypeFilter : undefined,
  //     );

  //     return res as PaginatedProjectsResponse;
  //   },
  //   enabled: !!token,
  //   staleTime: 5 * 60 * 1000, // 5 minutes - avoid unnecessary refetches
  //   placeholderData: keepPreviousData,
  //   retry: 1,
  // });

  const { paginatedProjectsData } = useDashboardAdminData(
    currentPage,
    itemsPerPage,
    debouncedSearch,
  );

  const { data, isLoading, isError, error, isFetching, refetch } =
    paginatedProjectsData;

  // Debug: inspect raw response
  useEffect(() => {
    if (data) {
      console.log("Data type:", typeof data);
      console.log("Data keys:", Object.keys(data as object));
      console.log("Data value:", data);
    }
  }, [data]);

  // Development debug: show raw response in UI
  const showDebug = process.env.NODE_ENV === "development";

  // Map API data to component interface
  // Handle both response formats: { data: [...] } or direct array
  const rawData = data as any;
  let itemsArray: any[] = [];
  if (Array.isArray(rawData)) {
    itemsArray = rawData;
  } else if (rawData && Array.isArray(rawData.data)) {
    itemsArray = rawData.data;
  } else if (rawData?.data && Array.isArray(rawData.data.data)) {
    itemsArray = rawData.data.data;
  }

  // Debug
  console.log("rawData:", rawData);
  console.log("itemsArray:", itemsArray);

  const projects: Project[] = itemsArray.map(
    (
      item: { type?: string; data?: ProjectApiResponse } | ProjectApiResponse,
    ) => {
      // Handle both wrapped ({type, data}) and direct item formats
      const proj = (item as any).data || item;
      return {
        id: proj.project_id,
        name: proj.project_name || "N/A",
        developer_name: proj.developer_name || "N/A",
        total_units:
          typeof proj.total_units === "string"
            ? parseInt(proj.total_units.replace(/,/g, "")) || 0
            : proj.total_units || 0,
        available_units:
          typeof proj.available_units === "string"
            ? parseInt(proj.available_units.replace(/,/g, "")) || 0
            : proj.available_units || 0,
        launch_date: proj.launch_date || "",
        completion_date: proj.completion_date || "",
        price_range: proj.price_range || "N/A",
        slug: proj.slug || "",
        project_size: proj.project_size || "",
        area_name: proj.area_name || "N/A",
        city_name: proj.city_name || "N/A",
        country_name: proj.country_name || "N/A",
        whatsapp: proj.whatsapp_no || "",
        currency: proj.currency || "AED",
        latitude: parseFloat(proj.latitude || "0") || 0,
        longitude: parseFloat(proj.longitude || "0") || 0,
        media_urls: proj.media_urls || "",
        rating: parseFloat(proj.rating || "0"),
        rating_count: proj.rating_count || 0,
        badge: proj.badge
          ? { color: proj.badge.color, name: proj.badge.name }
          : null,
        offer: proj.offer,
        is_favourite: Boolean(proj.is_favourite),
        price_after_discount: proj.price_after_discount || "",
        status: proj.status || "active",
        projectType:
          (proj.project_type as "residential" | "mixed use" | "commercial") ||
          "residential",
        is_visible: proj.is_visible ? true : false,
      };
    },
  );

  const totalProjects =
    rawData?.total ||
    rawData?.data?.total ||
    itemsArray.length ||
    0;
  const totalPages =
    rawData?.last_page ||
    rawData?.data?.last_page ||
    Math.ceil(totalProjects / itemsPerPage) ||
    1;
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Initialize visibility state based on projects data from API
  useEffect(() => {
    const rawItems = (data as any)?.data;
    const itemsArray = Array.isArray(rawItems) ? rawItems : [];
    if (itemsArray.length > 0) {
      const visibilityState = itemsArray.reduce(
        (
          acc: Record<number, boolean>,
          item:
            | { type?: string; data?: ProjectApiResponse }
            | ProjectApiResponse,
        ) => {
          const proj = (item as any).data || item;
          return {
            ...acc,
            [proj.project_id]: proj.is_visible ? true : false,
          };
        },
        {},
      );
      setProjectVisibility(visibilityState);
    }
  }, [data]);

  // Delete project mutation
  const mutationDelete = useMutation({
    mutationFn: async (project_id: number) => {
      await deleteProject(project_id, token!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete project.");
    },
  });

  // Handle page changes
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProjects(projects.map((p) => p.id));
    } else {
      setSelectedProjects([]);
    }
  };

  const handleSelectProject = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedProjects([...selectedProjects, id]);
    } else {
      setSelectedProjects(selectedProjects.filter((pid) => pid !== id));
    }
  };

  const toggleVisibility = (id: number) => {
    setProjectVisibility((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    toast.success(`Project visibility updated`);
  };

  const handleRetry = () => {
    refetch();
  };

  // Generate page numbers for pagination
  const getPageNumbers = useCallback(() => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="p-4 px-3 space-y-4 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-700 border-purple-200 rounded-full px-2"
          >
            {totalProjects}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
            onClick={() => router.push("/admin/projects/create")}
          >
            <Plus className="h-4 w-4" />
            Add New Project
          </Button>
        </div>
      </div>

      {/* Debug panel (development only) */}
      {/* {showDebug && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm font-mono text-yellow-800">
            <strong>Debug Info:</strong>
            <br />
            rawData keys: {JSON.stringify(Object.keys((data as any) || {}))}
            <br />
            itemsArray length:{" "}
            {(data as any)?.data ? ((data as any).data as any[]).length : "N/A"}
            <br />
            projects length: {projects.length}
            <br />
            isLoading: {String(isLoading)} isError: {String(isError)}
          </p>
        </div>
      )} */}

      {/* Loading State with Skeletons */}
      {isLoading && (
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
      )}

      {/* Error State */}
      {isError && !isLoading && (
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
            onClick={handleRetry}
            className="mt-2 border-red-200 text-red-700 hover:bg-red-100"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Filters and Actions */}
      {!isLoading && !isError && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
              {/* Search */}
              <div className="relative w-full min-w-[200px] max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-200"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Under Construction">Upcoming</SelectItem>
                  <SelectItem value="Ready for Handover">
                    Ready for Handover
                  </SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>

              {/* Project Type Filter */}
              <Select
                value={projectTypeFilter}
                onValueChange={setProjectTypeFilter}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Project Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="mixed">Mixed-Use</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2 border-gray-200">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" className="gap-2 border-gray-200">
                <Settings2 className="h-4 w-4" />
                Table settings
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="w-[35px] px-2">
                    <Checkbox
                      checked={
                        projects.length > 0 &&
                        selectedProjects.length === projects.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[110px] px-2 text-sm cursor-pointer hover:bg-gray-100">
                    Project
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[110px] px-2 text-sm">
                    Developer
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[70px] px-2 text-sm">
                    Units
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[90px] px-2 text-sm">
                    City
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[90px] px-2 text-sm">
                    Type
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[80px] px-2 text-sm">
                    Price
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[140px] px-2 text-sm">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[70px] px-2 text-sm">
                    Visible
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[70px] px-2 text-sm">
                    Import
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center w-[50px] px-2 text-sm">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="h-24 text-center text-gray-500"
                    >
                      No projects found.
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="px-2">
                        <Checkbox
                          checked={selectedProjects.includes(project.id)}
                          onCheckedChange={(checked) =>
                            handleSelectProject(project.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium truncate max-w-[110px] px-2 text-sm">
                        <button
                          onClick={() => router.push(`/admin/projects/${project.id}`)}
                          className="text-teal-600 hover:text-teal-800 active:text-teal-900 transition-colors cursor-pointer text-left focus:outline-none"
                        >
                          {project.name}
                        </button>
                      </TableCell>
                      <TableCell className="text-gray-900 truncate max-w-[110px] px-2 text-sm">
                        {project.developer_name}
                      </TableCell>
                      <TableCell className="text-gray-900 text-xs px-2">
                        {project.available_units} / {project.total_units}
                      </TableCell>
                      <TableCell className="text-gray-900 text-sm px-2">
                        {project.city_name || project.country_name}
                      </TableCell>
                      <TableCell className="text-gray-900 text-xs px-2">
                        {project.projectType}
                      </TableCell>
                      <TableCell className="text-gray-900 text-sm px-2">
                        {project.price_range}
                      </TableCell>
                      <TableCell className="px-2">
                        {project.badge ? (
                          <Badge
                            variant="outline"
                            style={{
                              backgroundColor: `${project.badge.color}15`,
                              color: project.badge.color,
                              borderColor: `${project.badge.color}40`,
                              fontSize: "10px",
                              padding: "2px 8px",
                              borderRadius: "9999px",
                              fontWeight: 500,
                            }}
                          >
                            {project.badge.name}
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className={
                              project.status === "completed" ||
                                project.status === "Active"
                                ? "bg-green-50 text-green-700 border-green-200 text-[10px] px-1"
                                : "bg-red-50 text-red-700 border-red-200 text-[10px] px-1"
                            }
                          >
                            {project.status}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="px-2">
                        <Switch
                          checked={projectVisibility[project.id] || false}
                          onCheckedChange={() => toggleVisibility(project.id)}
                        />
                      </TableCell>
                      <TableCell className="px-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setBulkImportProjectId(project.id);
                            setBulkImportProjectName(project.name);
                            setBulkImportModalOpen(true);
                          }}
                          className="gap-1"
                        >
                          Import
                        </Button>
                      </TableCell>
                      <TableCell className="text-center px-2">
                        <TableActions
                          onView={() =>
                            router.push(`/admin/projects/${project.id}`)
                          }
                          onEdit={() => {
                            setBulkImportProjectId(project.id);
                            setIsEditModalOpen(true);
                          }}
                          onDelete={() => {
                            setProjectToDelete(project.id);
                            setDeleteDialogOpen(true);
                          }}
                        />
                        <Dialog
                          open={
                            deleteDialogOpen && projectToDelete === project.id
                          }
                          onOpenChange={(open) => {
                            setDeleteDialogOpen(open);
                            if (!open) setProjectToDelete(null);
                          }}
                        >
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2 text-red-600">
                                <AlertTriangle className="h-5 w-5" />
                                Delete Project
                              </DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this project?
                                This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                                <p className="font-medium text-gray-900">
                                  {project.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {project.developer_name} •{" "}
                                  {project.projectType}
                                </p>
                              </div>
                            </div>
                            <DialogFooter className="sm:justify-end">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setDeleteDialogOpen(false);
                                  setProjectToDelete(null);
                                }}
                                disabled={mutationDelete.isPending}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => {
                                  mutationDelete.mutate(project.id);
                                  setDeleteDialogOpen(false);
                                  setProjectToDelete(null);
                                }}
                                disabled={mutationDelete.isPending}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {mutationDelete.isPending
                                  ? "Deleting..."
                                  : "Delete"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, totalProjects)} of{" "}
                {totalProjects}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isFetching}
                  className="h-8 w-8 border-gray-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {getPageNumbers().map((page, index) =>
                  typeof page === "string" ? (
                    <span key={`ellipsis-${index}`} className="px-2">
                      {page}
                    </span>
                  ) : (
                    <Button
                      key={`page-${page}`}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      onClick={() => handlePageChange(page)}
                      disabled={isFetching}
                      className={
                        currentPage === page
                          ? "h-8 w-8 bg-gray-900 hover:bg-gray-800 text-white"
                          : "h-8 w-8 border-gray-200"
                      }
                    >
                      {page}
                    </Button>
                  ),
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isFetching}
                  className="h-8 w-8 border-gray-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Bulk Import Modal */}
      <BulkImportProjectsModal
        isOpen={bulkImportModalOpen}
        projectId={bulkImportProjectId}
        projectName={bulkImportProjectName}
        onClose={() => setBulkImportModalOpen(false)}
      />
      {/* <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        projectId={bulkImportProjectId}
      /> */}
    </div>
  );
}
