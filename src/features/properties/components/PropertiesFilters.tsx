import React from "react";
import { SearchInput } from "@/components/shared/SearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePropertyTypes } from "@/hooks/use-property-data";

interface PropertiesFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

export function PropertiesFilters({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeChange,
  statusFilter,
  onStatusChange,
}: PropertiesFiltersProps) {
  const { data: propertiesType = [] } = usePropertyTypes();

  return (
    <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search for properties"
      />

      <Select value={typeFilter} onValueChange={onTypeChange}>
        <SelectTrigger className="w-[150px] max-sm:w-full">
          <SelectValue placeholder="Property Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {propertiesType.map((type: any) => (
            <SelectItem key={type.id} value={String(type.id)}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[150px] max-sm:w-full">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="Available">Available</SelectItem>
          <SelectItem value="Reserved">Reserved</SelectItem>
          <SelectItem value="Sold">Sold</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
