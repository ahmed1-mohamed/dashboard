"use client";

import { CiGift } from "react-icons/ci";
import { useMemo } from "react";
import { MousePointerClick, Activity, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OfferTotals } from "@/features/offers/types";

interface OffersStatsCardsProps {
  totals: OfferTotals | null | undefined;
}

export function OffersStatsCards({ totals }: OffersStatsCardsProps) {
  const stats = useMemo(() => {
    if (!totals) return [];
    return [
      {
        title: "Total Offers",
        value: totals.total?.toLocaleString() ?? "0",
        icon: CiGift,
        trendUp: true,
        trend: "+10%",
      },
      {
        title: "Active",
        value: totals.active?.toLocaleString() ?? "0",
        icon: Activity,
        trendUp: true,
        trend: "+2%",
      },
      {
        title: "Total Views",
        value: totals.views?.toLocaleString() ?? "0",
        icon: Eye,
        trendUp: true,
        trend: "+5.6%",
      },
      {
        title: "Total Clicks",
        value: totals.clicks?.toLocaleString() ?? "0",
        icon: MousePointerClick,
        trendUp: true,
        trend: "+8%",
      },
    ];
  }, [totals]);

  if (!totals || stats.length === 0) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 pt-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-500 leading-tight">
                {stat.title}
              </CardTitle>
              <div className={`p-1.5 sm:p-2 rounded-full ${stat.trendUp ? "bg-green-50" : "bg-red-50"} shrink-0`}>
                <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${stat.trendUp ? "text-green-600" : "text-red-600"}`} />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className={`text-xs mt-1 ${stat.trendUp ? "text-green-600" : "text-red-600"}`}>
                {stat.trend} vs last 3 months
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}