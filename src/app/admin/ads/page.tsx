"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { TableSettings } from "@/components/table/table-settings";
import { useTableSettings } from "@/hooks/use-table-settings";
import { adsExportToPDF, adsExportToExcel } from "@/lib/exports/export-ads";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, TrendingUp, Users, MousePointerClick, Percent, AlertCircle } from "lucide-react";
import { CreateAdModal } from "@/components/modals/create-ad-modal";
import { DeleteAdDialog } from "@/components/modals/delete-ad-dialog";
import useDashboardAdminAdsData from "@/hooks/use-dashboardAdminAds";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";
import { AdminAdsService } from "@/services/AdminAdsService";

import { AdsTable } from "@/features/ads/components/AdsTable";
import { AdsFilters } from "@/features/ads/components/AdsFilters";

const DEFAULT_COLUMNS = [
  { id: "type", label: "Type", visible: true },
  { id: "platform", label: "Platform", visible: true },
  { id: "country", label: "Country", visible: true },
  { id: "location", label: "Locations", visible: true },
  { id: "views", label: "Views", visible: true },
  { id: "clicks", label: "Clicks", visible: true },
  { id: "ctr", label: "CTR", visible: true },
  { id: "status", label: "Status", visible: true },
];

export default function AdsPage({
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
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [selectedAds, setSelectedAds] = useState<string[]>([]);
  const [createAdModalOpen, setCreateAdModalOpen] = useState(false);
  const [deleteAdDialogOpen, setDeleteAdDialogOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<any | null>(null);
  const [updatingAdId, setUpdatingAdId] = useState<string | null>(null);

  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  const tableSettings = useTableSettings("ads", DEFAULT_COLUMNS);

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
  }, [filterStatus, filterPlatform, filterType, debouncedSearch]);

  const adsFilters = useMemo(
    () => ({
      status: filterStatus,
      platform: filterPlatform,
      format: filterType,
      search: debouncedSearch,
    }),
    [filterStatus, filterPlatform, filterType, debouncedSearch],
  );

  const { adsData, totalsData } = useDashboardAdminAdsData(
    currentPage,
    itemsPerPage,
    adsFilters,
  );

  const { data, isLoading, isError, error, refetch } = adsData;
  const { data: totals } = totalsData as { data?: any };

  const ads = ((data as any)?.data || data || []) as any[];
  const totalItems = (data as any)?.meta?.total || (data as any)?.total || ads.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;

  const adsTotals = useMemo(() => {
    if (!totals) return [];
    return [
      {
        title: "Total Active Ads",
        value: totals.active_ads?.toString() || "0",
        icon: TrendingUp,
        trend: "+12.5%",
        trendUp: true,
      },
      {
        title: "Total Views",
        value: totals.total_views?.toLocaleString() || "0",
        icon: Users,
        trend: "+5.2%",
        trendUp: true,
      },
      {
        title: "Total Clicks",
        value: totals.total_clicks?.toLocaleString() || "0",
        icon: MousePointerClick,
        trend: "+2.1%",
        trendUp: true,
      },
      {
        title: "Average CTR",
        value: totals.average_ctr || "0%",
        icon: Percent,
        trend: "-0.4%",
        trendUp: false,
      },
    ];
  }, [totals]);

  const handleExportExcel = async () => {
    try {
      toast.loading("Fetching all ads for export...", { id: "export" });
      const response: any = await AdminAdsService.getAds(1, 10000, adsFilters);
      const dataToExport = response.data?.data || response.data || [];
      if (dataToExport.length > 0) {
        adsExportToExcel(dataToExport);
        toast.success("Ads exported to Excel successfully", { id: "export" });
      } else {
        toast.error("No data to export", { id: "export" });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch ads for export", { id: "export" });
    }
  };

  const handleExportPdf = async () => {
    try {
      toast.loading("Fetching all ads for export...", { id: "export" });
      const response: any = await AdminAdsService.getAds(1, 10000, adsFilters);
      const dataToExport = response.data?.data || response.data || [];
      if (dataToExport.length > 0) {
        adsExportToPDF(dataToExport);
        toast.success("Ads exported to PDF successfully", { id: "export" });
      } else {
        toast.error("No data to export", { id: "export" });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch ads for export", { id: "export" });
    }
  };

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "active" | "inactive" }) => {
      const response = await apiClient.post(`/dashboard/ads/update-status/${id}`, { status });
      return response.data;
    },
    onMutate: () => {
      toast.loading("Updating status...", { id: "status-update" });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminAds"] });
      queryClient.invalidateQueries({ queryKey: ["adminAdsTotals"] });
      toast.success(`Ad status updated to ${variables.status}`, { id: "status-update" });
    },
    onError: (err: any) => {
      console.error("Status update error:", err);
      toast.error(err?.response?.data?.message || "Failed to update ad status", { id: "status-update" });
    },
    onSettled: () => {
      setUpdatingAdId(null);
    },
  });

  const handleStatusToggle = (adId: string, checked: boolean) => {
    setUpdatingAdId(adId);
    statusMutation.mutate({
      id: adId,
      status: checked ? "active" : "inactive",
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAds(ads.map((ad: any) => ad.creative_id));
    } else {
      setSelectedAds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedAds([...selectedAds, id]);
    } else {
      setSelectedAds(selectedAds.filter((adId) => adId !== id));
    }
  };

  const handleDeleteClick = (ad: any) => {
    setSelectedAd(ad);
    setDeleteAdDialogOpen(true);
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
        <h1 className="text-2xl font-bold text-gray-900">Ads</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <TableSettings settings={tableSettings} onExportExcel={handleExportExcel} onExportPdf={handleExportPdf} />
          <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2" onClick={() => setCreateAdModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Ad
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-600">Loading ads...</p>
          </div>
        </div>
      )}

      {isError && !isLoading && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-800">
              <strong>Error:</strong> {error instanceof Error ? error.message : "Failed to load ads"}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2 border-red-200 text-red-700 hover:bg-red-100">
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !isError && adsTotals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {adsTotals.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-full ${stat.trendUp ? "bg-teal-50" : "bg-red-50"}`}>
                    <Icon className={`h-4 w-4 ${stat.trendUp ? "text-teal-600" : "text-red-600"}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <p className={`text-xs mt-1 ${stat.trendUp ? "text-teal-600" : "text-red-600"}`}>
                    {stat.trend} from last month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!isLoading && !isError && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <AdsFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={filterStatus}
                onStatusChange={setFilterStatus}
                platformFilter={filterPlatform}
                onPlatformChange={setFilterPlatform}
                typeFilter={filterType}
                onTypeChange={setFilterType}
              />
            </div>
          </div>

          <AdsTable
            ads={ads}
            selectedAds={selectedAds}
            handleSelectAll={handleSelectAll}
            handleSelectOne={handleSelectOne}
            isColVisible={isColVisible}
            updatingAdId={updatingAdId}
            handleStatusToggle={handleStatusToggle}
            onDeleteClick={handleDeleteClick}
          />

          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-medium">
                    {totalItems > 0 ? `${Math.max(startIndex + 1, 0)}-${Math.min(currentPage * itemsPerPage, totalItems)}` : "0-0"}
                  </span>{" "}
                  of <span className="font-medium">{totalItems}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Rows per page:</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 w-20 bg-gray-50 border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-8"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1 hidden sm:flex">
                  {getPageNumbers().map((pageNum, idx) => (
                    <Button
                      key={idx}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => typeof pageNum === "number" && setCurrentPage(pageNum)}
                      disabled={pageNum === "..."}
                      className={`h-8 w-8 p-0 ${pageNum === currentPage ? "bg-teal-600 text-white hover:bg-teal-700" : "text-gray-600 border-gray-200"
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
                  className="h-8"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {createAdModalOpen && (
        <CreateAdModal isOpen={createAdModalOpen} onClose={() => setCreateAdModalOpen(false)} />
      )}

      {deleteAdDialogOpen && selectedAd && (
        <DeleteAdDialog
          isOpen={deleteAdDialogOpen}
          onClose={() => setDeleteAdDialogOpen(false)}
          ad={selectedAd}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}
