"use client";

import { DashboardExpertService } from "@/services/DashboardExpertService";
import { TransactionStatus } from "@/types/expertDashboard/transctions";
import { useQuery } from "@tanstack/react-query";

export function useTransactions(params?: {
    page?: number;
    per_page?: number;
    status?: TransactionStatus;
    search?: string;
}) {
    return useQuery({
        queryKey: ["TransactionsData", params],
        queryFn: () => DashboardExpertService.getMyTransactions(params),
        retry: false,
    });
}
