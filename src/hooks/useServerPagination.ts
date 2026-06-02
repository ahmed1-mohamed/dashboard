import { useState, useEffect, useCallback } from "react";

interface UseServerPaginationProps<TFilters = Record<string, any>> {
  initialPage?: number;
  initialPerPage?: number;
  initialSearch?: string;
  initialFilters?: TFilters;
  searchDebounceMs?: number;
}

export function useServerPagination<TFilters = Record<string, any>>({
  initialPage = 1,
  initialPerPage = 10,
  initialSearch = "",
  initialFilters = {} as TFilters,
  searchDebounceMs = 500,
}: UseServerPaginationProps<TFilters> = {}) {
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  
  const [filters, setFilters] = useState<TFilters>(initialFilters);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, searchDebounceMs);
    return () => clearTimeout(handler);
  }, [searchQuery, searchDebounceMs]);

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters]);

  const handlePerPageChange = useCallback((value: string) => {
    setPerPage(Number(value));
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const setFilter = useCallback(<K extends keyof TFilters>(key: K, value: TFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setSearchQuery("");
  }, [initialFilters]);

  return {
    page,
    perPage,
    searchQuery,
    debouncedSearch,
    filters,
    setPage: handlePageChange,
    setPerPage: handlePerPageChange,
    setSearchQuery,
    setFilters,
    setFilter,
    resetFilters,
  };
}
