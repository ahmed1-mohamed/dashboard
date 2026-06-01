"use client";

import { DashboardExpertService } from "@/services/DashboardExpertService";
import { useQuery } from "@tanstack/react-query";

export function useExceptions(expertId?: number) {
    return useQuery({
        queryKey: ["exceptions", expertId],
        queryFn: () => {
            if (!expertId) throw new Error("expertId is required");
            return DashboardExpertService.getAvailabilityException(expertId);
        },
        enabled: !!expertId,
        retry: false,
    });
}

