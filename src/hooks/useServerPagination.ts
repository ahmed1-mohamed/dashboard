import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(() => {
    const p = searchParams.get("page");
    return p ? Number(p) : initialPage;
  });

  const [perPage, setPerPage] = useState(() => {
    const p = searchParams.get("perPage");
    return p ? Number(p) : initialPerPage;
  });

  const [searchQuery, setSearchQuery] = useState(() => {
    return searchParams.get("search") || initialSearch;
  });
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  const [filters, setFilters] = useState<TFilters>(() => {
    const parsed = { ...initialFilters } as any;
    for (const key in initialFilters) {
      const val = searchParams.get(key);
      if (val !== null) {
        parsed[key] = val;
      }
    }
    return parsed;
  });

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (page !== initialPage) params.set("page", page.toString());
    else params.delete("page");

    if (perPage !== initialPerPage) params.set("perPage", perPage.toString());
    else params.delete("perPage");

    if (searchQuery) params.set("search", searchQuery);
    else params.delete("search");

    for (const key in filters) {
      const val = String(filters[key]);
      if (val && val !== "all" && val !== String(initialFilters[key])) {
        params.set(key, val);
      } else {
        params.delete(key);
      }
    }

    const newQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (newQuery !== currentQuery) {
      router.replace(`${pathname}?${newQuery}`, { scroll: false });
    }
  }, [page, perPage, searchQuery, filters, pathname, router, searchParams]);

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
