
"use client";

import { DashboardExpertService } from "@/services/DashboardExpertService";
import { useQuery } from "@tanstack/react-query";

export function useReview(expertId: number) {
    return useQuery({
        queryKey: ["ReviewsData", expertId],
        queryFn: () => DashboardExpertService.getReviews(expertId),
        retry: false,
    });
}
