import React from "react";
import { SearchInput } from "@/components/shared/SearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UsersFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  roleFilter: string;
  onRoleChange: (value: string) => void;
}

export function UsersFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  roleFilter,
  onRoleChange,
}: UsersFiltersProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search for users"
      />

      <Select value={roleFilter} onValueChange={onRoleChange}>
        <SelectTrigger className="w-[120px] max-sm:w-full">
          <SelectValue placeholder="User Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="Super Admin">Super Admin</SelectItem>
          <SelectItem value="Admin">Admin</SelectItem>
          <SelectItem value="Agent">Agent</SelectItem>
          <SelectItem value="Manager">Manager</SelectItem>
          <SelectItem value="Viewer">Viewer</SelectItem>
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[120px] max-sm:w-full">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Inactive">Inactive</SelectItem>
          <SelectItem value="Suspended">Suspended</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
