"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
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
import { Check, Loader2, HelpCircle, Sparkles, DollarSign, Users, Zap, Layers, Globe, MapPin, Layout } from "lucide-react";
import { addBadge } from "@/data/api-client";
import { toast } from "sonner";
import { z } from "zod";
import { Switch } from "@/components/ui/switch";

interface AddFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  projectId?: number;
}

const badgeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  applies_to: z.enum(["DEVELOPERS", "PROPERTIES", "PROJECTS"], {
    message: "Applies to must be one of: developer, property, agent",
  }),
  monthly_price_credits: z
    .number()
    .min(0, "Monthly price credits must be at least 0"),
  max_entities: z.number().min(1, "Max entities must be at least 1"),
  priority_boost: z.number().min(0, "Priority boost must be at least 0"),
  is_active: z.boolean(),
  placement: z.object({
    platform: z.enum(["web", "mobile", "both"]),
    location: z.string().min(1, "Location is required"),
    format: z.enum(["banner", "card", "native", "pop_up", "slider"]),
  }),
});

// Define form data type explicitly to ensure required fields
type BadgeFormData = {
  name: string;
  applies_to: "DEVELOPERS" | "PROPERTIES" | "PROJECTS";
  monthly_price_credits: number;
  max_entities: number;
  priority_boost: number;
  is_active: boolean;
  placement: {
    platform: "web" | "mobile" | "both";
    location: string;
    format: "banner" | "card" | "native" | "pop_up" | "slider";
  };
};

