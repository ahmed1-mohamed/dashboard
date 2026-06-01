import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
// import { debounce } from "lodash";
import {
  PaginatedResponse,
  ApiError,
  UsePaginatedDataOptions,
  PaginatedData,
  AdminApiConfig,
} from "@/types/admin-api.types";

// Helper to extract token from session
// const getToken = (): string | null => {
//   const session = useSession.getState().data;
//   return session?.user?.accessToken ?? null;
// };

export const usePaginatedData = <T>(options: UsePaginatedDataOptions<T>) => {
  const {
    config,
    initialPage = 1,
    initialPerPage = 10,
    initialSearch = "",
    initialFilters = {},
    initialSort = {},
    debounceMs = 300,
  } = options;

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);
  const [sort, setSort] = useState<Record<string, any>>(initialSort);
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  const queryClient = useQueryClient();

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to first page when search changes
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [searchQuery, debounceMs]);

  // Build query parameters
  // const buildQueryParams = useCallback(() => {
  //   let params: any = {
  //     page,
  //     per_page: perPage
  //   };

  //   // Add search if provided
  //   if (debouncedSearch) {
  //     params.search = debouncedSearch;
  //   }

  //   // Add filters
  //   Object.keys(filters).forEach(key => {
  //     const value = filters[key];
  //     if (value !== undefined && value !== null && value !== "") {
  //       params[key] = Array.isArray(value) ? value.join(",") : value;
  //     }
  //   });

  //   // Add sort
  //   if (sort.sortBy && sort.sortBy.length > 0) {
  //     params.sort_by = sort.sortBy;
  //     params.sort_order = sort.sortOrder || ["asc"];
  //   }

  //   // Allow config to customize params
  //   if (config.getListParams) {
  //     const customParams = config.getListParams(filters, debouncedSearch, page, perPage);
  //     params = { ...params, ...customParams };
  //   }

  //   return params;
  // }, [debouncedSearch, filters, page, perPage, sort, config.getListParams]);

  // Fetch data query
  // const {
  //   data: responseData,
  //   isLoading,
  //   isError,
  //   error,
  //   isFetching,
  //   refetch
  // } = useQuery<PaginatedResponse<T[]>, ApiError>({
  //   queryKey: ["paginated-data", config.listEndpoint, buildQueryParams()],
  //   queryFn: async () => {
  // const token = getToken();
  // if (!token) {
  //   throw new Error("No access token available");
  // }

  // Set token in api client
  // const apiClient = require("@/lib/apiClient").apiClient;
  // apiClient.setAuthToken(token, Math.floor(Date.now() / 1000) + 3600);

  // const endpoint = config.listEndpoint(buildQueryParams());
  // const response = await apiClient.get<any>(endpoint);

  // Handle different response formats
  //     let paginatedData: PaginatedResponse<T[]>;

  //     if (response.data && response.data.data !== undefined) {
  //       // Format: { data: { data: [...], current_page: ..., per_page: ..., total: ... } }
  //       paginatedData = {
  //         status: true,
  //         data: response.data.data.data.map(config.mapToItem),
  //         current_page: response.data.data.current_page,
  //         per_page: response.data.data.per_page,
  //         total: response.data.data.total
  //       };
  //     } else if (response.data && Array.isArray(response.data.data)) {
  //       // Format: { data: [...], current_page: ..., per_page: ..., total: ... }
  //       paginatedData = {
  //         status: true,
  //         data: response.data.data.map(config.mapToItem),
  //         current_page: response.data.current_page || page,
  //         per_page: response.data.per_page || perPage,
  //         total: response.data.total || 0
  //       };
  //     } else if (Array.isArray(response.data)) {
  //       // Format: [...]
  //       paginatedData = {
  //         status: true,
  //         data: response.data.map(config.mapToItem),
  //         current_page: page,
  //         per_page: perPage,
  //         total: response.data.length
  //       };
  //     } else {
  //       // Fallback
  //       paginatedData = {
  //         status: true,
  //         data: [],
  //         current_page: page,
  //         per_page: perPage,
  //         total: 0
  //       };
  //     }

  //     return paginatedData;
  //   },
  //   enabled: !!getToken(),
  //   placeholderData: KeepPreviousData,
  //   retry: 1,
  //   onError: (err) => {
  //     console.error("Error fetching paginated data:", err);
  //     toast.error(
  //       err.message ||
  //       (config.toastMessages?.error || "Failed to load data")
  //     );
  //   }
  // });

  // // Extract data and pagination info
  // const items = responseData?.data ?? [];
  // const total = responseData?.total ?? 0;
  // const currentPage = responseData?.current_page ?? page;
  // const currentPerPage = responseData?.per_page ?? perPage;
  // const totalPages = Math.ceil(total / currentPerPage);

  // Page change handlers
  //   const handlePageChange = useCallback((newPage: number) => {
  //     if (newPage >= 1 && newPage <= totalPages) {
  //       setPage(newPage);
  //     }
  //   }, [totalPages]);

  //   const handlePerPageChange = useCallback((newPerPage: number) => {
  //     setPerPage(newPerPage);
  //     setPage(1); // Reset to first page
  //   }, []);

  //   // Refetch handler
  //   const handleRefetch = useCallback(() => {
  //     refetch();
  //   }, [refetch]);

  //   // Update filters
  //   const updateFilters = useCallback((newFilters: Record<string, any>) => {
  //     setFilters(prev => ({ ...prev, ...newFilters }));
  //     setPage(1); // Reset to first page
  //   }, []);

  //   // Update sort
  //   const updateSort = useCallback((newSort: Record<string, any>) => {
  //     setSort(prev => ({ ...prev, ...newSort }));
  //     setPage(1); // Reset to first page
  //   }, []);

  //   // Update search
  //   const updateSearch = useCallback((newSearch: string) => {
  //     setSearchQuery(newSearch);
  //   }, []);

  //   // Reset to initial state
  //   const reset = useCallback(() => {
  //     setPage(initialPage);
  //     setPerPage(initialPerPage);
  //     setSearchQuery(initialSearch);
  //     setFilters(initialFilters);
  //     setSort(initialSort);
  //   }, [initialPage, initialPerPage, initialSearch, initialFilters, initialSort]);

  //   return {
  //     // Data
  //     items,
  //     total,
  //     page: currentPage,
  //     perPage: currentPerPage,
  //     totalPages,

  //     // States
  //     isLoading,
  //     isError,
  //     isFetching,
  //     error,

  //     // Handlers
  //     handlePageChange,
  //     handlePerPageChange,
  //     handleRefetch,
  //     updateFilters,
  //     updateSort,
  //     updateSearch,
  //     reset,

  //     // Current values
  //     searchQuery: debouncedSearch,
  //     filters,
  //     sort
  //   };
  // };
};
