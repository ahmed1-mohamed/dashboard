"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
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
import { User, Mail, Phone } from "lucide-react";
import {
  editNewUserSchema,
  type EditNewUserInput,
} from "@/validators/edit-new-user.schema";
import {
  editUser,
  fetchRoles,
  fetchDevelopers,
  fetchUsersDetails,
} from "@/data/api-client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { AxiosError } from "axios";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  onSubmit?: (data: EditNewUserInput) => void;
  onSuccess?: () => void;
}

interface UserData {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role_id: number;
  role_name: string;
  role_type: string;
  status: string;
  description: string;
  profile_picture: string;
  developer_id?: number;
}

export function EditUserModal({
  isOpen,
  onClose,
  userId,
  onSubmit,
  onSuccess,
}: EditUserModalProps) {
  // const queryClient = useQueryClient();
  // const { data: session } = useSession();
  // const token = session?.user?.accessToken;
  // const [profilePreview, setProfilePreview] = useState<string>("");
  // const [profileFile, setProfileFile] = useState<File | null>(null);
  // const [isDeveloper, setIsDeveloper] = useState<boolean>(false);
  // const {
  //   register,
  //   handleSubmit,
  //   setValue,
  //   reset,
  //   control,
  //   setError,
  //   formState: { errors },
  // } = useForm<EditNewUserInput>({
  //   resolver: zodResolver(editNewUserSchema),
  //   defaultValues: {
  //     first_name: "",
  //     last_name: "",
  //     email: "",
  //     phone_number: "",
  //     role_id: 1,
  //     developer_id: undefined,
  //     status: "active",
  //     description: "",
  //     profile_picture: "",
  //   },
  // });
  // // Fetch user data
  // const { data: userData, isLoading: userLoading } = useQuery({
  //   queryKey: ["User", userId, isOpen],
  //   queryFn: () => fetchUsersDetails(userId, token!),
  //   enabled: !!token && !!userId && isOpen,
  // });
  // // Set form values when user data is loaded
  // useEffect(() => {
  //   if (userData) {
  //     const user = userData;
  //     setValue("first_name", user.first_name || "");
  //     setValue("last_name", user.last_name || "");
  //     setValue("email", user.email || "");
  //     setValue("phone_number", user.phone_number || "");
  //     setValue("role_id", user.role_id || 1);
  //     setValue("status", user.status as "active" | "inactive" | "banned");
  //     setValue("description", user.description || "");
  //     setValue("profile_picture", user.profile_picture || "");
  //     if (user.profile_picture) {
  //       setProfilePreview(user.profile_picture);
  //     }
  //     // Check if role is developer
  //     if (user.role_type?.toLowerCase() === "developer") {
  //       setIsDeveloper(true);
  //       if (user.developer_id) {
  //         setValue("developer_id", user.developer_id);
  //       }
  //     }
  //   }
  // }, [userData, setValue]);
  // const { data: roles = [], isLoading: rolesLoading } = useQuery({
  //   queryKey: ["Roles", isOpen],
  //   queryFn: () => fetchRoles(token!),
  //   enabled: !!token && isOpen,
  // });
  // const {
  //   data: developers = [],
  //   isLoading: developersLoading,
  // } = useQuery({
  //   queryKey: ["Developers", isOpen],
  //   queryFn: () => fetchDevelopers(token!, 1, 100),
  //   enabled: !!token && isOpen,
  // });
  // const mutation = useMutation({
  //   mutationFn: async (data: EditNewUserInput) => {
  //     if (!token) throw new Error("Not authenticated");
  //     return editUser(userId, data, token);
  //   },
  //   onSuccess: (data) => {
  //     toast.success("User updated successfully!");
  //     queryClient.invalidateQueries({ queryKey: ["Users"] });
  //     handleClose();
  //     if (onSubmit) {
  //       onSubmit(data);
  //     }
  //     if (onSuccess) {
  //       onSuccess();
  //     }
  //   },
  //   onError: (error: AxiosError<{ message?: string }>) => {
  //     const errorMessage =
  //       error.response?.data?.message ||
  //       "Failed to update user. Please try again.";
  //     setError("root", { message: errorMessage });
  //   },
  // });
  // const handleProfilePictureChange = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setProfileFile(file);
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setProfilePreview(reader.result as string);
  //       setValue("profile_picture", reader.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  // const handleClose = () => {
  //   reset();
  //   setProfilePreview("");
  //   setProfileFile(null);
  //   setIsDeveloper(false);
  //   onClose();
  // };
  // const handleRoleChange = (selectedRoleId: number) => {
  //   setValue("role_id", selectedRoleId);
  //   const selectedRole = roles.find((r: { role_id: number; role_type: string }) => r.role_id === selectedRoleId);
  //   if (selectedRole) {
  //     setIsDeveloper(selectedRole.role_type?.toLowerCase() === "developer");
  //   }
  // };
  // const onSubmitForm = (data: EditNewUserInput) => {
  //   mutation.mutate(data);
  // };
  // return (
  //   <Modal
  //     isOpen={isOpen}
  //     onClose={handleClose}
  //     title="Edit User"
  //     size="md"
  //     showCloseButton={false}
  //     footer={
  //       <div className="flex gap-3 justify-end w-full">
  //         <Button
  //           variant="outline"
  //           onClick={handleClose}
  //           disabled={mutation.isPending}
  //         >
  //           Close
  //         </Button>
  //         <Button
  //           className="bg-teal-600 hover:bg-teal-700 text-white"
  //           onClick={handleSubmit(onSubmitForm)}
  //           disabled={mutation.isPending || userLoading}
  //         >
  //           {mutation.isPending ? "Updating..." : "Update User"}
  //         </Button>
  //       </div>
  //     }
  //   >
  //     {userLoading ? (
  //       <div className="flex items-center justify-center py-12">
  //         <div className="text-center">
  //           <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
  //           <p className="mt-4 text-sm text-gray-600">Loading user data...</p>
  //         </div>
  //       </div>
  //     ) : (
  //       <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-5">
  //         {/* Upload Profile Picture */}
  //         <div>
  //           <Label className="text-sm font-medium text-gray-900 mb-2 block">
  //             Upload profile picture
  //           </Label>
  //           <div className="flex items-start gap-4">
  //             {/* Profile Preview */}
  //             <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
  //               {profilePreview ? (
  //                 <img
  //                   src={profilePreview}
  //                   alt="Profile preview"
  //                   className="w-full h-full object-cover"
  //                 />
  //               ) : (
  //                 <User className="h-8 w-8 text-gray-400" />
  //               )}
  //             </div>
  //             {/* File Input */}
  //             <div className="flex-1">
  //               <div className="relative">
  //                 <input
  //                   type="file"
  //                   id="profile-upload-edit"
  //                   accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif"
  //                   onChange={handleProfilePictureChange}
  //                   className="sr-only"
  //                 />
  //                 <label
  //                   htmlFor="profile-upload-edit"
  //                   className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
  //                 >
  //                   Choose files
  //                 </label>
  //                 <span className="ml-3 text-sm text-gray-500">
  //                   {profileFile ? profileFile.name : "No file chosen"}
  //                 </span>
  //               </div>
  //               <p className="text-xs text-gray-500 mt-2">
  //                 SVG, PNG, JPG or GIF (MAX. 800x400px).
  //               </p>
  //             </div>
  //           </div>
  //         </div>
  //         {/* Full Name and Email Row */}
  //         <div className="grid grid-cols-2 gap-4">
  //           <div>
  //             <Label htmlFor="first-name">
  //               First name <span className="text-red-500">*</span>
  //             </Label>
  //             <div className="relative mt-1">
  //               <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
  //               <Input
  //                 id="first-name"
  //                 placeholder="e.g. Bonnie"
  //                 {...register("first_name")}
  //                 className="pl-10"
  //               />
  //             </div>
  //             {errors.first_name && (
  //               <p className="text-xs red-500 mt-1">
  //                 {errors.first_name.message}
  //               </p>
  //             )}
  //           </div>
  //           <div>
  //             <Label htmlFor="last-name">
  //               Last name <span className="text-red-500">*</span>
  //             </Label>
  //             <div className="relative mt-1">
  //               <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
  //               <Input
  //                 id="last-name"
  //                 placeholder="e.g. Green"
  //                 {...register("last_name")}
  //                 className="pl-10"
  //               />
  //             </div>
  //             {errors.last_name && (
  //               <p className="text-xs red-500 mt-1">
  //                 {errors.last_name.message}
  //               </p>
  //             )}
  //           </div>
  //         </div>
  //         {/* Email */}
  //         <div>
  //           <Label htmlFor="email">
  //             Email address <span className="text-red-500">*</span>
  //           </Label>
  //           <div className="relative mt-1">
  //             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
  //             <Input
  //               id="email"
  //               type="email"
  //               placeholder="e.g. name@company.com"
  //               {...register("email")}
  //               className="pl-10"
  //             />
  //           </div>
  //           {errors.email && (
  //             <p className="text-xs red-500 mt-1">{errors.email.message}</p>
  //           )}
  //         </div>
  //         {/* Phone Number and Role Row */}
  //         <div className="grid grid-cols-2 gap-4">
  //           <div>
  //             <Label htmlFor="phone-number">Phone number</Label>
  //             <div className="relative mt-1">
  //               <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
  //               <Input
  //                 id="phone-number"
  //                 type="tel"
  //                 placeholder="+1 234 567 890"
  //                 {...register("phone_number")}
  //                 className="pl-10"
  //               />
  //             </div>
  //             {errors.phone_number && (
  //               <p className="text-xs red-500 mt-1">
  //                 {errors.phone_number.message}
  //               </p>
  //             )}
  //           </div>
  //           <div>
  //             <Label htmlFor="role">
  //               Role <span className="text-red-500">*</span>
  //             </Label>
  //             <Controller
  //               name="role_id"
  //               control={control}
  //               render={({ field }) => (
  //                 <Select
  //                   value={field.value?.toString() || ""}
  //                   onValueChange={(value) => handleRoleChange(Number(value))}
  //                 >
  //                   <SelectTrigger className="mt-1">
  //                     <SelectValue placeholder={rolesLoading ? "Loading roles..." : "Select Role"} />
  //                   </SelectTrigger>
  //                   <SelectContent>
  //                     {roles.map(
  //                       (role: { role_id: number; role_name: string }) => (
  //                         <SelectItem
  //                           key={role.role_id}
  //                           value={role.role_id.toString()}
  //                         >
  //                           {role.role_name}
  //                         </SelectItem>
  //                       )
  //                     )}
  //                   </SelectContent>
  //                 </Select>
  //               )}
  //             />
  //             {errors.role_id && (
  //               <p className="text-xs red-500 mt-1">
  //                 {errors.role_id.message}
  //               </p>
  //             )}
  //           </div>
  //         </div>
  //         {/* Status */}
  //         <div>
  //           <Label htmlFor="status">
  //             Status <span className="text-red-500">*</span>
  //           </Label>
  //           <Controller
  //             name="status"
  //             control={control}
  //             render={({ field }) => (
  //               <Select
  //                 value={field.value || "active"}
  //                 onValueChange={(value) => field.onChange(value as "active" | "inactive" | "banned")}
  //               >
  //                 <SelectTrigger className="mt-1">
  //                   <SelectValue placeholder="Select Status" />
  //                 </SelectTrigger>
  //                 <SelectContent>
  //                   <SelectItem value="active">Active</SelectItem>
  //                   <SelectItem value="inactive">Inactive</SelectItem>
  //                   <SelectItem value="banned">Banned</SelectItem>
  //                 </SelectContent>
  //               </Select>
  //             )}
  //           />
  //           {errors.status && (
  //             <p className="text-xs red-500 mt-1">
  //               {errors.status.message}
  //             </p>
  //           )}
  //         </div>
  //         {/* Developer Selection - Show when role is Developer */}
  //         {isDeveloper && (
  //           <div>
  //             <Label htmlFor="developer">
  //               Select Developer <span className="text-red-500">*</span>
  //             </Label>
  //             <Controller
  //               name="developer_id"
  //               control={control}
  //               render={({ field }) => (
  //                 <Select
  //                   value={field.value?.toString() || ""}
  //                   onValueChange={(value) => field.onChange(Number(value))}
  //                 >
  //                   <SelectTrigger className="mt-1">
  //                     <SelectValue placeholder={developersLoading ? "Loading developers..." : "Select Developer"} />
  //                   </SelectTrigger>
  //                   <SelectContent>
  //                     {developers.map(
  //                       (developer: { developer_id: number; developer_name: string }) => (
  //                         <SelectItem
  //                           key={developer.developer_id}
  //                           value={developer.developer_id.toString()}
  //                         >
  //                           {developer.developer_name}
  //                         </SelectItem>
  //                       )
  //                     )}
  //                   </SelectContent>
  //                 </Select>
  //               )}
  //             />
  //             {errors.developer_id && (
  //               <p className="text-xs red-500 mt-1">
  //                 {errors.developer_id.message}
  //               </p>
  //             )}
  //           </div>
  //         )}
  //         {/* Root Error Message */}
  //         {errors.root && (
  //           <p className="text-xs red-500 mt-1">
  //             {errors.root.message}
  //           </p>
  //         )}
  //       </form>
  //     )}
  //   </Modal>
  // );
}
