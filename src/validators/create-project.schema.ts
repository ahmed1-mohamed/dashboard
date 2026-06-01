import { z } from "zod";

export const createProjectSchema = z
  .object({
    project_name: z.string().min(1, "Project name is required"),
    project_type: z.string().min(1, "Project type is required"),
    total_units: z.number().min(0, "Total units cannot be negative"),
    available_units: z.number().min(0, "Available units cannot be negative"),
    launch_date: z.string(),
    completion_date: z.string().optional(),
    status: z.string(),
    currency: z.string().min(1, "Currency is required"),
    price_min: z.string().min(1, "Min price is required"),
    price_max: z.string().min(1, "Max price is required"),
    price_sq_min: z.string().min(1, "Min price per sq is required"),
    price_sq_max: z.string().min(1, "Max price per sq is required"),
    description: z.string().optional(),
    project_size: z.string().optional(),
    developer_id: z.number(),
    location_id: z.number().optional(),
    price_range: z.string().optional(),
    price_range_SQ: z.string().optional(),
    is_active: z.number().optional(),
    // New fields for the nested payload structure
    milestone_id: z.number().optional(),
    phase: z.string().optional(),
    permit_no: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Only validate when both dates are provided
    if (data.launch_date && data.completion_date) {
      const launchDate = new Date(data.launch_date);
      const completionDate = new Date(data.completion_date);

      if (completionDate < launchDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Completion date must be on or after launch date",
          path: ["completion_date"],
        });
      }
    }
  });

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
