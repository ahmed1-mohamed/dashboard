import {
  AddressDataType,
  DldAreasDataType,
  FeaturesDataType,
  PropertiesDataType,
  PropertySubtypeDataType,
  PropertyTypeDataType,
  RolesDataType,
  PermissionsDataType,
  AdData,
  AdCreditPackage,
  AdCreditPackagesResponse,
  FetchAdCreditPackagesParams,
  BadgeFeaturesResponse,
  CreateBadgeParams,
  CreateBadgeResponse,
  DeveloperDataType,
  ExpertDataType,
  FetchExpertsResult,
} from "@/types";
import { AreaInput } from "@/validators/area.schema";
import { BuildingInputType } from "@/validators/buildingSchema";
import { CityInput } from "@/validators/city.schema";
import { FeatureInput } from "@/validators/feature.schema";
import { EditLocationInput, LocationInput } from "@/validators/location.schema";
import { CreateNewUserInput } from "@/validators/create-new-user.schema";
import { CreateProjectMediaInput } from "@/validators/create-project-media.schema";
import { CreateProjectInput } from "@/validators/create-project.schema";
import { EditProjectInput } from "@/validators/edit-project.schema";
import { CreatePropertyMediaInput } from "@/validators/create-property-media.schema";
import { CreateDeveloperFeatureInput } from "@/validators/developer-feature.shema";
import { FormValues } from "@/validators/developerSchema";
import { EditNewUserInput } from "@/validators/edit-new-user.schema";
import { MilestoneSchema } from "@/validators/milestone.schema";
import { OtpSchema } from "@/validators/otp.schema";
import { CreateProjectFeatureInput } from "@/validators/project-features.schema";
import { CreatePropertyFeatureInput } from "@/validators/property-feature.schema";
import { ResetpasswordSchema } from "@/validators/reset-password.schema";
import { CreateRolesPermissionsInput } from "@/validators/roles-permission.schema";
import { CreateReferralInput } from "@/validators/create-referral.schema";
import { PropertiesInput } from "@/validators/propertiesSchema";
import { PaymentPlanInput } from "@/validators/payment-plan.schema";
import { BadgeInput } from "@/validators/badge.schema";
import axios from "axios";
import { apiClient as apiClientClass } from "@/lib/apiClient";

interface CreateProjectResponse {
  data?: {
    project_id?: number;
    project_name?: string;
  };
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiClient2 = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL_WITHOUT_DASHBOARD,
  headers: {
    "Content-Type": "application/json",
  },
});

// const setupInterceptor = (client: any) => {
//   client.interceptors.response.use(
//     (response: any) => response,
//     async (error: any) => {
//       if (error.response?.status === 401) {
//         console.warn("⚠️ 401 received — letting NextAuth handle it");

//         // DO NOTHING HERE
//         // - No redirect
//         // - No signOut
//         // - No getSession
//       }

//       return Promise.reject(error);
//     },
//   );
// };

// setupInterceptor(apiClient);
// setupInterceptor(apiClient2);

import { toast } from "sonner";

const handleError = (error: unknown, endpoint: string) => {
  const axiosError = error as {
    response?: {
      data?: {
        status?: string;
        message?: string;
        errors?: Array<Record<string, string>>;
      };
    };
    message?: string;
  };

  const responseData = axiosError.response?.data;

  // Check if response has structured error format: {status: "error", errors: [{field: "message"}]}
  if (
    responseData?.status === "error" &&
    responseData?.errors &&
    Array.isArray(responseData.errors)
  ) {
    // Extract field-specific error messages
    const fieldErrors = responseData.errors.map(
      (err: Record<string, string>) => {
        const field = Object.keys(err)[0];
        const message = err[field];
        return `${field}: ${message}`;
      },
    );

    const errorDescription = fieldErrors.join("\n");

    // Log for debugging
    console.error(`API Error on ${endpoint}:`, errorDescription);

    // Show toast notification with field-specific errors
    toast.error("Operation failed", {
      description: errorDescription,
      duration: 5000,
    });

    throw error;
  }

  // Fallback to original error handling
  const errorMessage =
    axiosError.response?.data?.message ||
    axiosError.message ||
    "An error occurred";

  // Log for debugging
  console.error(`API Error on ${endpoint}:`, errorMessage);

  // Show toast notification for user-facing errors
  toast.error("Operation failed", {
    description: errorMessage,
    duration: 4000,
  });

  throw error;
};

