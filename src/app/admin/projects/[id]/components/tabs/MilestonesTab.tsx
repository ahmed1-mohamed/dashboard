"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { deleteMilestone } from "@/data/api-client";
import { Milestone } from "../../types";
import { AddMilestoneModal } from "@/components/modals/add-milestone-modal";
import { EditMilestoneModal } from "@/components/modals/edit-milestone-modal";
import { DeleteFeatureModal } from "@/components/modals/delete-feature-modal";
import type { AxiosError } from "axios";

interface MilestonesTabProps {
  projectId: number;
  token: string;
  milestones: Milestone[];
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-green-50 text-green-700 border-green-200",
};

export function MilestonesTab({ projectId, token, milestones }: MilestonesTabProps) {
  const queryClient = useQueryClient();

  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [isEditMilestoneModalOpen, setIsEditMilestoneModalOpen] = useState(false);
  const [milestoneToDelete, setMilestoneToDelete] = useState<number | null>(null);
  const [isDeleteMilestoneModalOpen, setIsDeleteMilestoneModalOpen] = useState(false);

  const deleteMilestoneMutation = useMutation({
    mutationFn: (milestoneId: number) => deleteMilestone(milestoneId, token),
    onSuccess: () => {
      toast.success("Milestone deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["projectDetails", projectId.toString()] });
      setIsDeleteMilestoneModalOpen(false);
      setMilestoneToDelete(null);
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(axiosError?.response?.data?.message || "Failed to delete milestone.");
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Milestones ({milestones.length})</h3>
        <div className="flex gap-2">
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
            onClick={() => setIsMilestoneModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Milestone
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {milestones.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No milestones available</div>
        ) : (
          milestones.map((milestone, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {milestone.milestone_name}
                  </h4>
                  <Badge
                    className={`text-xs mt-1 ${
                      statusColors[milestone.status] ?? "bg-orange-50 text-orange-700 border-orange-200"
                    }`}
                  >
                    {milestone.status?.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingMilestone(milestone);
                      setIsEditMilestoneModalOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setMilestoneToDelete(milestone.milestone_id);
                      setIsDeleteMilestoneModalOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Calendar className="h-4 w-4" />
                <span>
                  {milestone.planned_start_date} – {milestone.planned_end_date}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-semibold text-gray-900">
                    {milestone.completion_percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-teal-600 h-2 rounded-full"
                    style={{ width: `${milestone.completion_percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AddMilestoneModal
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
        projectId={projectId}
      />

      <EditMilestoneModal
        isOpen={isEditMilestoneModalOpen}
        onClose={() => {
          setIsEditMilestoneModalOpen(false);
          setEditingMilestone(null);
        }}
        projectId={projectId}
        milestone={editingMilestone}
      />

      <DeleteFeatureModal
        isOpen={isDeleteMilestoneModalOpen}
        onClose={() => {
          setIsDeleteMilestoneModalOpen(false);
          setMilestoneToDelete(null);
        }}
        onConfirm={() => {
          if (milestoneToDelete) {
            deleteMilestoneMutation.mutate(milestoneToDelete);
          }
        }}
        feature={null}
        isDeleting={deleteMilestoneMutation.isPending}
      />
    </div>
  );
}
