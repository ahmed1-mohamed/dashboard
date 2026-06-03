"use client";
import React, { useState, useCallback } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableActions } from "@/components/table/table-actions";
import { Location } from "../types";
import { Badge } from "@/components/ui/badge";

function StatusToggle({
  isActive,
  onToggle,
}: {
  isActive: boolean;
  onToggle: () => void;
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = useCallback(() => {
    setIsAnimating(true);
    onToggle();
    setTimeout(() => setIsAnimating(false), 400);
  }, [onToggle]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleClick}
        className={`
          relative w-10 h-6 rounded-full outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-300 ease-in-out
          ${isActive ? "bg-teal-500 focus:ring-teal-400" : "bg-gray-300 focus:ring-gray-400"}
          ${isAnimating ? "scale-95" : "scale-100"}
        `}
        aria-checked={isActive}
        role="switch"
      >
        <span
          className={`
            absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm
            flex items-center justify-center
            transition-transform duration-300 ease-in-out
            ${isActive ? "translate-x-4" : "translate-x-0"}
          `}
        >
          {isAnimating && (
            <svg
              className="w-3 h-3 text-gray-400 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
        </span>
      </button>
      <span
        className={`text-xs font-medium transition-colors duration-300 ${isActive ? "text-teal-600" : "text-gray-400"
          }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    </div>
  );
}

interface LocationsTableProps {
  locations: Location[];
  selectedLocations: number[];
  locationStatuses: Record<number, boolean>;
  onSelectAll: (checked: boolean) => void;
  onSelectLocation: (id: number, checked: boolean) => void;
  onToggleStatus: (id: number) => void;
  onView: (location: Location) => void;
  onEdit: (location: Location) => void;
  onDelete: (location: Location) => void;
}

export function LocationsTable({
  locations,
  selectedLocations,
  locationStatuses,
  onSelectAll,
  onSelectLocation,
  onToggleStatus,
  onView,
  onEdit,
  onDelete,
}: LocationsTableProps) {
  if (locations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-lg border border-gray-200 shadow-sm animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 mb-4 bg-gray-50 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No locations found</h3>
        <p className="text-sm text-gray-500 text-center max-w-sm">
          We couldn't find any locations matching your criteria. Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden overflow-x-auto animate-in fade-in duration-500">
      <Table className="min-w-full table-fixed">
        <TableHeader>
          <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-200">
            <TableHead className="w-[40px] px-4 py-3">
              <Checkbox
                checked={
                  locations.length > 0 &&
                  selectedLocations.length === locations.length
                }
                onCheckedChange={onSelectAll}
                className="border-gray-300"
              />
            </TableHead>
            <TableHead className="font-semibold text-gray-700 px-4 py-3 text-sm w-[140px]">
              Landmark / Name
            </TableHead>
            <TableHead className="font-semibold text-gray-700 px-4 py-3 text-sm w-[200px]">
              Location Details
            </TableHead>
            <TableHead className="font-semibold text-gray-700 px-4 py-3 text-sm w-[120px]">
              Projects
            </TableHead>
            <TableHead className="font-semibold text-gray-700 px-4 py-3 text-sm w-[160px]">
              Created Date
            </TableHead>
            <TableHead className="font-semibold text-gray-700 px-4 py-3 text-sm w-[130px]">
              Status
            </TableHead>
            <TableHead className="font-semibold text-gray-700 text-center px-4 py-3 text-sm w-[80px]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.map((location) => (
            <TableRow
              key={location.location_id}
              className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0"
            >
              <TableCell className="px-4 py-3">
                <Checkbox
                  checked={selectedLocations.includes(location.location_id)}
                  onCheckedChange={(checked) =>
                    onSelectLocation(location.location_id, checked as boolean)
                  }
                  className="border-gray-300"
                />
              </TableCell>
              <TableCell className="px-4 py-3 max-w-[150px]">
                <button
                  onClick={() => onView(location)}
                  className="text-gray-900 font-medium text-sm block truncate text-left hover:text-teal-600 active:text-teal-800 transition-colors cursor-pointer focus:outline-none w-full"
                  title={location.location_landmark}
                >
                  {location.location_landmark}
                </button>
              </TableCell>
              <TableCell className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-900 font-medium text-sm">{location.city_name}</span>
                  <span className="text-gray-500 text-xs">{location.area_name}, {location.country_name}</span>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200">
                  {location.projects_count} Projects
                </Badge>
              </TableCell>
              <TableCell className="text-gray-600 px-4 py-3 text-sm">
                {location.created_at}
              </TableCell>
              <TableCell className="px-4 py-3">
                <StatusToggle
                  isActive={locationStatuses[location.location_id] ?? true}
                  onToggle={() => onToggleStatus(location.location_id)}
                />
              </TableCell>
              <TableCell className="text-center px-4 py-3">
                <TableActions
                  onView={() => onView(location)}
                  onEdit={() => onEdit(location)}
                  onDelete={() => onDelete(location)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}