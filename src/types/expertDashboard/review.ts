
export interface Customer {
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
    deleted_at: string | null;
    role_id: number;
    firebase_uid: string;
    verification: string;
    device_token: string;
    identifier: number;
    country_code: string | null;
    referral_code: string | null;
    agora_id: string | null;
    agora_synced: number;
    preferred_country: string | null;
    preferred_currency: string | null;
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
    status: string;
    pay_method: string;
    sub_minutes_used: number | null;
    meeting_provider: string;
    meeting_join_customer: string;
    meeting_join_expert: string;
    meeting_url: string | null;
    notes_customer: string | null;
    notes_expert: string | null;
    created_at: string;
    updated_at: string;
}

export interface Review {
    review_id: number;
    booking_id: number;
    expert_id: number;
    customer_id: number;
    rating: number;
    comment: string;
    created_at: string;
    customer: Customer;
    booking: Booking;
}

export interface ReviewsResponse {
    data: Review[];
    status: string;
    message: string;
}
