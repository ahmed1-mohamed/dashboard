import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FeaturesFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  children?: React.ReactNode;
}

export function FeaturesFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  children,
}: FeaturesFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
        <div className="relative w-full min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search for feature"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200 h-9"
          />
        </div>

        <Select defaultValue="all">
          <SelectTrigger className="w-[140px] bg-white border-gray-200 h-9 text-gray-600">
            <SelectValue placeholder="Cities" />
          </SelectTrigger>
          <SelectContent>
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                <Input placeholder="Search" className="pl-7 h-8 text-xs border-gray-200" />
              </div>
            </div>
            <SelectItem value="all">All Cities</SelectItem>
            <SelectItem value="city1">City 1</SelectItem>
            <SelectItem value="city12">City 12</SelectItem>
            <SelectItem value="city3">City 3</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] bg-white border-gray-200 h-9 text-gray-600">
            <SelectValue placeholder="status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
