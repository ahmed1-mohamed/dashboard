import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Settings2 } from "lucide-react";
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

interface FeaturesFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  onExport: (format: "pdf" | "xlsx" | "excel") => void;
}

export function FeaturesFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onExport,
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

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 border-gray-200 bg-white text-gray-600 font-normal h-9">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-32 bg-white">
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

        <Button variant="outline" className="gap-2 border-gray-200 bg-white text-gray-600 font-normal h-9">
          <Settings2 className="h-4 w-4" />
          Table settings
        </Button>
      </div>
    </div>
  );
}
