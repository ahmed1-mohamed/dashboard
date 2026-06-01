"use client";

import { DashboardExpertService } from "@/services/DashboardExpertService";
import { BookingStats } from "@/types/expertDashboard/bookings";
import { useQuery } from "@tanstack/react-query";

export function useBookings({ page, per_page, status, search }: { page: number; per_page: number; status?: BookingStats; search?: string }) {
    return useQuery({
        queryKey: ["BookingsData", { page, per_page, status, search }],
        queryFn: () => DashboardExpertService.getBookings({ page, per_page, status, search }),
        retry: false,
    });
}
