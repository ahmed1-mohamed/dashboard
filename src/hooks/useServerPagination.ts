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
      setDebouncedSearch((prev) => {
        if (prev !== searchQuery) {
          setPage(1);
        }
        return searchQuery;
      });
    }, searchDebounceMs);
    return () => clearTimeout(handler);
  }, [searchQuery, searchDebounceMs]);

  const handlePerPageChange = useCallback((value: string) => {
    setPerPage(Number(value));
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleSetFilters = useCallback((value: React.SetStateAction<TFilters>) => {
    setFilters(value);
    setPage(1);
  }, []);

  const setFilter = useCallback(<K extends keyof TFilters>(key: K, value: TFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setSearchQuery("");
    setPage(1);
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
    setFilters: handleSetFilters,
    setFilter,
    resetFilters,
  };
}
