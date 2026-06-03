export interface Property {
  property_id: number;
  property_name: string;
  property_no: string;
  status: string;
  availability_status: string;
  construction_status: string;
  price: string;
  size: string;
  bedrooms: number;
  bathrooms: number;
  parking_spaces: number;
  furnish_status: string;
  finishing_status: string;
  propertytype?: {
    id: number;
    name: string;
  };
  propertysubtype?: {
    id: number;
    name: string;
  } | null;
}

export interface Building {
  building_id: number;
  building_name: string;
  total_floors: number;
  total_units: number;
  construction_status: string;
  building_type: string;
  parking_spaces: number;
  description?: string;
  latitude?: string;
  longitude?: string;
  built_type?: string;
  completion_date?: string;
}

export interface Feature {
  feature_id: number;
  feature_name: string;
  value: string;
  description: string | null;
  is_amenity: number;
  icons?: string | null;
}

export interface Milestone {
  milestone_id: number;
  milestone_name: string;
  status: string;
  description: string;
  planned_start_date: string;
  planned_end_date: string;
  completion_percentage: number;
  actual_start_date?: string;
  actual_end_date?: string;
}

export interface PaymentPlanItem {
  id?: number;
  payment_plan_item_id?: number;
  type: string;
  percentage: number;
  intervals?: number;
}

export interface PaymentPlan {
  payment_plan_id: number;
  name: string;
  description?: string | null;
  payment_plan_type?: string;
  total_cost?: string;
  status?: string;
  period_by_years?: number | null;
  type?: string;
  paymentplanitems?: PaymentPlanItem[];
}

export interface Media {
  media_id: number;
  media_url: string;
  media_type: string;
  description?: string;
  is_primary?: number;
  my_order?: number;
}

export interface Developer {
  developer_id: number;
  name: string;
  email: string;
  phone_number: string;
  website: string;
  logo: string;
  description: string;
  status: string;
  is_top: number;
}

export interface City {
  id: number;
  name: string;
  country?: {
    id: number;
    name: string;
    currency: string;
  };
}

export interface Area {
  area_id: number;
  area_name: string;
  region?: string;
  latitude?: string;
  longitude?: string;
}

export interface Location {
  location_id: number;
  google_map_link: string;
  north_side: string;
  south_side: string;
  east_side: string;
  west_side: string;
  landmark: string;
  description: string;
  latitude: string;
  longitude: string;
  city?: City;
  area?: Area;
}

export interface ProjectData {
  project_id: number;
  project_name: string;
  project_type: string;
  total_units: number;
  available_units: number;
  launch_date: string;
  completion_date: string;
  status: string;
  price_range: string;
  price_range_SQ: string;
  description: string;
  project_size: string;
  phase: string | null;
  is_active: number;
  currency: string;
  permit_no: string | null;
  barcode: string | null;
  active_properties_count: number;
  available_properties_count: number;
  booked_properties_count: number;
  sold_properties_count: number;
  developer?: Developer;
  location?: Location;
  buildings: Building[];
  properties: Property[];
  features: Feature[];
  milestones: Milestone[];
  paymentPlans: PaymentPlan[];
  medias?: Media[];
}
