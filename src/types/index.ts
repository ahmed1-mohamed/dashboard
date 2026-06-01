import { CouponType } from "@/config/enums";
import { ReactNode } from "react";

// ============================================
// Ad Credit Package Types
// ============================================

export interface AdCreditPackage {
  id: number;
  code: string;
  name: string;
  price: number;
  currency: string;
  credits: number;
  subscribers: number;
  sort_order: number;
  status: boolean;
}

export interface AdCreditPackagesResponse {
  success: boolean;
  data: AdCreditPackage[];
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface AdCreditPackagesError {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export type AdCreditPackageFormInput = Omit<
  AdCreditPackage,
  "id" | "created_at" | "updated_at"
>;

// API Service Types
export interface FetchAdCreditPackagesParams {
  page?: number;
  limit?: number;
  sort_by?: "price" | "credits" | "sort_order" | "name";
  sort_order?: "asc" | "desc";
  is_active?: boolean;
  include_inactive?: boolean;
}

export interface AdCreditPackageState {
  packages: AdCreditPackage[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  } | null;
}

export interface UseAdCreditPackagesOptions {
  immediate?: boolean;
  cache?: boolean;
  cacheTimeout?: number;
  onSuccess?: (data: AdCreditPackage[]) => void;
  onError?: (error: string) => void;
}

// ============================================
// Badge Types
// ============================================

export interface BadgePlacement {
  id: number;
  code: string;
  badge_id: number;
  platform: string | null;
  location: string | null;
  format: string | null;
  created_at: string;
  updated_at: string;
}

export interface BadgeFeature {
  badge_id: number;
  name: string;
  code: string;
  applies_to: string;
  monthly_price_credits: number;
  priority_boost: number;
  max_entities: number;
  is_active: boolean;
  placement: BadgePlacement | null;
  timestamp: string;
}

export interface BadgeFeaturesResponse {
  success: boolean;
  data: BadgeFeature[];
  message?: string;
}

export interface BadgePlacementInput {
  platform: string;
  location: string;
  format: string;
}

export interface CreateBadgeParams {
  name: string;
  applies_to: string;
  monthly_price_credits: number;
  priority_boost?: number;
  max_entities?: number;
  is_active?: boolean;
  placement?: BadgePlacementInput;
}

export interface CreateBadgeResponse {
  success: boolean;
  data: BadgeFeature;
  message?: string;
}

// ============================================
// Existing Types
// ============================================

export interface Coupon {
  id: string;
  name: string;
  type: CouponType;
  slug: string;
  amount?: string;
  code?: string;
}

export interface Address {
  customerName?: string;
  phoneNumber?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: string;
  street?: string;
}

export interface GoogleMapLocation {
  lat?: number;
  lng?: number;
  street_number?: string;
  route?: string;
  street_address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  formattedAddress?: string;
}

export type ProductColor = {
  name?: string;
  code?: string;
};

export interface CartItem {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  image: string;
  color?: ProductColor | null;
  price: number;
  salePrice?: number;
  quantity: number;
  size: number;
  stock?: number;
  discount?: number;
}

export type Product = {
  id: number;
  slug?: string;
  title: string;
  description?: string;
  price: number;
  sale_price?: number;
  thumbnail: string;
  colors?: ProductColor[];
  sizes?: number[];
};

export type PosProduct = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  salePrice: number;
  quantity: number;
  size: number;
  discount?: number;
};

export interface CalendarEvent {
  id?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  title: string;
  description?: string;
  location?: string;
}

export interface FlightingCardProps {
  id: number;
  image: string;
  title: string;
  price: string;
  meta?: {
    model: string;
    hours: string;
    stop: string;
  };
  class: string;
  bucket: {
    luggage?: string;
    bag?: string;
  };
  airlines?: string;
  routes?: {
    arrivalDate: Date | string;
    arrivalTime: Date | string;
    departureDate: Date | string;
    departureTime: Date | string;
    departureCityCode: string;
    departureCity: string;
    departureTerminal: string;
    arrivalCityCode: string;
    arrivalCity: string;
    arrivalTerminal: string;
    layover: {
      layoverCityCode: string;
      layoverCity: string;
      layoverTerminal: string;
      layoverTime: string;
    }[];
  };
  cheapest?: boolean;
  best?: boolean;
  quickest?: boolean;
}

// Features
export type FeaturesDataType = {
  feature_id: number;
  feature_name: string;
  value: string;
  is_amenity: number;
  icons: string;
  is_active?: boolean;
};

// Developer
export type DeveloperDataType = {
  developer_id: number;
  developer_name: string;
  logo: string;
  phone_number: string;
  email: string;
  website: string;
  projects_count: number;
  countries: string;
  cities: string;
  is_active?: boolean;
  description?: string;
  status?: string;
  is_top?: number;
};

export type DeveloperCreateDataType = {
  developer_id: number;
  name: string;
  logo: string;
  phone_number: string;
  email: string;
  website: string;
  projects_count: number;
  countries: string;
  cities: string;
  is_active?: boolean;
  description?: string;
  status?: string;
  is_top?: number;
};

// Reservations
export type ReservationsDataType = {
  reservation_id: number;
  reservation_status: string;
  reservation_status_type: string;
  reservation_date: string;
  expiry_date: string;
  comments: string | null;
  property_id: number;
  property_name: string;
  property_price: string;
  property_no: string;
  project_id: number;
  project_name: string;
  developer_id: number;
  developer_name: string;
  country: string;
  city: string;
  payment_plan_description: string;
  payment_plan_name: string;
  user_id: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  media_urls: string | null;
  last_status: string | null;
  last_status_time: string | null;
  last_admin: string | null;
};

// Developer Features
export type DeveloperFeaturesDataType = {
  feature_id: number;
  feature_name: string;
  value: string;
  is_amenity: number;
  icons: string;
};

// Projects
export type ProjectsDataType = {
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
  developer: DeveloperDataType[];
  medias: medias[];
  location: {
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
    created_at: string;
    updated_at: string;
  };
  features: ProjectFeatureDataType[];
  milestones: MilestoneDataType[];
  is_active: number;
};

// Referrals
export type ReferralsDataType = {
  id: number;
  name: string;
  email: string;
  mobile: string;
  users_count: number;
  referral_code: string;
  created_at: string;
  updated_at: string;
};

// Meeting Requests
export type MeetingRequestsDataType = {
  id: number;
  user_id: number;
  date: string;
  time: string;
  status: string;
  created_at: string;
  updated_at: string;
  user: {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string | null;
    profile_picture: string;
    status: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    role_id: number;
    firebase_uid: string;
    verification: string;
    device_token: string | null;
  } | null;
};

// Selected Projects
export type SelectedProjectsDataType = {
  project_name: string;
  project_type: string;
  total_units: number;
  available_units: number;
  status: string;
  launch_date: string;
  completion_date: string;
  price_range: number;
  price_range_SQ: number;
  description: string;
  project_size: number;
  developer_id: number;
};

// Cities
export type CitiesDataType = {
  id: number;
  name: string;
  state_id: number;
  country_id: number;
  created_at: string;
  updated_at: string;
  state: {
    id: number;
    name: string;
    country_id: number;
    created_at: string;
    updated_at: string;
  };
  country: {
    id: number;
    name: string;
    language: string;
    phone_no: string;
    whatsapp_no: string;
    email: string;
    timezone: string;
    currency: string;
    dimension_unit: string;
    created_at: string;
    updated_at: string;
  };
};

// Properties Template
export type PropertiesTemplateDataType = {
  property_name: string;
  property_no: string;
  property_type_id: string;
  property_subtype_id: string;
  project_id: string;
  location_id: string;
  plot_size: string;
  bua_size: string;
  price: string;
  size: string;
};

// Project Features
export type ProjectFeatureDataType = {
  feature_id: number;
  feature_name: string;
  value: string;
  is_amenity: number;
  icons: string;
  description: string;
};

// Milestone
export type MilestoneDataType = {
  milestone_id: number;
  milestone_name: string;
  description: string;
  status: string;
  planned_start_date: string;
  planned_end_date: string;
  completion_percentage: string;
  actual_start_date: string;
  actual_end_date: string;
  created_at: string;
  updated_at: string;
};

// Areas
export type AreasDataType = {
  area_id: number;
  area_name: string;
  region: string;
  latitude: number;
  longitude: number;
  description: string;
  population: number;
  dld_area_id?: number;
  major_landmarks: string[];
  DldAreas: DldAreasDataType[];
  Locations: LocationsDataType[];
  Address: AddressDataType[];
};

// DLD Areas
export type DldAreasDataType = {
  area_id: number;
  area_name: string;
  latitude: string;
  longitude: string;
  description: string;
  created_at: string;
  updated_at: string;
};

// Locations
export type LocationsDataType = {
  location_id: number;
  google_map_link: string;
  north_side: string;
  south_side: string;
  east_side: string;
  west_side: string;
  landmark: string[];
  description: string;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
  Areas?: AreasDataType[];
  buildings: BuildingDataType[];
  projects: ProjectsDataType[];
};

// Address
export type AddressDataType = {
  id: number;
  entity_id: number;
  entity_type: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_primary: number;
  phone_number: string | number;
  created_at: string;
  updated_at: string;
};

// Building
export type BuildingDataType = {
  building_id: number;
  building_name: string;
  total_floors: number;
  total_units: number;
  construction_status: string;
  completion_date: string;
  description: string;
  latitude: string;
  longitude: string;
  building_type: string;
  built_type: string;
  parking_spaces: number;
  created_at: string;
  updated_at: string;
  properties: PropertiesDataType[];
  locations: LocationsDataType[];
  project: ProjectsDataType[];
};

// Property Type
export type PropertyTypeDataType = {
  id: number;
  name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
};

// Property Subtype
export type PropertySubtypeDataType = {
  id: number;
  property_type_id: number;
  name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
};

// Media
export type medias = {
  media_id: number;
  entity_type: string;
  entity_id: number;
  media_type: string;
  media_url: string;
  description: string;
  is_primary: boolean;
  my_order: boolean;
};

// Payments
export type payments = {
  payment_plan_id: number;
  status: string;
  created_at: number;
  updated_at: string;
  deleted_at: boolean;
  name: string;
  description: string;
  total_cost: number;
  period_by_years: number;
  paymentplanitems: [
    {
      id: number;
      payment_plan_id: number;
      type: string;
      percentage: number;
      created_at: string;
      updated_at: string;
      intervals: number;
    },
  ];
};

// Properties
export type PropertiesDataType = {
  property_id: number;
  property_name: string;
  unit_number: string;
  area: number;
  floor: string;
  medias: medias[];
  property_type: PropertyTypeDataType[];
  property_subtype: PropertySubtypeDataType[];
  project: ProjectsDataType[];
  milestones: MilestoneDataType[];
  features: FeaturesDataType[];
  building: BuildingDataType[];
  plot_size: string;
  bua_size: string;
  maid_room: number;
  status: string;
  furnish_status: string;
  finishing_status: string;
  price: string;
  size: string;
  bedrooms: number;
  bathrooms: number;
  parking_spaces: number;
  availability_status: string;
  construction_status: string;
  description: string;
  reference_listed: string;
  ownership_type: string;
  broker_license: string;
  agent_license: string;
  zone_name: string;
  dld_permit_number: string;
  dld_barcode: string;
  created_at: string;
  updated_at: string;
  area_name: string;
};

// Activity Log
export type ActivityLog = {
  id: number;
  user_id: number;
  action: string;
  description?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
};

// User
export type UserDataType = {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  status: "active" | "inactive" | "banned";
  role_id: number;
  activity_logs: ActivityLog[];
};

// Get User
export type GetUserDataType = {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  profile_picture: string;
  status: string;
  description: string;
  role_id: number;
  firebase_uid: number;
  role_name: string;
  role: {
    role_id: number;
    role_name: string;
    role_type: string;
    description: string;
    default_permissions: string;
    is_active: boolean;
  };
};

// Roles
export type RolesDataType = {
  role_id: number;
  role_name: string;
  role_type: string;
  description: string[]; // 👈 UI uses array
  users_count: number;
  is_active: boolean;
};

// Permissions
export type PermissionsDataType = {
  permission_id: number;
  permission_name: string;
  description: string;
};

// Property Features
export type PropertyFeaturesDataType = {
  feature_id: number;
  feature_name: string;
  value: string;
  is_amenity: number;
  icons: string;
};

// Enums
export enum BILLING_UNIT {
  MONTH = "month",
  CLICK = "click",
  VIEW = "view",
  IMPRESSION = "impression",
}

export enum PROJECT_TYPE {
  Residential = "Residential",
  Commercial = "Commercial",
  MixedUse = "Mixed Use",
}

export enum PROJECT_STATUS {
  Ongoing = "Ongoing",
  Completed = "Completed",
  Upcoming = "Upcoming",
}

// Menu Item
export interface MenuItem {
  name: string;
  href?: string;
  icon?: ReactNode;
  dropdownItems?: MenuItem[];
  badge?: string;
}

// Tenants
export type TenantDataType = {
  tenant_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  property_name: string;
  property_address: string;
  lease_end_date: string;
  status: string;
  rent_amount: string;
};

// Bookings
export type BookingDataType = {
  id: number;
  tenant?: {
    name: string;
  };
  user?: {
    name: string;
  };
  property?: {
    name: string;
  };
  unit?: {
    unit_number: string;
  };
  updated_at: string;
  amount: string;
  status: string;
};

// Ads
export type AdData = {
  campaign: {
    start_at: string | null;
    end_at?: string | null;
    daily_cap_credits: number | null;
    status: string;
  };
  placement: {
    platform: string | null;
    location: string | null;
    format: string | null;
    billing_unit?: string | null;
  };
  country_id: number | null;
  entity_type: string | null;
  entity_id: number | null;
  title: string | null;
  subtitle?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
  weight: number | null;
  image_url?: string | null;
};

// ============================================
// Expert Types
// ============================================

export interface ExpertDataType {
  expert_id: number;
  display_name: string;
  status: string;
  rating_avg: number;
  rating_count: number;
  user_id: number;
  email: string;
  phone_number: string;
  country_code: string | null;
  consultations_count: number;
  categories: string[];
  countries: string[];
  experiences: string[];
  created_at: string;
}

export interface FetchExpertsResult {
  experts: ExpertDataType[];
  total: number;
}
