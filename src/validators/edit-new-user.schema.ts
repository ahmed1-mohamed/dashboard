import { z } from "zod";

export const editNewUserSchema = z.object({
  first_name: z.string().min(1, "First name is required").optional(),
  last_name: z.string().min(1, "Last name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone_number: z.string().optional(),
  role_id: z.number().optional(),
  developer_id: z.number().optional(),
  status: z.enum(["active", "inactive", "banned"]).optional(),
  description: z.string().optional(),
  profile_picture: z.string().optional(),
});

export type EditNewUserInput = z.infer<typeof editNewUserSchema>;
