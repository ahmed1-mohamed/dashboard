import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface AreasFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  children?: React.ReactNode;
}

export function AreasFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  children,
}: AreasFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 w-full">
      <div className="flex flex-wrap items-center gap-2 flex-1">
        <div className="relative w-full sm:w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search for area"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white border-gray-200 h-10 w-full"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[130px] h-10 bg-white border-gray-200">
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
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {children}
        </div>
      )}
    </div>
  );
}
