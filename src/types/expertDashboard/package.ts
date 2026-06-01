
export interface Package {
    package_id: number,
    expert_id: number,
    name: string,
    minutes: number,
    price_cents: number,
    currency: string,
    is_active: boolean
}

export interface PackageResponse {
    status: boolean,
    message: string,
    total: number,
    data: Package[]
}


export interface SinglePackageResponse {
    status: boolean,
    message: string,
    data: Package
}

export interface PackageFormData {
    name: string;
    minutes: string;
    price_cents: string;
    currency: string;
    is_active: boolean;
}