"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  MoreHorizontal,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Eye,
  Edit2,
  Trash2,
} from "lucide-react";
import dynamic from "next/dynamic";

const AddRoleModal = dynamic(() => import("@/components/modals/add-role-modal"));
const ViewRoleModal = dynamic(() => import("@/components/modals/view-role-modal").then(mod => mod.ViewRoleModal));
const EditRoleModal = dynamic(() => import("@/components/modals/edit-role-modal").then(mod => mod.EditRoleModal));
import useDashboardAdminRolesData from "@/hooks/use-dashboardAdminRoles";
import { RolesDataType } from "@/types";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RoleCard } from "./components/role-card";

export interface Role {
  role_id: number;
  role_name: string;
  role_type: string;
  description: string[];
  users_count: number;
  is_active: boolean;
  permissions?: Record<string, Record<string, boolean>> | null;
}

export default function RolesPage() {
  const { data: session } = useSession();
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch roles with custom hook
  const { rolesData, roles, deleteRoleMutation } = useDashboardAdminRolesData();
  const isDeleting = deleteRoleMutation.isPending;

  const handleViewRole = (role: Role) => {
    setSelectedRole(role);
    setIsViewModalOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };

  const handleDeleteRole = () => {
    if (!selectedRole) return;

    deleteRoleMutation.mutate(selectedRole.role_id, {
      onSuccess: () => {
        toast.success("Role deleted successfully!");
        setDeleteDialogOpen(false);
        setSelectedRole(null);
      },
      onError: (error) => {
        console.error(error);
        toast.error("Failed to delete role");
      },
    });
  };

  if (rolesData.isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#007A55]" />
      </div>
    );
  }

  if (rolesData.isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center flex-col gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium text-gray-900">Error loading roles</p>
        <p className="text-gray-500">
          {rolesData.error instanceof Error
            ? rolesData.error.message
            : String(rolesData.error)}
        </p>
        <Button variant="outline" onClick={() => rolesData.refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden bg-gray-50/30 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#15042B]">Roles</h1>
          <Badge
            variant="outline"
            className="bg-[#A855F7] text-white border-transparent rounded-full px-2 py-0.5 text-xs font-semibold"
          >
            {roles.length}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-[#007A55] hover:bg-[#007a55e0] text-white gap-2 font-medium"
            onClick={() => setIsAddRoleModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add New Role
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {roles.map((role) => (
          <RoleCard
            key={role.role_id}
            role={role}
            onView={handleViewRole}
            onEdit={handleEditRole}
            onDelete={(r) => {
              setSelectedRole(r);
              setDeleteDialogOpen(true);
            }}
          />
        ))}
      </div>

      {isAddRoleModalOpen && (
        <AddRoleModal
          isOpen={isAddRoleModalOpen}
          onClose={() => setIsAddRoleModalOpen(false)}
        />
      )}

      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setSelectedRole(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Role
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-100">
                <p className="font-medium text-[#15042B]">
                  {selectedRole.role_name}
                </p>
                <p className="text-sm text-[#4A5565]">
                  {selectedRole.role_type} • {selectedRole.users_count} users
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedRole(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteRole}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isViewModalOpen && selectedRole && (
        <ViewRoleModal
          roleId={selectedRole.role_id!}
          roleName={selectedRole.role_name}
          roleType={selectedRole.role_type}
          description={selectedRole.description || []}
          usersCount={selectedRole.users_count || 0}
          isActive={selectedRole.is_active}
          permissions={selectedRole.permissions}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          onEdit={() => {
            setIsViewModalOpen(false);
            setIsEditModalOpen(true);
          }}
          onDelete={() => {
            setIsViewModalOpen(false);
            setDeleteDialogOpen(true);
          }}
        />
      )}

      {isEditModalOpen && selectedRole && (
        <EditRoleModal
          roleId={selectedRole.role_id!}
          roleName={selectedRole.role_name}
          roleType={selectedRole.role_type}
          description={selectedRole.description || []}
          permissions={selectedRole.permissions}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            setIsEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
