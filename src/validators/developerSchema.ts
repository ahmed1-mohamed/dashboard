import { z } from "zod";

export const developerSchema = z.object({
  name: z.string().min(1, "Developer name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(1, "Phone number is required"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  logo: z.any().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  is_top: z.boolean(),
});

export type FormValues = z.infer<typeof developerSchema>;
