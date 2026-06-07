"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { AdminRolesService } from "@/services/AdminRolesService";
import { Loader2, Edit2, Trash2 } from "lucide-react";

interface ViewRoleModalProps {
  roleId: number;
  roleName: string;
  roleType: string;
  description: string[] | string | null;
  usersCount: number;
  isActive: boolean;
  permissions?: Record<string, Record<string, boolean>> | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const SECTIONS = ["Developers", "Projects", "Properties", "Ads", "Roles", "Users"];
const ACTIONS = ["view", "edit", "delete", "create"] as const;

export function ViewRoleModal({
  roleId,
  roleName,
  roleType,
  description,
  usersCount,
  isActive,
  permissions: listPermissions,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: ViewRoleModalProps) {

  const { data: roleDetails, isLoading } = useQuery({
    queryKey: ["roleDetails", roleId],
    queryFn: async () => {
      const response = await AdminRolesService.getRole(roleId);
      return (response as any).data?.data || (response as any).data || response;
    },
    enabled: isOpen && roleId != null,
  });

  if (!isOpen) return null;

  const descArray = Array.isArray(description)
    ? description
    : typeof description === 'string' ? [description] : ["No specific description"];

  let rawPerms = roleDetails?.permissions || listPermissions || {};
  if (typeof rawPerms === "string") {
    try { rawPerms = JSON.parse(rawPerms); } catch (e) { rawPerms = {}; }
  }
  const permissions = rawPerms;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-white p-0 overflow-hidden border-none rounded-xl">
        <DialogHeader className="p-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-[#15042B]">
                {roleName}
              </DialogTitle>
              <p className="text-sm text-[#4A5565] mt-1">{roleType} • {usersCount} users</p>
            </div>
            <Badge
              variant="outline"
              className={
                isActive
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </DialogHeader>

        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          <div>
            <h4 className="text-sm font-medium text-[#15042B] mb-2">Description</h4>
            <div className="flex flex-wrap gap-2">
              {descArray.map((desc, index) => (
                <span key={index} className="text-sm text-[#4A5565]">
                  {desc}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-[#15042B] mb-4">Permissions</h4>

            <div className="bg-gray-50/50 rounded-lg p-4">
              <div className="grid grid-cols-5 gap-4 mb-4 px-4 text-sm font-medium text-[#15042B]">
                <div className="col-span-1">Section</div>
                <div className="text-center">View</div>
                <div className="text-center">Edit</div>
                <div className="text-center">Delete</div>
                <div className="text-center">Create</div>
              </div>

              <div className="space-y-2">
                {SECTIONS.map((section) => {
                  const sectionPerms = permissions?.[section] || {};

                  return (
                    <div key={section} className="grid grid-cols-5 gap-4 items-center bg-white p-4 rounded-lg border border-gray-100 shadow-sm opacity-90">
                      <div className="col-span-1">
                        <span className="font-semibold text-[#15042B] text-sm">{section}</span>
                      </div>
                      {ACTIONS.map(action => (
                        <div key={action} className="flex justify-center">
                          <div className={`w-4 h-4 rounded-full ${sectionPerms[action] ? 'bg-[#A855F7]' : 'bg-gray-200'}`} />
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 border-t border-gray-100 bg-white sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onDelete}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Role
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 bg-white"
            >
              Close
            </Button>
            <Button
              onClick={onEdit}
              className="bg-[#007A55] hover:bg-[#007a55e0] text-white font-medium"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Role
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
