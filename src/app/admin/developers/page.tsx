"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import useDashboardAdminDevelopersData from "@/hooks/use-dashboardAdminDevelopers";
import { AddDeveloperModal } from "@/components/modals/add-developer-modal";
import { BulkImportDevelopersModal } from "@/components/modals/bulk-import-developers-modal";
import { EditDeveloperModal } from "@/components/modals/edit-developer-modal";
import { DeveloperDataType } from "@/types";

interface DeveloperApiResponse {
  developer_id: number;
  developer_name: string;
  countries: string;
  cities: string;
  projects_count: number;
  website: string;
  email: string;
  phone_number: string;
  status: string;
  is_active: boolean;
  is_top: number;
  created_at: string;
  updated_at: string;
  logo?: string;
  description?: string;
}

interface Developer {
  id: number;
  name: string;
  countries: string;
  cities: string;
  projects: number;
  website: string;
  email: string;
  contact: string;
  status: boolean;
}

interface DevelopersPageProps {
  initialPage?: number;
  itemsPerPage?: number;
}

export default function DevelopersPage({
  initialPage = 1,
  itemsPerPage = 10,
}: DevelopersPageProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPageState, setItemsPerPage] = useState(itemsPerPage);
  const [selectedDevelopers, setSelectedDevelopers] = useState<number[]>([]);
  const [selectedDeveloperId, setSelectedDeveloperId] = useState<number | null>(
    null,
  );
  const [selectedDeveloperData, setSelectedDeveloperData] =
    useState<DeveloperDataType>({} as DeveloperDataType);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [bulkImportModalOpen, setBulkImportModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [developerToDelete, setDeveloperToDelete] = useState<number | null>(
    null,
  );

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, countryFilter]);

  const {
    developersData,
    deleteMutation,
    bulkImportMutation,
    toggleStatusMutation,
  } = useDashboardAdminDevelopersData(
    currentPage,
    itemsPerPageState,
    debouncedSearch,
    statusFilter,
  );

  const {
    data: devData,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = developersData as any;
  console.log("devdata", devData);

  const rawData = devData?.data as unknown;
  let developersArray: DeveloperApiResponse[] = [];
  if (Array.isArray(rawData)) {
    developersArray = rawData as DeveloperApiResponse[];
  } else if (
    rawData &&
    typeof rawData === "object" &&
    "developers" in rawData &&
    Array.isArray((rawData as { developers?: unknown }).developers)
  ) {
    developersArray = (rawData as { developers?: unknown })
      .developers as DeveloperApiResponse[];
  }

  useEffect(() => {
    if (devData) {
      console.log("Developers Data type:", typeof devData);
      console.log("Developers Data keys:", Object.keys(devData as object));
      console.log("Developers Data value:", devData);
    }
  }, [devData]);

  const developers: Developer[] = developersArray.map(
    (dev: DeveloperApiResponse) => {
      return {
        id: dev.developer_id,
        name: dev.developer_name || "N/A",
        countries: dev.countries || "N/A",
        cities: dev.cities || "N/A",
        projects: dev.projects_count || 0,
        website: dev.website || "N/A",
        email: dev.email || "N/A",
        contact: dev.phone_number || "N/A",
        status: dev.is_active || false,
      };
    },
  );

  const totalDevelopers = (devData as any)?.total || 0;
  const totalPages = Math.ceil(Number(totalDevelopers) / itemsPerPageState);
  const startIndex = (currentPage - 1) * itemsPerPageState;

  const filteredDevelopers = developers.filter((developer) => {
    const matchesCountry =
      countryFilter === "all" || developer.countries === countryFilter;
    return matchesCountry;
  });

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages],
  );

  const handleItemsPerPageChange = useCallback((value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedDevelopers(filteredDevelopers.map((d) => d.id));
      } else {
        setSelectedDevelopers([]);
      }
    },
    [filteredDevelopers],
  );

  const handleSelectDeveloper = useCallback(
    (id: number, checked: boolean) => {
      if (checked) {
        setSelectedDevelopers([...selectedDevelopers, id]);
      } else {
        setSelectedDevelopers(selectedDevelopers.filter((did) => did !== id));
      }
    },
    [selectedDevelopers],
  );

  const toggleStatus = useCallback(
    (id: number, newStatus: boolean) => {
      const status = newStatus ? "active" : "inactive";
      toggleStatusMutation.mutate(
        { id, status },
        {
          onSuccess: () => {
            toast.success(
              `Developer ${newStatus ? "activated" : "deactivated"} successfully`,
            );
          },
          onError: (error: unknown) => {
            const message =
              error instanceof Error
                ? error.message
                : "Failed to update status";
            toast.error(message);
          },
        },
      );
    },
    [toggleStatusMutation],
  );

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleEditDeveloper = useCallback(
    (id: number) => {
      const developer = (
        devData as { developers?: DeveloperApiResponse[] }
      )?.developers?.find((d) => d.developer_id === id);
      if (developer) {
        setSelectedDeveloperId(id);
        setSelectedDeveloperData(developer as DeveloperDataType);
        setEditModalOpen(true);
      }
    },
    [devData],
  );

  const handleDeleteDeveloper = useCallback((id: number) => {
    setDeveloperToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDeleteDeveloper = useCallback(() => {
    if (developerToDelete) {
      deleteMutation.mutate(developerToDelete, {
        onSuccess: () => {
          toast.success("Developer deleted successfully!");
          setDeleteDialogOpen(false);
          setDeveloperToDelete(null);
        },
        onError: (error) => {
          console.error(error);
          toast.error("Failed to delete developer.");
        },
      });
    }
  }, [developerToDelete, deleteMutation]);

  const handleBulkImport = useCallback(
    (file: File) => {
      bulkImportMutation.mutate(file, {
        onSuccess: () => {
          toast.success("Developers imported successfully!");
          setBulkImportModalOpen(false);
        },
        onError: (error) => {
          console.error(error);
          toast.error("Failed to import developers.");
        },
      });
    },
    [bulkImportMutation],
  );

  const getPageNumbers = useCallback(() => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - Math.floor(maxVisible / 2));
      const end = Math.min(totalPages - 1, start + maxVisible - 3);

      if (end === totalPages - 1) {
        start = Math.max(2, end - maxVisible + 2);
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="p-4 px-3 space-y-4 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Developers</h1>
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-700 border-purple-200 rounded-full px-2"
          >
            {totalDevelopers}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
            onClick={() => setAddModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add New Developer
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
            developers length: {developers.length}
            <br />
            isLoading: {String(isLoading)} isError: {String(isError)}
          </p>
        </div>
      )} */}

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-64" />
          </div>
        </div>
      )}

      {isError && !isLoading && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-800">
              <strong>Error:</strong>{" "}
              {error instanceof Error
                ? error.message
                : "Failed to load developers"}
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

      {!isLoading && !isError && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
              <div className="relative w-full min-w-[200px] max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for developers"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-200"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="UAE">UAE</SelectItem>
                  <SelectItem value="Egypt">Egypt</SelectItem>
                  <SelectItem value="Oman">Oman</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2 border-gray-200">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                className="gap-2 border-gray-200"
                onClick={() => setBulkImportModalOpen(true)}
              >
                <Upload className="h-4 w-4" />
                Import
              </Button>
              <Button variant="outline" className="gap-2 border-gray-200">
                <Settings2 className="h-4 w-4" />
                Table settings
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="w-[35px] px-2">
                    <Checkbox
                      checked={
                        filteredDevelopers.length > 0 &&
                        selectedDevelopers.length === filteredDevelopers.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[140px] px-2 text-sm">
                    Developer
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
                    Country
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
                    City
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[70px] px-2 text-sm">
                    Projects
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[130px] px-2 text-sm">
                    Website
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[140px] px-2 text-sm">
                    Email
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[120px] px-2 text-sm">
                    Contact
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[70px] px-2 text-sm">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center w-[50px] px-2 text-sm">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevelopers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="h-24 text-center text-gray-500"
                    >
                      No developers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDevelopers.map((developer) => (
                    <TableRow key={developer.id}>
                      <TableCell className="px-2">
                        <Checkbox
                          checked={selectedDevelopers.includes(developer.id)}
                          onCheckedChange={(checked) =>
                            handleSelectDeveloper(
                              developer.id,
                              checked as boolean,
                            )
                          }
                        />
                      </TableCell>
                      <TableCell className="text-teal-600 font-medium px-2 text-sm truncate">
                        <button
                          onClick={() => router.push(`/admin/developers/${developer.id}`)}
                          className="text-teal-600 hover:text-teal-800 active:text-teal-900 transition-colors cursor-pointer text-left focus:outline-none"
                        >
                          {developer.name}
                        </button>
                      </TableCell>
                      <TableCell className="text-gray-900 px-2 text-sm">
                        {developer.countries}
                      </TableCell>
                      <TableCell className="text-gray-900 px-2 text-sm">
                        {developer.cities}
                      </TableCell>
                      <TableCell className="text-gray-900 px-2 text-sm">
                        {developer.projects}
                      </TableCell>
                      <TableCell className="text-gray-900 px-2 text-sm truncate">
                        {developer.website}
                      </TableCell>
                      <TableCell className="text-gray-900 px-2 text-sm truncate">
                        {developer.email}
                      </TableCell>
                      <TableCell className="text-gray-900 px-2 text-sm">
                        {developer.contact}
                      </TableCell>
                      <TableCell className="px-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${developer.status ? "bg-green-500" : "bg-gray-400"
                              } ${toggleStatusMutation.isPending
                                ? "animate-pulse"
                                : ""
                              }`}
                          />
                          <Switch
                            checked={developer.status}
                            onCheckedChange={(checked) =>
                              toggleStatus(developer.id, checked)
                            }
                            disabled={toggleStatusMutation.isPending}
                            className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center px-2">
                        <TableActions
                          onView={() =>
                            router.push(`/admin/developers/${developer.id}`)
                          }
                          onEdit={() => handleEditDeveloper(developer.id)}
                          onDelete={() => handleDeleteDeveloper(developer.id)}
                        />
                        <Dialog
                          open={
                            deleteDialogOpen &&
                            developerToDelete === developer.id
                          }
                          onOpenChange={(open) => {
                            setDeleteDialogOpen(open);
                            if (!open) setDeveloperToDelete(null);
                          }}
                        >
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2 text-red-600">
                                <AlertTriangle className="h-5 w-5" />
                                Delete Developer
                              </DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this developer?
                                This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                                <p className="font-medium text-gray-900">
                                  {developer.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {developer.email} • {developer.projects}{" "}
                                  projects
                                </p>
                              </div>
                            </div>
                            <DialogFooter className="sm:justify-end">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setDeleteDialogOpen(false);
                                  setDeveloperToDelete(null);
                                }}
                                disabled={deleteMutation.isPending}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => confirmDeleteDeveloper()}
                                disabled={deleteMutation.isPending}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {deleteMutation.isPending
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

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Show</span>
                <Select
                  value={itemsPerPageState.toString()}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-500">entries</span>
              </div>

              <div className="text-sm text-gray-500">
                Showing {startIndex + 1}-
                {Math.min(startIndex + itemsPerPageState, totalDevelopers)} of{" "}
                {totalDevelopers}
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
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-gray-400"
                    >
                      {page}
                    </span>
                  ) : (
                    <Button
                      key={`page-${page}`}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      onClick={() => handlePageChange(page)}
                      disabled={currentPage === page || isFetching}
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

      <AddDeveloperModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

      <BulkImportDevelopersModal
        isOpen={bulkImportModalOpen}
        onClose={() => setBulkImportModalOpen(false)}
        onSubmit={handleBulkImport}
      />

      {/* <EditDeveloperModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedDeveloperId(null);
          setSelectedDeveloperData({} as DeveloperDataType);
        }}
        developerId={selectedDeveloperId!}
        data={
          selectedDeveloperData
            ? {
                developer_id: selectedDeveloperData.developer_id,
                name: selectedDeveloperData.developer_name || "",
                email: selectedDeveloperData.email || "",
                phone_number: selectedDeveloperData.phone_number || "",
                website: selectedDeveloperData.website || "",
                logo: selectedDeveloperData.logo || "",
                description: selectedDeveloperData.description || "",
                status: selectedDeveloperData.status || "active",
                is_top: selectedDeveloperData.is_top || 0,
              }
            : undefined
        }
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["developers"] });
          setEditModalOpen(false);
          setSelectedDeveloperId(null);
          setSelectedDeveloperData({} as DeveloperDataType);
        }}
      /> */}
    </div>
  );
}
