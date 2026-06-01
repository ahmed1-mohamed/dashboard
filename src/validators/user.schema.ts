import { z } from "zod";

export const userSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().optional(),
  status: z.enum(["active", "inactive", "banned"]).optional(),
  role_id: z.number(),
  profile_picture: z.any().optional(),
  description: z.string().optional(),
  firebase_uid: z.string().optional(),
  device_token: z.string().optional(),
});

export type UserInput = z.infer<typeof userSchema>;
