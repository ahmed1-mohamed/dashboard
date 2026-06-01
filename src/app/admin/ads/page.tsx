"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import useDashboardAdminAdsData from "@/hooks/use-dashboardAdminAds";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  Download,
  Settings2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  AlertTriangle,
  Trash2,
  MoreHorizontal,
  Megaphone,
  Bell,
  Eye,
  MousePointer2,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
import { toggleAdStatus } from "@/data/api-client";
import { CreateAdModal } from "@/components/modals/create-ad-modal";
import { ViewAdModal } from "@/components/modals/view-ad-modal";
import { EditAdModal } from "@/components/modals/edit-ad-modal";
import { DeleteAdDialog } from "@/components/modals/delete-ad-dialog";

// Type definitions matching the actual API response
interface AdApiResponse {
  creative_id: string;
  creative_title: string;
  type: string;
  platform: "Web" | "Mobile" | "Both";
  country: string;
  location: string;
  views: number;
  clicks: number;
  ctr: string;
  status: string;
}

type Ad = AdApiResponse;

interface PaginatedAdsResponse {
  status: boolean;
  data: AdApiResponse[];
  current_page: number;
  per_page: number;
  total: number;
  last_page?: number;
}

interface AdsTotalsResponse {
  total_ads?: number;
  active_ads?: number;
  total_views?: number;
  total_clicks?: number;
}

interface AdsPageProps {
  initialPage?: number;
  itemsPerPage?: number;
}

