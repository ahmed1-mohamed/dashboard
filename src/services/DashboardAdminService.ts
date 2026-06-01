import { apiClient } from "@/lib/apiClient";

export const DashboardAdminService = {
  getBookings: async () => {
    const response = await apiClient.get("/admin/bookings");
    return response.data;
  },
  getExperts: async () => {
    const response = await apiClient.get("/experts");
    return response.data;
  },
  getExpertsPaginated: async (page: number, limit: number, search?: string) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    const response = await apiClient.get(`/experts?${params.toString()}`);
    return response.data;
  },
  getProjects: async () => {
    const response = await apiClient.get("/projects");
    return response.data;
  },
  getProjectsPaginated: async (page: number, limit: number, search?: string) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("per_page", limit.toString());
    if (search) params.append("search", search);
    const response = await apiClient.get(`/projects?${params.toString()}`);
    return response.data;
  },
  getProjectDetails: async (projectId: number) => {
    const response = await apiClient.get(`/projects/${projectId}`);
    return response.data;
  },
  getProperties: async () => {
    const response = await apiClient.get("/properties");
    return response.data;
  },
  getPropertiesPaginated: async (page: number, limit: number, search?: string) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    const response = await apiClient.get(`/properties?${params.toString()}`);
    return response.data;
  },
  getDevelopers: async () => {
    const response = await apiClient.get("/developers");
    return response.data;
  },
  getDevelopersPaginated: async (page: number, limit: number, search?: string) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    const response = await apiClient.get(`/developers?${params.toString()}`);
    return response.data;
  },
  getCities: async (country?: string) => {
    const params = country ? `?country=${country}` : "";
    const response = await apiClient.get(`/cities/all${params}`);
    return response.data;
  },
  getAreas: async (country?: string) => {
    const params = country ? `?country=${country}` : "";
    const response = await apiClient.get(`/areas/all${params}`);
    return response.data;
  },
  getFeatures: async () => {
    const response = await apiClient.get("/features");
    return response.data;
  },

  // ============================================
  // Bookings (Admin)
  // ============================================

  /**
   * Get booking/reservation details by ID
   * Uses the show-reservation endpoint
   */
  getBookingDetails: async (reservationId: number) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL_WITHOUT_DASHBOARD}/show-reservation?reservation_id=${reservationId}`;
    const response = await apiClient.get(url);
    return response.data;
  },

  /**
   * Confirm/approve a booking
   */
  confirmBooking: (bookingId: number, formData: FormData) => {
    return apiClient.post(`/dashboard/admin/bookings/${bookingId}/confirm`, formData);
  },

  /**
   * Decline/reject a booking
   */
  declineBooking: (bookingId: number, formData: FormData) => {
    return apiClient.post(`/dashboard/admin/bookings/${bookingId}/decline`, formData);
  },

  /**
   * Upload sales offer document for a booking
   * FormData should include: reservation_id, file, comments
   */
  uploadSalesOffer: (formData: FormData) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL_WITHOUT_DASHBOARD}/make-sales-offer`;
    return apiClient.post(url, formData).then(res => res.data);
  },

  /**
   * Upload SPA (Sales and Purchase Agreement) document for a booking
   * FormData should include: reservation_id, file, comments
   */
  uploadSPA: (formData: FormData) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL_WITHOUT_DASHBOARD}/upload-sales-purchase`;
    return apiClient.post(url, formData).then(res => res.data);
  },
};