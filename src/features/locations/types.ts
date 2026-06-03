export interface Location {
  location_id: number;
  location_landmark: string;
  city_name: string;
  country_name: string;
  area_name: string;
  created_at: string;
  projects_count: number;
  status?: string;
}

export interface Project {
  project_id: number;
  project_name: string;
  project_type: string;
  status: string;
  total_units: number;
  available_units: number;
  price_range: string;
  launch_date: string;
  completion_date: string;
}

export interface LocationDetail {
  location_id: number;
  landmark: string;
  google_map_link: string;
  latitude: string;
  longitude: string;
  north_side: string;
  south_side: string;
  east_side: string;
  west_side: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  area: {
    area_name: string;
    region: string;
    description: string;
    population: number;
    major_landmarks: string[];
  } | null;
  city: {
    id: number;
    name: string;
  } | null;
  projects: Project[];
  buildings: unknown[];
}
