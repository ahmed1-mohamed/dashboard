import { z } from "zod";

export const meetingRequestSchema = z.object({
  user_id: z.number(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  status: z.string().optional(),
});

export type MeetingRequestInput = z.infer<typeof meetingRequestSchema>;