const fetchData = async (endpoint: string, token?: string) => {
  try {
    // If token is provided, set it on the apiClient for this request
    // apiClient class handles automatic token refresh
    if (token) {
      const expiresAt = Math.floor(Date.now() / 1000) + 3600; // Default 1 hour expiry
      apiClientClass.setAuthToken(token, expiresAt);
    }

    const response = await apiClientClass.get(endpoint);
    if (endpoint.includes("features")) {
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    handleError(error, endpoint);
  }
};

const fetchDevelopersData = async (endpoint: string, token?: string) => {
  try {
    if (token) {
      const expiresAt = Math.floor(Date.now() / 1000) + 3600;
      apiClientClass.setAuthToken(token, expiresAt);
    }

    const response = await apiClientClass.get(endpoint);
    return response.data;
  } catch (error) {
    handleError(error, endpoint);
  }
};

const fetchPropertiesCreateData = async (endpoint: string, token?: string) => {
  try {
    if (token) {
      const expiresAt = Math.floor(Date.now() / 1000) + 3600;
      apiClientClass.setAuthToken(token, expiresAt);
    }

    const response = await apiClientClass.get(endpoint);
    return response.data;
  } catch (error) {
    handleError(error, endpoint);
  }
};

const fetchDLDAreasData = async (endpoint: string, token?: string) => {
  try {
    if (token) {
      const expiresAt = Math.floor(Date.now() / 1000) + 3600;
      apiClientClass.setAuthToken(token, expiresAt);
    }

    const response = await apiClientClass.get(endpoint);
    return response.data;
  } catch (error) {
    handleError(error, endpoint);
  }
};

const fetchDataWithPagination = async (
  endpoint: string,
  token?: string,
  page: number = 1,
  perPage: number = 15,
) => {
  try {
    if (token) {
      const expiresAt = Math.floor(Date.now() / 1000) + 3600;
      apiClientClass.setAuthToken(token, expiresAt);
    }

    const response = await apiClientClass.get(endpoint, {
      params: {
        page,
        per_page: perPage,
      },
    });

    return response.data;
  } catch (error) {
    handleError(error, endpoint);
  }
};

const fetchPropertiesIdData = async (endpoint: string, token?: string) => {
  try {
    if (token) {
      const expiresAt = Math.floor(Date.now() / 1000) + 3600;
      apiClientClass.setAuthToken(token, expiresAt);
    }

    const response = await apiClientClass.get(endpoint);
    return response.data;
  } catch (error) {
    handleError(error, endpoint);
  }
};

const fetchPaginatedData = async (endpoint: string, token?: string) => {
  try {
    if (token) {
      const expiresAt = Math.floor(Date.now() / 1000) + 3600;
      apiClientClass.setAuthToken(token, expiresAt);
    }

    const response = await apiClientClass.get(endpoint);
    return response.data;
  } catch (error) {
    handleError(error, endpoint);
  }
};

const fetchAdsData = async (endpoint: string, token?: string) => {
  try {
    if (token) {
      const expiresAt = Math.floor(Date.now() / 1000) + 3600;
      apiClientClass.setAuthToken(token, expiresAt);
    }

    const response = await apiClientClass.get(endpoint);
    return response.data;
  } catch (error) {
    handleError(error, endpoint);
  }
};

const fetchDataTotals = async (endpoint: string, token?: string) => {
  try {
    if (token) {
      const expiresAt = Math.floor(Date.now() / 1000) + 3600;
      apiClientClass.setAuthToken(token, expiresAt);
    }

    const response = await apiClientClass.get(endpoint);
    return response.data;
  } catch (error) {
    handleError(error, endpoint);
  }
};

const fetchPropertiesData = async (
  endpoint: string,
  sortBy: string[],
  sortOrder: string[],
  selectedCountries: number[],
  selectedDevelopers: number[],
  selectedProjects: number[],
  per_page: number | string,
  page?: number,
) => {
  try {
    const body: any = {
      sort_by: sortBy,
      sort_order: sortOrder,
      country_id: selectedCountries,
      developer_id: selectedDevelopers,
      project_id: selectedProjects,
      per_page: per_page,
    };

    if (page !== undefined) {
      body.page = page;
    }

    const response = await apiClientClass.post(endpoint, body);
    return response.data;
  } catch (error) {
    handleError(error, endpoint);
  }
};

const fetchData2 = async (endpoint: string) => {
  try {
    const response = await apiClientClass.get(endpoint);
    return response.data;
  } catch (error) {
    handleError(error, endpoint);
  }
};

const fetchDataReserveUnit = async (
  token: string,
  reservationId: number,
): Promise<any> => {
  try {
    const expiresAt = Math.floor(Date.now() / 1000) + 3600;
    apiClientClass.setAuthToken(token, expiresAt);

    const response = await apiClientClass.get(
      `${process.env.NEXT_PUBLIC_API_URL_WITHOUT_DASHBOARD}/show-reservation?reservation_id=${reservationId}`,
    );

    return await response.data;
  } catch (error) {
    console.error("Fetch reservation error:", error);
  }
};

const fetchDataReserve = async (token: string) => {
  try {
    const expiresAt = Math.floor(Date.now() / 1000) + 3600;
    apiClientClass.setAuthToken(token, expiresAt);

    const response = await apiClientClass.get(
      `${process.env.NEXT_PUBLIC_API_URL_WITHOUT_DASHBOARD}/all-reservations`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const postData = async (endpoint: string, data: unknown, token?: string) => {
  try {
    if (token) {
      const expiresAt = Math.floor(Date.now() / 1000) + 3600;
      apiClientClass.setAuthToken(token, expiresAt);
    }

    const response = await apiClientClass.post(endpoint, data);
    return response.data;
  } catch (error) {
    handleError(error, endpoint);
  }
};

const editData = async (endpoint: string, data: unknown, token?: string) => {
  try {
    if (token) {
      const expiresAt = Math.floor(Date.now() / 1000) + 3600;
      apiClientClass.setAuthToken(token, expiresAt);
    }

    const response = endpoint.includes("projects")
      ? endpoint.includes("features") || endpoint.includes("medias")
        ? await apiClientClass.put(endpoint, data)
        : await apiClientClass.post(endpoint, data)
      : await apiClientClass.put(endpoint, data);
    return response.data;
  } catch (error) {
    handleError(error, endpoint);
  }
};

const deleteData = async (endpoint: string, token?: string) => {
  try {
    if (token) {
      const expiresAt = Math.floor(Date.now() / 1000) + 3600;
      apiClientClass.setAuthToken(token, expiresAt);
    }

    const response = await apiClientClass.delete(endpoint);
    return response.data;
  } catch (error) {
    handleError(error, endpoint);
  }
};

const patchData = async (endpoint: string, data?: unknown, token?: string) => {
  try {
    if (token) {
      const expiresAt = Math.floor(Date.now() / 1000) + 3600;
      apiClientClass.setAuthToken(token, expiresAt);
    }

    const response = await apiClientClass.patch(endpoint, data);
    return response.data;
  } catch (error) {
    handleError(error, endpoint);
  }
};

const postDataImg = async (endpoint: string, data: unknown, token?: string) => {
  try {
    if (token) {
      const expiresAt = Math.floor(Date.now() / 1000) + 3600;
      apiClientClass.setAuthToken(token, expiresAt);
    }

    const response = await apiClientClass.post(endpoint, data);
    return response.data;
  } catch (error) {
    handleError(error, endpoint);
  }
};

const editDataImg = async (endpoint: string, data: unknown, token?: string) => {
  try {
    if (token) {
      const expiresAt = Math.floor(Date.now() / 1000) + 3600;
      apiClientClass.setAuthToken(token, expiresAt);
    }

    const response = await apiClientClass.post(endpoint, data);
    return response.data;
  } catch (error) {
    handleError(error, endpoint);
  }
};

// FETCH DATA
export const fetchDldAreas = (token: string) =>
  fetchDLDAreasData("/dashboard/areas", token);
export const fetchAreas = (token: string, page?: number, perPage?: number) => {
  const endpoint = perPage
    ? `/areas?page=${page || 1}&per_page=${perPage}`
    : "/areas";
  return fetchPropertiesIdData(endpoint, token);
};
export const fetchLocations = (
  token: string,
  page: number = 1,
  perPage: number = 10,
) => fetchPaginatedData(`/locations?page=${page}&per_page=${perPage}`, token);
export const fetchProjects = (token: string) => fetchData("/projects", token);

export const fetchProjectsPaginated = (
  token: string,
  page: number = 1,
  per_page: number = 10,
  search?: string,
  status?: string,
  project_type?: string,
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: per_page.toString(),
  });

  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (project_type) params.append("project_type", project_type);

  return fetchPaginatedData(`/dashboard/projects?${params.toString()}`, token);
};

export const fetchProjectsByDeveloper = (
  token: string,
  developer_id: number,
  is_active: number = 1,
  per_page: string = "all",
  search?: string,
) => {
  const params = new URLSearchParams({
    developer_id: developer_id.toString(),
    is_active: is_active.toString(),
    per_page,
  });
  if (search) {
    params.append("search", search);
  }
  return fetchData(`/projects?${params.toString()}`, token);
};
export const fetchAds = (
  token: string,
  page: number = 1,
  per_page: number = 15,
  filters?: {
    status?: string;
    platform?: string;
    format?: string;
    search?: string;
  },
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: per_page.toString(),
  });

  if (filters) {
    if (filters.status && filters.status !== "all") {
      params.append("status", filters.status);
    }
    if (filters.platform && filters.platform !== "all") {
      params.append("platform", filters.platform);
    }
    if (filters.format && filters.format !== "all") {
      params.append("format", filters.format);
    }
    if (filters.search && filters.search.trim() !== "") {
      params.append("search", filters.search.trim());
    }
  }

  return fetchAdsData(`/ads?${params.toString()}`, token);
};
export const fetchAdsTotals = (token: string) =>
  fetchDataTotals("/ads/totals", token);
