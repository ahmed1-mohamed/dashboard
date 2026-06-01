import { z } from "zod";

export const createNewUserSchema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone_number: z.string().min(1, "Phone number is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
    role_id: z.number(),
    developer_id: z.number().optional(),
    developer_role: z.string().optional(),
    status: z.enum(["active", "inactive", "banned"]).optional(),
    description: z.string().optional(),
    profile_picture: z.string().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

export type CreateNewUserInput = z.infer<typeof createNewUserSchema>;
