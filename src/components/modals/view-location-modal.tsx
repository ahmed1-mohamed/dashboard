"use client";

import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, MapPin, Building2 } from "lucide-react";

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
  // if (!isOpen) return null;

  // return (
  //   <Modal isOpen={isOpen} onClose={onClose} title="Location Details" size="md">
  //     <div className="space-y-6">
  //       {/* Location Info */}
  //       <div className="space-y-4">
  //         <div className="flex items-center justify-between">
  //           <div className="flex items-center gap-3">
  //             <div className="p-2 bg-teal-100 rounded-lg">
  //               <MapPin className="w-5 h-5 text-teal-600" />
  //             </div>
  //             <div>
  //               <h3 className="text-lg font-semibold text-gray-900">
  //                 {locationLandmark}
  //               </h3>
  //               <p className="text-sm text-gray-500">{areaName}</p>
  //             </div>
  //           </div>
  //           <Badge
  //             variant={isActive ? "default" : "destructive"}
  //             className={
  //               isActive
  //                 ? "bg-green-100 text-green-800"
  //                 : "bg-red-100 text-red-800"
  //             }
  //           >
  //             {isActive ? "Active" : "Inactive"}
  //           </Badge>
  //         </div>

  //         <div className="grid grid-cols-2 gap-4 text-sm">
  //           <div>
  //             <span className="text-gray-500">City:</span>
  //             <span className="ml-2 font-medium text-gray-900">{cityName}</span>
  //           </div>
  //           <div>
  //             <span className="text-gray-500">Country:</span>
  //             <span className="ml-2 font-medium text-gray-900">
  //               {countryName}
  //             </span>
  //           </div>
  //           <div>
  //             <span className="text-gray-500">Area:</span>
  //             <span className="ml-2 font-medium text-gray-900">{areaName}</span>
  //           </div>
  //           <div>
  //             <span className="text-gray-500">Projects:</span>
  //             <span className="ml-2 font-medium text-gray-900 flex items-center gap-1">
  //               <Building2 className="w-3 h-3" />
  //               {projectsCount}
  //             </span>
  //           </div>
  //           <div className="col-span-2">
  //             <span className="text-gray-500">Created:</span>
  //             <span className="ml-2 font-medium text-gray-900">
  //               {createdAt}
  //             </span>
  //           </div>
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
