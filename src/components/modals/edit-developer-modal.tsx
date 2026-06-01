"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Upload } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Switch } from "@/components/ui/switch";
import { developerSchema, type FormValues } from "@/validators/developerSchema";
import { useDeveloperActions } from "@/hooks/use-developer-actions";
import { DeveloperFormData } from "@/hooks/use-developer-actions";

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

interface DeveloperData {
  developer_id: number;
  name: string;
  email: string;
  phone_number: string;
  website: string;
  logo: string;
  description: string;
  status: string;
  is_top: number;
}

interface EditDeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
  developerId: number | null;
  data: DeveloperData | undefined;
  onSuccess?: () => void;
}

export function EditDeveloperModal({
  isOpen,
  onClose,
  developerId,
  data,
  onSuccess,
}: EditDeveloperModalProps) {
  const { updateDeveloper, isUpdating } = useDeveloperActions();
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [existingLogo, setExistingLogo] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(developerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      website: "",
      description: "",
      status: "active",
      is_top: false,
    },
  });

  // Reset form when data changes
  useEffect(() => {
    if (data) {
      reset({
        name: data.name ?? "",
        email: data.email ?? "",
        phone_number: data.phone_number ?? "",
        website: data.website ?? "",
        status: data.status ?? "active",
        description: data.description ?? "",
        is_top: data.is_top === 1,
      });
      if (data.logo) {
        setExistingLogo(data.logo);
        setLogoPreview(data.logo);
      }
    }
  }, [data, reset]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setExistingLogo(""); // Clear existing logo when new file is selected
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    reset();
    setLogoPreview("");
    setLogoFile(null);
    setExistingLogo("");
    onClose();
  };

  const onSubmit = async (data: FormValues) => {
    if (!developerId) return;

    const formData: DeveloperFormData = {
      ...data,
      logo: logoFile || undefined,
    };

    try {
      await updateDeveloper({ developerId, data: formData });
      handleClose();
      onSuccess?.();
    } catch (error) {
      // Error is handled by the hook's toast notification
      console.error("Failed to update developer:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Developer"
      size="xl"
      showCloseButton={false}
      footer={
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUpdating}
          >
            Close
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleSubmit(onSubmit)}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Developer"}
          </Button>
        </div>
      }
    >
      <div className="max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Upload Developer Logo */}
          <div>
            <Label className="text-sm font-medium text-gray-900 mb-2 block">
              Upload developer logo
            </Label>
            <div className="flex items-start gap-4">
              {/* Logo Preview */}
              <div className="w-20 h-20 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="h-8 w-8 text-gray-400" />
                )}
              </div>

              {/* File Input */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="file"
                    id="logo-upload-edit"
                    accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif"
                    onChange={handleLogoChange}
                    className="sr-only"
                  />
                  <label
                    htmlFor="logo-upload-edit"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Choose files
                  </label>
                  <span className="ml-3 text-sm text-gray-500">
                    {logoFile
                      ? logoFile.name
                      : existingLogo
                        ? "Current logo"
                        : "No file chosen"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  SVG, PNG, JPG or GIF (MAX. 800x400px).
                </p>
              </div>
            </div>
          </div>

          {/* Developer Name and Email Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="developer-name" className="required">
                Developer name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="developer-name"
                placeholder="e.g. Emaar Properties"
                {...register("name")}
                className="mt-1"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email" className="required">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="info@p-adviser.com"
                {...register("email")}
                className="mt-1"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Contact Number */}
          <div>
            <Label htmlFor="contact-number" className="required">
              Contact Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contact-number"
              type="tel"
              placeholder="+20 115 4285 418"
              {...register("phone_number")}
              className="mt-1"
            />
            {errors.phone_number && (
              <p className="text-xs text-red-500 mt-1">
                {errors.phone_number.message}
              </p>
            )}
          </div>

          {/* Website */}
          <div>
            <Label htmlFor="website" className="required">
              Website <span className="text-red-500">*</span>
            </Label>
            <Input
              id="website"
              type="url"
              placeholder="www.p-adviser.com"
              {...register("website")}
              className="mt-1"
            />
            {errors.website && (
              <p className="text-xs text-red-500 mt-1">
                {errors.website.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Select value={value || ""} onValueChange={onChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Is Top Developer */}
          <div className="flex items-center gap-3">
            <Controller
              name="is_top"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch
                  id="is-top-developer"
                  checked={value || false}
                  onCheckedChange={onChange}
                />
              )}
            />
            <Label htmlFor="is-top-developer" className="cursor-pointer">
              Is Top Developer
            </Label>
          </div>

          {/* Short Description */}
          <div>
            <Label htmlFor="description" className="required">
              Short Description <span className="text-red-500">*</span>
            </Label>
            <RichTextEditor
              content={watch("description") || ""}
              onChange={(value: string) => setValue("description", value)}
              placeholder="Write text here ..."
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
}
