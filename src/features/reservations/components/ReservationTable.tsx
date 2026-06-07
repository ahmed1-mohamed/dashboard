import React, { memo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { TableActions } from "@/components/table/table-actions";
import { Booking } from "../types";
import { useRouter } from "next/navigation";
import { useTableSettings } from "@/hooks/use-table-settings";

interface ReservationTableProps {
  settings: ReturnType<typeof useTableSettings>;
  bookings: Booking[];
  selectedBookings: number[];
  onSelectAll: (checked: boolean) => void;
  onSelectBooking: (id: number, checked: boolean) => void;
}

export const ReservationTable = memo(function ReservationTable({
  settings,
  bookings,
  selectedBookings,
  onSelectAll,
  onSelectBooking,
}: ReservationTableProps) {
  const router = useRouter();

  const getDensityClass = () => {
    switch (settings.settings.density) {
      case "compact": return "py-1.5 px-2";
      case "spacious": return "py-4 px-2";
      case "comfortable":
      default: return "py-2.5 px-2";
    }
  };

  const densityClass = getDensityClass();

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden overflow-x-auto w-full">
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="w-[35px] px-2">
              <Checkbox
                checked={
                  bookings.length > 0 &&
                  selectedBookings.length === bookings.length
                }
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            {settings.isColumnVisible("number") && (
              <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">Reservation Number</TableHead>
            )}
            {settings.isColumnVisible("client") && (
              <TableHead className="font-semibold text-gray-900 w-[110px] px-2 text-sm">Client Name</TableHead>
            )}
            {settings.isColumnVisible("project") && (
              <TableHead className="font-semibold text-gray-900 w-[110px] px-2 text-sm">Project</TableHead>
            )}
            {settings.isColumnVisible("country") && (
              <TableHead className="font-semibold text-gray-900 w-[70px] px-2 text-sm">Country</TableHead>
            )}
            {settings.isColumnVisible("reservationDate") && (
              <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">Reservation Date</TableHead>
            )}
            {settings.isColumnVisible("expiryDate") && (
              <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">Expiry Date</TableHead>
            )}
            {settings.isColumnVisible("status") && (
              <TableHead className="font-semibold text-gray-900 w-[130px] px-2 text-sm">Status</TableHead>
            )}
            {settings.isColumnVisible("actions") && (
              <TableHead className="font-semibold text-gray-900 text-center w-[50px] px-2 text-sm">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="h-24 text-center text-gray-500"
              >
                No reservations found.
              </TableCell>
            </TableRow>
          ) : (
            bookings.map((booking) => (
              <TableRow
                key={booking.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => router.push(`/admin/reservations/${booking.id}`)}
              >
                <TableCell className={densityClass} onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedBookings.includes(booking.id)}
                    onCheckedChange={(checked) =>
                      onSelectBooking(booking.id, checked as boolean)
                    }
                  />
                </TableCell>
                {settings.isColumnVisible("number") && (
                  <TableCell className={`text-teal-600 font-medium text-sm ${densityClass}`}>
                    {booking.bookingNumber}
                  </TableCell>
                )}
                {settings.isColumnVisible("client") && (
                  <TableCell className={`text-gray-900 text-sm truncate max-w-[120px] ${densityClass}`}>
                    {booking.user_name}
                  </TableCell>
                )}
                {settings.isColumnVisible("project") && (
                  <TableCell className={`text-gray-900 text-sm truncate max-w-[120px] ${densityClass}`}>
                    {booking.project_name}
                  </TableCell>
                )}
                {settings.isColumnVisible("country") && (
                  <TableCell className={`text-gray-900 text-sm ${densityClass}`}>
                    {booking.country}
                  </TableCell>
                )}
                {settings.isColumnVisible("reservationDate") && (
                  <TableCell className={`text-gray-900 text-sm ${densityClass}`}>
                    {booking.reservation_date}
                  </TableCell>
                )}
                {settings.isColumnVisible("expiryDate") && (
                  <TableCell className={`text-gray-900 text-sm ${densityClass}`}>
                    {booking.expiry_date}
                  </TableCell>
                )}
                {settings.isColumnVisible("status") && (
                  <TableCell className={densityClass}>
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-gray-900 text-sm truncate max-w-[120px]">
                        {booking.reservation_status_type}
                      </span>
                      <Badge
                        variant="outline"
                        className="bg-gray-100 text-gray-700 border-gray-200 text-[10px] px-2 py-0.5"
                      >
                        {booking.last_status}
                      </Badge>
                    </div>
                  </TableCell>
                )}
                {settings.isColumnVisible("actions") && (
                  <TableCell className={`text-center ${densityClass}`} onClick={(e) => e.stopPropagation()}>
                    <TableActions
                      onView={() => router.push(`/admin/reservations/${booking.id}`)}
                      onEdit={() => router.push(`/admin/reservations/${booking.id}`)}
                      onDelete={() => console.log("Delete", booking.id)}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
});