export default function AdsPage({
  initialPage = 1,
  itemsPerPage: initialItemsPerPage = 15,
}: AdsPageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  // State for filters and UI
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [selectedAds, setSelectedAds] = useState<string[]>([]);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [createAdModalOpen, setCreateAdModalOpen] = useState(false);
  const [viewAdModalOpen, setViewAdModalOpen] = useState(false);
  const [editAdModalOpen, setEditAdModalOpen] = useState(false);
  const [deleteAdDialogOpen, setDeleteAdDialogOpen] = useState(false);
  const [updatingAdId, setUpdatingAdId] = useState<string | null>(null);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterPlatform, filterType, debouncedSearch]);

  // Memoize filters to prevent unnecessary refetches
  const adsFilters = useMemo(
    () => ({
      status: filterStatus,
      platform: filterPlatform,
      format: filterType,
      search: debouncedSearch,
    }),
    [filterStatus, filterPlatform, filterType, debouncedSearch],
  );

  // Fetch ads data using custom hook
  const { adsData, totalsData } = useDashboardAdminAdsData(
    currentPage,
    itemsPerPage,
    adsFilters,
  );

  const { data, isLoading, isError, error, isFetching, refetch } = adsData;
  const { data: totals } = totalsData as { data?: AdsTotalsResponse };

  // Debug: inspect raw response
  useEffect(() => {
    if (data) {
      console.log("Ads Data type:", typeof data);
      console.log("Ads Data keys:", Object.keys(data as object));
      console.log("Ads Data value:", data);
    }
  }, [data]);

  // Development debug: show raw response in UI
  const showDebug = process.env.NODE_ENV === "development";

  // Map API data to component interface
  // Handle both response formats: { data: [...] } or direct array
  const rawData = Array.isArray(data)
    ? data
    : data && typeof data === "object" && "data" in data
      ? data?.data
      : undefined;
  const itemsArray = Array.isArray(rawData) ? rawData : [];
  // if (Array.isArray(rawData)) {
  //   itemsArray = rawData;
  // } else if (rawData && Array.isArray(rawData.data)) {
  //   itemsArray = rawData.data;
  // }

  const ads: Ad[] = itemsArray.map((ad: any) => {
    const a = ad.data || ad;
    return {
      creative_id: a.creative_id?.toString() || "",
      creative_title: a.creative_title || "N/A",
      type: a.type || "N/A",
      platform: a.platform || "N/A",
      country: a.country || "N/A",
      location: a.location || "N/A",
      views: a.views || 0,
      clicks: a.clicks || 0,
      ctr: a.ctr || "0%",
      status: a.status || "inactive",
    };
  });
  console.log("Mapped Ads:", ads);
  console.log("Totals Data:", data);
  const totalItems = (data as any)?.total || (data as any)?.data?.total;
  const totalPages = Math.ceil(Number(totalItems) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Transform totals data for stats cards
  const adsTotals = totals
    ? [
        {
          title: "Total Ads",
          value: totals.total_ads?.toString() || "0",
          change: "+ 10%",
          trend: "up" as const,
          icon: Megaphone,
          period: "vs last 3 months",
        },
        {
          title: "Active",
          value: totals.active_ads?.toString() || "0",
          change: "↓ 2.4",
          trend: "down" as const,
          icon: Bell,
          period: "vs last 3 months",
        },
        {
          title: "Total Views",
          value: totals.total_views?.toLocaleString() || "0",
          change: "↑ 5.6%",
          trend: "up" as const,
          icon: Eye,
          period: "vs last 3 months",
        },
        {
          title: "Total Clicks",
          value: totals.total_clicks?.toLocaleString() || "0",
          change: "↑ 8%",
          trend: "up" as const,
          icon: MousePointer2,
          period: "vs last 3 months",
        },
      ]
    : [];

  // Status toggle mutation
  const mutationToggleStatus = useMutation({
    mutationFn: async ({
      adId,
      newStatus,
    }: {
      adId: string;
      newStatus: boolean;
    }) => {
      await toggleAdStatus(
        parseInt(adId),
        newStatus ? "active" : "paused",
        token!,
      );
    },
    onMutate: async ({ adId }) => {
      setUpdatingAdId(adId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      toast.success("Ad status updated successfully!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update ad status");
    },
    onSettled: () => {
      setUpdatingAdId(null);
    },
  });

  // Handle page changes
  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages],
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedAds(ads.map((a) => a.creative_id));
      } else {
        setSelectedAds([]);
      }
    },
    [ads],
  );

  const handleSelectOne = useCallback(
    (id: string, checked: boolean) => {
      if (checked) {
        setSelectedAds([...selectedAds, id]);
      } else {
        setSelectedAds(selectedAds.filter((aid) => aid !== id));
      }
    },
    [selectedAds],
  );

  const handleStatusToggle = useCallback(
    (adId: string, newStatus: boolean) => {
      mutationToggleStatus.mutate({ adId, newStatus });
    },
    [mutationToggleStatus],
  );

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  // Generate page numbers for pagination
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Ads</h1>
        <Button
          className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
          onClick={() => setCreateAdModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Create Ad
        </Button>
      </div>

      {/* Stats Cards */}
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
              <strong>Error:</strong>{" "}
              {error instanceof Error ? error.message : "Failed to load ads"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="mt-2 border-red-200 text-red-700 hover:bg-red-100"
          >
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !isError && adsTotals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {adsTotals.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-none border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{stat.title}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="flex items-center text-xs">
                    <span
                      className={`flex items-center font-medium ${
                        stat.trend === "up" ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-gray-500 ml-1">{stat.period}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Filters and Table Container */}
      {!isLoading && !isError && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Filters Toolbar */}
          <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto pb-1 sm:pb-0">
              {/* Search */}
              <div className="relative w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search ads by title"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>

              {/* Dropdowns */}
              <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                <SelectTrigger className="w-[140px] bg-gray-50 border-gray-200">
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filterStatus}
                onValueChange={(val) => {
                  setFilterStatus(val);
                }}
              >
                <SelectTrigger className="w-[120px] bg-gray-50 border-gray-200">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[120px] bg-gray-50 border-gray-200">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="banner">Banner</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="slider">Slider</SelectItem>
                  <SelectItem value="native">Native</SelectItem>
                  <SelectItem value="pop-up">Pop-up</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="gap-2 border-gray-200 text-gray-700"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                className="gap-2 border-gray-200 text-gray-700"
              >
                <Settings2 className="h-4 w-4" />
                Table settings
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                  <TableHead className="w-12 px-4">
                    <Checkbox
                      checked={
                        ads.length > 0 && selectedAds.length === ads.length
                      }
                      onCheckedChange={(checked) =>
                        handleSelectAll(checked as boolean)
                      }
                    />
                  </TableHead>
                  <TableHead className="min-w-[250px]">Ad</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Locations</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>CTR</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ads.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={11}
                      className="text-center py-8 text-gray-500"
                    >
                      No ads found.
                    </TableCell>
                  </TableRow>
                ) : (
                  ads.map((ad) => (
                    <TableRow key={ad.creative_id} className="hover:bg-gray-50">
                      <TableCell className="px-4">
                        <Checkbox
                          checked={selectedAds.includes(ad.creative_id)}
                          onCheckedChange={(checked) =>
                            handleSelectOne(ad.creative_id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900 text-sm">
                            {ad.creative_title}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{ad.type}</TableCell>
                      <TableCell className="text-gray-600">
                        {ad.platform}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {ad.country}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {ad.location}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {ad.views.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {ad.clicks.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-gray-600">{ad.ctr}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {/* Status Badge */}
                          <Badge
                            variant={
                              ad.status === "active" ? "success" : "secondary"
                            }
                            className={`${
                              ad.status === "active"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                            }`}
                          >
                            {ad.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                          {/* Status Indicator Dot */}
                          <div
                            className={`w-2 h-2 rounded-full ${
                              ad.status === "active"
                                ? "bg-green-500"
                                : "bg-gray-400"
                            } ${
                              updatingAdId === ad.creative_id
                                ? "animate-pulse"
                                : ""
                            }`}
                          />
                          <Switch
                            checked={ad.status === "active"}
                            onCheckedChange={(checked) =>
                              handleStatusToggle(ad.creative_id, checked)
                            }
                            disabled={updatingAdId === ad.creative_id}
                            className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-gray-600"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAd(ad);
                                setViewAdModalOpen(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAd(ad);
                                setEditAdModalOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAd(ad);
                                setDeleteAdDialogOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-medium">
                    {totalItems > 0
                      ? `${Math.max(startIndex + 1, 0)}-${Math.min(
                          currentPage * itemsPerPage,
                          totalItems,
                        )}`
                      : "0-0"}
                  </span>{" "}
                  of <span className="font-medium">{totalItems}</span>
                  {totalItems > 0 &&
                    currentPage === totalPages &&
                    totalItems % itemsPerPage !== 0 && (
                      <span className="text-xs text-gray-400">
                        ({totalItems % itemsPerPage} items on this page)
                      </span>
                    )}
                </div>

                {/* Rows per page select */}
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
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isFetching}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {getPageNumbers().map((page, index) =>
                  typeof page === "string" ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-gray-400"
                    >
                      {page}
                    </span>
                  ) : (
                    <Button
                      key={`page-${page}`}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      onClick={() => handlePageChange(page)}
                      disabled={currentPage === page || isFetching}
                      className={
                        currentPage === page
                          ? "h-8 w-8 bg-gray-900 hover:bg-gray-800 text-white"
                          : "h-8 w-8 border-gray-200"
                      }
                    >
                      {page}
                    </Button>
                  ),
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages || isFetching}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Ad Modal */}
      <CreateAdModal
        isOpen={createAdModalOpen}
        onClose={() => setCreateAdModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["ads"] });
          queryClient.invalidateQueries({ queryKey: ["adsTotals"] });
          setCreateAdModalOpen(false);
        }}
      />

      {/* View Ad Modal */}
      {/* <ViewAdModal
        ad={selectedAd}
        isOpen={viewAdModalOpen}
        onClose={() => {
          setViewAdModalOpen(false);
          setSelectedAd(null);
        }}
        onEdit={() => {
          setViewAdModalOpen(false);
          setEditAdModalOpen(true);
        }}
        onDelete={() => {
          setViewAdModalOpen(false);
          setDeleteAdDialogOpen(true);
        }}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["ads"] });
          queryClient.invalidateQueries({ queryKey: ["adsTotals"] });
          setViewAdModalOpen(false);
          setSelectedAd(null);
        }}
      /> */}

      {/* Edit Ad Modal */}
      {/* <EditAdModal
        ad={selectedAd}
        isOpen={editAdModalOpen}
        onClose={() => {
          setEditAdModalOpen(false);
          setSelectedAd(null);
        }}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["ads"] });
          queryClient.invalidateQueries({ queryKey: ["adsTotals"] });
          setEditAdModalOpen(false);
          setSelectedAd(null);
        }}
      /> */}

      {/* Delete Ad Dialog */}
      <DeleteAdDialog
        ad={selectedAd}
        isOpen={deleteAdDialogOpen}
        onClose={() => {
          setDeleteAdDialogOpen(false);
          setSelectedAd(null);
        }}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["ads"] });
          queryClient.invalidateQueries({ queryKey: ["adsTotals"] });
          setDeleteAdDialogOpen(false);
          setSelectedAd(null);
        }}
      />
    </div>
  );
}
