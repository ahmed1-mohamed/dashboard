"use client";

import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MapPin, Users, FileText, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AdminAreasService } from "@/services/AdminAreasService";

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
  const { data: queryData, isLoading, isError } = useQuery({
    queryKey: ["areaDetails", area?.area_id],
    queryFn: async () => {
      const response = await AdminAreasService.getArea(area!.area_id);
      return (response as any).data?.data || (response as any).data || response;
    },
    enabled: isOpen && area?.area_id != null,
  });

  if (!isOpen || !area) return null;

  const displayArea = queryData || area;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Area Details" size="md">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-4" />
          <p className="text-gray-500">Loading area details...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-500 mb-2">Failed to load area details.</p>
        </div>
      ) : (
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Area Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {displayArea.area_name}
              </h3>
              <p className="text-sm text-gray-500">ID: {displayArea.area_id}</p>
            </div>
          </div>
          {displayArea.dld_area && (
            <Badge className="bg-blue-100 text-blue-800">
              DLD Area: {displayArea.dld_area.dld_area_name}
            </Badge>
          )}
        </div>

        {/* Area Info Grid */}
        <div className="grid grid-cols-1 gap-4">
          {/* Region */}
          {displayArea.region && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Region</span>
              </div>
              <p className="font-medium text-gray-900">{displayArea.region}</p>
            </div>
          )}

          {/* Coordinates */}
          {(displayArea.latitude || displayArea.longitude) && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Coordinates</span>
              </div>
              <p className="font-medium text-gray-900">
                {displayArea.latitude}, {displayArea.longitude}
              </p>
          </div>
          )}

          {/* Population */}
          {displayArea.population && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-sm">Population</span>
              </div>
              <p className="font-medium text-gray-900">
                {displayArea.population.toLocaleString()}
              </p>
            </div>
          )}

          {/* Description */}
          {displayArea.description && (
            <div className="p-4 bg-gray-50 rounded-lg sm:col-span-2">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <FileText className="w-4 h-4" />
                <span className="text-sm">Description</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {displayArea.description}
              </p>
            </div>
          )}

          {/* Major Landmarks */}
          {displayArea.major_landmarks && displayArea.major_landmarks.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg sm:col-span-2">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Major Landmarks</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {displayArea.major_landmarks.map((landmark: string, idx: number) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="bg-white border-gray-200"
                  >
                    {landmark}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="outline"
            className="text-teal-600 border-teal-200 hover:bg-teal-50"
            onClick={onEdit}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Area
          </Button>
          <Button
            variant="destructive"
            className="bg-red-50 text-red-600 hover:bg-red-100 border-0"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Area
          </Button>
        </div>
      </div>
      )}
    </Modal>
  );
}
