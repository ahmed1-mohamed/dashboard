import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableActions } from "@/components/table/table-actions";

export interface Area {
  area_id: number;
  area_name: string;
  latitude: string;
  longitude: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  dld_area_id: number | undefined;
  locations_count: number | undefined;
  projects_count: number | undefined;
  status: boolean;
}

interface AreasTableProps {
  areas: Area[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  selectedAreas: number[];
  areaStatuses: Record<number, boolean>;
  onRetry: () => void;
  onSelectAll: (checked: boolean) => void;
  onSelectArea: (id: number, checked: boolean) => void;
  onToggleStatus: (id: number) => void;
  onView: (area: Area) => void;
  onEdit: (area: Area) => void;
  onDelete: (id: number) => void;
}

export function AreasTable({
  areas,
  isLoading,
  isError,
  error,
  selectedAreas,
  areaStatuses,
  onRetry,
  onSelectAll,
  onSelectArea,
  onToggleStatus,
  onView,
  onEdit,
  onDelete,
}: AreasTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[120px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[60px]" />
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-4 w-[70px]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-800">
            <strong>Error:</strong>{" "}
            {error instanceof Error ? error.message : "Failed to load areas"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-2 border-red-200 text-red-700 hover:bg-red-100"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white w-full overflow-hidden">
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[800px] w-full">
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-[40px] px-2 py-3 text-center">
                <Checkbox
                  checked={areas.length > 0 && selectedAreas.length === areas.length}
                  onCheckedChange={onSelectAll}
                />
              </TableHead>
              <TableHead className="font-semibold text-gray-900 w-[200px] px-2 py-3 text-xs uppercase tracking-wider">
                Area Name
              </TableHead>
              <TableHead className="font-semibold text-gray-900 w-[250px] px-2 py-3 text-xs uppercase tracking-wider">
                Description
              </TableHead>
              <TableHead className="font-semibold text-gray-900 w-[100px] px-2 py-3 text-xs uppercase tracking-wider">
                Created
              </TableHead>
              <TableHead className="font-semibold text-gray-900 text-center w-[80px] px-2 py-3 text-xs uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-900 text-center w-[80px] px-2 py-3 text-xs uppercase tracking-wider">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {areas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                  No areas found.
                </TableCell>
              </TableRow>
            ) : (
              areas.map((area) => (
                <TableRow key={area.area_id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="px-2 py-3 text-center">
                    <Checkbox
                      checked={selectedAreas.includes(area.area_id)}
                      onCheckedChange={(checked) =>
                        onSelectArea(area.area_id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell className="px-2 py-3 text-sm">
                    <button
                      onClick={() => onView(area)}
                      className="text-teal-600 font-medium transition-colors duration-200 hover:text-teal-800 focus:outline-none"
                    >
                      {area.area_name}
                    </button>
                  </TableCell>
                  <TableCell className="text-gray-900 px-2 py-3 text-sm">
                    <div className="line-clamp-2 w-[250px]" title={area.description || "N/A"}>
                      {area.description || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-900 px-2 py-3 text-sm whitespace-nowrap">
                    {area.created_at?.split(" ")[0]}
                  </TableCell>
                  <TableCell className="text-center px-2 py-3">
                    <Switch
                      checked={areaStatuses[area.area_id] !== false}
                      onCheckedChange={() => onToggleStatus(area.area_id)}
                    />
                  </TableCell>
                  <TableCell className="text-center px-2 py-3">
                    <TableActions
                      onView={() => onView(area)}
                      onEdit={() => onEdit(area)}
                      onDelete={() => onDelete(area.area_id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
