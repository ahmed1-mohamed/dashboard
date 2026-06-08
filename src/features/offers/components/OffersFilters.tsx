"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OffersFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
}

export function OffersFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: OffersFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 flex-1">
      <div className="relative flex-1 min-w-[300px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search offers by title or description..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 border-gray-200 focus-visible:ring-teal-500 w-full bg-white shadow-sm"
        />
      </div>

      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[140px] border-gray-200 bg-white shadow-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="ended">Ended</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