export const fetchAd = (adId: string, token: string) =>
  fetchData(`/ads/${adId}`, token);
export const updateAd = (adId: number, adData: FormData, token: string) =>
  postDataImg(`/ads/${adId}`, adData, token);
export const deleteAd = (adId: number, token: string) =>
  deleteData(`/ads/${adId}`, token);
export const createAd = (adData: FormData, token: string) =>
  postDataImg("/ads", adData, token);
export const updateAdStatus = (adId: number, status: boolean, token: string) =>
  editData(`/ads/${adId}`, { is_active: status }, token);

export const updateAdStatusUsingCreateEndpoint = (
  adId: number,
  status: string,
  token: string,
) => {
  // Send complete AdData object with status field updated
  const adData: AdData = {
    campaign: {
      start_at: null,
      end_at: null,
      daily_cap_credits: null,
      status: status,
    },
    placement: {
      platform: null,
      location: null,
      format: null,
      billing_unit: null,
    },
    country_id: null,
    entity_type: null,
    entity_id: null,
    title: null, // Set status to active or inactive
    weight: null,
  };
  return editData(`/ads/${adId}`, adData, token);
};

export const toggleAdStatus = (
  adId: number,
  newStatus: string,
  token: string,
) => {
  return patchData(`/ads/${adId}/toggle-status`, newStatus, token);
};

// ============================================
// Developers
// ============================================

export interface FetchDevelopersParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
}

