"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Filter,
  Settings2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Mail,
  Phone,
  Globe,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import useDashboardAdminExpertsData from "@/hooks/use-dashboardAdminExperts";
import { ExpertDataType } from "@/types";
import { AddExpertModal } from "@/components/modals/add-expert-modal";

interface Expert {
  id: number;
  name: string;
  email: string;
  phone: string;
  specializations: string[];
  countries: string[];
  consultations: number;
  rating_avg: number;
  rating_count: number;
  status: string;
}

const avatarColors = [
  "bg-teal-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-cyan-500",
];

export default function ExpertsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expertActiveStatus, setExpertActiveStatus] = useState<
    Record<number, boolean>
  >({});
  const [updatingExpertId, setUpdatingExpertId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expertToDelete, setExpertToDelete] = useState<number | null>(null);
  const [addExpertModalOpen, setAddExpertModalOpen] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch experts data using custom hook
  const { expertsData, deleteExpertMutation, toggleStatusMutation } =
    useDashboardAdminExpertsData(
      currentPage,
      itemsPerPage,
      debouncedSearch,
      statusFilter,
    );

  const { data, isLoading, isError, error, isFetching } = expertsData;

  const experts: Expert[] = useMemo(() => {
    const rawResponse = data as
      | { data?: ExpertDataType[]; total?: number }
      | undefined;

    const expertsList = rawResponse?.data || [];

    return expertsList.map((exp: ExpertDataType) => ({
      id: exp.expert_id,
      name: exp.display_name || "N/A",
      email: exp.email || "N/A",
      phone: exp.phone_number || "N/A",
      specializations: exp.categories || [],
      countries: exp.countries || [],
      consultations: exp.consultations_count ?? 0,
      rating_avg: exp.rating_avg ?? 0,
      rating_count: exp.rating_count ?? 0,
      status: exp.status || "pending",
    }));
  }, [data]);

  const totalExperts = (data as { total?: number })?.total || 0;
  const totalPages = Math.ceil(Number(totalExperts) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  if (typeof window !== "undefined") {
    if (experts.length > 0 && Object.keys(expertActiveStatus).length === 0) {
      const statusState = experts.reduce(
        (acc, exp) => ({
          ...acc,
          [exp.id]: exp.status === "approved",
        }),
        {},
      );
      setExpertActiveStatus(statusState);
    }
  }

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

  const getAvatarColor = (index: number) => {
    return avatarColors[index % avatarColors.length];
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getRatingBg = (rating: number) => {
    if (rating >= 4) return "bg-green-100";
    if (rating >= 3) return "bg-yellow-100";
    return "bg-red-100";
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const toggleStatus = useCallback(
    (id: number, checked: boolean) => {
      const previousStatus = expertActiveStatus[id];

      // Optimistic update
      setExpertActiveStatus((prev) => ({ ...prev, [id]: checked }));
      setUpdatingExpertId(id);

      toggleStatusMutation.mutate(
        { expertId: id, newStatus: checked },
        {
          onSettled: () => {
            setUpdatingExpertId(null);
          },
          onError: () => {
            setExpertActiveStatus((prev) => ({
              ...prev,
              [id]: previousStatus,
            }));
            toast.error("Failed to update expert status");
          },
        },
      );
    },
    [toggleStatusMutation, expertActiveStatus],
  );

  const handleDeleteExpert = useCallback(
    (id: number) => {
      deleteExpertMutation.mutate(id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setExpertToDelete(null);
        },
      });
    },
    [deleteExpertMutation],
  );

  return (
    <div className="p-4 px-3 space-y-4 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Experts</h1>
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-700 border-purple-200 rounded-full px-2"
          >
            {totalExperts}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
            onClick={() => setAddExpertModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add New Expert
          </Button>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          {/* Filter Button */}
          <Button variant="outline" className="gap-2 border-gray-200">
            <Filter className="h-4 w-4" />
            Filter by
          </Button>

          {/* Search */}
          <div className="relative w-full min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for experts"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 border-gray-200">
            <Settings2 className="h-4 w-4" />
            Table settings
          </Button>
        </div>
      </div>

      {/* Loading State */}
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

      {/* Error State */}
      {isError && !isLoading && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            <strong>Error:</strong>{" "}
            {error instanceof Error ? error.message : "Failed to load experts"}
          </p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <div className="rounded-lg border border-gray-200 bg-white overflow-x-auto table-scroll-container-h">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="font-semibold text-gray-900 w-[200px] px-3 text-sm">
                  Expert
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[180px] px-2 text-sm">
                  Email
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[180px] px-2 text-sm">
                  Specializations
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[110px] px-2 text-sm">
                  Country
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[130px] px-2 text-sm">
                  Contact
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[110px] px-2 text-sm">
                  Consultations
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[130px] px-2 text-sm">
                  Response Rate
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[90px] px-2 text-sm">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-gray-900 text-center w-[50px] px-2 text-sm">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-24 text-center text-gray-500"
                  >
                    No experts found.
                  </TableCell>
                </TableRow>
              ) : (
                experts.map((expert, index) => (
                  <TableRow key={expert.id}>
                    {/* Expert */}
                    <TableCell className="px-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 rounded-full ${getAvatarColor(
                            index,
                          )} flex items-center justify-center flex-shrink-0 text-white text-xs font-semibold`}
                        >
                          {getInitials(expert.name)}
                        </div>
                        <span className="text-gray-900 text-sm font-medium truncate">
                          {expert.name}
                        </span>
                      </div>
                    </TableCell>

                    {/* Email */}
                    <TableCell className="px-2 text-sm">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Mail className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{expert.email}</span>
                      </div>
                    </TableCell>

                    {/* Specializations */}
                    <TableCell className="px-2">
                      <div className="flex flex-wrap gap-1">
                        {expert.specializations.length > 0 ? (
                          expert.specializations.map((spec, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs bg-teal-50 text-teal-700 border-teal-200 px-1.5 py-0"
                            >
                              {spec}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )}
                      </div>
                    </TableCell>

                    {/* Country */}
                    <TableCell className="px-2 text-sm">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Globe className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate">
                          {expert.countries.length > 0
                            ? expert.countries.join(", ")
                            : "N/A"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Contact */}
                    <TableCell className="px-2 text-sm">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Phone className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{expert.phone}</span>
                      </div>
                    </TableCell>

                    {/* Consultations */}
                    <TableCell className="px-2 text-sm text-gray-900 font-medium">
                      {expert.consultations}
                    </TableCell>

                    {/* Response Rate (using rating_avg) */}
                    <TableCell className="px-2">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${getRatingBg(
                            expert.rating_avg,
                          )}`}
                        >
                          <Star
                            className={`h-3.5 w-3.5 ${getRatingColor(
                              expert.rating_avg,
                            )}`}
                            fill="currentColor"
                          />
                          <span
                            className={`text-xs font-semibold ${getRatingColor(
                              expert.rating_avg,
                            )}`}
                          >
                            {expert.rating_avg?.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          ({expert.rating_count})
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            expertActiveStatus[expert.id]
                              ? "bg-green-500"
                              : "bg-gray-400"
                          } ${
                            updatingExpertId === expert.id
                              ? "animate-pulse"
                              : ""
                          }`}
                        />
                        <Switch
                          checked={expertActiveStatus[expert.id] || false}
                          onCheckedChange={(checked) =>
                            toggleStatus(expert.id, checked)
                          }
                          disabled={updatingExpertId === expert.id}
                          className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
                        />
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-center px-2">
                      <TableActions
                        onView={() =>
                          router.push(`/admin/experts/${expert.id}`)
                        }
                        onEdit={() => {}}
                        onDelete={() => {
                          setExpertToDelete(expert.id);
                          setDeleteDialogOpen(true);
                        }}
                      />
                      <Dialog
                        open={deleteDialogOpen && expertToDelete === expert.id}
                        onOpenChange={(open) => {
                          setDeleteDialogOpen(open);
                          if (!open) setExpertToDelete(null);
                        }}
                      >
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-red-600">
                              <AlertTriangle className="h-5 w-5" />
                              Delete Expert
                            </DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this expert? This
                              action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                              <p className="font-medium text-gray-900">
                                {expert.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {expert.email} &bull;{" "}
                                {expert.specializations.join(", ") ||
                                  "No specializations"}
                              </p>
                            </div>
                          </div>
                          <DialogFooter className="sm:justify-end">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setDeleteDialogOpen(false);
                                setExpertToDelete(null);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteExpert(expert.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
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
      )}

      {/* Pagination */}
      {!isLoading && !isError && totalPages > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Items per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show</span>
            <Select
              value={itemsPerPage.toString()}
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

          {/* Pagination info */}
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, totalExperts)} of{" "}
            {totalExperts}
          </div>

          {/* Page navigation */}
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

      {/* Add Expert Modal */}
      {/* <AddExpertModal
        isOpen={addExpertModalOpen}
        onClose={() => setAddExpertModalOpen(false)}
      /> */}
    </div>
  );
}
