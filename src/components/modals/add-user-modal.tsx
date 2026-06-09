"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserActions } from "@/hooks/use-user-actions";
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
import { User, Mail, Phone, Lock } from "lucide-react";
import {
  createNewUserSchema,
  type CreateNewUserInput,
} from "@/validators/create-new-user.schema";
import { useRolesSelect } from "@/hooks/use-roles-select";
import { useDevelopersSelect } from "@/hooks/use-developers-select";
import { useState } from "react";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: CreateNewUserInput) => void;
}

export function AddUserModal({ isOpen, onClose, onSubmit }: AddUserModalProps) {
  const { createUser, isCreating } = useUserActions();
  const { roles, isLoading: rolesLoading } = useRolesSelect();
  const { developers, isLoading: developersLoading } = useDevelopersSelect();

  const [profilePreview, setProfilePreview] = useState<string>("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [isDeveloper, setIsDeveloper] = useState<boolean>(false);

  const developerRoleOptions = [
    { label: "Admin", value: "developer_admin" },
    { label: "Agent", value: "developer_agent" },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateNewUserInput>({
    resolver: zodResolver(createNewUserSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      password: "",
      password_confirmation: "",
      role_id: 1,
      status: "active",
      description: "",
      profile_picture: "",
      developer_id: undefined,
      developer_role: "",
    },
  });

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
        setValue("profile_picture", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRoleChange = (selectedRoleId: number) => {
    setValue("role_id", selectedRoleId);
    const selectedRole = roles.find((r) => r.role_id === selectedRoleId);
    if (selectedRole) {
      setIsDeveloper(selectedRole.role_type?.toLowerCase() === "developer");
    }
  };

  const handleClose = () => {
    reset();
    setProfilePreview("");
    setProfileFile(null);
    setIsDeveloper(false);
    onClose();
  };

  const onSubmitForm = async (data: CreateNewUserInput) => {
    try {
      await createUser(data);
      handleClose();
      onSubmit?.(data);
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New User"
      size="md"
      scrollable={true}
      showCloseButton={false}
      footer={
        <div className="flex gap-3 justify-end w-full">
          <Button variant="outline" onClick={handleClose} disabled={isCreating}>
            Close
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleSubmit(onSubmitForm)}
            disabled={isCreating}
          >
            {isCreating ? "Adding..." : "Add User"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-5">
        {/* Upload Profile Picture */}
        <div>
          <Label className="text-sm font-medium text-gray-900 mb-2 block">
            Upload profile picture
          </Label>
          <div className="flex items-start gap-4">
            {/* Profile Preview */}
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
              {profilePreview ? (
                <img
                  src={profilePreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-gray-400" />
              )}
            </div>

            {/* File Input */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif"
                  onChange={handleProfilePictureChange}
                  className="sr-only"
                />
                <label
                  htmlFor="profile-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Choose files
                </label>
                <span className="ml-3 text-sm text-gray-500">
                  {profileFile ? profileFile.name : "No file chosen"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                SVG, PNG, JPG or GIF (MAX. 800x400px).
              </p>
            </div>
          </div>
        </div>

        {/* Full Name and Email Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first-name">
              First name <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="first-name"
                placeholder="e.g. Bonnie"
                {...register("first_name")}
                className="pl-10"
              />
            </div>
            {errors.first_name && (
              <p className="text-xs text-red-500 mt-1">
                {errors.first_name.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="last-name">
              Last name <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="last-name"
                placeholder="e.g. Green"
                {...register("last_name")}
                className="pl-10"
              />
            </div>
            {errors.last_name && (
              <p className="text-xs text-red-500 mt-1">
                {errors.last_name.message}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">
            Email address <span className="text-red-500">*</span>
          </Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="e.g. name@company.com"
              {...register("email")}
              className="pl-10"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Number and Role Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone-number">Phone number</Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="phone-number"
                type="tel"
                placeholder="+1 234 567 890"
                {...register("phone_number")}
                className="pl-10"
              />
            </div>
            {errors.phone_number && (
              <p className="text-xs text-red-500 mt-1">
                {errors.phone_number.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="role">
              Role <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="role_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value?.toString() || ""}
                  onValueChange={(value) => handleRoleChange(Number(value))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue
                      placeholder={
                        rolesLoading ? "Loading roles..." : "Select Role"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(
                      (role: { role_id: number; role_name: string }) => (
                        <SelectItem
                          key={role.role_id}
                          value={role.role_id.toString()}
                        >
                          {role.role_name}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role_id && (
              <p className="text-xs text-red-500 mt-1">
                {errors.role_id.message}
              </p>
            )}
          </div>
        </div>

        {/* Developer Selection - Show when role is Developer */}
        {isDeveloper && (
          <div>
            <Label htmlFor="developer">
              Select Developer <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="developer_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value?.toString() || ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue
                      placeholder={
                        developersLoading
                          ? "Loading developers..."
                          : "Select Developer"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {developersLoading && developers.length === 0 ? (
                      <div className="p-2 text-sm text-gray-500 text-center">
                        Loading developers...
                      </div>
                    ) : developers.length === 0 ? (
                      <div className="p-2 text-sm text-gray-500 text-center">
                        No developers available
                      </div>
                    ) : (
                      developers.map(
                        (developer) => (
                          <SelectItem
                            key={developer.developer_id}
                            value={developer.developer_id.toString()}
                          >
                            {developer.developer_name}
                          </SelectItem>
                        ),
                      )
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.developer_id && (
              <p className="text-xs text-red-500 mt-1">
                {errors.developer_id.message}
              </p>
            )}
          </div>
        )}

        {/* Developer Role Selection - Show when role is Developer */}
        {isDeveloper && (
          <div>
            <Label htmlFor="developer_role">
              Developer Role <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="developer_role"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Developer Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {developerRoleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.developer_role && (
              <p className="text-xs text-red-500 mt-1">
                {errors.developer_role.message}
              </p>
            )}
          </div>
        )}

        {/* Root Error Message */}
        {errors.root && (
          <p className="text-xs text-red-500 mt-1">{errors.root.message}</p>
        )}

        {/* Password and Confirm Password Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="password">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="pl-10"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="confirm-password">
              Confirm password <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                {...register("password_confirmation")}
                className="pl-10"
              />
            </div>
            {errors.password_confirmation && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}