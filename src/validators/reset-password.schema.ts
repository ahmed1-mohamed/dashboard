import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

export type ResetpasswordSchema = z.infer<typeof resetPasswordSchema>;
