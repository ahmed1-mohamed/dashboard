"use client";

import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Star, Tag } from "lucide-react";

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
  // if (!isOpen || !feature) return null;

  // return (
  //   <Modal isOpen={isOpen} onClose={onClose} title="Feature Details" size="md">
  //     <div className="space-y-6">
  //       {/* Feature Header */}
  //       <div className="flex items-center justify-between">
  //         <div className="flex items-center gap-3">
  //           <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
  //             {feature.icon ? (
  //               <span className="text-lg">{feature.icon}</span>
  //             ) : (
  //               <Star className="w-6 h-6 text-purple-600" />
  //             )}
  //           </div>
  //           <div>
  //             <h3 className="text-lg font-semibold text-gray-900">
  //               {feature.featureName}
  //             </h3>
  //             <p className="text-sm text-gray-500">ID: {feature.id}</p>
  //           </div>
  //         </div>
  //         <Badge
  //           variant={feature.isAmenity ? "default" : "secondary"}
  //           className={
  //             feature.isAmenity
  //               ? "bg-green-100 text-green-800"
  //               : "bg-gray-100 text-gray-800"
  //           }
  //         >
  //           {feature.isAmenity ? "Amenity" : "Feature"}
  //         </Badge>
  //       </div>

  //       {/* Feature Info Grid */}
  //       <div className="grid grid-cols-2 gap-4">
  //         <div className="p-4 bg-gray-50 rounded-lg">
  //           <div className="flex items-center gap-2 text-gray-500 mb-1">
  //             <Tag className="w-4 h-4" />
  //             <span className="text-sm">Type</span>
  //           </div>
  //           <p className="font-medium text-gray-900">
  //             {feature.isAmenity ? "Amenity" : "Feature"}
  //           </p>
  //         </div>

  //         <div className="p-4 bg-gray-50 rounded-lg">
  //           <div className="flex items-center gap-2 text-gray-500 mb-1">
  //             <Star className="w-4 h-4" />
  //             <span className="text-sm">Icon</span>
  //           </div>
  //           <p className="font-medium text-gray-900">
  //             {feature.icon || "No icon"}
  //           </p>
  //         </div>
  //       </div>

  //       {/* Action Buttons */}
  //       <div className="flex gap-3 justify-end pt-4 border-t">
  //         <Button
  //           variant="outline"
  //           onClick={onDelete}
  //           className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
  //         >
  //           <Trash2 className="w-4 h-4 mr-2" />
  //           Delete
  //         </Button>
  //         <Button
  //           onClick={onEdit}
  //           className="bg-teal-600 hover:bg-teal-700 text-white"
  //         >
  //           <Edit2 className="w-4 h-4 mr-2" />
  //           Edit
  //         </Button>
  //       </div>
  //     </div>
  //   </Modal>
  // );
}
