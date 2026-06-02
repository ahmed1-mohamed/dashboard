export interface Project {
  id: number;
  name: string;
  developer_name: string;
  total_units: number;
  available_units: number;
  launch_date: string;
  completion_date: string;
  price_range: string;
  slug: string;
  project_size: string;
  area_name: string;
  city_name: string;
  country_name: string;
  whatsapp: string;
  currency: string;
  latitude: number;
  longitude: number;
  media_urls: string;
  rating: number;
  rating_count: number;
  badge: { color: string; name: string } | null;
  offer: any | null;
  is_favourite: boolean;
  price_after_discount: string;
  status: string;
  projectType: "residential" | "mixed use" | "commercial" | string;
  is_visible: boolean;
}
