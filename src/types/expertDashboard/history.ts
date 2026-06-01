import { Customer, Expert } from "./bookings";

export interface HistoryResponse {
  status: string;
  message: string;
  data: History[];
  next_cursor: string | null;
  previous_cursor: string | null;
}

export interface History {
  booking_id: number;
  customer_id: number;
  expert_id: number;
  package_id: number;
  minutes: number;
  price_cents: number;
  currency: string;
  start_time: string; 
  end_time: string;
  status: "confirmed" | "pending" | "in_progress" |"canceled" | "completed" | "declined" | "rescheduled"; 
  pay_method: string;
  sub_minutes_used: number | null;
  meeting_provider: string;
  meeting_join_customer: string | null;
  meeting_join_expert: string | null;
  notes_customer: string | null;
  notes_expert: string | null;
  meeting_url: string | null;
  created_at: string;
  updated_at: string;
  expert: Expert;
  customer: Customer;
}

export type HistoryStats = "canceled" | "completed" ;