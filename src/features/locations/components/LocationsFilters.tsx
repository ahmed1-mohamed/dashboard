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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Table, Settings2 } from "lucide-react";

interface LocationsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  cities: string[];
  cityFilter: string;
  onCityChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
}

export function LocationsFilters({
  searchQuery,
  onSearchChange,
  cities,
  cityFilter,
  onCityChange,
  statusFilter,
  onStatusChange,
  onExportPDF,
  onExportExcel,
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

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 border-gray-200 flex-1 sm:flex-none">
              <Download className="h-4 w-4" /> Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExportPDF} className="gap-2 cursor-pointer">
              <FileText className="h-4 w-4 text-red-500" /> Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportExcel} className="gap-2 cursor-pointer">
              <Table className="h-4 w-4 text-green-600" /> Export as Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" className="gap-2 border-gray-200">
          <Settings2 className="h-4 w-4" /> Table settings
        </Button>
      </div>
    </div>
  );
}
