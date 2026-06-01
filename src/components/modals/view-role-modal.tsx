"use client";

import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit2, Trash2 } from "lucide-react";

interface ViewRoleModalProps {
  roleId: number;
  roleName: string;
  roleType: string;
  description: string[];
  usersCount: number;
  isActive: boolean;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ViewRoleModal({
  roleName,
  roleType,
  description,
  usersCount,
  isActive,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: ViewRoleModalProps) {
  // if (!isOpen) return null;

  // return (
  //   <Modal isOpen={isOpen} onClose={onClose} title="Role Details" size="md">
  //     <div className="space-y-6">
  //       {/* Role Info */}
  //       <div className="space-y-4">
  //         <div className="flex items-center justify-between">
  //           <div>
  //             <h3 className="text-lg font-semibold text-gray-900">
  //               {roleName}
  //             </h3>
  //             <p className="text-sm text-gray-500">{roleType}</p>
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
  //             <span className="text-gray-500">Users Count:</span>
  //             <span className="ml-2 font-medium text-gray-900">
  //               {usersCount}
  //             </span>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Permissions/Description */}
  //       <div>
  //         <h4 className="text-sm font-medium text-gray-700 mb-2">
  //           Permissions
  //         </h4>
  //         <div className="flex flex-wrap gap-2">
  //           {description?.map((perm, index) => (
  //             <Badge key={index} variant="outline" className="bg-gray-100">
  //               {perm}
  //             </Badge>
  //           ))}
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
