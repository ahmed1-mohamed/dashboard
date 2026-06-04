"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, RefreshCw, Calendar } from "lucide-react";

interface DashboardHeaderProps {
  dateRange: string;
  setDateRange: (val: string) => void;
  onExport: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function DashboardHeader({
  dateRange,
  setDateRange,
  onExport,
  onRefresh,
  isRefreshing = false,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard overview
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track progress across all sales stages
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          className="gap-2 border-gray-200"
          onClick={onExport}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button
          variant="outline"
          className="gap-2 border-gray-200 transition-all hover:bg-gray-50 active:scale-95"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Dec 31 - Jan 31">Dec 31 - Jan 31</SelectItem>
            <SelectItem value="Last 7 days">Last 7 days</SelectItem>
            <SelectItem value="Last 30 days">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
