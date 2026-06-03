"use client";

import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, MapPin, Building2, Calendar, Globe } from "lucide-react";

interface ViewLocationModalProps {
  locationId: number;
  locationLandmark: string;
  cityName: string;
  countryName: string;
  areaName: string;
  createdAt: string;
  projectsCount: number;
  isActive: boolean;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ViewLocationModal({
  locationLandmark,
  cityName,
  countryName,
  areaName,
  createdAt,
  projectsCount,
  isActive,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: ViewLocationModalProps) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Location Details" size="md">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 rounded-xl border border-teal-100">
              <MapPin className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {locationLandmark}
              </h3>
              <p className="text-sm text-gray-500">{areaName}</p>
            </div>
          </div>
          <Badge
            className={
              isActive
                ? "bg-teal-50 text-teal-700 border border-teal-200 shrink-0"
                : "bg-gray-100 text-gray-500 border border-gray-200 shrink-0"
            }
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 border border-gray-100">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">City</span>
            <span className="text-sm font-semibold text-gray-900">{cityName}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Country</span>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-sm font-semibold text-gray-900">{countryName}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Area</span>
            <span className="text-sm font-semibold text-gray-900">{areaName}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Projects</span>
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-sm font-semibold text-gray-900">{projectsCount}</span>
            </div>
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Created At</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-sm font-semibold text-gray-900">{createdAt}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={onDelete}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <Button
            onClick={onEdit}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>
    </Modal>
  );
}
