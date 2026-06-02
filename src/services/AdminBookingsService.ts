// import { apiClient } from "@/lib/apiClient";

// export const AdminBookingsService = {
//   /**
//    * Get bookings with pagination and filters (admin)
//    */
//   getBookings: (
//     page: number = 1,
//     perPage: number = 10,
//     filters?: {
//       country?: string;
//       status?: string;
//       type?: string;
//       expiryDate?: string;
//       search?: string;
//     },
//   ) => {
//     const params = new URLSearchParams({
//       page: page.toString(),
//       per_page: perPage.toString(),
//     });

//     if (filters?.country && filters.country !== "all") {
//       params.append("country", filters.country);
//     }
//     if (filters?.status && filters.status !== "all") {
//       params.append("status", filters.status);
//     }
//     if (filters?.type && filters.type !== "all") {
//       params.append("type", filters.type);
//     }
//     if (filters?.expiryDate && filters.expiryDate !== "all") {
//       params.append("expiry_date", filters.expiryDate);
//     }
//     if (filters?.search && filters.search.trim() !== "") {
//       params.append("search", filters.search.trim());
//     }

//     return apiClient.get(`/dashboard/bookings?${params.toString()}`);
//   },

//   /**
//    * Get booking details by ID
//    */
//   getBookingDetails: (bookingId: number) => {
//     return apiClient.get(`/dashboard/admin/bookings/${bookingId}`);
//   },

//   /**
//    * Confirm a booking
//    */
//   confirmBooking: (bookingId: number, comments?: string) => {
//     const formData = new FormData();
//     formData.append("status", "confirmed");
//     if (comments) formData.append("comments", comments);
//     return apiClient.post(
//       `/dashboard/admin/bookings/${bookingId}/confirm`,
//       formData,
//     );
//   },

//   /**
//    * Decline a booking
//    */
//   declineBooking: (bookingId: number, comments?: string) => {
//     const formData = new FormData();
//     formData.append("status", "cancelled");
//     if (comments) formData.append("comments", comments);
//     return apiClient.post(
//       `/dashboard/admin/bookings/${bookingId}/decline`,
//       formData,
//     );
//   },
// };

import { apiClient } from "@/lib/apiClient";

export const AdminBookingsService = {
  /**
   * Get bookings with pagination and filters (admin)
   */
  getBookings: async (
    page: number = 1,
    perPage: number = 10,
    filters?: {
      country?: string;
      status?: string;
      type?: string;
      expiryDate?: string;
      search?: string;
    },
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    if (filters?.country && filters.country !== "all") {
      params.append("country", filters.country);
    }
    if (filters?.status && filters.status !== "all") {
      params.append("status", filters.status);
    }
    if (filters?.type && filters.type !== "all") {
      params.append("type", filters.type);
    }
    if (filters?.expiryDate && filters.expiryDate !== "all") {
      params.append("expiry_date", filters.expiryDate);
    }
    if (filters?.search && filters.search.trim() !== "") {
      params.append("search", filters.search.trim());
    }

    const response = await apiClient.get(`/all-reservations?${params.toString()}`);
    return response.data;
  },

  /**
   * Get booking details by ID
   */
  getBookingDetails: (bookingId: number) => {
    return apiClient.get(`/dashboard/admin/bookings/${bookingId}`);
  },

  /**
   * Confirm a booking
   */
  confirmBooking: (bookingId: number, comments?: string) => {
    const formData = new FormData();
    formData.append("status", "confirmed");
    if (comments) formData.append("comments", comments);
    return apiClient.post(
      `/dashboard/admin/bookings/${bookingId}/confirm`,
      formData,
    );
  },

  /**
   * Decline a booking
   */
  declineBooking: (bookingId: number, comments?: string) => {
    const formData = new FormData();
    formData.append("status", "cancelled");
    if (comments) formData.append("comments", comments);
    return apiClient.post(
      `/dashboard/admin/bookings/${bookingId}/decline`,
      formData,
    );
  },
};