export interface FetchDevelopersResult {
  developers: DeveloperDataType[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

/**
 * Fetches developers with pagination support
 * @param token - Authentication token
 * @param params - Pagination and filter parameters
 * @returns Promise with developers and pagination metadata
 */
export const fetchDevelopersPaginated = async (
  token: string,
  params: FetchDevelopersParams = {},
): Promise<FetchDevelopersResult> => {
  const { page = 1, per_page = 10, search, status } = params;

  const urlParams = new URLSearchParams({
    page: page.toString(),
    per_page: per_page.toString(),
  });

  if (search) urlParams.append("search", search);
  if (status) urlParams.append("status", status);

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const expiresAt = Math.floor(Date.now() / 1000) + 3600;
    apiClientClass.setAuthToken(token, expiresAt);

    const response = await apiClientClass.get(
      `/developers?${urlParams.toString()}`,
    );

    const responseData: any = response.data;

    return {
      developers: responseData.data || [],
      pagination: {
        page: responseData.page || page,
        per_page: responseData.per_page || per_page,
        total: responseData.total || 0,
        total_pages:
          responseData.total_pages ||
          Math.ceil((responseData.total || 0) / per_page),
      },
    };
  } catch (error) {
    handleError(error, "/developers");
    throw error;
  }
};

// ============================================
// Ad Credit Packages
// ============================================

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface FetchAdCreditPackagesResult {
  packages: AdCreditPackage[];
  pagination: PaginationMeta | null;
}

export interface CreateAdCreditPackageInput {
  code: string;
  name: string;
  price_cents: number;
  currency: string;
  credits: number;
  sort_order: number;
  is_active: boolean;
}

/**
 * Input for creating an AD Credit Package
 * @param name - The display name of the package
 * @param price_cents - Price in cents (minimum 0)
 * @param credits - Number of credits (minimum 1)
 * @param is_active - Whether the package is active (default: true)
 */
export interface CreateAdCreditPackageParams {
  name: string;
  price_cents: number;
  credits: number;
  is_active?: boolean;
}

/**
 * Response from creating an AD Credit Package
 */
export interface CreateAdCreditPackageResponse {
  success: boolean;
  data: AdCreditPackage;
  message?: string;
}

/**
 * API Error response for package creation
 */
export interface CreateAdCreditPackageApiError {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Generates a unique code for AD Credit Packages
 * Format: AD-PKG-{timestamp}-{randomSuffix}
 * @returns Unique code string
 */
export const generateAdCreditPackageCode = (): string => {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `AD-PKG-${timestamp}-${randomSuffix}`;
};

/**
 * Validates the input parameters for creating an AD Credit Package
 * @param params - The input parameters to validate
 * @throws Error if validation fails
 */
const validateCreateAdCreditPackageParams = (
  params: CreateAdCreditPackageParams,
): void => {
  if (!params.name || params.name.trim() === "") {
    throw new Error("Package name is required");
  }

  if (params.price_cents < 0) {
    throw new Error("Price must be non-negative");
  }

  if (params.credits < 1) {
    throw new Error("Credits must be at least 1");
  }
};

/**
 * Creates a new AD Credit Package by making a POST request to the API
 * @param token - Authentication token
 * @param params - Package creation parameters
 * @returns Promise resolving to the created package response
 * @throws Error with validation message or API error details
 */
export const createAdCreditPackage = async (
  token: string,
  params: CreateAdCreditPackageParams,
): Promise<CreateAdCreditPackageResponse> => {
  // Validate input parameters
  validateCreateAdCreditPackageParams(params);

  // Generate unique code
  const code = generateAdCreditPackageCode();

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const payload = {
      code,
      name: params.name.trim(),
      price_cents: params.price_cents,
      currency: "AED",
      credits: params.credits,
      sort_order: 0,
      is_active: params.is_active ?? true,
    };

    const expiresAt = Math.floor(Date.now() / 1000) + 3600;
    apiClientClass.setAuthToken(token, expiresAt);

    const response = await apiClientClass.post<CreateAdCreditPackageResponse>(
      "/ad-credit-packages",
      payload,
      { headers },
    );

    return response.data;
  } catch (error) {
    // Handle API errors with proper type casting
    const axiosError = error as {
      response?: {
        data?: CreateAdCreditPackageApiError;
      };
      message?: string;
    };

    const errorData = axiosError.response?.data;

    if (errorData?.errors && Object.keys(errorData.errors).length > 0) {
      // Format validation errors from API
      const errorMessages = Object.entries(errorData.errors)
        .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
        .join("; ");

      interface ErrorWithDetails extends Error {
        details?: string;
      }
      const apiError: ErrorWithDetails = new Error(
        errorData.message || "Validation failed",
      );
      apiError.details = errorMessages;
      handleError(error, "/dashboard/ad-credit-packages");
      throw apiError;
    }

    // Re-throw with user-friendly message
    const errorMessage =
      errorData?.message ||
      (axiosError.message
        ? `Request failed: ${axiosError.message}`
        : "Failed to create package");

    handleError(error, "/dashboard/ad-credit-packages");
    throw new Error(errorMessage);
  }
};

/**
 * Response from deleting an AD Credit Package
 */
export interface DeleteAdCreditPackageResponse {
  success: boolean;
  message?: string;
  data?: AdCreditPackage;
}

/**
 * API Error response for package deletion
 */
export interface DeleteAdCreditPackageApiError {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Deletes an AD Credit Package by making a DELETE request to the API
 * @param token - Authentication token
 * @param packageId - The ID of the package to delete
 * @returns Promise resolving to the delete response
 * @throws Error with user-friendly error message on failure
 */
export const deleteAdCreditPackage = async (
  token: string,
  packageId: number,
): Promise<DeleteAdCreditPackageResponse> => {
  // Validate input parameters
  if (!packageId || packageId <= 0) {
    throw new Error("Invalid package ID");
  }

  if (!token) {
    throw new Error("Authentication token is required");
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    headers["Authorization"] = `Bearer ${token}`;

    const endpoint = `/ad-credit-packages/${packageId}`;
    const expiresAt = Math.floor(Date.now() / 1000) + 3600;
    apiClientClass.setAuthToken(token, expiresAt);

    const response = await apiClientClass.delete<DeleteAdCreditPackageResponse>(
      endpoint,
      { headers },
    );

    return response.data;
  } catch (error) {
    // Handle API errors with proper type casting
    const axiosError = error as {
      response?: {
        data?: DeleteAdCreditPackageApiError;
      };
      message?: string;
    };

    const errorData = axiosError.response?.data;

    if (errorData?.errors && Object.keys(errorData.errors).length > 0) {
      // Format validation errors from API
      const errorMessages = Object.entries(errorData.errors)
        .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
        .join("; ");

      interface ErrorWithDetails extends Error {
        details?: string;
      }
      const apiError: ErrorWithDetails = new Error(
        errorData.message || "Validation failed",
      );
      apiError.details = errorMessages;
      handleError(error, "/dashboard/ad-credit-packages");
      throw apiError;
    }

    // Re-throw with user-friendly message
    const errorMessage =
      errorData?.message ||
      (axiosError.message
        ? `Request failed: ${axiosError.message}`
        : "Failed to delete package");

    handleError(error, "/dashboard/ad-credit-packages");
    throw new Error(errorMessage);
  }
};

export const fetchAdCreditPackages = async (
  token: string,
  params?: FetchAdCreditPackagesParams,
): Promise<FetchAdCreditPackagesResult> => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Build query params
    const queryParams = new URLSearchParams();
    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }
    if (params?.sort_by) {
      queryParams.append("sort_by", params.sort_by);
    }
    if (params?.sort_order) {
      queryParams.append("sort_order", params.sort_order);
    }
    if (typeof params?.is_active === "boolean") {
      queryParams.append("is_active", params.is_active.toString());
    }
    if (params?.include_inactive) {
      queryParams.append("include_inactive", "true");
    }

