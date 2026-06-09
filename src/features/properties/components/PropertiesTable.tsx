import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableActions } from "@/components/table/table-actions";
import { useRouter } from "next/navigation";
import { Property } from "../types";
import { useTableSettings } from "@/hooks/use-table-settings";

interface PropertiesTableProps {
  settings: ReturnType<typeof useTableSettings>;
  properties: Property[];
  selectedProperties: number[];
  onSelectAll: (checked: boolean) => void;
  onSelectProperty: (id: number, checked: boolean) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function PropertiesTable({
  settings,
  properties,
  selectedProperties,
  onSelectAll,
  onSelectProperty,
  onEdit,
  onDelete,
}: PropertiesTableProps) {
  const router = useRouter();

  const getDensityClass = () => {
    switch (settings.settings.density) {
      case "compact": return "py-1.5 px-2";
      case "spacious": return "py-4 px-2";
      case "comfortable":
      default: return "py-2.5 px-2";
    }
  };

  const densityClass = getDensityClass();

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-lg border border-gray-200 shadow-sm animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 mb-4 bg-gray-50 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No properties found</h3>
        <p className="text-sm text-gray-500 text-center max-w-sm">We couldn't find any properties matching your criteria. Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden overflow-x-auto w-full">
      {/* Mobile Card View */}
      <div className="block md:hidden">
        {properties.map((property) => (
          <div key={property.id} className="p-4 border-b border-gray-100 last:border-b-0 space-y-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={selectedProperties.includes(property.id)}
                  onCheckedChange={(checked) =>
                    onSelectProperty(property.id, checked as boolean)
                  }
                  className="mt-1"
                />
                <div>
                  <button
                    onClick={() => router.push(`/admin/properties/${property.id}`)}
                    className="text-gray-900 text-sm font-semibold hover:text-teal-600 transition-colors text-left focus:outline-none"
                  >
                    {property.unitNumber} {property.property_name && `- ${property.property_name}`}
                  </button>
                  <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    {property.project_name}
                  </div>
                </div>
              </div>
              <TableActions
                onView={() => router.push(`/admin/properties/${property.id}`)}
                onEdit={() => onEdit(property.id)}
                onDelete={() => onDelete(property.id)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-y-2 text-sm pl-7">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Type</span>
                <span className="text-gray-700 flex items-center gap-1">
                  {property.type || "N/A"}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Area</span>
                <span className="text-gray-700 flex items-center gap-1">
                  {property.area || "N/A"}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Price</span>
                <span className="text-gray-900 font-medium">{property.price || "N/A"}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Status</span>
                <Badge
                  variant="outline"
                  className={
                    property.status === "Reserved"
                      ? "bg-orange-50 text-orange-700 border-orange-200 text-[10px] px-1 w-fit"
                      : "bg-green-50 text-green-700 border-green-200 text-[10px] px-1 w-fit"
                  }
                >
                  {property.status || "Unknown"}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <Table className="hidden md:table">
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="w-[35px] px-2">
              <Checkbox
                checked={
                  properties.length > 0 &&
                  selectedProperties.length === properties.length
                }
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            {settings.isColumnVisible("unitNumber") && (
              <TableHead className="font-semibold text-gray-900 w-[80px] px-2 text-sm">Unit Number</TableHead>
            )}
            {settings.isColumnVisible("propertyName") && (
              <TableHead className="font-semibold text-gray-900 w-[110px] px-2 text-sm">Property Name</TableHead>
            )}
            {settings.isColumnVisible("type") && (
              <TableHead className="font-semibold text-gray-900 w-[140px] px-2 text-sm">Type</TableHead>
            )}
            {settings.isColumnVisible("area") && (
              <TableHead className="font-semibold text-gray-900 w-[70px] px-2 text-sm">Area</TableHead>
            )}
            {settings.isColumnVisible("floor") && (
              <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">Floor</TableHead>
            )}
            {settings.isColumnVisible("price") && (
              <TableHead className="font-semibold text-gray-900 w-[110px] px-2 text-sm">Price</TableHead>
            )}
            {settings.isColumnVisible("projectName") && (
              <TableHead className="font-semibold text-gray-900 w-[40px] px-2 text-sm">Project Name</TableHead>
            )}
            {settings.isColumnVisible("status") && (
              <TableHead className="font-semibold text-gray-900 w-[90px] px-2 text-sm">Status</TableHead>
            )}
            {settings.isColumnVisible("actions") && (
              <TableHead className="font-semibold text-gray-900 text-center w-[50px] px-2 text-sm">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className={`px-2 ${densityClass}`}>
                  <Checkbox
                    checked={selectedProperties.includes(property.id)}
                    onCheckedChange={(checked) =>
                      onSelectProperty(property.id, checked as boolean)
                    }
                  />
                </TableCell>
                {settings.isColumnVisible("unitNumber") && (
                  <TableCell className={`text-teal-600 font-medium px-2 text-sm ${densityClass}`}>
                    <button
                      onClick={() => router.push(`/admin/properties/${property.id}`)}
                      className="text-gray-900 text-sm font-medium hover:text-teal-600 active:text-teal-800 transition-colors cursor-pointer text-left focus:outline-none"
                    >
                      {property.unitNumber}
                    </button>
                  </TableCell>
                )}
                {settings.isColumnVisible("propertyName") && (
                  <TableCell className={`text-gray-900 px-2 text-sm truncate ${densityClass}`}>
                    {property.property_name}
                  </TableCell>
                )}
                {settings.isColumnVisible("type") && (
                  <TableCell className={`text-gray-900 px-2 text-sm truncate ${densityClass}`}>
                    {property.type}
                  </TableCell>
                )}
                {settings.isColumnVisible("area") && (
                  <TableCell className={`text-gray-900 px-2 text-xs ${densityClass}`}>
                    {property.area}
                  </TableCell>
                )}
                {settings.isColumnVisible("floor") && (
                  <TableCell className={`text-gray-900 px-2 text-sm ${densityClass}`}>
                    {property.floor}
                  </TableCell>
                )}
                {settings.isColumnVisible("price") && (
                  <TableCell className={`text-gray-900 px-2 text-sm ${densityClass}`}>
                    {property.price}
                  </TableCell>
                )}
                {settings.isColumnVisible("projectName") && (
                  <TableCell className={`text-gray-900 px-2 text-sm ${densityClass}`}>
                    {property.project_name}
                  </TableCell>
                )}
                {settings.isColumnVisible("status") && (
                  <TableCell className={`px-2 ${densityClass}`}>
                    <Badge
                      variant="outline"
                      className={
                        property.status === "Reserved"
                          ? "bg-orange-50 text-orange-700 border-orange-200 text-[10px] px-1"
                          : "bg-green-50 text-green-700 border-green-200 text-[10px] px-1"
                      }
                    >
                      {property.status}
                    </Badge>
                  </TableCell>
                )}
                {settings.isColumnVisible("actions") && (
                  <TableCell className={`text-center px-2 ${densityClass}`}>
                    <TableActions
                      onView={() => router.push(`/admin/properties/${property.id}`)}
                      onEdit={() => onEdit(property.id)}
                      onDelete={() => onDelete(property.id)}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
