import { z } from "zod";

export const otpSchema = z.object({
  email: z.string().email("Invalid email address"),
  token: z.string().min(4, "OTP must be at least 4 characters"),
});

export type OtpSchema = z.infer<typeof otpSchema>;
