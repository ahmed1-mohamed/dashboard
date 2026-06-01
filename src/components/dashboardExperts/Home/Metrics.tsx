'use client';

import { useMetrics } from "@/hooks/dashboardExpert/useMetrics";
import { Calendar, CheckSquare, DollarSign, Star } from "lucide-react";
import MetricCard from "./MetricCard";
import { formatDate } from "@/utlis/format";

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 animate-pulse">
            <div className="h-4 w-32 bg-gray-100 rounded" />
            <div className="h-8 w-20 bg-gray-100 rounded" />
            <div className="h-4 w-40 bg-gray-100 rounded" />
        </div>
    );
}

export default function Metrics() {
    const { data, isLoading, isError } = useMetrics();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
                {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="my-6 text-center text-sm text-red-400 py-6">
                Failed to load metrics.
            </div>
        );
    }

    const { upcoming_sessions, completed_sessions, monthly_earnings, rating } = data?.data?.data;

    const nextSession = upcoming_sessions?.next_session
        ? formatDate(upcoming_sessions.next_session)
        : "No upcoming sessions";

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
            <MetricCard
                icon={Calendar}
                label="Upcoming Sessions"
                value={upcoming_sessions?.total ?? 0}
                trend={upcoming_sessions?.trend ?? "up"}
                growth={`${upcoming_sessions?.growth ?? 0}%`}
                subLabel={`Next: ${nextSession}`}
            />
            <MetricCard
                icon={CheckSquare}
                label="Completed Sessions"
                value={completed_sessions?.total ?? 0}
                trend={completed_sessions?.trend ?? "up"}
                growth={`${completed_sessions?.growth ?? 0}`}
                subLabel={`This month: ${completed_sessions?.this_month ?? 0} sessions`}
            />
            <MetricCard
                icon={DollarSign}
                label="Monthly Earnings"
                value={monthly_earnings?.previous_period ?? 0}
                trend={monthly_earnings?.trend ?? "up"}
                growth={`${monthly_earnings?.growth ?? 0}%`}
                subLabel={`Last month: AED ${monthly_earnings?.last_month ?? 0}`}
            />
            <MetricCard
                icon={Star}
                label="Average Rating"
                value={rating?.average?.toFixed(1) ?? "—"}
                trend="up"
                growth="—"
                subLabel={`Based on ${rating?.total_reviews ?? 0} reviews`}
            />
        </div>
    );
}