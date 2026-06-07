"use client";
import React from "react";
import { SearchInput } from "@/components/shared/SearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocationsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  cities: string[];
  cityFilter: string;
  onCityChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  children?: React.ReactNode;
}

export function LocationsFilters({
  searchQuery,
  onSearchChange,
  cities,
  cityFilter,
  onCityChange,
  statusFilter,
  onStatusChange,
  children,
}: LocationsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap sm:items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search for area"
        />

        <Select value={cityFilter} onValueChange={onCityChange}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {children && (
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {children}
        </div>
      )}
    </div>
  );
}
