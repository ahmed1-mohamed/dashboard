"use client";

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

const offerSchema = z.object({
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
  starts_at: z.string().min(1, "Valid From date is required"),
  ends_at: z.string().optional(),
});

type OfferFormValues = z.infer<typeof offerSchema>;

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

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
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

  const availableEntities: any[] = Array.isArray((entitiesData as any)?.data)
    ? (entitiesData as any).data
    : Array.isArray(entitiesData)
      ? (entitiesData as any[])
      : [];

  const mutation = useMutation({
    mutationFn: (data: OfferFormValues) =>
      AdminOffersService.createOffer({
        name: data.name,
        entity_type: data.entity_type,
        entity_id: parseInt(data.entity_id),
        discount_type: data.discount_type,
        is_active: true,
        ...(data.description && { description: data.description }),
        ...(data.discount_pct && { discount_pct: parseFloat(data.discount_pct) }),
        ...(data.starts_at && { starts_at: data.starts_at }),
        ...(data.ends_at && { ends_at: data.ends_at }),
      }),
    onSuccess: () => {
      toast.success("Offer created successfully!");
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["offersTotals"] });
      if (onSuccess) onSuccess();
      handleClose();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0] ||
        error?.message ||
        "Failed to create offer";
      toast.error(message);
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (formData: OfferFormValues) => {
    mutation.mutate(formData);
  };

  return (
    <Modal isOpen={open} onClose={handleClose} title="Create New Offer" size="md">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-h-[75vh] overflow-y-auto px-1 pb-2"
      >
        {/* Offer Title */}
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

        {/* Link To + Entity */}
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
                  <SelectTrigger className={`bg-white ${errors.entity_type ? "border-red-500" : ""}`}>
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
              {selectedEntityType.charAt(0) + selectedEntityType.slice(1).toLowerCase()}{" "}
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
                  <SelectTrigger className={`bg-white ${errors.entity_id ? "border-red-500" : ""}`}>
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

        {/* Discount Type */}
        <div className="space-y-1.5">
          <Label>
            Discount Type <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="discount_type"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className={`bg-white ${errors.discount_type ? "border-red-500" : ""}`}>
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

        {/* Discount Percentage */}
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

        {/* Description */}
        <div className="space-y-1.5">
          <Label>Description</Label>
          <Input
            placeholder="e.g., 20% OFF or AED 500,000 OFF"
            {...register("description")}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>
              Valid From <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              {...register("starts_at")}
              className={errors.starts_at ? "border-red-500" : ""}
            />
            {errors.starts_at && (
              <p className="text-xs text-red-500">{errors.starts_at.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Valid Until (Optional)</Label>
            <Input type="date" {...register("ends_at")} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end pt-4 sticky bottom-0 bg-white border-t mt-4 py-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={mutation.isPending}
          >
            Close
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Offer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
