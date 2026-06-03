export interface ActivityLogResponse {
  id: number;
  user_id: number;
  user_name: string;
  action: string;
  entity_type: string;
  entity_id: number;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  created_at: string;
  ip_address: string;
  user_agent: string;
}

export interface Activity {
  id: number;
  userId: number;
  user: string;
  action: string;
  entity: string;
  description: string;
  dateTime: string;
  ipAddress: string;
}