    const endpoint = `/ad-credit-packages${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const expiresAt = Math.floor(Date.now() / 1000) + 3600;
    apiClientClass.setAuthToken(token, expiresAt);

    const response = await apiClientClass.get<AdCreditPackagesResponse>(
      endpoint,
      {
        headers,
      },
    );
    console.log("API Response:", response.data.data);
    return {
      packages: response.data.data || [],
      pagination: response.data.pagination || null,
    };
  } catch (error) {
    handleError(error, "/dashboard/ad-credit-package");
    throw error;
  }
};

/**
 * Fetch badge features from the API
 * @param token - Authentication token
 * @returns Promise containing badge features data
 */
export const fetchBadgeFeatures = async (
  token: string,
): Promise<BadgeFeaturesResponse> => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const expiresAt = Math.floor(Date.now() / 1000) + 3600;
    apiClientClass.setAuthToken(token, expiresAt);

    const response = await apiClientClass.get<BadgeFeaturesResponse>(
      "/badges",
      {
        headers,
      },
    );

    return response.data;
  } catch (error) {
    handleError(error, "/badges");
    throw error;
  }
};

/**
 * Create a new badge
 * @param token - Authentication token
 * @param data - Badge creation data
 * @returns Promise containing created badge data
 */
export const createBadge = async (
  token: string,
  data: CreateBadgeParams,
): Promise<CreateBadgeResponse> => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const expiresAt = Math.floor(Date.now() / 1000) + 3600;
    apiClientClass.setAuthToken(token, expiresAt);

    const response = await apiClientClass.post<CreateBadgeResponse>(
      "/badges",
      data,
      { headers },
    );

    return response.data;
  } catch (error) {
    handleError(error, "/badges (POST)");
    throw error;
  }
};

/**
 * Create a new badge feature
 * @param token - Authentication token
 * @param data - Feature data
 * @returns Promise containing created feature data
 */
export const createBadgeFeature = async (
  token: string,
  data: {
    name: string;
    code?: string;
    applies_to: string;
    monthly_price_credits: number;
    priority_boost?: number;
    max_entities?: number;
    is_active?: boolean;
  },
): Promise<BadgeFeaturesResponse> => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const expiresAt = Math.floor(Date.now() / 1000) + 3600;
    apiClientClass.setAuthToken(token, expiresAt);

    const response = await apiClientClass.post<BadgeFeaturesResponse>(
      "/badges",
      data,
      { headers },
    );

    return response.data;
  } catch (error) {
    handleError(error, "/badges (POST)");
    throw error;
  }
};

/**
 * Delete a badge feature by ID
 * @param token - Authentication token
 * @param featureId - Feature ID to delete
 * @returns Promise containing deletion result
 */
export const deleteBadgeFeature = async (
  token: string,
  featureId: number,
): Promise<BadgeFeaturesResponse> => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const expiresAt = Math.floor(Date.now() / 1000) + 3600;
    apiClientClass.setAuthToken(token, expiresAt);

    const response = await apiClientClass.delete<BadgeFeaturesResponse>(
      `/badges/${featureId}`,
      { headers },
    );

    return response.data;
  } catch (error) {
    handleError(error, `/badges/${featureId} (DELETE)`);
    throw error;
  }
};

export const fetchCities = (token: string) =>
  fetchData("/dashboard/cities", token);
export const fetchCityDetails = (cityId: number, token: string) =>
  fetchData(`/cities/${cityId}`, token);

export const fetchCitiesWithParams = (
  token: string,
  page: number = 1,
  perPage: number = 10,
  search?: string,
) => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("per_page", perPage.toString());
  if (search) params.append("search", search);
  return fetchPaginatedData(`dashboard/cities?${params.toString()}`, token);
};

export const fetchCountries = (token: string) => fetchData("/countries", token);

export const fetchAreasByCountry = (countryName: string, token: string) =>
  fetchData(`/areas/all?country=${encodeURIComponent(countryName)}`, token);

export const fetchStatesByCountry = (countryName: string, token: string) =>
  fetchData(`/states?country=${encodeURIComponent(countryName)}`, token);

export const fetchFeatures = (token: string) => fetchData("/features", token);
export const fetchMileStones = (token: string) =>
  fetchData("/milestones", token);
export const fetchPropertyTypes = (token: string) =>
  fetchPropertiesCreateData("/propertyTypes", token);
export const fetchPropertySubtype = (token: string) =>
  fetchPropertiesCreateData("/propertySubtypes", token);
export const fetchPropertiesByDeveloper = (
  token: string,
  developer_id: number,
  status: string = "active",
  per_page: string = "all",
  search?: string,
) => {
  const params = new URLSearchParams({
    developer_id: developer_id.toString(),
    status,
    per_page,
  });
  if (search) {
    params.append("search", search);
  }
  return fetchData(`/properties?${params.toString()}`, token);
};
export const fetchProperties = (
  sortBy: string[] = [],
  sortOrder: string[] = [],
  selectedCountries: number[] = [],
  selectedDevelopers: number[] = [],
  selectedProjects: number[] = [],
  per_page: number | string = "all",
  page?: number,
) =>
  fetchPropertiesData(
    `/filter/properties`,
    sortBy,
    sortOrder,
    selectedCountries,
    selectedDevelopers,
    selectedProjects,
    per_page,
    page,
  );
export const fetchPropertiesSorted = (sortBy: string) =>
  fetchData2(`/getproprty?sort_by=${sortBy}`);
export const fetchImportProperties = (token: string) =>
  fetchData("/properties", token);
export const fetchDevelopers = (
  token: string,
  page: number,
  per_page: number,
  search?: string,
  status?: string,
  country_id?: string,
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: per_page.toString(),
  });

  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (country_id) params.append("country_id", country_id);
  return fetchData(`/developers/all?${params.toString()}`, token);
};
export const fetchReservations = (token: string) => fetchDataReserve(token);
export const fetchBuildings = (token: string) => fetchData("/buildings", token);
export const fetchAddresses = (token: string) => fetchData("/addresses", token);
export const fetchUsers = (
  token: string,
  page: number = 1,
  perPage: number = 15,
) => fetchDataWithPagination("/users", token, page, perPage);
export const fetchTenants = (token: string) => fetchData("/tenants", token);
export const fetchPermissions = (token: string) =>
  fetchData("/permissions", token);
export const fetchRoles = (token: string) =>
  fetchData("/dashboard/roles", token);

// FETCH DATA ID
export const fetchAreaDetails = (areaId: number, token: string) =>
  fetchData(`/areas/${areaId}`, token);
export const fetchDldAreaDetails = (dldAreaId: number, token: string) =>
  fetchData(`/dldAreas/${dldAreaId}`, token);
export const fetchLocationsDetails = (locationId: number, token: string) =>
  fetchData(`/locations/${locationId}`, token);
export const fetchProjectsDetails = (projectId: number, token: string) =>
  fetchData(`/dashboard/projects/${projectId}`, token);
export const fetchReservationDetails = (token: string, reservationId: number) =>
  fetchDataReserveUnit(token, reservationId);

export const confirmBooking = (
  bookingId: number,
  token: string,
  comments?: string,
) => {
  const formData = new FormData();
  formData.append("status", "confirmed");
  if (comments) formData.append("comments", comments);
  return postData(
    `/dashboard/admin/reservations/${bookingId}/confirm`,
    formData,
    token,
  );
};

export const declineBooking = (
  bookingId: number,
  token: string,
  comments?: string,
) => {
  const formData = new FormData();
  formData.append("status", "cancelled");
  if (comments) formData.append("comments", comments);
  return postData(
    `/dashboard/admin/reservations/${bookingId}/decline`,
    formData,
    token,
  );
};
export const fetchRereferralDetails = (referralId: number, token: string) =>
  fetchData(`/referrals/${referralId}`, token);
export const fetchFeaturesDetails = (featureId: number, token: string) =>
  fetchData(`/features/${featureId}`, token);
export const fetchMilestonesDetails = (projectId: number, token: string) =>
  fetchData(`/milestones/${projectId}`, token);
export const fetchPropertyTypesDetails = (
  propertyTypeId: number,
  token: string,
) => fetchData(`/propertyTypes/${propertyTypeId}`, token);
export const fetchPropertySubtypesDetails = (
  propertySubtypeId: number,
  token: string,
) => fetchData(`/propertySubtypes/${propertySubtypeId}`, token);
export const fetchPropertyDetails = (propertyId: number, token: string) =>
  fetchData(`/properties/${propertyId}`, token);
export const fetchBuildingsDetails = (buildingId: number, token: string) =>
  fetchData(`/buildings/${buildingId}`, token);
export const fetchDeveloperDetails = (developerId: number, token: string) =>
  fetchDevelopersData(`/developers/${developerId}`, token);
export const fetchDeveloperFeaturesDetails = (
  developerFeatureId: number,
  token: string,
) => fetchData(`/feature-developers/${developerFeatureId}`, token);
export const fetchAddressDetails = (addressId: number, token: string) =>
  fetchData(`/addresses/${addressId}`, token);
export const fetchUsersDetails = (userId: number, token: string) =>
  fetchData(`/dashboard/users/${userId}`, token);
export const fetchPermissionDetails = (permissionId: number, token: string) =>
  fetchData(`/permissions/${permissionId}`, token);
export const fetchRolesDetails = (roleId: number, token: string) =>
  fetchData(`/roles/${roleId}`, token);
export const fetchProjectFeatureDetails = (
  projectId: number,
  featureId: number,
  token: string,
) => fetchData(`/projects/${projectId}/features/${featureId}`, token);

export const fetchActivityLogs = (token: string, params?: string) =>
  fetchData(`/activityLogs${params ? `?${params}` : ""}`, token);
export const searchActivityLogs = (
  searchData: { keyword: string; per_page: number; page: number },
  token: string,
) => postData("/activityLogs/search", searchData, token);

export const fetchDashboardStats = (token: string) =>
  fetchData("/dashboard/stats", token);

export const fetchTransactions = (token: string) =>
  fetchData("/transactions", token);

export const fetchUserProfile = (token: string) =>
  fetchData("/user/profile", token);

export const updateUserProfile = (
  userData: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    country: string;
    profile_picture: string;
  },
  token: string,
) => postData("/user/profile/update", userData, token);

export const changePassword = (
  passwordData: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  },
  token: string,
) => postData("/user/change-password", passwordData, token);

export const fetchAiConversations = (token: string, params?: string) =>
  fetchData(`/ai/conversations${params ? `?${params}` : ""}`, token);

export const fetchAiTemplates = (token: string) =>
  fetchData("/ai/templates", token);

export const addAiTemplate = (
  templateData: {
    name: string;
    content: string;
    description?: string;
  },
  token: string,
) => postData("/ai/templates", templateData, token);

export const fetchNotifications = (token: string, params?: string) =>
  fetchData(`/notifications${params ? `?${params}` : ""}`, token);

export const searchNotifications = (
  searchData: { keyword: string; per_page: number; cursor?: string },
  token: string,
) => postData("/notifications/search", searchData, token);

export const fetchBookings = (token: string) => fetchData("/bookings", token);

export const fetchProjectMediaDetails = (mediaId: number, token: string) =>
  fetchData(`/projects/medias/${mediaId}`, token);
export const fetchProjectPaymentDetails = (paymentId: number, token: string) =>
  fetchData(`/paymentPlans/${paymentId}`, token);
export const fetchPropertyMediaDetails = (mediaId: number, token: string) =>
  fetchData(`/properties/medias/${mediaId}`, token);
export const fetchPropertyFeatureDetails = (
  propertyId: number,
  featureId: number,
  token: string,
) => fetchData(`/properties/${propertyId}/features/${featureId}`, token);
export const fetchDeveloperFeatureDetails = (
  developerId: number,
  featureId: number,
  token: string,
) => fetchData(`/developers/${developerId}/features/${featureId}`, token);

// POST DATA
export const addProject = (
  data: CreateProjectInput,
  token: string,
): Promise<CreateProjectResponse> => {
  return postData("/projects", data, token).then((res: any) => res.data);
};
export const addReferral = (referralData: CreateProjectInput, token: string) =>
  postData("/referrals", referralData, token);
export const addArea = (areaData: AreaInput, token: string) =>
  postData("/areas", areaData, token);
export const addCity = (cityData: CityInput, token: string) =>
  postData("/cities", cityData, token);
export const addDldArea = (dldAreaData: DldAreasDataType, token: string) =>
  postData("/dldAreas", dldAreaData, token);
export const addLocation = (locationData: LocationInput, token: string) =>
  postData("/locations", locationData, token);
export const addFeature = (featureData: FeatureInput, token: string) =>
  postData("/features", featureData, token);
export const addMilestone = (milestoneData: MilestoneSchema, token: string) =>
  postData("/milestones", milestoneData, token);
export const addPropertyType = (
  propertyTypeData: PropertyTypeDataType,
  token: string,
) => postData("/propertyTypes", propertyTypeData, token);
export const addPropertySubtype = (
  propertySubtypeData: PropertySubtypeDataType,
  token: string,
) => postData("/propertySubtypes", propertySubtypeData, token);
export const addProperty = (propertyData: PropertiesInput, token: string) =>
  postData("/properties", propertyData, token);
export const addDeveloper = (developerData: FormData, token: string) =>
  postDataImg("/developers", developerData, token);
export const addBuilding = (buildingData: BuildingInputType, token: string) =>
  postData("/buildings", buildingData, token);
export const addAddress = (addressData: AddressDataType, token: string) =>
  postData("/addresses", addressData, token);
export const addUser = (userData: CreateNewUserInput, token: string) =>
  postData("/users", userData, token);
export const addPermission = (
  permissionData: PermissionsDataType,
  token: string,
) => postData("/permissions", permissionData, token);
export const addRoles = (rolesData: RolesDataType, token: string) =>
  postData("/roles", rolesData, token);
export const addRolesPermission = (
  rolesPermissionsData: CreateRolesPermissionsInput,
  token: string,
) => postData("/roles/permissions", rolesPermissionsData, token);
export const addProjectFeature = (projectFeatureData: any, token: string) =>
  postData("/projects/features", projectFeatureData, token);
export const addSubscriptionFeature = (
  projectFeatureData: CreateProjectFeatureInput,
  token: string,
) => postData("/badges", projectFeatureData, token);
export const addBadge = (badgeData: BadgeInput, token: string) =>
  postData("/badges", badgeData, token);
export const addProjectMedia = (
  projectMediaData: CreateProjectMediaInput,
  token: string,
) => postDataImg(`/projects/medias/create`, projectMediaData, token);
export const addProjectPayment = (
  projectPaymentData: PaymentPlanInput,
  token: string,
) => postData(`/paymentPlans`, projectPaymentData, token);
export const addProjectPaymentBulk = (
  projectPaymentData: PaymentPlanInput,
  token: string,
) => postData(`/paymentPlans/bulk/add`, projectPaymentData, token);

export interface PaymentPlanItemInput {
  payment_plan_id: number;
  type: string;
  percentage: number;
  intervals: number;
}

export const addPaymentPlanItem = (
  paymentPlanItemData: PaymentPlanItemInput,
  token: string,
) => postData(`/paymentPlanItems`, paymentPlanItemData, token);

export const deletePaymentPlan = (paymentPlanId: number, token: string) =>
  deleteData(`/paymentPlans/${paymentPlanId}`, token);

export const updatePaymentPlan = (
  paymentPlanId: number,
  paymentPlanData: PaymentPlanInput,
  token: string,
) => postData(`/paymentPlans/${paymentPlanId}`, paymentPlanData, token);
export const addPropertyFeature = (
  propertyFeatureData: CreatePropertyFeatureInput,
  token: string,
) => postData(`/properties/features`, propertyFeatureData, token);
export const addPropertyMedia = (
  propertyMediaData: CreatePropertyMediaInput,
  token: string,
) => postDataImg(`/properties/medias`, propertyMediaData, token);
export const addDeveloperFeature = (
  developerFeatureData: CreateDeveloperFeatureInput,
  token: string,
) => postData(`/developers/features/create`, developerFeatureData, token);

// EDIT DATA
export const editProject = (
  projectId: number,
  projectData: Record<string, unknown>,
  token: string,
) => editData(`/projects/${projectId}`, projectData, token);

export const editReferral = (
  referralId: number,
  referralData: CreateReferralInput,
  token: string,
) => editData(`/referrals/${referralId}`, referralData, token);

export const editArea = (areaId: number, areaData: AreaInput, token: string) =>
  editData(`/areas/${areaId}`, areaData, token);

export const editCity = (cityId: number, cityData: CityInput, token: string) =>
  editData(`/cities/${cityId}`, cityData, token);

export const editDldarea = (
  dldAreaId: number,
  dldAreaData: DldAreasDataType,
  token: string,
) => editData(`/dldAreas/${dldAreaId}`, dldAreaData, token);

export const editLocation = (
  locationId: number,
  locationData: EditLocationInput,
  token: string,
) => editData(`/locations/${locationId}`, locationData, token);

export const editFeature = (
  featureId: number,
  featureData: FeaturesDataType,
  token: string,
) => editData(`/features/${featureId}`, featureData, token);

export const editMilestone = (
  milestoneId: number,
  milestoneData: MilestoneSchema,
  token: string,
) => editData(`/milestones/${milestoneId}`, milestoneData, token);

export const editPropertyType = (
  propertyTypeId: number,
  propertyTypeData: PropertyTypeDataType,
  token: string,
) => editData(`/propertyTypes/${propertyTypeId}`, propertyTypeData, token);

export const editPropertySubtype = (
  propertySubtypeId: number,
  propertySubtypeData: PropertySubtypeDataType,
  token: string,
) =>
  editData(
    `/propertySubtypes/${propertySubtypeId}`,
    propertySubtypeData,
    token,
  );

export const editProperty = (
  propertyId: number,
  propertyData: PropertiesDataType,
  token: string,
) => editData(`/properties/${propertyId}`, propertyData, token);

export const editDeveloper = (
  developerId: number,
  developerData: FormData,
  token: string,
) => editDataImg(`/developers/${developerId}`, developerData, token);

export const toggleDeveloperStatus = (
  developerId: number,
  newStatus: string,
  token: string,
) => patchData(`/developers/${developerId}/toggle-status`, newStatus, token);

export const editBuilding = (
  buildingId: number,
  buildingData: BuildingInputType,
  token: string,
) => editData(`/buildings/${buildingId}`, buildingData, token);

export const editAddress = (
  addressId: number,
  addressData: AddressDataType,
  token: string,
) => editData(`/addresses/${addressId}`, addressData, token);

export const editUser = (
  userId: number,
  userData: EditNewUserInput,
  token: string,
) => editData(`/users/${userId}`, userData, token);

export const editPermission = (
  permissionId: number,
  permissionData: PermissionsDataType,
  token: string,
) => editData(`/permissions/${permissionId}`, permissionData, token);

export const editRoles = (
  rolesId: number,
  rolesData: RolesDataType,
  token: string,
) => editData(`/roles/${rolesId}`, rolesData, token);

export const editProjectFeature = (
  projectId: number,
  featureId: number,
  projectFeatureData: { value: string; description: string },
  token: string,
) =>
  editData(
    `/projects/${projectId}/features/${featureId}`,
    projectFeatureData,
    token,
  );

export const editProjectMedia = (
  mediaId: number,
  projectMediaData: {
    description: string;
    is_primary: boolean;
    my_order: boolean;
  },
  token: string,
) => editData(`/projects/medias/${mediaId}`, projectMediaData, token);

export const editProjectPayment = (
  paymentId: number,
  projectPaymentData: {
    name: string;
    description: string;
    period_by_years: number;
    status: string;
    developerId: number;
  },
  token: string,
) => editData(`/paymentPlans/${paymentId}`, projectPaymentData, token);

export const editPropertyFeature = (
  propertyId: number,
  featureId: number,
  propertyFeatureData: { value: string },
  token: string,
) =>
  editData(
    `/properties/${propertyId}/features/${featureId}`,
    propertyFeatureData,
    token,
  );

export const editPropertyMedia = (
  mediaId: number,
  propertyMediaData: {
    description: string;
    is_primary: boolean;
    my_order: boolean;
  },
  token: string,
) => editData(`/properties/medias/${mediaId}`, propertyMediaData, token);

export const editDeveloperFeature = (
  developerId: number,
  featureId: number,
  developerFeatureData: { value: string },
  token: string,
) =>
  editData(
    `/developers/${developerId}/features/${featureId}`,
    developerFeatureData,
    token,
  );

// DELETE DATA
export const deleteArea = (areaId: number, token: string) =>
  deleteData(`/areas/${areaId}`, token);
export const deleteDldArea = (dldAreaId: number, token: string) =>
  deleteData(`/dldAreas/${dldAreaId}`, token);
export const deleteLocation = (locationId: number, token: string) =>
  deleteData(`/locations/${locationId}`, token);
export const deleteProject = (projectId: number, token: string) =>
  deleteData(`/projects/${projectId}`, token);
export const deleteReferral = (referralId: number, token: string) =>
  deleteData(`/referrals/${referralId}`, token);
export const deleteCity = (cityId: number, token: string) =>
  deleteData(`/cities/${cityId}`, token);
export const deleteFeature = (featureId: number, token: string) =>
  deleteData(`/features/${featureId}`, token);
export const deleteMilestone = (milestoneId: number, token: string) =>
  deleteData(`/milestones/${milestoneId}`, token);
export const deletePropertyType = (propertyTypeId: number, token: string) =>
  deleteData(`/propertyTypes/${propertyTypeId}`, token);
export const deletePropertySubtype = (
  propertySubtypeId: number,
  token: string,
) => deleteData(`/propertySubtypes/${propertySubtypeId}`, token);
export const deleteProperty = (propertyId: number, token: string) =>
  deleteData(`/properties/${propertyId}`, token);
export const deleteDeveloper = (developerId: number, token: string) =>
  deleteData(`/developers/${developerId}`, token);
export const deleteBuilding = (buildingId: number, token: string) =>
  deleteData(`/buildings/${buildingId}`, token);
export const deleteAddress = (addressId: number, token: string) =>
  deleteData(`/addresses/${addressId}`, token);
export const deleteUser = (userId: number, token: string) =>
  deleteData(`/users/${userId}`, token);
export const deletePermission = (permissionId: number, token: string) =>
  deleteData(`/permissions/${permissionId}`, token);
export const deleteRoles = (rolesId: number, token: string) =>
  deleteData(`/roles/${rolesId}`, token);
export const deleteRolesPermissions = (
  rolesId: number,
  permissionId: number,
  token: string,
) => deleteData(`/roles/${rolesId}/permissions/${permissionId}`, token);
export const deleteProjectFeature = (
  projectId: number,
  featureId: number,
  token: string,
) => deleteData(`/projects/${projectId}/features/${featureId}`, token);
export const deletePropertyFeature = (
  propertyId: number,
  featureId: number,
  token: string,
) => deleteData(`/properties/${propertyId}/features/${featureId}`, token);
export const deleteDeveloperFeature = (
  developerId: number,
  featureId: number,
  token: string,
) => deleteData(`/developers/${developerId}/features/${featureId}`, token);
export const deletePropertyMedia = (media_id: number, token: string) =>
  deleteData(`/properties/medias/${media_id}`, token);
export const deleteProjectMedia = (media_id: number, token: string) =>
  deleteData(`/projects/medias/${media_id}`, token);
export const deleteProjectPayment = (
  payment_id: number,
  projectId: number,
  token: string,
) => deleteData(`/paymentPlans/${payment_id}`, token);
export const deletePropertyPayment = (
  payment_id: number,
  propId: number,
  token: string,
) => deleteData(`/paymentPlans/${payment_id}`, token);

// AUTH
const apiAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const postDataAuth = async (endpoint: string, data: unknown) => {
  try {
    const response = await apiAuth.post(endpoint, data);
    return response.data;
  } catch (error) {
    handleError(error, endpoint);
  }
};

export const signUpAdmin = async (userData: {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  password_confirmation: string;
  role_id: string;
}) => {
  return postDataAuth("/auth/register", userData);
};

export const forgetPassword = async (userData: { email: string }) => {
  postDataAuth("/auth/forget-password", userData);
};

export const verifyToken = (verifyTokenData: OtpSchema) =>
  postDataAuth("/auth/verify-token", verifyTokenData);

export const resetPassword = (resetPasswordData: ResetpasswordSchema) =>
  postDataAuth("/auth/reset-password", resetPasswordData);

// MEETING REQUESTS
/**
 * Confirm a meeting request (approve)
 * @param id - Meeting request ID
 * @param token - Authentication token
 * @returns Promise with the API response
 */
export const confirmMeetingRequest = async (
  id: number | string,
  token: string,
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/meeting-requests/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({ status: "active" }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      throw new Error("Failed to confirm meeting request");
    }

    return res;
  } catch (error) {
    handleError(error, `/meeting-requests/${id}`);
    throw error;
  }
};

/**
 * Cancel a meeting request (reject)
 * @param id - Meeting request ID
 * @param token - Authentication token
 * @returns Promise with the API response
 */
export const cancelMeetingRequest = async (
  id: number | string,
  token: string,
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/meeting-requests/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({ status: "cancelled" }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      throw new Error("Failed to cancel meeting request");
    }

    return res;
  } catch (error) {
    handleError(error, `/meeting-requests/${id}`);
    throw error;
  }
};

// export const fetchMeetingRequestDetails = async (
//   meetingId: number,
//   token: string,
// ) => {
//   try {
//     const headers: Record<string, string> = {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     };

//     const expiresAt = Math.floor(Date.now() / 1000) + 3600;
//     apiClientClass.setAuthToken(token, expiresAt);

//     const response = await apiClientClass.get(
//       `/dashboard/meeting-requests/${id}`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       },
//     );

//     return response.data;
//   } catch (error) {
//     handleError(error, `/dashboard/meeting-requests/${meetingId}`);
//   }
// };

// ============================================
// Expert Functions
// ============================================

export const fetchExpertsPaginated = async (
  token: string,
  params: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
  },
): Promise<FetchExpertsResult> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.per_page)
      queryParams.append("per_page", params.per_page.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.status) queryParams.append("status", params.status);

    const res = await apiClient.get(`/experts?${queryParams.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      experts: res.data?.data || [],
      total: res.data?.total || 0,
    };
  } catch (error) {
    handleError(error, "/experts");
    return { experts: [], total: 0 };
  }
};

export const deleteExpert = async (id: number, token: string) => {
  try {
    const expiresAt = Math.floor(Date.now() / 1000) + 3600;
    apiClientClass.setAuthToken(token, expiresAt);

    const res = await apiClientClass.delete(`/experts/${id}`);
    return res.data;
  } catch (error) {
    handleError(error, `/experts/${id}`);
    throw error;
  }
};

export const addExpert = async (data: FormData, token: string) => {
  try {
    const res = await apiClient.post("/experts", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    handleError(error, "/experts");
    throw error;
  }
};

export const editExpert = async (id: number, data: FormData, token: string) => {
  try {
    const res = await apiClient.post(`/experts/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    handleError(error, `/experts/${id}`);
    throw error;
  }
};

export const toggleExpertStatus = async (id: number, token: string) => {
  try {
    const res = await apiClient.patch(
      `/experts/${id}/toggle-status`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return res.data;
  } catch (error) {
    handleError(error, `/experts/${id}/toggle-status`);
    throw error;
  }
};

export const fetchExpertDetails = async (id: number, token: string) => {
  try {
    const res = await apiClient.get(`/experts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    handleError(error, `/experts/${id}`);
    throw error;
  }
};
