"use client";

import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import useDashboardAdminBookingsData from "@/hooks/use-dashboardAdminBookings";
import { useSession } from "next-auth/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Download,
  Settings2,
  AlertCircle,
} from "lucide-react";

import { ReservationTable } from "@/features/reservations/components/ReservationTable";
import { ReservationFilters } from "@/features/reservations/components/ReservationFilters";
import { ReservationPagination } from "@/features/reservations/components/ReservationPagination";
import { Booking, ApiReservation } from "@/features/reservations/types";
import { TableSettings } from "@/components/table/table-settings";
import { useTableSettings } from "@/hooks/use-table-settings";

interface BookingsPageProps {
  initialPage?: number;
  itemsPerPage?: number;
}

export default function BookingsPage(props: BookingsPageProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <BookingsPageContent {...props} />
    </Suspense>
  );
}

function BookingsPageContent({
  initialPage = 1,
  itemsPerPage = 10,
}: BookingsPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // Filter state initialized from URL
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") || "");
  const [countryFilter, setCountryFilter] = useState(() => searchParams.get("country") || "all");
  const [statusFilter, setStatusFilter] = useState(() => searchParams.get("status") || "all");
  const [typeFilter, setTypeFilter] = useState(() => searchParams.get("type") || "all");
  const [expiryDateFilter, setExpiryDateFilter] = useState(() => searchParams.get("expiryDate") || "all");
  const [currentPage, setCurrentPage] = useState(() => {
    const p = searchParams.get("page");
    return p ? Number(p) : initialPage;
  });

  const DEFAULT_COLUMNS = [
    { id: "number", label: "Reservation Number", visible: true },
    { id: "client", label: "Client Name", visible: true },
    { id: "project", label: "Project", visible: true },
    { id: "country", label: "Country", visible: true },
    { id: "reservationDate", label: "Reservation Date", visible: true },
    { id: "expiryDate", label: "Expiry Date", visible: true },
    { id: "status", label: "Status", visible: true },
    { id: "actions", label: "Actions", visible: true },
  ];

  const tableSettings = useTableSettings("reservations", DEFAULT_COLUMNS);

  const [itemsPerPageState, setItemsPerPage] = useState(tableSettings.settings.itemsPerPage);

  useEffect(() => {
    setItemsPerPage(tableSettings.settings.itemsPerPage);
  }, [tableSettings.settings.itemsPerPage]);

  const [selectedBookings, setSelectedBookings] = useState<number[]>([]);

  const isInitialMount = useRef(true);

  // Sync state to URL
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (currentPage !== initialPage) params.set("page", currentPage.toString());
    else params.delete("page");

    if (searchQuery) params.set("search", searchQuery);
    else params.delete("search");

    if (countryFilter && countryFilter !== "all") params.set("country", countryFilter);
    else params.delete("country");

    if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);
    else params.delete("status");

    if (typeFilter && typeFilter !== "all") params.set("type", typeFilter);
    else params.delete("type");

    if (expiryDateFilter && expiryDateFilter !== "all") params.set("expiryDate", expiryDateFilter);
    else params.delete("expiryDate");

    const newQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (newQuery !== currentQuery) {
      router.replace(`${pathname}?${newQuery}`, { scroll: false });
    }
  }, [currentPage, searchQuery, countryFilter, statusFilter, typeFilter, expiryDateFilter, pathname, router, searchParams]);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to page 1 on search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch bookings data using custom hook with all filters
  const {
    bookingsData,
    bookings,
    totalBookings,
    handleConfirm,
    handleDecline,
    isConfirming,
    isDeclining,
  } = useDashboardAdminBookingsData({
    page: currentPage,
    perPage: itemsPerPageState,
    search: debouncedSearch,
    country: countryFilter,
    status: statusFilter,
    type: typeFilter,
    expiryDate: expiryDateFilter,
  });

  const { isLoading, isError, error, isFetching, refetch } = bookingsData;

  // Pagination using server-side total
  const totalPages = Math.ceil(Number(totalBookings) / itemsPerPageState);
  const startIndex = (currentPage - 1) * itemsPerPageState;
  const endIndex = startIndex + itemsPerPageState;
  const paginatedBookings = bookings; // Already paginated by server

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
        setSelectedBookings(bookings.map((b) => b.id));
      } else {
        setSelectedBookings([]);
      }
    },
    [bookings],
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
          <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-700 border-purple-200 rounded-full px-2"
          >
            {totalBookings}
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
              {error instanceof Error
                ? error.message
                : "Failed to load reservations"}
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
          <div className="flex flex-col gap-4 mb-4">
            <ReservationFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              countryFilter={countryFilter}
              onCountryChange={setCountryFilter}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              typeFilter={typeFilter}
              onTypeChange={setTypeFilter}
              expiryDateFilter={expiryDateFilter}
              onExpiryDateChange={setExpiryDateFilter}
            >
              <TableSettings 
                settings={tableSettings} 
                onExportExcel={() => console.log("Exporting excel...")} 
                onExportCsv={() => console.log("Exporting csv...")} 
              />
            </ReservationFilters>
          </div>

          <ReservationTable
            settings={tableSettings}
            bookings={bookings}
            selectedBookings={selectedBookings}
            onSelectAll={handleSelectAll}
            onSelectBooking={handleSelectBooking}
          />

          <div className="mt-4">
            <ReservationPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalBookings}
              itemsPerPage={itemsPerPageState}
              onPageChange={handlePageChange}
              isFetching={isFetching}
            />
          </div>
        </>
      )}
    </div>
  );
}
