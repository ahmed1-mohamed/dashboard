import { z } from "zod";

export const reservationSchema = z.object({
  property_id: z.number(),
  user_id: z.number(),
  reservation_status: z.string(),
  reservation_date: z.string(),
  expiry_date: z.string(),
  comments: z.string().optional(),
  payment_plan_id: z.number().optional(),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
