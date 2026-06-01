import { z } from "zod";

export const milestoneSchema = z.object({
  milestone_name: z.string().min(1, "Milestone name is required"),
  description: z.string().optional(),
  status: z.string(),
  planned_start_date: z.string(),
  planned_end_date: z.string(),
  completion_percentage: z.string().optional(),
  actual_start_date: z.string().optional(),
  actual_end_date: z.string().optional(),
  project_id: z.number().optional(),
});

export type MilestoneSchema = z.infer<typeof milestoneSchema>;
