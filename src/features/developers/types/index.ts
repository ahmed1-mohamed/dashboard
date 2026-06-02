export interface DeveloperApiResponse {
  developer_id: number;
  developer_name: string;
  countries: string;
  cities: string;
  projects_count: number;
  website: string;
  email: string;
  phone_number: string;
  status: string;
  is_active: boolean;
  is_top: number;
  created_at: string;
  updated_at: string;
  logo?: string;
  description?: string;
}

export interface Developer {
  id: number;
  name: string;
  countries: string;
  cities: string;
  projects: number;
  website: string;
  email: string;
  contact: string;
  status: boolean;
  logo?: string;
}
