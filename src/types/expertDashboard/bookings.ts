
export interface BookingResponse {
  status: string;
  message: string;
  data: Booking[];
  next_cursor: string | null;
  previous_cursor: string | null;
}

export interface Booking {
  booking_id: number;
  customer_id: number;
  expert_id: number;
  package_id: number;
  minutes: number;
  price_cents: number;
  currency: string;
  start_time: string; 
  end_time: string;
  status: BookingStats;
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

export type BookingStats = "confirmed" | "pending" | "ongoing"| "canceled" | "completed" | "no_show" | "refunded"

export interface Expert {
  expert_id: number;
  display_name: string;
  photo_url: string;
  bio: string;
}

export interface Customer {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture: string;
}

export type AgoraRes = {
  token: string;
  uid: string;
  channel: string;
  app_id: string;
}