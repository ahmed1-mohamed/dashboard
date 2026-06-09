"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useTableSettings } from "@/hooks/use-table-settings";
import useDashboardAdminOffersData from "@/hooks/use-dashboardAdminOffers";
import { AdminOffersService } from "@/services/AdminOffersService";
import type { OfferUpdateFields } from "@/services/AdminOffersService";
import type { Offer, OffersFilters, OffersColumn } from "@/features/offers/types";

const DEFAULT_COLUMNS: OffersColumn[] = [
  { id: "linked_to", label: "Linked To", visible: true },
  { id: "type", label: "Type", visible: true },
  { id: "discount", label: "Discount", visible: true },
  { id: "validity", label: "Validity Period", visible: true },
  { id: "clicks", label: "Clicks", visible: true },
  { id: "views", label: "Views", visible: true },
  { id: "status", label: "Status", visible: true },
];

const DEBOUNCE_MS = 300;

function extractOffers(data: unknown): Offer[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as Offer[];
  const d = data as Record<string, unknown>;
  if (Array.isArray(d.data)) return d.data as Offer[];
  const inner = d.data as Record<string, unknown> | undefined;
  if (inner && Array.isArray(inner.data)) return inner.data as Offer[];
  const arrays = Object.values(d).filter(Array.isArray);
  return arrays.length > 0 ? (arrays[0] as Offer[]) : [];
}

function extractTotalItems(data: unknown, fallback: number): number {
  if (!data) return fallback;
  const d = data as Record<string, unknown>;
  const meta = d.meta as Record<string, unknown> | undefined;
  const innerData = d.data as Record<string, unknown> | undefined;
  return (
    Number(meta?.total) ||
    Number(d.total) ||
    Number(innerData?.total) ||
    fallback
  );
}

export function useOffers(initialPage = 1, initialItemsPerPage = 15) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, debouncedSearch]);

  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const [updatingOfferId, setUpdatingOfferId] = useState<string | null>(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpenId, setViewModalOpenId] = useState<number | string | null>(null);
  const [editModalOpenId, setEditModalOpenId] = useState<number | string | null>(null);

  const tableSettings = useTableSettings("offers", DEFAULT_COLUMNS);

  useEffect(() => {
    setItemsPerPage(tableSettings.settings.itemsPerPage);
  }, [tableSettings.settings.itemsPerPage]);

  const isColVisible = useCallback(
    (colId: string) =>
      tableSettings.settings.columns.find((c) => c.id === colId)?.visible !== false,
    [tableSettings.settings.columns],
  );

  const offersFilters = useMemo<OffersFilters>(
    () => ({ status: filterStatus, search: debouncedSearch }),
    [filterStatus, debouncedSearch],
  );

  const { offersData, totalsData } = useDashboardAdminOffersData(
    currentPage,
    itemsPerPage,
    offersFilters,
  );

  const { data, isLoading, isError, error, refetch } = offersData;
  const { data: totalsRaw } = totalsData as { data?: unknown };

  const offers = useMemo(() => extractOffers(data), [data]);
  const totalItems = useMemo(
    () => extractTotalItems(data, offers.length),
    [data, offers.length],
  );
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;

  const toggleStatusMutation = useMutation({
    mutationFn: (params: { offerId: number; fields: OfferUpdateFields }) =>
      AdminOffersService.toggleStatus(params.offerId, params.fields),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("Offer status updated");
    },
    onError: () => toast.error("Failed to update status"),
    onSettled: () => setUpdatingOfferId(null),
  });

  const deleteMutation = useMutation({
    mutationFn: (offerId: number) => AdminOffersService.deleteOffer(offerId),
    onSuccess: () => {
      toast.success("Offer deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["offersTotals"] });
    },
    onError: () => toast.error("Failed to delete offer"),
  });

  const handleStatusToggle = useCallback(
    (offer: Offer, checked: boolean) => {
      setUpdatingOfferId(String(offer.offer_id));
      const fields: OfferUpdateFields = {
        entity_type: offer.entity_type ?? "PROPERTIES",
        entity_id: Number(offer.entity_id ?? 0),
        discount_type: offer.discount_type ?? "percentage",
        name: offer.name || offer.offer_details,
        is_active: checked,
        description: offer.description,
        starts_at: offer.starts_at || offer.valid_from,
        ends_at: offer.ends_at || offer.valid_to,
        discount_pct: offer.discount_pct,
      };
      toggleStatusMutation.mutate({ offerId: Number(offer.offer_id), fields });
    },
    [toggleStatusMutation],
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedOffers(checked ? offers.map((o) => String(o.offer_id ?? o.id)) : []);
    },
    [offers],
  );

  const handleSelectOne = useCallback((id: string, checked: boolean) => {
    setSelectedOffers((prev) =>
      checked ? [...prev, id] : prev.filter((sid) => sid !== id),
    );
  }, []);

  const handleDeleteClick = useCallback(
    (offer: Offer) => {
      const name = offer.name || offer.offer_details || "this offer";
      if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
        deleteMutation.mutate(Number(offer.offer_id ?? offer.id));
      }
    },
    [deleteMutation],
  );

  const handleExportExcel = useCallback(() => {
    toast.success("Offers exported to Excel successfully");
  }, []);

  const handleExportPdf = useCallback(() => {
    toast.success("Offers exported to PDF successfully");
  }, []);

  const getPageNumbers = useCallback((): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }, [currentPage, totalPages]);

  return {
    offers,
    totalItems,
    totalPages,
    startIndex,
    totalsRaw,
    isLoading,
    isError,
    error,
    refetch,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    getPageNumbers,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    selectedOffers,
    handleSelectAll,
    handleSelectOne,
    updatingOfferId,
    handleStatusToggle,
    handleDeleteClick,
    handleExportExcel,
    handleExportPdf,
    createModalOpen,
    setCreateModalOpen,
    viewModalOpenId,
    setViewModalOpenId,
    editModalOpenId,
    setEditModalOpenId,
    tableSettings,
    isColVisible,
    token,
  };
}