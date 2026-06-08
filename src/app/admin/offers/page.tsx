"use client";

import { CiGift } from "react-icons/ci";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { TableSettings } from "@/components/table/table-settings";
import { useTableSettings } from "@/hooks/use-table-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, TrendingUp, Users, MousePointerClick, Activity, AlertCircle, Eye } from "lucide-react";
import useDashboardAdminOffersData from "@/hooks/use-dashboardAdminOffers";
import { toast } from "sonner";
import { AdminOffersService } from "@/services/AdminOffersService";

import { OffersTable } from "@/features/offers/components/OffersTable";
import { OffersFilters } from "@/features/offers/components/OffersFilters";
import AddOfferModal from "@/components/modals/add-offer-modal";
import ViewOfferModal from "@/components/modals/view-offer-modal";

const DEFAULT_COLUMNS = [
  { id: "linked_to", label: "Linked To", visible: true },
  { id: "type", label: "Type", visible: true },
  { id: "discount", label: "Discount", visible: true },
  { id: "validity", label: "Validity Period", visible: true },
  { id: "clicks", label: "Clicks", visible: true },
  { id: "views", label: "Views", visible: true },
  { id: "priority", label: "Priority", visible: true },
  { id: "status", label: "Status", visible: true },
];

export default function OffersPage({
  initialPage = 1,
  initialItemsPerPage = 15,
}: {
  initialPage?: number;
  initialItemsPerPage?: number;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const [updatingOfferId, setUpdatingOfferId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpenId, setViewModalOpenId] = useState<number | string | null>(null);

  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  const tableSettings = useTableSettings("offers", DEFAULT_COLUMNS);

  useEffect(() => {
    setItemsPerPage(tableSettings.settings.itemsPerPage);
  }, [tableSettings.settings.itemsPerPage]);

  const isColVisible = (colId: string) => {
    return tableSettings.settings.columns.find((c) => c.id === colId)?.visible !== false;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, debouncedSearch]);

  const offersFilters = useMemo(
    () => ({
      status: filterStatus,
      search: debouncedSearch,
    }),
    [filterStatus, debouncedSearch],
  );

  const { offersData, totalsData } = useDashboardAdminOffersData(
    currentPage,
    itemsPerPage,
    offersFilters,
  );

  const { data, isLoading, isError, error, refetch } = offersData;
  const { data: totals } = totalsData as { data?: any };

  let offers: any[] = [];
  if (Array.isArray(data)) {
    offers = data;
  } else if (data && typeof data === "object") {
    if (Array.isArray((data as any).data)) {
      offers = (data as any).data;
    } else if ((data as any).data && typeof (data as any).data === "object" && Array.isArray((data as any).data.data)) {
      offers = (data as any).data.data;
    } else {
      const arrays = Object.values(data).filter(Array.isArray);
      if (arrays.length > 0) offers = arrays[0] as any[];
    }
  }

  const totalItems = (data as any)?.meta?.total || (data as any)?.total || (data as any)?.data?.total || offers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;

  const offersTotals = useMemo(() => {
    if (!totals) return [];
    return [
      {
        title: "Total Offers",
        value: totals.total?.toLocaleString() || "0",
        icon: CiGift,
        trend: "+10%",
        trendUp: true,
      },
      {
        title: "Active",
        value: totals.active?.toLocaleString() || "0",
        icon: Activity,
        trend: "-2.4%",
        trendUp: false,
      },
      {
        title: "Total Views",
        value: totals.views?.toLocaleString() || "0",
        icon: Eye,
        trend: "+5.6%",
        trendUp: true,
      },
      {
        title: "Total Clicks",
        value: totals.clicks?.toLocaleString() || "0",
        icon: MousePointerClick,
        trend: "+8%",
        trendUp: true,
      },
    ];
  }, [totals]);

  const handleExportExcel = async () => {
    toast.success("Offers exported to Excel successfully");
  };

  const handleExportPdf = async () => {
    toast.success("Offers exported to PDF successfully");
  };

  const toggleStatusMutation = useMutation({
    mutationFn: (data: { offerId: number; payload: any; token: string }) =>
      AdminOffersService.toggleStatus(data.offerId, data.payload, data.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("Offer status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update status");
    },
    onSettled: () => setUpdatingOfferId(null),
  });

  const handleStatusToggle = (offer: any, checked: boolean) => {
    setUpdatingOfferId(offer.offer_id);
    
    // We only need to send the field we are updating
    const payload = {
      is_active: checked,
    };
    
    toggleStatusMutation.mutate({
      offerId: Number(offer.offer_id),
      payload: payload,
      token: token as string,
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOffers(offers.map((offer: any) => offer.offer_id || offer.id));
    } else {
      setSelectedOffers([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedOffers([...selectedOffers, id]);
    } else {
      setSelectedOffers(selectedOffers.filter((offerId) => offerId !== id));
    }
  };

  const handleDeleteClick = (offer: any) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      AdminOffersService.deleteOffer(offer.offer_id || offer.id).then(() => {
        toast.success("Offer deleted successfully");
        refetch();
      }).catch(() => {
        toast.error("Failed to delete offer");
      });
    }
  };

  const getPageNumbers = useCallback(() => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Offers</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <TableSettings settings={tableSettings} onExportExcel={handleExportExcel} onExportPdf={handleExportPdf} />
          <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2" onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Offer
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-600">Loading offers...</p>
          </div>
        </div>
      )}

      {isError && !isLoading && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-800">
              <strong>Error:</strong> {error instanceof Error ? error.message : "Failed to load offers"}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2 border-red-200 text-red-700 hover:bg-red-100">
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !isError && offersTotals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {offersTotals.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-full ${stat.trendUp ? "bg-green-50" : "bg-red-50"}`}>
                    <Icon className={`h-4 w-4 ${stat.trendUp ? "text-green-600" : "text-red-600"}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <p className={`text-xs mt-1 ${stat.trendUp ? "text-green-600" : "text-red-600"}`}>
                    {stat.trend} vs last 3 months
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!isLoading && !isError && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <OffersFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={filterStatus}
                onStatusChange={setFilterStatus}
              />
            </div>
          </div>

          <OffersTable
            offers={offers}
            selectedOffers={selectedOffers}
            handleSelectAll={handleSelectAll}
            handleSelectOne={handleSelectOne}
            isColVisible={isColVisible}
            updatingOfferId={updatingOfferId}
            handleStatusToggle={handleStatusToggle}
            onDeleteClick={handleDeleteClick}
            onViewClick={(offer: any) => setViewModalOpenId(offer.offer_id)}
          />

          {totalPages >= 1 && (
            <div className="p-4 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-medium text-gray-900">
                    {totalItems > 0 ? `${Math.max(startIndex + 1, 0)}-${Math.min(currentPage * itemsPerPage, totalItems)}` : "0-0"}
                  </span>{" "}
                  of <span className="font-medium text-gray-900">{totalItems}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-9 w-9 p-0"
                >
                  {"<"}
                </Button>
                <div className="flex items-center gap-1 hidden sm:flex">
                  {getPageNumbers().map((pageNum, idx) => (
                    <Button
                      key={idx}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => typeof pageNum === "number" && setCurrentPage(pageNum)}
                      disabled={pageNum === "..."}
                      className={`h-9 w-9 p-0 ${pageNum === currentPage ? "bg-white border-teal-600 text-teal-600 font-bold hover:bg-gray-50" : "text-gray-600 border-gray-200"
                        }`}
                    >
                      {pageNum}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-9 w-9 p-0"
                >
                  {">"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      
      <AddOfferModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => refetch()}
      />

      <ViewOfferModal
        open={!!viewModalOpenId}
        onClose={() => setViewModalOpenId(null)}
        offerId={viewModalOpenId}
      />
    </div>
  );
}
