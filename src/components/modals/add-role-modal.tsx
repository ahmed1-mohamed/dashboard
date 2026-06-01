"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateRole } from "@/hooks/use-create-role";
import { Button } from "rizzui/button";
import { Input } from "rizzui/input";
import { Textarea } from "rizzui/textarea";
import { rolesSchema } from "@/validators/role.schema";
import type { RolesFormInput } from "@/validators/role.schema";

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddRoleModal({ isOpen, onClose }: AddRoleModalProps) {
  const { createRole, isCreating } = useCreateRole();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<RolesFormInput>({
    resolver: zodResolver(rolesSchema),
    defaultValues: {
      role_name: "",
      role_type: "",
      description: "",
    },
  });

  const handleFormSubmit = async (formData: RolesFormInput) => {
    try {
      await createRole(formData);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-auto w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Create New Role</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input
            {...register("role_name")}
            label="Role Name"
            error={errors.role_name?.message as string | undefined}
          />

          <Input
            {...register("role_type")}
            label="Role Type"
            error={errors.role_type?.message as string | undefined}
          />

          <Textarea
            {...register("description")}
            error={(errors.description?.message as string) || undefined}
            rows={4}
            label="Description"
          />

          {errors.root && (
            <div className="rounded-md bg-red-200 p-2 text-sm text-red-700">
              {errors.root.message}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Role"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
