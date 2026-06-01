'use client';

import { useBookings } from "@/hooks/dashboardExpert/useBookings";
import { Booking } from "@/types/expertDashboard/bookings";
import { BookingCard } from "../Booking/BookingCard";
import { BookingSkeleton } from "../Booking/BookingSkeleton";
import EmptyPage from "../EmptyPage";

export default function Bookings() {

    const { data, isLoading, isError } = useBookings({
        page: 1,
        per_page: 10,
    });

const bookingData: Booking[] = data?.data?.data?.slice(0, 3) ?? [];

    if (isError) {
        return (
            <p className="text-red-500 text-center">
                Failed to load bookings. Please try again later.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {isLoading ? (
                <BookingSkeleton />
            ) : bookingData.length ? (
                bookingData.map((session) => (
                    <BookingCard
                        key={session.booking_id}
                        session={session}
                        className="bg-[#F9FAFB] border border-[#F3F4F6] rounded-2xl shadow-none"
                    />
                ))
            ) : (
                <EmptyPage
                    title="No reservations yet"
                    description="Once you start booking sessions, they will appear here."
                />
            )}
        </div>
    )
}
