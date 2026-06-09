"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import { Button, Input } from "@/components/ui";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminOffersService } from "@/services/AdminOffersService";
import { DashboardAdminService } from "@/services/DashboardAdminService";

const editOfferSchema = z.object({
  name: z.string().min(1, "Offer title is required").max(128, "Max 128 characters"),
  entity_type: z.enum(["DEVELOPERS", "PROJECTS", "PROPERTIES"], {
    required_error: "Please select what to link this offer to",
  }),
  entity_id: z.string().min(1, "Please select a target entity"),
  discount_type: z.enum(
    ["percentage", "fixed_amount", "special_deal", "join_offers", "discount_events"],
    { required_error: "Discount type is required" },
  ),
  discount_pct: z
    .string()
    .optional()
    .refine(
      (val) => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100),
      "Discount must be between 0 and 100",
    ),
  description: z.string().optional(),
  starts_at: z.string().optional(),
  ends_at: z.string().optional(),
  is_active: z.string().optional(),
});

type EditOfferFormValues = z.infer<typeof editOfferSchema>;

interface EditOfferModalProps {
  open: boolean;
  onClose: () => void;
  offerId: number | string | null;
  onSuccess?: () => void;
}

export default function EditOfferModal({
  open,
  onClose,
  offerId,
  onSuccess,
}: EditOfferModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditOfferFormValues>({
    resolver: zodResolver(editOfferSchema),
    defaultValues: {
      name: "",
      entity_type: "PROPERTIES",
      entity_id: "",
      discount_type: "percentage",
      discount_pct: "",
      description: "",
      starts_at: "",
      ends_at: "",
      is_active: "1",
    },
  });

  const selectedEntityType = watch("entity_type");

  const { data: offerResponse, isLoading: loadingOffer } = useQuery({
    queryKey: ["offerDetails", offerId],
    queryFn: () => AdminOffersService.getOffer(offerId!.toString()),
    enabled: open && !!offerId,
  });

  const offer = (offerResponse as any)?.data?.data || (offerResponse as any)?.data || null;

  useEffect(() => {
    if (!offer) return;
    const formatDate = (dateStr: string | undefined) => {
      if (!dateStr) return "";
      return dateStr.split("T")[0];
    };
    reset({
      name: offer.name || offer.offer_details || "",
      entity_type:
        (offer.entity_type as "DEVELOPERS" | "PROJECTS" | "PROPERTIES") ||
        "PROPERTIES",
      entity_id: String(offer.entity_id || ""),
      discount_type:
        (offer.discount_type as EditOfferFormValues["discount_type"]) ||
        "percentage",
      discount_pct: offer.discount_pct != null ? String(offer.discount_pct) : "",
      description: offer.description || "",
      starts_at: formatDate(offer.starts_at || offer.valid_from),
      ends_at: formatDate(offer.ends_at || offer.valid_to),
      is_active: offer.is_active ? "1" : "0",
    });
  }, [offer, reset]);

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

  const availableEntities: any[] = Array.isArray((entitiesData as any)?.data)
    ? (entitiesData as any).data
    : Array.isArray(entitiesData)
      ? (entitiesData as any[])
      : [];

  const mutation = useMutation({
    mutationFn: (data: EditOfferFormValues) => {
      const formData = new FormData();
      formData.append("entity_type", data.entity_type);
      formData.append("entity_id", data.entity_id);
      formData.append("name", data.name);
      formData.append("discount_type", data.discount_type);
      if (data.description) formData.append("description", data.description);
      if (data.discount_pct) formData.append("discount_pct", data.discount_pct);
      if (data.starts_at) formData.append("starts_at", data.starts_at);
      if (data.ends_at) formData.append("ends_at", data.ends_at);
      if (data.is_active !== undefined) formData.append("is_active", data.is_active === "1" ? "1" : "0");
      return AdminOffersService.updateOffer(Number(offerId), formData);
    },
    onSuccess: () => {
      toast.success("Offer updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["offerDetails", offerId] });
      queryClient.invalidateQueries({ queryKey: ["offersTotals"] });
      if (onSuccess) onSuccess();
      handleClose();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0] ||
        error?.message ||
        "Failed to update offer";
      toast.error(message);
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (formData: EditOfferFormValues) => {
    mutation.mutate(formData);
  };

  return (
    <Modal isOpen={open} onClose={handleClose} title="Edit Offer" size="xl">
      {loadingOffer ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 max-h-[75vh] overflow-y-auto px-1 pb-2"
        >
          <div className="space-y-1.5">
            <Label>
              Offer Title <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="e.g., Summer Flash Sale - 20% Off"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>
                Link To <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="entity_type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className={`bg-white ${errors.entity_type ? "border-red-500" : ""}`}
                    >
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
              {errors.entity_type && (
                <p className="text-xs text-red-500">{errors.entity_type.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>
                Select{" "}
                {selectedEntityType.charAt(0) +
                  selectedEntityType.slice(1).toLowerCase()}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="entity_id"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loadingEntities}
                  >
                    <SelectTrigger
                      className={`bg-white ${errors.entity_id ? "border-red-500" : ""}`}
                    >
                      <SelectValue
                        placeholder={loadingEntities ? "Loading..." : "Select Target"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEntities.map((entity: any, index: number) => {
                        const entityId =
                          entity.id ||
                          entity.project_id ||
                          entity.developer_id ||
                          entity.property_id ||
                          String(index);
                        const entityName =
                          entity.name ||
                          entity.title ||
                          entity.developer_name ||
                          entity.project_name ||
                          entity.property_name ||
                          `Item ${entityId}`;
                        return (
                          <SelectItem key={entityId} value={entityId.toString()}>
                            {entityName}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.entity_id && (
                <p className="text-xs text-red-500">{errors.entity_id.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>
              Discount Type <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="discount_type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    className={`bg-white ${errors.discount_type ? "border-red-500" : ""}`}
                  >
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
            {errors.discount_type && (
              <p className="text-xs text-red-500">{errors.discount_type.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Discount Percentage (0 – 100)</Label>
            <Input
              type="number"
              min={0}
              max={100}
              step="0.01"
              placeholder="e.g. 20"
              {...register("discount_pct")}
              className={errors.discount_pct ? "border-red-500" : ""}
            />
            {errors.discount_pct && (
              <p className="text-xs text-red-500">{errors.discount_pct.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <Input placeholder="e.g., 20% OFF or AED 500,000 OFF" {...register("description")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Valid From</Label>
              <Input type="date" {...register("starts_at")} />
            </div>
            <div className="space-y-1.5">
              <Label>Valid Until (Optional)</Label>
              <Input type="date" {...register("ends_at")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Status</Label>
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Active</SelectItem>
                    <SelectItem value="0">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4 sticky bottom-0 bg-white border-t mt-4 py-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Offer
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}