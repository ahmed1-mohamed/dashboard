import React from "react";
import { SearchInput } from "@/components/shared/SearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropertiesFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  countryId: string;
  onCountryChange: (value: string) => void;
  developerId: string;
  onDeveloperChange: (value: string) => void;
  projectId: string;
  onProjectChange: (value: string) => void;
}

export function PropertiesFilters({
  searchQuery,
  onSearchChange,
  countryId,
  onCountryChange,
  developerId,
  onDeveloperChange,
  projectId,
  onProjectChange,
}: PropertiesFiltersProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search for properties"
      />

      <Select value={countryId} onValueChange={onCountryChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Countries</SelectItem>
          {/* Add dynamic country options here */}
        </SelectContent>
      </Select>

      <Select value={developerId} onValueChange={onDeveloperChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Developer" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Developers</SelectItem>
          {/* Add dynamic developer options here */}
        </SelectContent>
      </Select>

      <Select value={projectId} onValueChange={onProjectChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          {/* Add dynamic project options here */}
        </SelectContent>
      </Select>

      <Select defaultValue="all">
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="All Filters" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Filters</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
