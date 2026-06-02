import React from "react";
import { SearchInput } from "@/components/shared/SearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  projectTypeFilter: string;
  onProjectTypeChange: (value: string) => void;
}

export function ProjectsFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  projectTypeFilter,
  onProjectTypeChange,
}: ProjectsFiltersProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search for projects..."
      />

      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="under construction">Under Construction</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="planned">Planned</SelectItem>
        </SelectContent>
      </Select>

      <Select value={projectTypeFilter} onValueChange={onProjectTypeChange}>
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="residential">Residential</SelectItem>
          <SelectItem value="mixed use">Mixed Use</SelectItem>
          <SelectItem value="commercial">Commercial</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
