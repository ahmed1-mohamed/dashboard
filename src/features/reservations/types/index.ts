export interface Booking {
  id: number;
  bookingNumber: string;
  user_name: string;
  project_name: string;
  country: string;
  reservation_date: string;
  expiry_date: string;
  types: string;
  reservation_status_type: string;
  last_status: string;
}

export interface ApiReservation {
  reservation_id: number;
  last_status: string;
  reservation_date: string;
  expiry_date?: string;
  user_name: string;
  property?: {
    property_type?: {
      property_type_name: string;
    };
  };
  reservation_status_type: string;
  project_name: string;
  country: string;
}
