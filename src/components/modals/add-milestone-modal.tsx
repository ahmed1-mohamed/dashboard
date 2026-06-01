"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Check } from "lucide-react";
import { milestoneSchema, MilestoneSchema } from "@/validators/milestone.schema";
import { addMilestone } from "@/data/api-client";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface AddMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
}

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
];

export function AddMilestoneModal({
  isOpen,
  onClose,
  projectId,
}: AddMilestoneModalProps) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user.accessToken;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    reset,
  } = useForm<MilestoneSchema>({
    resolver: zodResolver(milestoneSchema),
    defaultValues: {
      project_id: projectId,
      milestone_name: "",
      description: "",
      status: "",
      planned_start_date: "",
      planned_end_date: "",
      actual_start_date: "",
      actual_end_date: "",
      completion_percentage: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: MilestoneSchema) => addMilestone(data, token!),
    onSuccess: () => {
      toast.success('Milestone created successfully!');
      queryClient.invalidateQueries({ queryKey: ['projectDetails'] });
      handleClose();
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{
        errors: { [key: string]: string[] | string };
        message?: string;
      }>;
      const errorList = axiosError?.response?.data?.errors;
      const errorMessages = errorList
        ? Object.values(errorList)
            .map((err) => (Array.isArray(err) ? err : [err]))
            .flat()
            .join(', ')
        : '';
      const errorMessage =
        errorMessages ||
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to create milestone.';
      setError('root', { message: errorMessage });
    },
  });

  const handleFormSubmit = (data: MilestoneSchema) => {
    mutation.mutate({
      ...data,
      project_id: projectId,
    });
  };

  const handleClose = () => {
    reset({
      project_id: projectId,
      milestone_name: "",
      description: "",
      status: "",
      planned_start_date: "",
      planned_end_date: "",
      actual_start_date: "",
      actual_end_date: "",
      completion_percentage: "",
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Milestone"
      size="lg"
      showCloseButton={false}
      footer={
        <div className="flex gap-3 justify-end w-full">
          <Button variant="outline" onClick={handleClose} disabled={mutation.isPending}>
            Close
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Add Milestone
              </>
            )}
          </Button>
        </div>
      }
    >
      <form className="space-y-4 overflow-y-auto max-h-[calc(90vh-180px)] pr-2">
        {errors.root && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">
            {errors.root.message}
          </div>
        )}

        {/* Milestone Name */}
        <div>
          <Label>
            Milestone Name <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="e.g. Construction Stage"
            {...register("milestone_name")}
            className="mt-1"
          />
          {errors.milestone_name && (
            <p className="text-red-500 text-sm mt-1">{errors.milestone_name.message}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <Label>
            Status <span className="text-red-500">*</span>
          </Label>
          <Select
            onValueChange={(value) => setValue("status", value, { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
          )}
        </div>

        {/* Planned Dates Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Planned Start Date */}
          <div>
            <Label>Planned Start Date</Label>
            <Input
              type="date"
              {...register("planned_start_date")}
              className="mt-1"
            />
          </div>

          {/* Planned End Date */}
          <div>
            <Label>Planned End Date</Label>
            <Input
              type="date"
              {...register("planned_end_date")}
              className="mt-1"
            />
          </div>
        </div>

        {/* Actual Dates Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Actual Start Date */}
          <div>
            <Label>Actual Start Date</Label>
            <Input
              type="date"
              {...register("actual_start_date")}
              className="mt-1"
            />
          </div>

          {/* Actual End Date */}
          <div>
            <Label>Actual End Date</Label>
            <Input
              type="date"
              {...register("actual_end_date")}
              className="mt-1"
            />
          </div>
        </div>

        {/* Completion Percentage */}
        <div>
          <Label>Completion Percentage</Label>
          <Input
            type="number"
            min="0"
            max="100"
            {...register("completion_percentage")}
            className="mt-1"
          />
        </div>

        {/* Description */}
        <div>
          <Label>Description</Label>
          <Textarea
            placeholder="Write description here"
            {...register("description")}
            className="mt-1 min-h-[80px]"
          />
        </div>
      </form>
    </Modal>
  );
}
