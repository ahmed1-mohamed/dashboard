
"use client";

import { DashboardExpertService } from "@/services/DashboardExpertService";
import { useQuery } from "@tanstack/react-query";

export function usePackages(expertId?: number) {
    return useQuery({
        queryKey: ["packages", expertId],
        queryFn: () => {
            if (!expertId) throw new Error("expertId is required");
            return DashboardExpertService.getAllPackages(expertId);
        },
        enabled: !!expertId,
        retry: false,
    });
}
