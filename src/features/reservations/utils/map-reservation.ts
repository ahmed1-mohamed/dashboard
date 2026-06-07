import { Booking, ApiReservation } from "../types";

export function unpackReservationsResponse(data: unknown): { itemsArray: ApiReservation[]; totalItems: number } {
  const itemsArray = (data as any)?.data || [];
  const totalItems = (data as any)?.total || itemsArray.length;
  
  return { itemsArray, totalItems };
}

export function mapReservation(booking: ApiReservation): Booking {
  return {
    id: booking.reservation_id,
    bookingNumber: `BK-${booking.reservation_id}`,
    user_name: booking.user_name || "N/A",
    project_name: booking.project_name || "N/A",
    country: booking.country || "N/A",
    reservation_date: booking.reservation_date
      ? new Date(booking.reservation_date).toISOString().split("T")[0]
      : "N/A",
    expiry_date: booking.expiry_date
      ? new Date(booking.expiry_date).toISOString().split("T")[0]
      : "N/A",
    reservation_status_type: booking.reservation_status_type || "N/A",
    types: booking.property?.property_type?.property_type_name || "N/A",
    last_status: booking.last_status,
  };
}
