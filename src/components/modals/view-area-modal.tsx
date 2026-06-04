"use client";

import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MapPin, Users, FileText } from "lucide-react";

interface AreaData {
  area_id: number;
  area_name: string;
  region?: string;
  latitude?: number | string;
  longitude?: number | string;
  description?: string;
  population?: number;
  major_landmarks?: string[];
  dld_area?: {
    dld_area_id: number;
    dld_area_name: string;
  };
  created_at?: string;
}

interface ViewAreaModalProps {
  area: AreaData | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ViewAreaModal({
  area,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: ViewAreaModalProps) {
  if (!isOpen || !area) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Area Details" size="md">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Area Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {area.area_name}
              </h3>
              <p className="text-sm text-gray-500">ID: {area.area_id}</p>
            </div>
          </div>
          {area.dld_area && (
            <Badge className="bg-blue-100 text-blue-800">
              DLD Area: {area.dld_area.dld_area_name}
            </Badge>
          )}
        </div>

        {/* Area Info Grid */}
        <div className="grid grid-cols-1 gap-4">
          {/* Region */}
          {area.region && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Region</span>
              </div>
              <p className="font-medium text-gray-900">{area.region}</p>
            </div>
          )}

          {/* Coordinates */}
          {(area.latitude || area.longitude) && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Coordinates</span>
              </div>
              <p className="font-medium text-gray-900">
                {area.latitude}, {area.longitude}
              </p>
            </div>
          )}

          {/* Population */}
          {area.population && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-sm">Population</span>
              </div>
              <p className="font-medium text-gray-900">
                {area.population.toLocaleString()}
              </p>
            </div>
          )}

          {/* Description */}
          {area.description && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <FileText className="w-4 h-4" />
                <span className="text-sm">Description</span>
              </div>
              <p className="font-medium text-gray-900">{area.description}</p>
            </div>
          )}

          {/* Major Landmarks */}
          {area.major_landmarks && area.major_landmarks.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Major Landmarks</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {area.major_landmarks.map((landmark, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white border rounded-md text-sm"
                  >
                    {landmark}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Created At */}
          {area.created_at && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <span className="text-sm">Created At</span>
              </div>
              <p className="font-medium text-gray-900">
                {new Date(area.created_at).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t">
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
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>
    </Modal>
  );
}
