// Configuration helpers and types for admin API

import { AdminApiConfig, PaginatedResponse } from "@/types/admin-api.types";

/**
 * Helper to create admin API configurations with standardized patterns
 */
export class AdminApiConfigBuilder<T> {
  private config: Partial<AdminApiConfig<T>> = {};

  setListEndpoint(endpoint: (params?: any) => string) {
    this.config.listEndpoint = endpoint;
    return this;
  }

  setDetailEndpoint(endpoint: (id: number | string) => string) {
    this.config.detailEndpoint = endpoint;
    return this;
  }

  setCreateEndpoint(endpoint: () => string) {
    this.config.createEndpoint = endpoint;
    return this;
  }

  setUpdateEndpoint(endpoint: (id: number | string) => string) {
    this.config.updateEndpoint = endpoint;
    return this;
  }

  setDeleteEndpoint(endpoint: (id: number | string) => string) {
    this.config.deleteEndpoint = endpoint;
    return this;
  }

  setMapToItem(mapper: (rawData: any) => T) {
    this.config.mapToItem = mapper;
    return this;
  }

  setMapFromItem(mapper: (item: T) => any) {
    this.config.mapFromItem = mapper;
    return this;
  }

  setGetListParams(getter: (filters: any, search: string, page: number, perPage: number) => any) {
    this.config.getListParams = getter;
    return this;
  }

  setToastMessages(messages: Partial<AdminApiConfig<T>["toastMessages"]>) {
    this.config.toastMessages = {
      createSuccess: "Item created successfully",
      updateSuccess: "Item updated successfully",
      deleteSuccess: "Item deleted successfully",
      error: "Operation failed",
      ...messages
    };
    return this;
  }

  build(): AdminApiConfig<T> {
    // Validate required fields
    const requiredFields = [
      "listEndpoint",
      "detailEndpoint", 
      "createEndpoint",
      "updateEndpoint",
      "deleteEndpoint",
      "mapToItem",
      "mapFromItem"
    ] as const;

    for (const field of requiredFields) {
      if (!this.config[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    return this.config as AdminApiConfig<T>;
  }
}

/**
 * Create a new admin API config builder
 */
export const createAdminApiConfig = <T>() => {
  return new AdminApiConfigBuilder<T>();
};

/**
 * Standard pagination response handler
 */
export const handlePaginatedResponse = <T>(response: any, mapToItem: (rawData: any) => T): PaginatedResponse<T> => {
  // Handle different response formats
  if (response.data && response.data.data !== undefined) {
    // Format: { data: { data: [...], current_page: ..., per_page: ..., total: ... } }
    return {
      status: true,
      data: response.data.data.data.map(mapToItem),
      current_page: response.data.data.current_page,
      per_page: response.data.data.per_page,
      total: response.data.data.total
    };
  } else if (response.data && Array.isArray(response.data.data)) {
    // Format: { data: [...], current_page: ..., per_page: ..., total: ... }
    return {
      status: true,
      data: response.data.data.map(mapToItem),
      current_page: response.data.current_page || 1,
      per_page: response.data.per_page || 10,
      total: response.data.total || 0
    };
  } else if (Array.isArray(response.data)) {
    // Format: [...]
    return {
      status: true,
      data: response.data.map(mapToItem),
      current_page: 1,
      per_page: response.data.length,
      total: response.data.length
    };
  } else {
    // Fallback
    return {
      status: true,
      data: [],
      current_page: 1,
      per_page: 10,
      total: 0
    };
  }
};

/**
 * Standard error handler for admin APIs
 */
export const handleAdminApiError = (error: any, defaultMessage: string = "Operation failed"): Error => {
  console.error("Admin API Error:", error);
  
  // Extract message from various error formats
  let message = defaultMessage;
  
  if (error.response?.data?.message) {
    message = error.response.data.message;
  } else if (error.response?.data?.errors) {
    // Handle field validation errors
    const errors = error.response.data.errors;
    if (Array.isArray(errors)) {
      message = errors.join(", ");
    } else if (typeof errors === 'object') {
      message = Object.values(errors).flat().join(", ");
    }
  } else if (error.message) {
    message = error.message;
  }
  
  return new Error(message);
};