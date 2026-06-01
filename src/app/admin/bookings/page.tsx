"use client";

import { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useDashboardAdminBookingsData from "@/hooks/use-dashboardAdminBookings";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  Search,
  Download,
  Settings2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

interface Booking {
  id: number;
  bookingNumber: string;
  user_name: string;
  project_name: string;
  country: string;
  createdDate: string;
  expiry_date: string;
  types: string;
  last_status: string;
}

interface ApiReservation {
  reservation_id: number;
  last_status: string;
  created_at: string;
  expiry_date?: string;
  user_name: string;
  property?: {
    property_type?: {
      property_type_name: string;
    };
  };
  project_name: string;
  country: string;
}

interface BookingsPageProps {
  initialPage?: number;
  itemsPerPage?: number;
}

export default function BookingsPage({
  initialPage = 1,
  itemsPerPage = 10,
}: BookingsPageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [expiryDateFilter, setExpiryDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedBookings, setSelectedBookings] = useState<number[]>([]);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch bookings data using custom hook
  const { bookingsData, handleConfirm, handleDecline, isConfirming, isDeclining } = useDashboardAdminBookingsData();

  const { data, isLoading, isError, error, isFetching, refetch } = bookingsData;

  // Debug: inspect raw response
  useEffect(() => {
    if (data) {
      console.log("Bookings Data type:", typeof data);
      console.log("Bookings Data keys:", Object.keys(data as object));
      console.log("Bookings Data value:", data);
    }
  }, [data]);

  // Map API data to component interface
  const rawData = data as any;
  let itemsArray: any[] = [];
  if (Array.isArray(rawData)) {
    itemsArray = rawData;
  } else if (rawData && Array.isArray(rawData.data)) {
    itemsArray = rawData.data;
  }

  const bookings: Booking[] = itemsArray.map((booking: ApiReservation) => ({
    id: booking.reservation_id,
    bookingNumber: `BK-${booking.reservation_id}`,
    user_name: booking.user_name || "N/A",
    project_name: booking.project_name || "N/A",
    country: booking.country || "N/A",
    createdDate: booking.created_at
      ? new Date(booking.created_at).toISOString().split("T")[0]
      : "N/A",
    expiry_date: booking.expiry_date
      ? new Date(booking.expiry_date).toISOString().split("T")[0]
      : "N/A",
    types: booking.property?.property_type?.property_type_name || "N/A",
    last_status: booking.last_status,
  }));

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.project_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry =
      countryFilter === "all" || booking.country === countryFilter;
    const matchesStatus =
      statusFilter === "all" || booking.last_status === statusFilter;
    const matchesType = typeFilter === "all" || booking.types === typeFilter;
    const matchesExpiryDate =
      expiryDateFilter === "all" ||
      (expiryDateFilter === "expired" &&
        booking.expiry_date !== "N/A" &&
        new Date(booking.expiry_date) < new Date()) ||
      (expiryDateFilter === "active" &&
        booking.expiry_date !== "N/A" &&
        new Date(booking.expiry_date) >= new Date()) ||
      (expiryDateFilter === "no_expiry" && booking.expiry_date === "N/A");

    return (
      matchesSearch &&
      matchesCountry &&
      matchesStatus &&
      matchesType &&
      matchesExpiryDate
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

  // Handle page changes
  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages],
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedBookings(paginatedBookings.map((b) => b.id));
      } else {
        setSelectedBookings([]);
      }
    },
    [paginatedBookings],
  );

  const handleSelectBooking = useCallback(
    (id: number, checked: boolean) => {
      if (checked) {
        setSelectedBookings([...selectedBookings, id]);
      } else {
        setSelectedBookings(selectedBookings.filter((bid) => bid !== id));
      }
    },
    [selectedBookings],
  );

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

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
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-700 border-purple-200 rounded-full px-2"
          >
            {bookings.length}
          </Badge>
        </div>
      </div>

      {/* Debug panel (development only) */}
      {/* {process.env.NODE_ENV === "development" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm font-mono text-yellow-800">
            <strong>Debug Info:</strong>
            <br />
            rawData keys: {JSON.stringify(Object.keys((data as any) || {}))}
            <br />
            bookings length: {bookings.length}
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
              {error instanceof Error ? error.message : "Failed to load bookings"}
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
                  placeholder="Search for bookings"
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
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Sales Offer">Sales Offer</SelectItem>
                  <SelectItem value="Down Payment">Down Payment</SelectItem>
                  <SelectItem value="Sales Agreement">Sales Agreement</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="1 Bedroom Apartment">1 Bedroom</SelectItem>
                  <SelectItem value="2 Bedroom Apartment">2 Bedroom</SelectItem>
                  <SelectItem value="3 Bedroom Apartment">3 Bedroom</SelectItem>
                  <SelectItem value="Penthouse">Penthouse</SelectItem>
                </SelectContent>
              </Select>

              {/* Expiry Date Filter */}
              <Select value={expiryDateFilter} onValueChange={setExpiryDateFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Expiry Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Expiry Dates</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="no_expiry">No Expiry Date</SelectItem>
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
                        paginatedBookings.length > 0 &&
                        selectedBookings.length === paginatedBookings.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
                    Booking Number
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[110px] px-2 text-sm">
                    Client Name
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[110px] px-2 text-sm">
                    Project
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[70px] px-2 text-sm">
                    Country
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
                    Created Date
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
                    Expiry Date
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[130px] px-2 text-sm">
                    Types
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 w-[120px] px-2 text-sm">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center w-[50px] px-2 text-sm">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBookings.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="h-24 text-center text-gray-500"
                    >
                      No bookings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="px-2">
                        <Checkbox
                          checked={selectedBookings.includes(booking.id)}
                          onCheckedChange={(checked) =>
                            handleSelectBooking(booking.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-teal-600 font-medium px-2 text-sm">
                        {booking.bookingNumber}
                      </TableCell>
                      <TableCell className="text-gray-900 px-2 text-sm truncate">
                        {booking.user_name}
                      </TableCell>
                      <TableCell className="text-gray-900 px-2 text-sm truncate">
                        {booking.project_name}
                      </TableCell>
                      <TableCell className="text-gray-900 px-2 text-sm">
                        {booking.country}
                      </TableCell>
                      <TableCell className="text-gray-900 px-2 text-sm">
                        {booking.createdDate}
                      </TableCell>
                      <TableCell className="text-gray-900 px-2 text-sm">
                        {booking.expiry_date}
                      </TableCell>
                      <TableCell className="text-gray-900 px-2 text-sm truncate">
                        {booking.types}
                      </TableCell>
                      <TableCell className="px-2">
                        <Badge
                          variant="outline"
                          className={`bg-gray-100 text-gray-700 border-gray-200 text-[10px] px-2 py-0.5`}
                        >
                          {booking.last_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center px-2">
                        <TableActions
                          onView={() =>
                            router.push(`/admin/bookings/${booking.id}`)
                          }
                          onEdit={() =>
                            router.push(`/admin/bookings/${booking.id}`)
                          }
                          onDelete={() => console.log("Delete", booking.id)}
                        />
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
                Showing {startIndex + 1}-{Math.min(endIndex, filteredBookings.length)} of {filteredBookings.length}
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
                  typeof page === "number" ? (
                    <Button
                      key={index}
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
                  ) : (
                    <span key={index} className="px-2 text-gray-400">
                      {page}
                    </span>
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
    </div>
  );
}
