export interface Offer {
  offer_id: number;
  id?: number;
  offer_details?: string;
  name?: string;
  description?: string;
  linked_name?: string;
  linked_type?: string;
  entity_type?: "DEVELOPERS" | "PROJECTS" | "PROPERTIES";
  entity_id?: number;
  entity_name?: string;
  discount?: string;
  discount_type?: string;
  discount_pct?: number;
  is_active?: boolean;
  valid_from?: string;
  valid_to?: string;
  starts_at?: string;
  ends_at?: string;
  clicks?: number;
  views?: number;
  priority?: number;
  banner_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OfferTotals {
  total?: number;
  active?: number;
  views?: number;
  clicks?: number;
}

export interface OffersFilters {
  status?: string;
  search?: string;
}

export interface OffersColumn {
  id: string;
  label: string;
  visible: boolean;
}