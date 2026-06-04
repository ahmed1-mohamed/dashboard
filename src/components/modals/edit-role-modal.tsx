"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { AdminRolesService } from "@/services/AdminRolesService";
import { toast } from "sonner";
import { rolesSchema } from "@/validators/role.schema";
import type { RolesFormInput } from "@/validators/role.schema";

interface EditRoleModalProps {
  roleId: number;
  roleName: string;
  roleType: string;
  description: string[] | string | null;
  permissions?: Record<string, Record<string, boolean>> | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SECTIONS = ["Developers", "Projects", "Properties", "Ads", "Roles", "Users"];
const ACTIONS = ["view", "edit", "delete", "create"] as const;

export function EditRoleModal({
  roleId,
  roleName,
  roleType,
  description,
  permissions: initialPermissions,
  isOpen,
  onClose,
  onSuccess,
}: EditRoleModalProps) {
  const queryClient = useQueryClient();

  const defaultDesc = Array.isArray(description) 
    ? description[0] 
    : typeof description === 'string' ? description : "";

  const safePermissions = (perms: any) => {
    if (!perms || Array.isArray(perms) || Object.keys(perms).length === 0) {
      return SECTIONS.reduce((acc, section) => {
        acc[section] = { view: false, edit: false, delete: false, create: false };
        return acc;
      }, {} as Record<string, Record<string, boolean>>);
    }
    const result = { ...perms };
    SECTIONS.forEach(section => {
      if (!result[section]) {
        result[section] = { view: false, edit: false, delete: false, create: false };
      }
    });
    return result;
  };

  const { data: roleDetails, isLoading } = useQuery({
    queryKey: ["roleDetails", roleId],
    queryFn: async () => {
      const response = await AdminRolesService.getRole(roleId);
      return (response as any).data?.data || (response as any).data || response;
    },
    enabled: isOpen && !!roleId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<RolesFormInput>({
    resolver: zodResolver(rolesSchema),
    defaultValues: {
      role_name: roleName,
      role_type: roleType as any,
      description: defaultDesc,
      permissions: safePermissions(initialPermissions),
    },
  });

  useEffect(() => {
    if (isOpen) {
      let rawPerms = roleDetails?.permissions || initialPermissions || {};
      if (typeof rawPerms === "string") {
        try { rawPerms = JSON.parse(rawPerms); } catch (e) { rawPerms = {}; }
      }

      reset({
        role_name: roleDetails?.role_name || roleName,
        role_type: (roleDetails?.role_type || roleType) as any,
        description: roleDetails?.description || defaultDesc,
        permissions: safePermissions(rawPerms),
      });
    }
  }, [isOpen, roleName, roleType, defaultDesc, initialPermissions, roleDetails, reset]);

  const currentPermissions = watch("permissions") || {};

  const mutation = useMutation({
    mutationFn: async (data: RolesFormInput) => {
      return AdminRolesService.updateRole(roleId, data);
    },
    onSuccess: () => {
      toast.success("Role updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["roles_admin"] });
      onSuccess();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update role");
    },
  });

  const handleFormSubmit = (data: RolesFormInput) => {
    mutation.mutate({
      ...data,
      role_id: roleId,
      is_active: true,
      permissions: currentPermissions,
    } as any);
  };

  const toggleAction = (section: string, action: typeof ACTIONS[number]) => {
    const currentVal = currentPermissions[section]?.[action] || false;
    setValue(`permissions.${section}.${action}`, !currentVal);
  };

  const toggleSectionAll = (section: string) => {
    const allTrue = ACTIONS.every(a => currentPermissions[section]?.[a]);
    ACTIONS.forEach(a => {
      setValue(`permissions.${section}.${a}`, !allTrue);
    });
  };

  const toggleGlobalAll = () => {
    const allTrue = SECTIONS.every(s => ACTIONS.every(a => currentPermissions[s]?.[a]));
    SECTIONS.forEach(s => {
      ACTIONS.forEach(a => {
        setValue(`permissions.${s}.${a}`, !allTrue);
      });
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-white p-0 overflow-hidden border-none rounded-xl">
        <DialogHeader className="p-6 pb-4 border-b border-gray-100 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-xl font-semibold text-[#15042B]">Edit Role</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col max-h-[80vh]">
          <div className="p-6 overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  Role Name ( EN ) <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register("role_name")}
                  className="bg-gray-50/50"
                />
                {errors.role_name && <p className="text-xs text-red-500">{errors.role_name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  Role Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("role_type")}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-gray-50/50 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="developer">Developer</option>
                  <option value="agent">Agent</option>
                  <option value="consultant">Consultant</option>
                </select>
                {errors.role_type && <p className="text-xs text-red-500">{errors.role_type.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <Textarea
                {...register("description")}
                rows={3}
                className="bg-gray-50/50 resize-none"
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#15042B]">Permissions</h3>
                <button
                  type="button"
                  onClick={toggleGlobalAll}
                  className="text-sm font-medium text-teal-600 hover:text-teal-700"
                >
                  Toggle All
                </button>
              </div>

              <div className="bg-gray-50/50 rounded-lg p-4">
                <div className="grid grid-cols-5 gap-4 mb-4 px-4 text-sm font-medium text-[#15042B]">
                  <div className="col-span-1">Section</div>
                  <div className="text-center">View</div>
                  <div className="text-center">Edit</div>
                  <div className="text-center">Delete</div>
                  <div className="text-center">Create</div>
                </div>

                <div className="space-y-2">
                  {SECTIONS.map((section) => (
                    <div key={section} className="grid grid-cols-5 gap-4 items-center bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                      <div className="col-span-1 flex flex-col gap-1">
                        <span className="font-semibold text-[#15042B] text-sm">{section}</span>
                        <button
                          type="button"
                          onClick={() => toggleSectionAll(section)}
                          className="text-xs text-teal-600 text-left hover:underline"
                        >
                          Toggle All
                        </button>
                      </div>
                      {ACTIONS.map(action => (
                        <div key={action} className="flex justify-center">
                          <Switch
                            checked={currentPermissions[section]?.[action] || false}
                            onCheckedChange={() => toggleAction(section, action)}
                            className="data-[state=checked]:bg-[#A855F7]"
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white">
            <Button type="button" variant="outline" onClick={onClose} className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 bg-white">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#007A55] hover:bg-[#007a55e0] text-white px-6 font-medium"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
