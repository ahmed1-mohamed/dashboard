"use client";

import { DashboardExpertService } from "@/services/DashboardExpertService";
import { useQuery } from "@tanstack/react-query";

export function useMetrics() {
    return useQuery({
        queryKey: ["MetricsData"],
        queryFn: () => DashboardExpertService.getMetrics(),
        retry: false,
    });
}
