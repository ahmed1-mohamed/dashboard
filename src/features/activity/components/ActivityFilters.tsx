import { SearchInput } from "@/components/shared/SearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ActivityFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  actionFilter: string;
  onActionChange: (value: string) => void;
  entityFilter: string;
  onEntityChange: (value: string) => void;
  dateFilter: string;
  onDateChange: (value: string) => void;
}

export function ActivityFilters({
  searchQuery,
  onSearchChange,
  actionFilter,
  onActionChange,
  entityFilter,
  onEntityChange,
  dateFilter,
  onDateChange,
}: ActivityFiltersProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search in log"
      />

      <Select value={actionFilter} onValueChange={onActionChange}>
        <SelectTrigger className="w-[140px] max-sm:w-full bg-white">
          <SelectValue placeholder="Actions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Actions</SelectItem>
          <SelectItem value="create">Create</SelectItem>
          <SelectItem value="update">Update</SelectItem>
          <SelectItem value="delete">Delete</SelectItem>
          <SelectItem value="login">Login</SelectItem>
        </SelectContent>
      </Select>

      <Select value={entityFilter} onValueChange={onEntityChange}>
        <SelectTrigger className="w-[140px] max-sm:w-full bg-white">
          <SelectValue placeholder="Entities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Entities</SelectItem>
          <SelectItem value="Developer">Developer</SelectItem>
          <SelectItem value="Project">Project</SelectItem>
          <SelectItem value="Unit">Unit</SelectItem>
          <SelectItem value="User">User</SelectItem>
        </SelectContent>
      </Select>

      <div className="relative">
        <input
          type="date"
          className="h-10 w-[140px] max-sm:w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={dateFilter === "all" ? "" : dateFilter}
          onChange={(e) => onDateChange(e.target.value || "all")}
        />
      </div>
    </div>
  );
}
