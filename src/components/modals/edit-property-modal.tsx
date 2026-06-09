"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { AdminPropertiesService } from "@/features/properties/services/AdminPropertiesService";
import { fetchPropertyTypes, fetchPropertySubtype, fetchProjectsPaginated } from "@/data/api-client";

interface EditPropertyFormValues {
  property_name: string;
  unit_number: string;
  floor: string;
  price: string;
  size: string;
  bedrooms: string;
  bathrooms: string;
  project_id: string;
  id: string;
  availability_status: string;
  construction_status: string;
  furnish_status: string;
  finishing_status: string;
  view: string;
  ownership_type: string;
  description: string;
}

interface EditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
}

const availabilityOptions = [
  { label: "Available", value: "available" },
  { label: "Reserved", value: "reserved" },
  { label: "Sold", value: "sold" },
];

const constructionStatusOptions = [
  { label: "Ready", value: "ready" },
  { label: "Under Construction", value: "under-construction" },
  { label: "Off Plan", value: "off-plan" },
];

const furnishOptions = [
  { label: "Furnished", value: "furnished" },
  { label: "UnFurnished", value: "unfurnished" },
  { label: "SemiFurnished", value: "semi-furnished" },
];

const finishingOptions = [
  { label: "Finished", value: "finished" },
  { label: "SemiFinished", value: "semi-finished" },
  { label: "UnFinished", value: "unfinished" },
];

const viewOptions = [
  { label: "Sea View", value: "sea" },
  { label: "City View", value: "city" },
  { label: "Garden View", value: "garden" },
];

const ownershipOptions = [
  { label: "Freehold", value: "freehold" },
  { label: "Leasehold", value: "leasehold" },
];

