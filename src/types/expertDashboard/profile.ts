
export interface ExpertProfileResponse {
    status: boolean;
    message: string;
    data: Expert;
}

export interface Expert {
    expert_id: number;
    user_id: number;
    status: string;
    display_name: string;
    email: string;
    phone_number: string;
    title: string | null;
    bio: string;
    years_experience: number;
    certifications: Certification[];
    website: string;
    linkedin: string;
    rate_per_30min_cents: number;
    currency: string;
    languages: Language[];
    rating_avg: string;
    rating_count: number;
    photo_url: string;
    podcast: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    consultions: number;

    user: User;
    countries: Country[];
    categories: Category[];
    availability_rules: AvailabilityRule[];
    availability_exceptions: AvailabilityException[];
    reviews: Review[];
    wallet: Wallet | null;
    packages: Package[];
    bookings: Booking[];
    experiences: Experience[];
}

export interface Certification {
    cert_name: string;
}

export interface Language {
    language_id: number;
    name: string;
    code: string;
    created_at: string;
    updated_at: string;
    pivot: {
        expert_id: number;
        language_id: number;
    };
}

export interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string ;
    profile_picture: string | null;
}


export interface Country {
    id: number;
    name: string;
    language: string;
    phone_no: string;
    whatsapp_no: string;
    email: string;
    timezone: string;
    currency: string;
    dimension_unit: string;
    created_at: string | null;
    updated_at: string | null;
    pivot: {
        expert_id: number;
        country_id: number;
    };
}

export interface Category {
    category_id: number;
    code: string;
    name: string;
    pivot: {
        expert_id: number;
        category_id: number;
    };
}

export interface AvailabilityRule {
    rule_id: number;
    expert_id: number;
    dow_bitmask: number;
    time_start: string;
    time_end: string;
    tz: string;
    is_active: boolean;
    created_at: string;
    days: string[];
}
export interface Package {
    package_id: number;
    expert_id: number;
    name: string;
    minutes: number;
    price_cents: number;
    currency: string;
    is_active: boolean;
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
    meeting_join_customer: string | null;
    meeting_join_expert: string | null;
    meeting_url: string | null;
    notes_customer: string | null;
    notes_expert: string | null;
    created_at: string;
    updated_at: string;

    customer: User;
}
export interface Experience {
    id: number;
    expert_id: number;
    cert_name: string;
    cert_img: string | null;
    cert_desc: string | null;
    cert_year: number | null;
    created_at: string;
    updated_at: string;
}

export interface Review { }
export interface Wallet { }
export interface AvailabilityException { }

export interface LanguageOption {
    language_id: number;
    name: string;
}

export interface CategoryOption {
    category_id: number;
    name: string;
}

export type LanguagesResponse = {
    data: LanguageOption[];
};

export type CountryResponse = {
    data: Country[];
};

export type CategoryResponse = {
    data: CategoryOption[];
}

