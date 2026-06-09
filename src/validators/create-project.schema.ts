import { z } from "zod";

export const createProjectSchema = z
  .object({
    project_name: z.string().min(1, "Project name is required").max(255, "Project name cannot exceed 255 characters"),
    project_type: z.enum(["residential", "commercial", "mixed-use"], {
      message: "Project type is required",
    }),
    total_units: z.string().min(1, "Total units is required"),
    available_units: z.string().min(1, "Available units is required"),
    launch_date: z.string().min(1, "Launch date is required"),
    completion_date: z.string().optional(),
    status: z.enum(["ongoing", "completed", "upcoming"], {
      message: "Status is required",
    }),
    currency: z.string().max(50, "Currency cannot exceed 50 characters").optional(),
    price_min: z.string().min(1, "Min price is required"),
    price_max: z.string().min(1, "Max price is required"),
    price_sq_min: z.string().min(1, "Min price per sq is required"),
    price_sq_max: z.string().min(1, "Max price per sq is required"),
    price_range: z.string().optional(),
    price_range_SQ: z.string().optional(),
    description: z.string().optional(),
    project_size: z.string().optional(),
    developer_id: z.string().min(1, "Developer is required"),

    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    landmark: z.string().max(255).optional(),
    city_id: z.string().min(1, "City ID is required"),
    area_id: z.string().optional(),
    north_side: z.string().max(255).optional(),
    south_side: z.string().max(255).optional(),
    east_side: z.string().max(255).optional(),
    west_side: z.string().max(255).optional(),
    google_map_link: z.string().max(2048).url("Must be a valid URL"),
    location_description: z.string().optional(),

    is_active: z.enum(["0", "1", "2"]).optional(),
    milestone_id: z.string().optional(),
    phase: z.string().optional(),
    permit_no: z.string().max(20).optional(),
    barcode: z.any().optional(), // File type
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
