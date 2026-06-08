"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/modal";
import { Button, Input } from "@/components/ui";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminOffersService } from "@/services/AdminOffersService";
import { DashboardAdminService } from "@/services/DashboardAdminService";

interface AddOfferModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddOfferModal({
  open,
  onClose,
  onSuccess,
}: AddOfferModalProps) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      entity_type: "PROPERTIES",
      entity_id: "",
      discount_type: "percentage",
      discount_pct: "",
      description: "",
      starts_at: "",
      ends_at: "",
    },
  });

  const selectedEntityType = watch("entity_type");

  const { data: entitiesData, isLoading: loadingEntities } = useQuery({
    queryKey: ["entitiesList", selectedEntityType],
    queryFn: async () => {
      if (selectedEntityType === "DEVELOPERS") return DashboardAdminService.getDevelopers();
      if (selectedEntityType === "PROJECTS") return DashboardAdminService.getProjects();
      if (selectedEntityType === "PROPERTIES") return DashboardAdminService.getProperties();
      return { data: [] };
    },
    enabled: open,
  });

  const availableEntities = Array.isArray((entitiesData as any)?.data)
    ? (entitiesData as any).data
    : Array.isArray(entitiesData)
      ? entitiesData
      : [];
  const mutation = useMutation({
    mutationFn: (data: any) => AdminOffersService.createOffer(data, token as string),
    onSuccess: () => {
      toast.success("Offer created successfully!");
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["offersTotals"] });
      if (onSuccess) onSuccess();
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || "Failed to create offer");
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (formData: any) => {
    const payload: any = {
      name: formData.name,
      entity_type: formData.entity_type,
      entity_id: parseInt(formData.entity_id),
      discount_type: formData.discount_type,
      is_active: true, // Default to active upon creation
    };

    if (formData.description) payload.description = formData.description;
    if (formData.discount_pct) payload.discount_pct = parseFloat(formData.discount_pct);
    if (formData.starts_at) payload.starts_at = formData.starts_at; // Format depends on what server expects, assuming YYYY-MM-DD works
    if (formData.ends_at) payload.ends_at = formData.ends_at;

    mutation.mutate(payload);
  };

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title="Create New Offer"
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto px-1 pb-2">
        <div className="space-y-1.5">
          <Label>Offer Title <span className="text-red-500">*</span></Label>
          <Input placeholder="e.g., Summer Flash Sale - 20% Off" {...register("name", { required: true })} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Link To <span className="text-red-500">*</span></Label>
            <Controller
              name="entity_type"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PROPERTIES">Properties</SelectItem>
                    <SelectItem value="PROJECTS">Projects</SelectItem>
                    <SelectItem value="DEVELOPERS">Developers</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Select {selectedEntityType.charAt(0) + selectedEntityType.slice(1).toLowerCase()} <span className="text-red-500">*</span></Label>
            <Controller
              name="entity_id"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} disabled={loadingEntities}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder={loadingEntities ? "Loading..." : "Select Target"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEntities.map((entity: any, index: number) => {
                      const entityId = entity.id || entity.project_id || entity.developer_id || entity.property_id || entity.offer_id || String(index);
                      return (
                        <SelectItem key={entityId} value={entityId.toString()}>
                          {entity.name || entity.title || entity.developer_name || entity.project_name || entity.property_name || `Item ${entityId}`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Discount type <span className="text-red-500">*</span></Label>
          <Controller
            name="discount_type"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select Discount Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage ( % )</SelectItem>
                  <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                  <SelectItem value="special_deal">Special Deal</SelectItem>
                  <SelectItem value="join_offers">Join Offers</SelectItem>
                  <SelectItem value="discount_events">Discount Events</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Discount Percentage</Label>
          <Input type="number" placeholder="e.g 20" {...register("discount_pct")} />
        </div>

        <div className="space-y-1.5">
          <Label>Discount Display Text</Label>
          <Input placeholder="e.g., 20% OFF or AED 500,000 OFF" {...register("description")} />
          <p className="text-xs text-gray-500">This text will be displayed on the offer badge</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Valid From <span className="text-red-500">*</span></Label>
            <Input type="date" {...register("starts_at", { required: true })} />
          </div>
          <div className="space-y-1.5">
            <Label>Valid Until (Optional)</Label>
            <Input type="date" {...register("ends_at")} />
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-4 sticky bottom-0 bg-white border-t mt-4 py-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={mutation.isPending}>
            Close
          </Button>
          <Button type="submit" disabled={mutation.isPending} className="bg-teal-600 hover:bg-teal-700 text-white">
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Offer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
