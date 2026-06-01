"use client";

export const dynamic = "force-dynamic";

import { useState, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
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
import {
  Search,
  Download,
  Settings2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import useDashboardAdminMeetingsData from "@/hooks/use-dashboardAdminMeetingsData";
import { ViewMeetingModal } from "@/components/modals/view-meeting-modal";
import { MeetingRequestsDataType } from "@/types";

interface MeetingRequest {
  id: number;
  clientName: string;
  clientAvatar: string;
  relatedTo: string;
  email: string;
  preferredDate: string;
  requestDate: string;
  status: "Pending" | "Approved" | "Rejected" | "Active";
}

const avatarColors = [
  "bg-pink-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-indigo-500",
  "bg-red-500",
  "bg-cyan-500",
  "bg-orange-500",
  "bg-teal-500",
];

const statusDotColors = {
  Pending: "bg-yellow-500",
  Approved: "bg-green-500",
  Rejected: "bg-red-500",
  Active: "bg-green-500",
};

export default function MeetingRequestsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [userIdToView, setUserIdToView] = useState<number | null>(null);

  // Build filters object
  const filters = useMemo(
    () => ({
      country: countryFilter,
      status: statusFilter,
      search: searchQuery,
    }),
    [countryFilter, statusFilter, searchQuery],
  );

  // Fetch meeting requests using custom hook
  const { meetingsData, confirmMeetingMutation, cancelMeetingMutation } =
    useDashboardAdminMeetingsData(currentPage, perPage, filters);

  const { data, isLoading, isError, error } = meetingsData;
  console.log("API Response Data:", data);

  // Map API data to UI format
  const meetingRequests: MeetingRequest[] = useMemo(() => {
    const rawData = data as { data?: any } | undefined;
    console.log("Raw API Data:", rawData);
    let itemsArray: any[] = rawData?.data?.data || [];

    return itemsArray.map((item) => ({
      id: item.id,
      clientName: item.user
        ? `${item.user.first_name} ${item.user.last_name}`
        : "Unknown Client",
      clientAvatar: item.user
        ? `${item.user.first_name.charAt(0)}${item.user.last_name.charAt(0)}`
        : "??",
      relatedTo: "Meeting Request",
      email: item.user?.email || "N/A",
      preferredDate: item.date || "N/A",
      requestDate: item.created_at || "N/A",
      status: (item.status.charAt(0).toUpperCase() + item.status.slice(1)) as
        | "Pending"
        | "Approved"
        | "Rejected"
        | "Active",
    }));
  }, [data]);

  // Get user_id for view modal
  const meetingRequestsWithUser = useMemo(() => {
    const rawData = data as
      | { data?: Array<MeetingRequestsDataType & { user_id?: number }> }
      | Array<MeetingRequestsDataType & { user_id?: number }>
      | undefined;

    let itemsArray: Array<MeetingRequestsDataType & { user_id?: number }> = [];

    if (Array.isArray(rawData)) {
      itemsArray = rawData;
    } else if (rawData && Array.isArray((rawData as any).data)) {
      itemsArray = (rawData as any).data;
    }

    return itemsArray;
  }, [data]);

  // Totals and pagination
  const rawDataForTotal = (data as any)?.toatal || (data as any)?.data?.total;
  const total = rawDataForTotal || 0;

  const totalPages = Math.ceil(total / perPage);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = Math.min(10, totalPages);

    for (let i = 1; i <= maxVisible; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handlePerPageChange = (value: string) => {
    setPerPage(Number(value));
    setCurrentPage(1);
  };

  const getAvatarColor = (index: number) => {
    return avatarColors[index % avatarColors.length];
  };

  // Handle approving a meeting request
  const handleApprove = useCallback(
    (id: number) => {
      confirmMeetingMutation.mutate(id);
    },
    [confirmMeetingMutation],
  );

  // Handle rejecting/canceling a meeting request
  const handleReject = useCallback(
    (id: number) => {
      cancelMeetingMutation.mutate(id);
    },
    [cancelMeetingMutation],
  );

  return (
    <div className="p-4 px-3 space-y-4 max-w-full overflow-hidden">
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-600">
              Loading meeting requests...
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            <strong>Error:</strong> {(error as Error)?.message}
          </p>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && !isError && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Meeting Requests
              </h1>
              <Badge
                variant="outline"
                className="bg-purple-100 text-purple-700 border-purple-200 rounded-full px-2"
              >
                {total}
              </Badge>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
              {/* Search */}
              <div className="relative w-full min-w-[200px] max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for Client"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-200"
                />
              </div>

              {/* Country Filter */}
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

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
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
                  <TableHead className="font-semibold text-gray-900 w-[130px] px-2 text-sm">
                    Client
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
                    Related To
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[120px] px-2 text-sm">
                    Email
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[90px] px-2 text-sm">
                    Pref. Date
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[110px] px-2 text-sm">
                    Request Date
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[80px] px-2 text-sm">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[120px] px-2 text-sm">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meetingRequests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-gray-500"
                    >
                      No meeting requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  meetingRequests.map((request, index) => {
                    const originalItem = meetingRequestsWithUser[index];
                    return (
                      <TableRow key={request.id}>
                        <TableCell className="px-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-8 w-8 rounded-full ${getAvatarColor(
                                index,
                              )} flex items-center justify-center flex-shrink-0`}
                            >
                              <span className="text-white text-[10px] font-medium">
                                {request.clientAvatar}
                              </span>
                            </div>
                            <span className="text-gray-900 text-xs font-medium truncate">
                              {request.clientName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-teal-600 px-2 text-xs truncate">
                          {request.relatedTo}
                        </TableCell>
                        <TableCell className="text-gray-900 px-2 text-xs truncate">
                          {request.email}
                        </TableCell>
                        <TableCell className="text-gray-900 px-2 text-xs">
                          {request.preferredDate}
                        </TableCell>
                        <TableCell className="text-gray-900 px-2 text-xs">
                          {request.requestDate}
                        </TableCell>
                        <TableCell className="px-2">
                          <div className="flex items-center gap-1.5">
                            <Circle
                              className={`h-2 w-2 ${
                                statusDotColors[request.status]
                              } fill-current flex-shrink-0`}
                            />
                            <span className="text-gray-900 text-xs truncate">
                              {request.status}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-2">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-1.5 text-teal-600 hover:text-teal-700 hover:bg-teal-50 text-[10px]"
                              onClick={() => {
                                if (originalItem?.user_id) {
                                  setUserIdToView(originalItem.user_id);
                                  setViewModalOpen(true);
                                }
                              }}
                              title="View User"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            {request.status === "Active" ? (
                              <span className="text-xs font-medium text-green-600">
                                Active
                              </span>
                            ) : (
                              <div className="flex items-center gap-0.5">
                                {request.status === "Pending" && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 px-1.5 bg-teal-600 text-white hover:bg-teal-700 text-[10px]"
                                      onClick={() => handleApprove(request.id)}
                                      disabled={
                                        confirmMeetingMutation.isPending
                                      }
                                    >
                                      <Circle className="h-1.5 w-1.5 fill-current mr-0.5" />
                                      Approve
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 px-1.5 bg-red-500 text-white hover:bg-red-600 text-[10px]"
                                      onClick={() => handleReject(request.id)}
                                      disabled={cancelMeetingMutation.isPending}
                                    >
                                      <Circle className="h-1.5 w-1.5 fill-current mr-0.5" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Show</span>
              <Select
                value={perPage.toString()}
                onValueChange={handlePerPageChange}
              >
                <SelectTrigger className="w-[80px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-500">of {total} entries</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 border-gray-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {getPageNumbers().map((page, index) => (
                <Button
                  key={index}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                  className={
                    currentPage === page
                      ? "h-8 w-8 bg-gray-900 hover:bg-gray-800 text-white"
                      : "h-8 w-8 border-gray-200"
                  }
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="h-8 w-8 border-gray-200"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* View Meeting Modal */}
      {/* <ViewMeetingModal
        meetingId={userIdToView}
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setUserIdToView(null);
        }}
      /> */}
    </div>
  );
}
