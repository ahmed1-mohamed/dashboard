"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { AdminUsersService } from "@/features/users/services/AdminUsersService";
import { useUsers } from "@/features/users/hooks/useUsers";

interface EditUserFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  status: string;
  role_id: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  onSuccess?: () => void;
}

export function EditUserModal({
  isOpen,
  onClose,
  userId,
  onSuccess,
}: EditUserModalProps) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<EditUserFormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      status: "active",
      role_id: "",
    },
  });

  // Fetch user data
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["user-detail", userId],
    queryFn: () => AdminUsersService.getUser(userId),
    enabled: !!token && !!userId && isOpen,
  });

  // Fetch roles
  const { data: rolesData = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: () => AdminUsersService.getRoles(),
    enabled: !!token && isOpen,
  });

  const roles = Array.isArray(rolesData)
    ? rolesData
    : (rolesData as { data?: unknown[] }).data ?? [];

  // Populate form when user data arrives
  useEffect(() => {
    if (!userData) return;
    const user = (userData as unknown as { data?: unknown; [key: string]: unknown }).data ?? userData;
    const u = user as Record<string, unknown>;
    reset({
      first_name: (u.first_name as string) ?? "",
      last_name: (u.last_name as string) ?? "",
      email: (u.email as string) ?? "",
      phone_number: (u.phone_number as string) ?? "",
      status: (u.status as string) ?? "active",
      role_id: u.role_id ? String(u.role_id) : "",
    });
  }, [userData, reset]);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const onSubmit = async (formValues: EditUserFormValues) => {
    if (!userId) return;
    setIsSubmitting(true);
    try {
      await AdminUsersService.updateUser(userId, {
        ...formValues,
        role_id: Number(formValues.role_id),
      });
      toast.success("User updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-detail", userId] });
      handleClose();
      onSuccess?.();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message ?? err.message ?? "Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit User"
      size="md"
      showCloseButton={false}
      footer={
        <div className="flex gap-3 justify-end w-full">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || userLoading}
          >
            {isSubmitting ? "Updating..." : "Update User"}
          </Button>
        </div>
      }
    >
      {userLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent" />
            <p className="mt-4 text-sm text-gray-600">Loading user data...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-first-name">
                First name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-first-name"
                placeholder="e.g. Bonnie"
                {...register("first_name", { required: "First name is required" })}
                className="mt-1"
              />
              {errors.first_name && (
                <p className="text-xs text-red-500 mt-1">{errors.first_name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="edit-last-name">
                Last name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-last-name"
                placeholder="e.g. Green"
                {...register("last_name", { required: "Last name is required" })}
                className="mt-1"
              />
              {errors.last_name && (
                <p className="text-xs text-red-500 mt-1">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="edit-user-email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-user-email"
              type="email"
              placeholder="name@company.com"
              {...register("email", { required: "Email is required" })}
              className="mt-1"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="edit-user-phone">Phone number</Label>
            <Input
              id="edit-user-phone"
              type="tel"
              placeholder="+1 234 567 890"
              {...register("phone_number")}
              className="mt-1"
            />
          </div>

          {/* Role and Status row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-user-role">Role</Label>
              <Controller
                name="role_id"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      {(roles as Array<{ role_id: number; role_name: string }>).map((role) => (
                        <SelectItem key={role.role_id} value={String(role.role_id)}>
                          {role.role_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="edit-user-status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
