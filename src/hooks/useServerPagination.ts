import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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

  const page = searchParams.get("page") ? Number(searchParams.get("page")) : initialPage;
  const perPage = searchParams.get("perPage") ? Number(searchParams.get("perPage")) : initialPerPage;
  const searchFromUrl = searchParams.get("search") || initialSearch;

  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const [debouncedSearch, setDebouncedSearch] = useState(searchFromUrl);

  const initialFiltersStr = JSON.stringify(initialFilters);
  const filters = useMemo(() => {
    const parsed = { ...initialFilters } as any;
    for (const key in initialFilters) {
      const val = searchParams.get(key);
      if (val !== null) {
        parsed[key] = val;
      }
    }
    return parsed as TFilters;
  }, [searchParams, initialFiltersStr]);

  useEffect(() => {
    setSearchQuery(searchFromUrl);
    setDebouncedSearch(searchFromUrl);
  }, [searchFromUrl]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedSearch !== searchQuery) {
        setDebouncedSearch(searchQuery);

        const params = new URLSearchParams(searchParams.toString());
        if (searchQuery) params.set("search", searchQuery);
        else params.delete("search");

        params.delete("page");

        const newQuery = params.toString();
        router.push(`${pathname}${newQuery ? `?${newQuery}` : ""}`, { scroll: false });
      }
    }, searchDebounceMs);
    return () => clearTimeout(handler);
  }, [searchQuery, debouncedSearch, searchDebounceMs, pathname, router, searchParams]);

  const handlePerPageChange = useCallback((value: string | number) => {
    const currentVal = searchParams.get("perPage") || initialPerPage.toString();
    if (currentVal === value.toString()) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("perPage", value.toString());
    params.delete("page");
    const newQuery = params.toString();
    router.push(`${pathname}?${newQuery}`, { scroll: false });
  }, [pathname, router, searchParams, initialPerPage]);

  const handlePageChange = useCallback((newPage: number) => {
    const currentVal = searchParams.get("page") || initialPage.toString();
    if (currentVal === newPage.toString()) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    const newQuery = params.toString();
    router.push(`${pathname}?${newQuery}`, { scroll: false });
  }, [pathname, router, searchParams, initialPage]);

  const handleSetFilters = useCallback((newFiltersOrUpdater: React.SetStateAction<TFilters>) => {
    const nextFilters = typeof newFiltersOrUpdater === "function"
      ? (newFiltersOrUpdater as (prev: TFilters) => TFilters)(filters)
      : newFiltersOrUpdater;

    const params = new URLSearchParams(searchParams.toString());

    for (const key in nextFilters) {
      const val = String(nextFilters[key]);
      if (val && val !== "all" && val !== String(initialFilters[key])) {
        params.set(key, val);
      } else {
        params.delete(key);
      }
    }
    params.delete("page");
    const newQuery = params.toString();
    router.push(`${pathname}${newQuery ? `?${newQuery}` : ""}`, { scroll: false });
  }, [pathname, router, searchParams, filters, initialFilters]);

  const setFilter = useCallback(<K extends keyof TFilters>(key: K, value: TFilters[K]) => {
    const params = new URLSearchParams(searchParams.toString());
    const val = String(value);
    const currentVal = searchParams.get(key as string);

    const isDefault = !val || val === "all" || val === String(initialFilters[key]);

    // Deduplicate pushes
    if (isDefault && currentVal === null) return;
    if (!isDefault && currentVal === val) return;

    if (!isDefault) {
      params.set(key as string, val);
    } else {
      params.delete(key as string);
    }

    params.delete("page");
    const newQuery = params.toString();
    router.push(`${pathname}${newQuery ? `?${newQuery}` : ""}`, { scroll: false });
  }, [pathname, router, searchParams, initialFilters]);

  const resetFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (searchParams.has("perPage")) {
      params.set("perPage", searchParams.get("perPage") as string);
    }
    const newQuery = params.toString();
    router.push(`${pathname}${newQuery ? `?${newQuery}` : ""}`, { scroll: false });
  }, [pathname, router, searchParams]);

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