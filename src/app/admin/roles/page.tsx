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
import AddRoleModal from "@/components/modals/add-role-modal";
import { ViewRoleModal } from "@/components/modals/view-role-modal";
import { EditRoleModal } from "@/components/modals/edit-role-modal";
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

export interface Role {
  role_id: number;
  role_name: string;
  role_type: string;
  description: string[];
  users_count: number;
  is_active: boolean;
}

export default function RolesPage() {
  const { data: session } = useSession();
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch roles with custom hook
  const { rolesData, deleteRoleMutation } = useDashboardAdminRolesData();
  const { data } = rolesData;
  const isDeleting = deleteRoleMutation.isPending;

  // Handle both response formats: direct array or { data: array }
  const rawData = data as unknown;
  let rolesArray: any[] = [];
  if (Array.isArray(rawData)) {
    rolesArray = rawData;
  } else if (
    rawData &&
    typeof rawData === "object" &&
    "data" in rawData &&
    Array.isArray((rawData as { data?: unknown }).data)
  ) {
    rolesArray = (rawData as { data?: unknown }).data as any[];
  }

  // Map API data to component interface
  const roles: Role[] = rolesArray.map((role: any) => ({
    role_id: role.role_id,
    role_name: role.role_name,
    role_type: role.role_type,
    description: role.description
      ? Array.isArray(role.description)
        ? role.description
        : [role.description]
      : ["No specific permissions"],
    users_count: role.users_count || 0,
    is_active: role.is_active || false,
  }));

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
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
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
    <div className="p-4 px-3 space-y-4 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Roles</h1>
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-700 border-purple-200 rounded-full px-2"
          >
            {roles.length}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
            onClick={() => setIsAddRoleModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add New Role
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {roles.map((role) => (
          <div
            key={role.role_id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 text-base">
                  {role.role_name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {role.users_count} users
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 p-1"
                    aria-label="More options"
                    title="More options"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem
                    onClick={() => handleViewRole(role)}
                    className="cursor-pointer"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleEditRole(role)}
                    className="cursor-pointer"
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedRole(role);
                      setDeleteDialogOpen(true);
                    }}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {role.description?.slice(0, 5).map((description, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-gray-100 text-gray-700 border-gray-200 text-xs px-2 py-0.5 font-normal"
                >
                  {description}
                </Badge>
              ))}
              {role.description.length > 5 && (
                <Badge
                  variant="outline"
                  className="bg-gray-100 text-gray-700 border-gray-200 text-xs px-2 py-0.5 font-normal"
                >
                  +{role.description.length - 5}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      <AddRoleModal
        isOpen={isAddRoleModalOpen}
        onClose={() => setIsAddRoleModalOpen(false)}
      />
{/* 
      {selectedRole && (
        <ViewRoleModal
          roleId={selectedRole.role_id}
          roleName={selectedRole.role_name}
          roleType={selectedRole.role_type}
          description={selectedRole.description}
          usersCount={selectedRole.users_count}
          isActive={selectedRole.is_active}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          onEdit={() => {
            setIsViewModalOpen(false);
            setIsEditModalOpen(true);
          }}
          onDelete={handleDeleteRole}
        />
      )} */}

      {/* {selectedRole && (
        <EditRoleModal
          roleId={selectedRole.role_id}
          roleName={selectedRole.role_name}
          roleType={selectedRole.role_type}
          description={selectedRole.description[0] || ""}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedRole(null);
          }}
          onSuccess={() => {
            setIsEditModalOpen(false);
            setSelectedRole(null);
            // refetch();
          }}
        />
      )} */}

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
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <p className="font-medium text-gray-900">
                  {selectedRole.role_name}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedRole.role_type} • {selectedRole.users_count} users
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-end">
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
    </div>
  );
}

// export default function RolesPage() {
//   const { data: session } = useSession();
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);

//   // View/Edit modal state
//   const [selectedRole, setSelectedRole] = useState<Role | null>(null);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);

//   // Delete dialog state
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

//   useEffect(() => {
//     async function loadRoles() {
//       if (!session?.user?.accessToken) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);
//         const data = await fetchRoles(session.user.accessToken);

//         // Map API data to component interface
//         const mappedRoles: Role[] = data.map((role: RolesDataType) => ({
//           role_id: role.role_id,
//           role_name: role.role_name,
//           role_type: role.role_type,
//           users_count: role.users_count,
//           is_active: role.is_active,

//           // ✅ Normalize description
//           description: role.description
//             ? [role.description] // turn string → array
//             : ["No specific permissions"],
//         }));

//         setRoles(mappedRoles);
//       } catch (err) {
//         console.error("Error loading roles:", err);
//         setError(err instanceof Error ? err.message : "Failed to load roles");
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadRoles();
//   }, [session]);

//   const handleViewRole = (role: Role) => {
//     setSelectedRole(role);
//     setIsViewModalOpen(true);
//   };

//   const handleEditRole = (role: Role) => {
//     setSelectedRole(role);
//     setIsEditModalOpen(true);
//   };

//   const handleDeleteRole = async () => {
//     if (!selectedRole || !session?.user?.accessToken) return;

//     if (!window.confirm("Are you sure you want to delete this role?")) return;

//     setIsDeleting(true);
//     try {
//       await deleteRoles(selectedRole.role_id, session.user.accessToken);
//       toast.success("Role deleted successfully!");
//       setIsViewModalOpen(false);
//       // Reload roles
//       const data = await fetchRoles(session.user.accessToken);
//       const mappedRoles: Role[] = data.map((role: RolesDataType) => ({
//         role_id: role.role_id,
//         role_name: role.role_name,
//         role_type: role.role_type,
//         users_count: role.users_count,
//         is_active: role.is_active,
//         description: role.description
//           ? [role.description]
//           : ["No specific permissions"],
//       }));
//       setRoles(mappedRoles);
//     } catch (err) {
//       toast.error("Failed to delete role");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex min-h-[400px] items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex min-h-[400px] items-center justify-center flex-col gap-4">
//         <AlertCircle className="h-12 w-12 text-red-500" />
//         <p className="text-lg font-medium text-gray-900">Error loading roles</p>
//         <p className="text-gray-500">{error}</p>
//         <Button variant="outline" onClick={() => window.location.reload()}>
//           Try Again
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 px-3 space-y-4 max-w-full overflow-hidden">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <h1 className="text-2xl font-bold text-gray-900">Roles</h1>
//           <Badge
//             variant="outline"
//             className="bg-purple-100 text-purple-700 border-purple-200 rounded-full px-2"
//           >
//             {roles.length}
//           </Badge>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button
//             className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
//             onClick={() => setIsAddRoleModalOpen(true)}
//           >
//             <Plus className="h-4 w-4" />
//             Add New Role
//           </Button>
//         </div>
//       </div>

//       {/* Roles Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//         {roles.map((role) => (
//           <div
//             key={role.role_id}
//             className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
//           >
//             {/* Role Header */}
//             <div className="flex items-start justify-between mb-3">
//               <div>
//                 <h3 className="font-semibold text-gray-900 text-base">
//                   {role.role_name}
//                 </h3>
//                 <p className="text-xs text-gray-500 mt-0.5">
//                   {role.users_count} users
//                 </p>
//               </div>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <button className="text-gray-400 hover:text-gray-600 p-1">
//                     <MoreHorizontal className="h-5 w-5" />
//                   </button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-32">
//                   <DropdownMenuItem
//                     onClick={() => handleViewRole(role)}
//                     className="cursor-pointer"
//                   >
//                     <Eye className="mr-2 h-4 w-4" />
//                     View
//                   </DropdownMenuItem>
//                   <DropdownMenuItem
//                     onClick={() => handleEditRole(role)}
//                     className="cursor-pointer"
//                   >
//                     <Edit2 className="mr-2 h-4 w-4" />
//                     Edit
//                   </DropdownMenuItem>
//                   <DropdownMenuItem
//                     onClick={() => {
//                       setSelectedRole(role);
//                       setDeleteDialogOpen(true);
//                     }}
//                     className="cursor-pointer text-red-600 focus:text-red-600"
//                   >
//                     <Trash2 className="mr-2 h-4 w-4" />
//                     Delete
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>

//             {/* Permissions */}
//             <div className="flex flex-wrap gap-1.5">
//               {role.description?.slice(0, 5).map((description, index) => (
//                 <Badge
//                   key={index}
//                   variant="outline"
//                   className="bg-gray-100 text-gray-700 border-gray-200 text-xs px-2 py-0.5 font-normal"
//                 >
//                   {description}
//                 </Badge>
//               ))}
//               {role.description.length > 5 && (
//                 <Badge
//                   variant="outline"
//                   className="bg-gray-100 text-gray-700 border-gray-200 text-xs px-2 py-0.5 font-normal"
//                 >
//                   +{role.description.length - 5}
//                 </Badge>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Add Role Modal */}
//       <AddRoleModal
//         isOpen={isAddRoleModalOpen}
//         onClose={() => setIsAddRoleModalOpen(false)}
//       />

//       {/* View Role Modal */}
//       {selectedRole && (
//         <ViewRoleModal
//           roleId={selectedRole.role_id}
//           roleName={selectedRole.role_name}
//           roleType={selectedRole.role_type}
//           description={selectedRole.description}
//           usersCount={selectedRole.users_count}
//           isActive={selectedRole.is_active}
//           isOpen={isViewModalOpen}
//           onClose={() => setIsViewModalOpen(false)}
//           onEdit={() => {
//             setIsViewModalOpen(false);
//             setIsEditModalOpen(true);
//           }}
//           onDelete={handleDeleteRole}
//         />
//       )}

//       {/* Edit Role Modal */}
//       {selectedRole && (
//         <EditRoleModal
//           roleId={selectedRole.role_id}
//           roleName={selectedRole.role_name}
//           roleType={selectedRole.role_type}
//           description={selectedRole.description[0] || ""}
//           isOpen={isEditModalOpen}
//           onClose={() => setIsEditModalOpen(false)}
//           onSuccess={async () => {
//             if (session?.user?.accessToken) {
//               const data = await fetchRoles(session.user.accessToken);
//               const mappedRoles: Role[] = data.map((role: RolesDataType) => ({
//                 role_id: role.role_id,
//                 role_name: role.role_name,
//                 role_type: role.role_type,
//                 users_count: role.users_count,
//                 is_active: role.is_active,
//                 description: role.description
//                   ? [role.description]
//                   : ["No specific permissions"],
//               }));
//               setRoles(mappedRoles);
//             }
//           }}
//         />
//       )}

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={deleteDialogOpen}
//         onOpenChange={(open) => {
//           setDeleteDialogOpen(open);
//           if (!open) setSelectedRole(null);
//         }}
//       >
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2 text-red-600">
//               <AlertTriangle className="h-5 w-5" />
//               Delete Role
//             </DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete this role? This action cannot be
//               undone.
//             </DialogDescription>
//           </DialogHeader>
//           {selectedRole && (
//             <div className="py-4">
//               <div className="bg-gray-50 rounded-lg p-3 space-y-2">
//                 <p className="font-medium text-gray-900">
//                   {selectedRole.role_name}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   {selectedRole.role_type} • {selectedRole.users_count} users
//                 </p>
//               </div>
//             </div>
//           )}
//           <DialogFooter className="sm:justify-end">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setDeleteDialogOpen(false);
//                 setSelectedRole(null);
//               }}
//               disabled={isDeleting}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={async () => {
//                 if (!selectedRole || !session?.user?.accessToken) return;

//                 setIsDeleting(true);
//                 try {
//                   await deleteRoles(
//                     selectedRole.role_id,
//                     session.user.accessToken,
//                   );
//                   toast.success("Role deleted successfully!");
//                   setDeleteDialogOpen(false);
//                   setSelectedRole(null);
//                   // Reload roles
//                   const data = await fetchRoles(session.user.accessToken);
//                   const mappedRoles: Role[] = data.map(
//                     (role: RolesDataType) => ({
//                       role_id: role.role_id,
//                       role_name: role.role_name,
//                       role_type: role.role_type,
//                       users_count: role.users_count,
//                       is_active: role.is_active,
//                       description: role.description
//                         ? [role.description]
//                         : ["No specific permissions"],
//                     }),
//                   );
//                   setRoles(mappedRoles);
//                 } catch (err) {
//                   toast.error("Failed to delete role");
//                 } finally {
//                   setIsDeleting(false);
//                 }
//               }}
//               disabled={isDeleting}
//               className="bg-red-600 hover:bg-red-700"
//             >
//               {isDeleting ? "Deleting..." : "Delete"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
