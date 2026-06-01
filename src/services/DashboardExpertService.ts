import { apiClient } from "@/lib/apiClient";
import {
  AvailabilityException,
  AvailabilityExceptionRes,
  AvailabilitySlot,
  WeeklyAvailability,
} from "@/types/expertDashboard/availability";
import {
  BookingResponse,
  BookingStats,
} from "@/types/expertDashboard/bookings";
import { HistoryStats } from "@/types/expertDashboard/history";
import { DashboardMetricsResponse } from "@/types/expertDashboard/metrics";
import {
  PackageResponse,
  SinglePackageResponse,
} from "@/types/expertDashboard/package";
import {
  CategoryResponse,
  Country,
  CountryResponse,
  ExpertProfileResponse,
  LanguagesResponse,
} from "@/types/expertDashboard/profile";
import { ReviewsResponse } from "@/types/expertDashboard/review";
import {
  TransactionsResponse,
  TransactionStatus,
} from "@/types/expertDashboard/transctions";


export const DashboardExpertService = {

  // Home
  getMetrics: () => apiClient.get<DashboardMetricsResponse>("/dashboard/experts/me/bookings-metrics"),

  // Reviews
  getReviews: (expertId: number) => apiClient.get<ReviewsResponse>(`/dashboard/experts/${expertId}/reviews`),

  // Bookings
  getBookings: ({
    page,
    per_page,
    status,
    search,
  }: {
    page: number;
    per_page: number;
    status?: BookingStats;
    search?: string;
  }) => {
    return apiClient.get<BookingResponse>("/dashboard/experts/me/bookings", {
      params: { page, per_page, status, search },
    });
  },

  confirmBooking: (bookingId: number) => {
    return apiClient.post(`/dashboard/experts/bookings/${bookingId}/confirm`);
  },

  declineBooking: (bookingId: number) => {
    return apiClient.post(`/dashboard/experts/bookings/${bookingId}/decline`);
  },

  rescheduleBookings: (
    bookingId: number,
    data: {
      start_time: string;
      minutes: number;
    },
  ) => {
    return apiClient.post(
      `/dashboard/experts/bookings/${bookingId}/reschedule`,
      data,
    );
  },

  agoraCall: (channelName: string) => {
    return apiClient.get(`agora/token?channel_name=${channelName}`);
  },

  getBookingsHistory: ({
    page,
    status,
    search,
  }: {
    page: number;
    status?: HistoryStats;
    search?: string;
  }) => {
    return apiClient.get<BookingResponse>("/dashboard/experts/me/history", {
      params: { page, status, search },
    });
  },

  // Availability

  getWeeklyAvailability(expertId: number) {
    return apiClient.get<WeeklyAvailability>(
      `/dashboard/experts/${expertId}/availabilities`,
    );
  },

  toggleAvailabilityDay: (
    expertId: number,
    data: {
      day: string;
      enabled: boolean;
    },
  ) => {
    return apiClient.patch(
      `/dashboard/experts/${expertId}/availabilities/day-toggle`,
      data,
    );
  },

  getAvailabilitySlot: (expertId: number, ruleId: number) => {
    return apiClient.get<AvailabilitySlot>(
      `/dashboard/experts/${expertId}/availabilities/${ruleId}`,
    );
  },

  addAvailabilitySlot: (
    expertId: number,
    data: {
      day: string;
      from: string;
      to: string;
      timezone?: string;
    },
  ) => {
    return apiClient.post<AvailabilitySlot>(
      `/dashboard/experts/${expertId}/availabilities/slots`,
      data,
    );
  },

  updateAvailabilitySlot: (
    expertId: number,
    ruleId: number,
    data: {
      from: string;
      to: string;
    },
  ) => {
    return apiClient.put<AvailabilitySlot>(
      `/dashboard/experts/${expertId}/availabilities/slots/${ruleId}`,
      data,
    );
  },

  deleteAvailabilitySlot: (expertId: number, ruleId: number) => {
    return apiClient.delete(
      `/dashboard/experts/${expertId}/availabilities/slots/${ruleId}`,
    );
  },

  // Exceptions

  getAvailabilityException: (expertId: number) => {
    return apiClient.get<AvailabilityExceptionRes>(
      `/dashboard/experts/${expertId}/availabilities/exceptions`,
    );
  },

  getSingleAvailabilityException: (expertId: number, exceptionId: number) => {
    return apiClient.get<any>(
      `/dashboard/experts/${expertId}/availabilities/exceptions/${exceptionId}`,
    );
  },

  setAvailabilityException: (
    expertId: number,
    data: {
      start_date: string;
      end_date: string;
      available: boolean;
    },
  ) => {
    return apiClient.post<AvailabilityException>(
      `/dashboard/experts/${expertId}/availabilities/exceptions`,
      data,
    );
  },

  updateAvailabilityException: (
    expertId: number,
    exceptionId: number,
    data: {
      start_date: string;
      end_date: string;
      available: boolean;
    },
  ) => {
    return apiClient.put(
      `/dashboard/experts/${expertId}/availabilities/exceptions/${exceptionId}`,
      data,
    );
  },

  deleteAvailabilityException: (expertId: number, exceptionId: number) => {
    return apiClient.delete(
      `/dashboard/experts/${expertId}/availabilities/exceptions/${exceptionId}`,
    );
  },

  // package

  getAllPackages(expertId: number) {
    return apiClient.get<PackageResponse>(
      `/dashboard/experts/${expertId}/packages`,
    );
  },

  getSinglePackage: (expertId: number, packageId: number) => {
    return apiClient.get<SinglePackageResponse>(
      `/dashboard/experts/${expertId}/packages/${packageId}`,
    );
  },

  addPackage: (
    expertId: number,
    data: {
      expert_id: number;
      name: string;
      minutes: string;
      price_cents: string;
      currency: string;
      is_active: boolean;
    },
  ) => {
    return apiClient.post(`/dashboard/experts/${expertId}/packages`, data);
  },

  updatePackage: (
    expertId: number,
    packageId: number,
    data: {
      expert_id?: number;
      name: string;
      minutes: string;
      price_cents: string;
      currency: string;
      is_active: boolean;
    },
  ) => {
    return apiClient.put(
      `/dashboard/experts/${expertId}/packages/${packageId}`,
      data,
    );
  },

  deletePackage: (expertId: number, packageId: number) => {
    return apiClient.delete(
      `/dashboard/experts/${expertId}/packages/${packageId}`,
    );
  },

  // transactions

  getMyTransactions: (params?: {
    page?: number;
    per_page?: number;
    status?: TransactionStatus;
    search?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.per_page) query.append("per_page", String(params.per_page));
    if (params?.status) query.append("status", params.status);
    if (params?.search) query.append("search", params.search);
    return apiClient.get<TransactionsResponse>(
      `/dashboard/experts/me/transactions?${query.toString()}`,
    );
  },

  requestWithdrawal: (data: {
    amount_cents: number;
    payment_method: "bank_transfer" | "paypal" | "wallet";
    account_holder_name: string;
    iban: string;
    bank_name: string;
  }) => {
    return apiClient.post("/dashboard/experts/me/payouts", data);
  },

  // Profile
  getProfileInformation: (expertId: number) =>
    apiClient.get<ExpertProfileResponse>(`/dashboard/experts/${expertId}`),

  updateProfileInformation: (expertId: number, data: FormData) =>
    apiClient.post<ExpertProfileResponse>(
      `/dashboard/experts/${expertId}`,
      data,
    ),

  getCountriesList: () => apiClient.get<Country[]>(`/dashboard/countries`),

  getLanguagesList: () =>
    apiClient.get<LanguagesResponse>(`/experts/languages`),

  getCategoriesList: () =>
    apiClient.get<CategoryResponse>(`/experts/categories`),
};
