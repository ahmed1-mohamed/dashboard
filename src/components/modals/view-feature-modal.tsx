"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Tag, Loader2, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AdminFeaturesService } from "@/services/AdminFeaturesService";

interface Feature {
  id: number;
  featureName: string;
  isAmenity: boolean;
  icon: string;
}

interface ViewFeatureModalProps {
  feature: Feature | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ViewFeatureModal({
  feature,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: ViewFeatureModalProps) {
  
  const { data: featureDetails, isLoading } = useQuery({
    queryKey: ["featureDetails", feature?.id],
    queryFn: async () => {
      const response = await AdminFeaturesService.getFeature(feature!.id);
      return (response as any).data?.data || (response as any).data || response;
    },
    enabled: isOpen && feature?.id != null,
  });

  if (!isOpen || !feature) return null;

  const displayFeature = featureDetails || feature;
  const isAmenity = featureDetails ? displayFeature.is_amenity === 1 : feature.isAmenity;
  const featureName = displayFeature.feature_name || feature.featureName;
  const icon = displayFeature.icons || feature.icon;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl bg-white p-0 overflow-hidden border-none rounded-xl shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F3E8FF] flex items-center justify-center text-[#A855F7] shadow-sm border border-purple-100">
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : icon ? (
                  <span className="text-xl font-bold">{icon.substring(0, 2).toUpperCase()}</span>
                ) : (
                  <Star className="w-6 h-6" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-[#15042B] mb-1">
                  {isLoading ? "Loading..." : featureName}
                </DialogTitle>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID: {feature.id}
                  </p>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <Badge
                    variant="outline"
                    className={
                      isAmenity
                        ? "bg-teal-50 text-teal-700 border-teal-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }
                  >
                    {isAmenity ? "Amenity" : "Feature"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 transition-colors hover:bg-gray-100/80">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Tag className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Category</span>
                </div>
                <p className="font-semibold text-gray-900 text-base">
                  {isAmenity ? "Amenity" : "Feature"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 transition-colors hover:bg-gray-100/80">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Star className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Icon</span>
                </div>
                <p className="font-semibold text-gray-900 text-base truncate" title={icon || "No icon set"}>
                  {icon || "No icon set"}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-5 border-t border-gray-100 bg-gray-50/50 sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onDelete}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 h-10 px-4"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Feature
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 bg-white h-10 px-4 border-gray-200"
            >
              Close
            </Button>
            <Button
              onClick={onEdit}
              className="bg-[#007A55] hover:bg-[#007a55e0] text-white font-medium h-10 px-5"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Feature
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