export function AddFeatureModal({
  isOpen,
  onClose,
  onSuccess,
  projectId,
}: AddFeatureModalProps) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user.accessToken;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<BadgeFormData>({
    resolver: zodResolver(badgeSchema),
    defaultValues: {
      name: "",
      applies_to: undefined,
      monthly_price_credits: 0,
      max_entities: 1,
      priority_boost: 0,
      is_active: true,
      placement: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: BadgeFormData) => {
      // Transform data to match API expectations
      const apiData = {
        name: data.name,
        applies_to: data.applies_to.toLowerCase() as
          | "developer"
          | "property"
          | "agent",
        monthly_price_credits: data.monthly_price_credits,
        max_entities: data.max_entities,
      };
      return addBadge(apiData, token!);
    },
    onSuccess: () => {
      toast.success("Badge created successfully!");
      queryClient.invalidateQueries({ queryKey: ["badges"] });
      if (onSuccess) {
        onSuccess();
      }
      handleClose();
    },
    onError: (error: any) => {
      // Error is already handled in api-client.ts with toast
      console.error("Failed to create badge:", error);
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (formData: BadgeFormData) => {
    console.log("Data being sent to the server:", formData);
    mutation.mutate(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Feature"
      size="lg"
      showCloseButton={false}
      scrollable
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-1">
        {errors.root && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
            {errors.root.message}
          </div>
        )}

        {/* Header Icon */}
        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
          <div className="p-1.5 bg-emerald-100 rounded-md">
            <Sparkles className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-900">Add New Feature</p>
            <p className="text-xs text-emerald-600">Create a premium feature/badge for your platform</p>
          </div>
        </div>

        {/* Badge Name */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs">
            <Sparkles className="h-3 w-3 text-emerald-500" />
            Feature Name <span className="text-red-500">*</span>
            <HelpCircle className="h-3 w-3 text-gray-400 ml-auto" />
          </Label>
          <Input 
            placeholder="e.g. Premium Badge, Featured Listing, Top Pick" 
            {...register("name")}
            className="bg-gray-50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 py-3"
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Applies To */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs">
            <Layers className="h-3 w-3 text-emerald-500" />
            Applies To <span className="text-red-500">*</span>
            <HelpCircle className="h-3 w-3 text-gray-400 ml-auto" />
          </Label>
          <Controller
            name="applies_to"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(val) => field.onChange(val)}
              >
                <SelectTrigger className="bg-gray-50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 py-3">
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEVELOPERS">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-emerald-500" />
                      Developer
                    </div>
                  </SelectItem>
                  <SelectItem value="PROPERTIES">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-emerald-500" />
                      Property
                    </div>
                  </SelectItem>
                  <SelectItem value="PROJECTS">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-emerald-500" />
                      Project
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.applies_to && (
            <p className="text-xs text-red-500">{errors.applies_to.message}</p>
          )}
        </div>

        {/* Pricing & Limits */}
        <div className="grid grid-cols-3 gap-3">
          {/* Monthly Price Credits */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1 text-xs">
              <DollarSign className="h-3 w-3 text-emerald-500" />
              Monthly Credits <span className="text-red-500">*</span>
              <HelpCircle className="h-3 w-3 text-gray-400 ml-auto" />
            </Label>
            <Input
              type="number"
              placeholder="5000"
              {...register("monthly_price_credits", { valueAsNumber: true })}
              className="bg-gray-50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 py-3"
            />
            {errors.monthly_price_credits && (
              <p className="text-xs text-red-500">
                {errors.monthly_price_credits.message}
              </p>
            )}
          </div>

          {/* Max Entities */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1 text-xs">
              <Users className="h-3 w-3 text-emerald-500" />
              Max Entities <span className="text-red-500">*</span>
              <HelpCircle className="h-3 w-3 text-gray-400 ml-auto" />
            </Label>
            <Input
              type="number"
              placeholder="5"
              {...register("max_entities", { valueAsNumber: true })}
              className="bg-gray-50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 py-3"
            />
            {errors.max_entities && (
              <p className="text-xs text-red-500">
                {errors.max_entities.message}
              </p>
            )}
          </div>

          {/* Priority Boost */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1 text-xs">
              <Zap className="h-3 w-3 text-emerald-500" />
              Priority Boost <span className="text-red-500">*</span>
              <HelpCircle className="h-3 w-3 text-gray-400 ml-auto" />
            </Label>
            <Input
              type="number"
              placeholder="10"
              {...register("priority_boost", { valueAsNumber: true })}
              className="bg-gray-50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 py-3"
            />
            {errors.priority_boost && (
              <p className="text-xs text-red-500">
                {errors.priority_boost.message}
              </p>
            )}
          </div>
        </div>

        {/* Is Active */}
        <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-emerald-100 rounded">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <Label className="text-sm font-medium text-gray-700">Active Status</Label>
          </div>
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <Switch 
                checked={field.value} 
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-emerald-500"
              />
            )}
          />
        </div>

        {/* Placement Section */}
        <div className="border-t border-gray-200 pt-3">
          <div className="flex items-center gap-2 mb-3">
            <Layout className="h-3.5 w-3.5 text-emerald-500" />
            <h3 className="text-sm font-semibold text-gray-900">Placement Settings</h3>
            <span className="text-xs text-gray-500">(Optional)</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Platform */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-600">Platform</Label>
              <Controller
                name="placement.platform"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <SelectTrigger className="bg-gray-50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 py-3">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Web
                        </div>
                      </SelectItem>
                      <SelectItem value="mobile">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Mobile
                        </div>
                      </SelectItem>
                      <SelectItem value="both">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Both
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-600">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="e.g. Profile Header"
                  {...register("placement.location")}
                  className="bg-gray-50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 py-3 pl-10"
                />
              </div>
              {errors.placement?.location && (
                <p className="text-xs text-red-500">
                  {errors.placement.location.message}
                </p>
              )}
            </div>

            {/* Format */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-600">Format</Label>
              <Controller
                name="placement.format"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <SelectTrigger className="bg-gray-50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 py-3">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banner">Banner</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="native">Native</SelectItem>
                      <SelectItem value="pop_up">Pop-up</SelectItem>
                      <SelectItem value="slider">Slider</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 justify-end pt-3 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={mutation.isPending}
            className="hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Create Feature
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
