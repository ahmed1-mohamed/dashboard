// Standardized TypeScript types for admin API interactions

export interface PaginatedResponse<T> {
  status: boolean;
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface TableItem {
  id: number | string;
  [key: string]: any;
}

export interface SearchParams {
  search?: string;
  page?: number;
  per_page?: number;
  [key: string]: any;
}

export interface FilterOptions {
  status?: string;
  project_type?: string;
  [key: string]: any;
}

export interface SortOptions {
  sortBy?: string[];
  sortOrder?: string[];
}

export interface AdminApiConfig<T> {
  // API endpoints
  listEndpoint: (params?: SearchParams) => string;
  detailEndpoint: (id: number | string) => string;
  createEndpoint: () => string;
  updateEndpoint: (id: number | string) => string;
  deleteEndpoint: (id: number | string) => string;
  
  // Data transformation
  mapToItem: (rawData: any) => T;
  mapFromItem: (item: T) => any;
  
  // Optional: custom query parameters for list
  getListParams?: (filters: FilterOptions, search: string, page: number, perPage: number) => SearchParams;
  
  // Optional: toast messages
  toastMessages?: {
    createSuccess: string;
    updateSuccess: string;
    deleteSuccess: string;
    error: string;
  };
}

export interface UsePaginatedDataOptions<T> {
  config: AdminApiConfig<T>;
  initialPage?: number;
  initialPerPage?: number;
  initialSearch?: string;
  initialFilters?: FilterOptions;
  initialSort?: SortOptions;
  debounceMs?: number;
}

export interface UseTableActionsOptions<T> {
  config: AdminApiConfig<T>;
  onSuccess?: (action: string, data: T) => void;
  onError?: (action: string, error: ApiError) => void;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface TableActionHandlers<T> {
  onAdd: (data: T) => Promise<void>;
  onEdit: (id: number | string, data: T) => Promise<void>;
  onDelete: (id: number | string) => Promise<void>;
  onToggle: (id: number | string, enabled: boolean) => Promise<void>;
  onView: (id: number | string) => void;
}