export function EditPropertyModal({
  isOpen,
  onClose,
  propertyId,
}: EditPropertyModalProps) {
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
  } = useForm<EditPropertyFormValues>({
    defaultValues: {
      property_name: "",
      unit_number: "",
      floor: "",
      price: "",
      size: "",
      bedrooms: "",
      bathrooms: "",
      project_id: "",
      id: "",
      availability_status: "available",
      construction_status: "",
      furnish_status: "",
      finishing_status: "",
      view: "",
      ownership_type: "",
      description: "",
    },
  });

  // Fetch property details
  const { data: propertyData, isLoading: propertyLoading } = useQuery({
    queryKey: ["property-detail", propertyId],
    queryFn: () => AdminPropertiesService.getProperty(propertyId),
    enabled: !!token && propertyId != null && isOpen,
  });

  // Fetch property types
  const { data: propertyTypesRaw = [] } = useQuery({
    queryKey: ["property-types"],
    queryFn: () => fetchPropertyTypes(token!),
    enabled: !!token && isOpen,
    select: (data) => (data as { data?: unknown[] }).data ?? [],
  });

  // Fetch projects for dropdown
  const { data: projectsRaw } = useQuery({
    queryKey: ["projects-dropdown"],
    queryFn: () => fetchProjectsPaginated(token!, 1, 100),
    enabled: !!token && isOpen,
    select: (data) => (data as { data?: unknown[] }).data ?? [],
  });

  const propertyTypes = propertyTypesRaw as Array<{ id: number; property_type_name: string }>;
  const projects = (projectsRaw ?? []) as Array<{ project_id: number; project_name: string }>;

  // Populate form when data arrives
  useEffect(() => {
    if (!propertyData) return;
    const raw = (propertyData as { data?: unknown }).data ?? propertyData;
    const p = raw as Record<string, unknown>;
    reset({
      property_name: (p.property_name as string) ?? "",
      unit_number: (p.unit_number as string) ?? (p.property_no as string) ?? "",
      floor: String(p.floor ?? ""),
      price: String(p.price ?? ""),
      size: String(p.size ?? ""),
      bedrooms: String(p.bedrooms ?? ""),
      bathrooms: String(p.bathrooms ?? ""),
      project_id: p.project_id ? String(p.project_id) : "",
      id: p.id ? String(p.id) : "",
      availability_status: (p.availability_status as string) ?? "available",
      construction_status: (p.construction_status as string) ?? "",
      furnish_status: (p.furnish_status as string) ?? "",
      finishing_status: (p.finishing_status as string) ?? "",
      view: (p.view as string) ?? "",
      ownership_type: (p.ownership_type as string) ?? "",
      description: (p.description as string) ?? "",
    });
  }, [propertyData, reset]);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const onSubmit = async (formValues: EditPropertyFormValues) => {
    if (!propertyId) return;
    setIsSubmitting(true);
    try {
      await AdminPropertiesService.updateProperty(propertyId, {
        ...formValues,
        project_id: formValues.project_id ? Number(formValues.project_id) : undefined,
        id: formValues.id ? Number(formValues.id) : undefined,
        price: formValues.price ? Number(formValues.price) : undefined,
        size: formValues.size ? Number(formValues.size) : undefined,
        bedrooms: formValues.bedrooms ? Number(formValues.bedrooms) : undefined,
        bathrooms: formValues.bathrooms ? Number(formValues.bathrooms) : undefined,
      });
      toast.success("Property updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property-detail", propertyId] });
      handleClose();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message ?? err.message ?? "Failed to update property");
    } finally {
      setIsSubmitting(false);
    }
  };
  console.log(propertyTypes, "propert types");
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Property"
      size="xl"
      showCloseButton={false}
      footer={
        <div className="flex gap-3 justify-end w-full">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || propertyLoading}
          >
            {isSubmitting ? "Updating..." : "Update Property"}
          </Button>
        </div>
      }
    >
      {propertyLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent" />
        </div>
      ) : (
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Basic Info */}
            <h3 className="text-sm font-semibold text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ep-name">Property Name</Label>
                <Input id="ep-name" {...register("property_name")} placeholder="Property Name" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="ep-unit">Unit Number</Label>
                <Input id="ep-unit" {...register("unit_number")} placeholder="e.g. Unit 101" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="ep-project">Project</Label>
                <Controller
                  name="project_id"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select Project" /></SelectTrigger>
                      <SelectContent>
                        {projects.map((p) => (
                          <SelectItem key={p.project_id} value={String(p.project_id)}>
                            {p.project_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="ep-type">Property Type</Label>
                <Controller
                  name="id"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select Type" /></SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((t, index) => (
                          <SelectItem
                            key={`type-${t.id}-${index}`}
                            value={String(t.id)}
                          >
                            {t.property_type_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Status */}
            <h3 className="text-sm font-semibold text-gray-900 mt-2">Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Availability</Label>
                <Controller name="availability_status" control={control} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Availability" /></SelectTrigger>
                    <SelectContent>
                      {availabilityOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )} />
              </div>
              <div>
                <Label>Construction Status</Label>
                <Controller name="construction_status" control={control} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Construction Status" /></SelectTrigger>
                    <SelectContent>
                      {constructionStatusOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )} />
              </div>
            </div>

            {/* Size & Pricing */}
            <h3 className="text-sm font-semibold text-gray-900 mt-2">Size & Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="ep-price">Price</Label>
                <Input id="ep-price" type="number" {...register("price")} placeholder="Price" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="ep-size">Size (sqm)</Label>
                <Input id="ep-size" type="number" {...register("size")} placeholder="Size" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="ep-floor">Floor</Label>
                <Input id="ep-floor" {...register("floor")} placeholder="Floor" className="mt-1" />
              </div>
            </div>

            {/* Rooms */}
            <h3 className="text-sm font-semibold text-gray-900 mt-2">Rooms</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="ep-bedrooms">Bedrooms</Label>
                <Input id="ep-bedrooms" type="number" {...register("bedrooms")} placeholder="Bedrooms" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="ep-bathrooms">Bathrooms</Label>
                <Input id="ep-bathrooms" type="number" {...register("bathrooms")} placeholder="Bathrooms" className="mt-1" />
              </div>
              <div>
                <Label>View</Label>
                <Controller name="view" control={control} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select View" /></SelectTrigger>
                    <SelectContent>
                      {viewOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )} />
              </div>
            </div>

            {/* Finishing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Furnish Status</Label>
                <Controller name="furnish_status" control={control} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Furnish Status" /></SelectTrigger>
                    <SelectContent>
                      {furnishOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )} />
              </div>
              <div>
                <Label>Finishing Type</Label>
                <Controller name="finishing_status" control={control} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Finishing" /></SelectTrigger>
                    <SelectContent>
                      {finishingOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )} />
              </div>
              <div>
                <Label>Ownership Type</Label>
                <Controller name="ownership_type" control={control} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Ownership" /></SelectTrigger>
                    <SelectContent>
                      {ownershipOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )} />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="ep-desc">Description</Label>
              <Input id="ep-desc" {...register("description")} placeholder="Property description" className="mt-1" />
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
}