"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useUrlFilters<T extends Record<string, string | number>>(defaultValues: T) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const defaultValuesStr = JSON.stringify(defaultValues);

  const filters = useMemo(() => {
    const current: Record<string, string | number> = { ...defaultValues };
    Object.keys(defaultValues).forEach((key) => {
      const val = searchParams?.get(key);
      if (val !== null) {
        if (typeof defaultValues[key] === "number") {
          current[key] = Number(val);
        } else {
          current[key] = val;
        }
      }
    });
    return current as T;
  }, [searchParams, defaultValuesStr]);

  const setFilter = useCallback(
    (key: keyof T, value: string | number) => {
      const currentQuery = searchParams?.toString() || "";
      const params = new URLSearchParams(currentQuery);
      
      if (value === defaultValues[key] || value === "") {
        params.delete(key as string);
      } else {
        params.set(key as string, String(value));
      }

      // If we are updating a filter (not page itself) and page exists, reset it to 1
      if (key !== "page" && defaultValues.page !== undefined) {
        params.delete("page");
      }

      if (params.toString() === currentQuery) return;

      const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      router.push(newUrl, { scroll: false });
    },
    [pathname, router, searchParams, defaultValuesStr]
  );

  const setFilters = useCallback(
    (newFilters: Partial<T>) => {
      const currentQuery = searchParams?.toString() || "";
      const params = new URLSearchParams(currentQuery);
      
      let changedFilters = false;
      Object.keys(newFilters).forEach((key) => {
        if (key !== "page") changedFilters = true;
        const value = newFilters[key as keyof T];
        if (value === defaultValues[key as keyof T] || value === "" || value === undefined) {
          params.delete(key as string);
        } else {
          params.set(key as string, String(value));
        }
      });

      if (changedFilters && defaultValues.page !== undefined && !newFilters.hasOwnProperty("page")) {
         params.delete("page");
      }

      if (params.toString() === currentQuery) return;

      const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      router.push(newUrl, { scroll: false });
    },
    [pathname, router, searchParams, defaultValuesStr]
  );

  return { filters, setFilter, setFilters };
}
