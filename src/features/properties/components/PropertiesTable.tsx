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

interface PropertiesTableProps {
  properties: Property[];
  selectedProperties: number[];
  onSelectAll: (checked: boolean) => void;
  onSelectProperty: (id: number, checked: boolean) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function PropertiesTable({
  properties,
  selectedProperties,
  onSelectAll,
  onSelectProperty,
  onEdit,
  onDelete,
}: PropertiesTableProps) {
  const router = useRouter();

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden overflow-x-auto">
      <Table>
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
            <TableHead className="font-semibold text-gray-900 w-[80px] px-2 text-sm">
              Unit Number
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[110px] px-2 text-sm">
              Property Name
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[140px] px-2 text-sm">
              Type
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[70px] px-2 text-sm">
              Area
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
              Floor
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[110px] px-2 text-sm">
              Price
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[40px] px-2 text-sm">
              Project Name
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[90px] px-2 text-sm">
              Status
            </TableHead>
            <TableHead className="font-semibold text-gray-900 text-center w-[50px] px-2 text-sm">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center text-gray-500">
                No properties found.
              </TableCell>
            </TableRow>
          ) : (
            properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="px-2">
                  <Checkbox
                    checked={selectedProperties.includes(property.id)}
                    onCheckedChange={(checked) =>
                      onSelectProperty(property.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell className="text-teal-600 font-medium px-2 text-sm">
                  <button
                    onClick={() => router.push(`/admin/properties/${property.id}`)}
                    className="text-gray-900 text-sm font-medium hover:text-teal-600 active:text-teal-800 transition-colors cursor-pointer text-left focus:outline-none"
                  >
                    {property.unitNumber}
                  </button>
                </TableCell>
                <TableCell className="text-gray-900 px-2 text-sm truncate">
                  {property.property_name}
                </TableCell>
                <TableCell className="text-gray-900 px-2 text-sm truncate">
                  {property.type}
                </TableCell>
                <TableCell className="text-gray-900 px-2 text-xs">
                  {property.area}
                </TableCell>
                <TableCell className="text-gray-900 px-2 text-sm">
                  {property.floor}
                </TableCell>
                <TableCell className="text-gray-900 px-2 text-sm">
                  {property.price}
                </TableCell>
                <TableCell className="text-gray-900 px-2 text-sm">
                  {property.project_name}
                </TableCell>
                <TableCell className="px-2">
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
                <TableCell className="text-center px-2">
                  <TableActions
                    onView={() => router.push(`/admin/properties/${property.id}`)}
                    onEdit={() => onEdit(property.id)}
                    onDelete={() => onDelete(property.id)}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
