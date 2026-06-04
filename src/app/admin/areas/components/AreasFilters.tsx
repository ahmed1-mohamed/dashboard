import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Download, Settings2 } from "lucide-react";

interface AreasFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  onExport: (format: "pdf" | "xlsx" | "excel") => void;
}

export function AreasFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onExport,
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

      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 border-gray-200 whitespace-nowrap h-10">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32 bg-white">
            <DropdownMenuItem onClick={() => onExport("xlsx")} className="text-xs cursor-pointer font-medium text-gray-700 py-2">
              XLSX
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport("pdf")} className="text-xs cursor-pointer font-medium text-gray-700 py-2">
              PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport("excel")} className="text-xs cursor-pointer font-medium text-gray-700 py-2">
              Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" className="gap-2 border-gray-200 whitespace-nowrap h-10">
          <Settings2 className="h-4 w-4" />
          Table settings
        </Button>
      </div>
    </div>
  );
}
