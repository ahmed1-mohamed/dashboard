"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { toast } from "react-hot-toast";
import { AdminProjectsService } from "@/features/projects/services/AdminProjectsService";
import { Milestone } from "@/app/admin/projects/[id]/types";
import type { AxiosError } from "axios";

interface EditMilestoneFormValues {
  milestone_name: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  planned_start_date: string;
  planned_end_date: string;
  actual_start_date: string;
  actual_end_date: string;
  completion_percentage: string;
}

interface EditMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  milestone: Milestone | null;
}

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
];

export function EditMilestoneModal({
  isOpen,
  onClose,
  projectId,
  milestone,
}: EditMilestoneModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, control } =
    useForm<EditMilestoneFormValues>({
      defaultValues: {
        milestone_name: "",
        description: "",
        status: "pending",
        planned_start_date: "",
        planned_end_date: "",
        actual_start_date: "",
        actual_end_date: "",
        completion_percentage: "0",
      },
    });

  useEffect(() => {
    if (!milestone) return;
    reset({
      milestone_name: milestone.milestone_name ?? "",
      description: milestone.description ?? "",
      status: (milestone.status as "pending" | "in_progress" | "completed") ?? "pending",
      planned_start_date: milestone.planned_start_date ?? "",
      planned_end_date: milestone.planned_end_date ?? "",
      actual_start_date: milestone.actual_start_date ?? "",
      actual_end_date: milestone.actual_end_date ?? "",
      completion_percentage: milestone.completion_percentage != null
        ? String(milestone.completion_percentage)
        : "0",
    });
  }, [milestone, reset]);

  const updateMutation = useMutation({
    mutationFn: (formValues: EditMilestoneFormValues) =>
      AdminProjectsService.updateMilestone(milestone!.milestone_id, {
        project_id: projectId,
        milestone_name: formValues.milestone_name,
        description: formValues.description,
        status: formValues.status,
        planned_start_date: formValues.planned_start_date || undefined,
        planned_end_date: formValues.planned_end_date || undefined,
        actual_start_date: formValues.actual_start_date || undefined,
        actual_end_date: formValues.actual_end_date || undefined,
        completion_percentage: formValues.completion_percentage
          ? Number(formValues.completion_percentage)
          : undefined,
      }),
    onSuccess: () => {
      toast.success("Milestone updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projectDetails", projectId.toString()],
      });
      onClose();
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{
        errors?: Record<string, string>[];
        message?: string;
      }>;
      const errorList = axiosError?.response?.data?.errors;
      const flatMessages = errorList
        ? Object.values(errorList)
            .map((errObj) => Object.values(errObj))
            .flat()
            .join(", ")
        : "";
      toast.error(
        flatMessages ||
          axiosError.response?.data?.message ||
          axiosError.message ||
          "Failed to update milestone."
      );
    },
  });

  const onSubmit = async (formValues: EditMilestoneFormValues) => {
    if (!milestone) return;
    setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync(formValues);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Milestone"
      size="lg"
      showCloseButton={false}
      footer={
        <div className="flex gap-3 justify-end w-full">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Milestone"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <Label htmlFor="em-name">Milestone Name</Label>
          <Input
            id="em-name"
            {...register("milestone_name")}
            placeholder="e.g. Foundation Work"
            className="mt-1"
          />
        </div>

        {/* Status */}
        <div>
          <Label>Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Completion */}
        <div>
          <Label htmlFor="em-completion">Completion Percentage (%)</Label>
          <Input
            id="em-completion"
            type="number"
            min={0}
            max={100}
            {...register("completion_percentage")}
            placeholder="0 - 100"
            className="mt-1"
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="em-desc">Description</Label>
          <Input
            id="em-desc"
            {...register("description")}
            placeholder="Milestone description"
            className="mt-1"
          />
        </div>

        {/* Planned Dates */}
        <h4 className="text-sm font-semibold text-gray-700">Planned Dates</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="em-plan-start">Start Date</Label>
            <Input
              id="em-plan-start"
              type="date"
              {...register("planned_start_date")}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="em-plan-end">End Date</Label>
            <Input
              id="em-plan-end"
              type="date"
              {...register("planned_end_date")}
              className="mt-1"
            />
          </div>
        </div>

        {/* Actual Dates */}
        <h4 className="text-sm font-semibold text-gray-700">Actual Dates</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="em-act-start">Start Date</Label>
            <Input
              id="em-act-start"
              type="date"
              {...register("actual_start_date")}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="em-act-end">End Date</Label>
            <Input
              id="em-act-end"
              type="date"
              {...register("actual_end_date")}
              className="mt-1"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
