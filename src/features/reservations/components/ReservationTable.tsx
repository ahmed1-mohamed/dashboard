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

interface ReservationTableProps {
  bookings: Booking[];
  selectedBookings: number[];
  onSelectAll: (checked: boolean) => void;
  onSelectBooking: (id: number, checked: boolean) => void;
}

export const ReservationTable = memo(function ReservationTable({
  bookings,
  selectedBookings,
  onSelectAll,
  onSelectBooking,
}: ReservationTableProps) {
  const router = useRouter();

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
            <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
              Reservation Number
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
              Reservation Date
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
              Expiry Date
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[130px] px-2 text-sm">
              Status
            </TableHead>
            <TableHead className="font-semibold text-gray-900 text-center w-[50px] px-2 text-sm">
              Actions
            </TableHead>
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
                <TableCell className="px-2" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedBookings.includes(booking.id)}
                    onCheckedChange={(checked) =>
                      onSelectBooking(booking.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell className="text-teal-600 font-medium px-2 text-sm">
                  {booking.bookingNumber}
                </TableCell>
                <TableCell className="text-gray-900 px-2 text-sm truncate max-w-[120px]">
                  {booking.user_name}
                </TableCell>
                <TableCell className="text-gray-900 px-2 text-sm truncate max-w-[120px]">
                  {booking.project_name}
                </TableCell>
                <TableCell className="text-gray-900 px-2 text-sm">
                  {booking.country}
                </TableCell>
                <TableCell className="text-gray-900 px-2 text-sm">
                  {booking.reservation_date}
                </TableCell>
                <TableCell className="text-gray-900 px-2 text-sm">
                  {booking.expiry_date}
                </TableCell>
                <TableCell className="px-2">
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
                <TableCell className="text-center px-2" onClick={(e) => e.stopPropagation()}>
                  <TableActions
                    onView={() => router.push(`/admin/reservations/${booking.id}`)}
                    onEdit={() => router.push(`/admin/reservations/${booking.id}`)}
                    onDelete={() => console.log("Delete", booking.id)}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
});
