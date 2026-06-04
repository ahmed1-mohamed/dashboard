"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateRole } from "@/hooks/use-create-role";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { rolesSchema } from "@/validators/role.schema";
import type { RolesFormInput } from "@/validators/role.schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SECTIONS = ["Developers", "Projects", "Properties", "Ads", "Roles", "Users"];
const ACTIONS = ["view", "edit", "delete", "create"] as const;

export default function AddRoleModal({ isOpen, onClose }: AddRoleModalProps) {
  const { createRole, isCreating } = useCreateRole();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    control,
    setValue,
    watch,
  } = useForm<RolesFormInput>({
    resolver: zodResolver(rolesSchema),
    defaultValues: {
      role_name: "",
      role_type: "user",
      description: "",
      permissions: SECTIONS.reduce((acc, section) => {
        acc[section] = { view: false, edit: false, delete: false, create: false };
        return acc;
      }, {} as Record<string, Record<string, boolean>>),
    },
  });

  const permissions = watch("permissions") || {};

  const handleFormSubmit = async (formData: RolesFormInput) => {
    try {
      await createRole({
        ...formData,
        permissions,
      });
      reset();
      onClose();
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { status?: Record<string, string[]>; message?: string } }; message?: string };
      const errorMessage =
        apiError?.response?.data?.status?.role_type?.[0] ||
        apiError?.response?.data?.status?.role_name?.[0] ||
        apiError?.response?.data?.status?.description?.[0] ||
        apiError?.response?.data?.message ||
        apiError?.message ||
        "Failed to create Role. Please try again.";
      setError("root", { message: errorMessage });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const toggleAction = (section: string, action: typeof ACTIONS[number]) => {
    const currentVal = permissions[section]?.[action] || false;
    setValue(`permissions.${section}.${action}`, !currentVal);
  };

  const toggleSectionAll = (section: string) => {
    const allTrue = ACTIONS.every(a => permissions[section]?.[a]);
    ACTIONS.forEach(a => {
      setValue(`permissions.${section}.${a}`, !allTrue);
    });
  };

  const toggleGlobalAll = () => {
    const allTrue = SECTIONS.every(s => ACTIONS.every(a => permissions[s]?.[a]));
    SECTIONS.forEach(s => {
      ACTIONS.forEach(a => {
        setValue(`permissions.${s}.${a}`, !allTrue);
      });
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl bg-white p-0 overflow-hidden border-none rounded-xl">
        <DialogHeader className="p-6 pb-4 border-b border-gray-100 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-xl font-semibold text-[#15042B]">Add New Role</DialogTitle>
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
                  placeholder="e.g. Developer"
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
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-gray-50/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Role Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                {...register("description")}
                placeholder="Write description here"
                rows={4}
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
                        <span className="font-semibold text-[#15042B]">{section}</span>
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
                            checked={permissions[section]?.[action] || false}
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

            {errors.root && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                {errors.root.message}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 bg-white"
            >
              Close
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              className="bg-[#007A55] hover:bg-[#007a55e0] text-white px-6 font-medium"
            >
              {isCreating ? "Creating..." : "Create Role"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
