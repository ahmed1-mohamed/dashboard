"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { editMilestone, fetchMilestonesDetails } from "@/data/api-client";
import { MilestoneSchema } from "@/validators/milestone.schema";

export function useMilestone(milestoneId: number, projectId: number, token: string | undefined) {
  const queryClient = useQueryClient();

  const milestoneQuery = useQuery({
    queryKey: ["milestone", milestoneId],
    queryFn: () => fetchMilestonesDetails(milestoneId, token!),
    enabled: !!milestoneId && !!token,
  });

  const editMutation = useMutation({
    mutationFn: (updatedData: MilestoneSchema) =>
      editMilestone(milestoneId, updatedData, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectDetails", String(projectId)],
      });
    },
  });

  return {
    milestoneQuery,
    editMutation,
  };
}