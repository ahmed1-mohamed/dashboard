"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check } from "lucide-react";
import { editRoles } from "@/data/api-client";
import { toast } from "sonner";
import { z } from "zod";

interface EditRoleModalProps {
  roleId: number;
  roleName: string;
  roleType: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const roleSchema = z.object({
  role_name: z.string().min(1, "Role name is required"),
  role_type: z.string().min(1, "Role type is required"),
  description: z.string().optional(),
});

type RoleFormData = z.infer<typeof roleSchema>;

export function EditRoleModal({
  roleId,
  roleName,
  roleType,
  description,
  isOpen,
  onClose,
  onSuccess,
}: EditRoleModalProps) {
  // const queryClient = useQueryClient();
  // const { data: session } = useSession();
  // const token = session?.user.accessToken;

  // const {
  //   register,
  //   reset,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<RoleFormData>({
  //   resolver: zodResolver(roleSchema),
  //   defaultValues: {
  //     role_name: roleName,
  //     role_type: roleType,
  //     description: description,
  //   },
  // });

  // useEffect(() => {
  //   if (isOpen) {
  //     reset({
  //       role_name: roleName,
  //       role_type: roleType,
  //       description: description,
  //     });
  //   }
  // }, [isOpen, roleName, roleType, description, reset]);

  // const mutation = useMutation({
  //   mutationFn: (data: RoleFormData) => editRoles(roleId, data as any, token!),
  //   onSuccess: () => {
  //     toast.success("Role updated successfully!");
  //     queryClient.invalidateQueries({ queryKey: ["roles"] });
  //     onSuccess();
  //     onClose();
  //   },
  //   onError: (error: any) => {
  //     toast.error(error.message || "Failed to update role");
  //   },
  // });

  // const handleFormSubmit = (data: RoleFormData) => {
  //   mutation.mutate(data);
  // };

  // if (!isOpen) return null;

  // return (
  //   <Modal isOpen={isOpen} onClose={onClose} title="Edit Role" size="md">
  //     <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
  //       <div>
  //         <Label>
  //           Role Name <span className="text-red-500">*</span>
  //         </Label>
  //         <Input {...register("role_name")} className="mt-1" />
  //         {errors.role_name && (
  //           <p className="text-red-500 text-sm mt-1">
  //             {errors.role_name.message}
  //           </p>
  //         )}
  //       </div>

  //       <div>
  //         <Label>
  //           Role Type <span className="text-red-500">*</span>
  //         </Label>
  //         <Input {...register("role_type")} className="mt-1" />
  //         {errors.role_type && (
  //           <p className="text-red-500 text-sm mt-1">
  //             {errors.role_type.message}
  //           </p>
  //         )}
  //       </div>

  //       <div>
  //         <Label>Description</Label>
  //         <Textarea {...register("description")} className="mt-1" rows={3} />
  //       </div>

  //       <div className="flex gap-3 justify-end pt-4">
  //         <Button type="button" variant="outline" onClick={onClose}>
  //           Cancel
  //         </Button>
  //         <Button
  //           type="submit"
  //           className="bg-teal-600 hover:bg-teal-700 text-white"
  //           disabled={mutation.isPending}
  //         >
  //           {mutation.isPending ? (
  //             <>
  //               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
  //               Saving...
  //             </>
  //           ) : (
  //             <>
  //               <Check className="w-4 h-4 mr-2" />
  //               Save Changes
  //             </>
  //           )}
  //         </Button>
  //       </div>
  //     </form>
  //   </Modal>
  // );
}
