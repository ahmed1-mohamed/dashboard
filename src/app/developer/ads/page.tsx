"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  Bell,
  Eye,
  MousePointer2,
  Edit,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchAds, fetchAdsTotals, toggleAdStatus } from "@/data/api-client";
import { CreateAdModal } from "@/components/modals/create-ad-modal";
import { ViewAdModal } from "@/components/modals/view-ad-modal";
import { EditAdModal } from "@/components/modals/edit-ad-modal";
import { DeleteAdDialog } from "@/components/modals/delete-ad-dialog";
import { toast } from "sonner";

interface Ad {
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

export default function AdsPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [selectedAds, setSelectedAds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [ads, setAds] = useState<Ad[]>([]);
  const [adsTotals, setAdsTotals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createAdModalOpen, setCreateAdModalOpen] = useState(false);
  const [viewAdModalOpen, setViewAdModalOpen] = useState(false);
  const [editAdModalOpen, setEditAdModalOpen] = useState(false);
  const [deleteAdDialogOpen, setDeleteAdDialogOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [updatingAdId, setUpdatingAdId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [hasDataOnCurrentPage, setHasDataOnCurrentPage] = useState(true);

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const filteredAds = ads.filter((ad) => {
    if (
      searchQuery &&
      !ad.creative_title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (filterPlatform !== "all") {
      if (ad.platform.toLowerCase() !== filterPlatform.toLowerCase()) {
        return false;
      }
    }

    if (filterStatus !== "all") {
      const statusBool = filterStatus;
      if (ad.status !== statusBool) {
        return false;
      }
    }

    if (filterType !== "all") {
      if (ad.type.toLowerCase() !== filterType.toLowerCase()) {
        return false;
      }
    }

    return true;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAds(filteredAds.map((ad) => ad.creative_id));
    } else {
      setSelectedAds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedAds((prev) => [...prev, id]);
    } else {
      setSelectedAds((prev) => prev.filter((adId) => adId !== id));
    }
  };

  const handleStatusToggle = async (adId: string, newStatus: boolean) => {
    if (!session?.user?.accessToken) {
      toast.error("Authentication required");
      return;
    }

    const previousAds = [...ads];
    const newStatusValue = newStatus ? "active" : "paused";
    setAds((prevAds) =>
      prevAds.map((ad) => {
        if (ad.creative_id === adId) {
          return { ...ad, status: newStatusValue };
        }
        return ad;
      }),
    );
    setUpdatingAdId(adId);

    try {
      await toggleAdStatus(
        parseInt(adId),
        newStatusValue,
        session.user.accessToken,
      );
      toast.success(
        `Ad ${newStatus ? "activated" : "deactivated"} successfully`,
      );
    } catch (error: any) {
      console.error("Error updating ad status:", error);
      setAds(previousAds);
      toast.error(
        error?.response?.data?.message || "Failed to update ad status",
      );
    } finally {
      setUpdatingAdId(null);
    }
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

  useEffect(() => {
    async function loadAds() {
      if (!session?.user?.accessToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response: any = await fetchAds(
          session.user.accessToken,
          currentPage,
          itemsPerPage,
          {
            status: filterStatus,
            platform: filterPlatform,
            format: filterType,
            search: debouncedSearch,
          },
        );
        const totalsData = await fetchAdsTotals(session.user.accessToken);

        let adsData = [];
        adsData = response.data;
        setAds(adsData);

        const total = response.total || 0;
        const currentDataLength = adsData?.length || 0;

        const lastPage =
          response.last_page || Math.ceil(total / itemsPerPage) || 1;

        if (currentDataLength === 0 && currentPage > 1) {
          const newPage = currentPage - 1;
          setCurrentPage(newPage);
          return;
        }

        setHasDataOnCurrentPage(currentDataLength > 0);

        setTotalItems(total);
        setTotalPages(lastPage);

        // if (totalsData) {
        //   const transformedStats = [
        //     {
        //       title: "Total Ads",
        //       value: totalsData.total_ads?.toString() || "0",
        //       change: "+ 10%",
        //       trend: "up",
        //       icon: Megaphone,
        //       period: "vs last 3 months",
        //     },
        //     {
        //       title: "Active",
        //       value: totalsData.active_ads?.toString() || "0",
        //       change: "↓ 2.4",
        //       trend: "down",
        //       icon: Bell,
        //       period: "vs last 3 months",
        //     },
        //     {
        //       title: "Total Views",
        //       value: totalsData.total_views?.toLocaleString() || "0",
        //       change: "↑ 5.6%",
        //       trend: "up",
        //       icon: Eye,
        //       period: "vs last 3 months",
        //     },
        //     {
        //       title: "Total Clicks",
        //       value: totalsData.total_clicks?.toLocaleString() || "0",
        //       change: "↑ 8%",
        //       trend: "up",
        //       icon: MousePointer2,
        //       period: "vs last 3 months",
        //     },
        //   ];
        //   setAdsTotals(transformedStats);
        // }
      } catch (err) {
        console.error("Error loading ads:", err);
        setError(err instanceof Error ? err.message : "Failed to load ads");
      } finally {
        setLoading(false);
      }
    }

    loadAds();
  }, [
    session,
    currentPage,
    itemsPerPage,
    filterPlatform,
    filterStatus,
    filterType,
    searchQuery,
  ]);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
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

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-600">Loading ads...</p>
          </div>
        </div>
      )}
      {error && !loading && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {adsTotals.map((stat, index) => (
          <Card key={index} className="shadow-none border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div className="flex items-center gap-2 text-gray-500">
                <stat.icon className="h-4 w-4" />
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
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto pb-1 sm:pb-0">
            <div className="relative w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search ads by title"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>

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

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                <TableHead className="w-12 px-4">
                  <Checkbox
                    checked={
                      filteredAds.length > 0 &&
                      selectedAds.length === filteredAds.length
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
              {filteredAds.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    className="text-center py-8 text-gray-500"
                  >
                    No ads found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredAds.map((ad) => (
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
                    <TableCell className="text-gray-600">{ad.views}</TableCell>
                    <TableCell className="text-gray-600">{ad.clicks}</TableCell>
                    <TableCell className="text-gray-600">{ad.ctr}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
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

        <div className="p-4 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium">
                {totalItems > 0
                  ? `${Math.max(
                      (currentPage - 1) * itemsPerPage + 1,
                      0,
                    )}-${Math.min(currentPage * itemsPerPage, totalItems)}`
                  : "0-0"}
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
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {(() => {
              const range = [];
              const maxButtons = 7;

              if (totalPages <= maxButtons) {
                for (let i = 1; i <= totalPages; i++) {
                  range.push(i);
                }
              } else {
                const leftSiblingIndex = Math.max(currentPage - 1, 1);
                const rightSiblingIndex = Math.min(currentPage + 1, totalPages);

                const showLeftDots = leftSiblingIndex > 2;
                const showRightDots = rightSiblingIndex < totalPages - 1;

                if (!showLeftDots && showRightDots) {
                  const leftRange = [1, 2, 3, 4, 5];
                  range.push(...leftRange);
                  range.push("...");
                  range.push(totalPages);
                } else if (showLeftDots && !showRightDots) {
                  const rightRange = [
                    totalPages - 4,
                    totalPages - 3,
                    totalPages - 2,
                    totalPages - 1,
                    totalPages,
                  ];
                  range.push(1);
                  range.push("...");
                  range.push(...rightRange);
                } else if (showLeftDots && showRightDots) {
                  range.push(1);
                  range.push("...");
                  range.push(leftSiblingIndex);
                  range.push(currentPage);
                  range.push(rightSiblingIndex);
                  range.push("...");
                  range.push(totalPages);
                }
              }

              return range.map((page, index) => {
                if (page === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="text-gray-400 px-1"
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "outline" : "ghost"}
                    size="icon"
                    className={`h-8 w-8 ${
                      currentPage === page
                        ? "bg-gray-50 text-gray-600 border-gray-200"
                        : "text-gray-600"
                    }`}
                    onClick={() => setCurrentPage(page as number)}
                  >
                    {page}
                  </Button>
                );
              });
            })()}

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage >= totalPages || !hasDataOnCurrentPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <CreateAdModal
        isOpen={createAdModalOpen}
        onClose={() => setCreateAdModalOpen(false)}
        onSuccess={() => {
          if (session?.user?.accessToken) {
            fetchAds(session.user.accessToken, currentPage).then(
              (response: any) => {
                if (response?.data) {
                  setAds(response.data);
                }
              },
            );
            fetchAdsTotals(session.user.accessToken).then((totalsData: any) => {
              if (totalsData) {
                setAdsTotals([
                  {
                    title: "Total Ads",
                    value: totalsData.total_ads?.toString() || "0",
                    change: "+ 10%",
                    trend: "up",
                    icon: Megaphone,
                    period: "vs last 3 months",
                  },
                  {
                    title: "Active",
                    value: totalsData.active_ads?.toString() || "0",
                    change: "↓ 2.4",
                    trend: "down",
                    icon: Bell,
                    period: "vs last 3 months",
                  },
                  {
                    title: "Total Views",
                    value: totalsData.total_views?.toLocaleString() || "0",
                    change: "↑ 5.6%",
                    trend: "up",
                    icon: Eye,
                    period: "vs last 3 months",
                  },
                  {
                    title: "Total Clicks",
                    value: totalsData.total_clicks?.toLocaleString() || "0",
                    change: "↑ 8%",
                    trend: "up",
                    icon: MousePointer2,
                    period: "vs last 3 months",
                  },
                ]);
              }
            });
          }
        }}
      />

      {selectedAd && (
        <ViewAdModal
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
            if (session?.user?.accessToken) {
              fetchAds(session.user.accessToken, currentPage).then(
                (response: any) => {
                  if (response?.data) {
                    setAds(response.data);
                  }
                },
              );
              fetchAdsTotals(session.user.accessToken).then((totalsData: any) => {
                if (totalsData) {
                  setAdsTotals([
                    {
                      title: "Total Ads",
                      value: totalsData.total_ads?.toString() || "0",
                      change: "+ 10%",
                      trend: "up",
                      icon: Megaphone,
                      period: "vs last 3 months",
                    },
                    {
                      title: "Active",
                      value: totalsData.active_ads?.toString() || "0",
                      change: "↓ 2.4",
                      trend: "down",
                      icon: Bell,
                      period: "vs last 3 months",
                    },
                    {
                      title: "Total Views",
                      value: totalsData.total_views?.toLocaleString() || "0",
                      change: "↑ 5.6%",
                      trend: "up",
                      icon: Eye,
                      period: "vs last 3 months",
                    },
                    {
                      title: "Total Clicks",
                      value: totalsData.total_clicks?.toLocaleString() || "0",
                      change: "↑ 8%",
                      trend: "up",
                      icon: MousePointer2,
                      period: "vs last 3 months",
                    },
                  ]);
                }
              });
            }
          }}
        />
      )}

      {selectedAd && (
        <EditAdModal
          ad={selectedAd}
          isOpen={editAdModalOpen}
          onClose={() => {
            setEditAdModalOpen(false);
            setSelectedAd(null);
          }}
          onSuccess={() => {
            if (session?.user?.accessToken) {
              fetchAds(session.user.accessToken, currentPage).then(
                (response: any) => {
                  if (response?.data) {
                    setAds(response.data);
                  }
                },
              );
              fetchAdsTotals(session.user.accessToken).then((totalsData: any) => {
                if (totalsData) {
                  setAdsTotals([
                    {
                      title: "Total Ads",
                      value: totalsData.total_ads?.toString() || "0",
                      change: "+ 10%",
                      trend: "up",
                      icon: Megaphone,
                      period: "vs last 3 months",
                    },
                    {
                      title: "Active",
                      value: totalsData.active_ads?.toString() || "0",
                      change: "↓ 2.4",
                      trend: "down",
                      icon: Bell,
                      period: "vs last 3 months",
                    },
                    {
                      title: "Total Views",
                      value: totalsData.total_views?.toLocaleString() || "0",
                      change: "↑ 5.6%",
                      trend: "up",
                      icon: Eye,
                      period: "vs last 3 months",
                    },
                    {
                      title: "Total Clicks",
                      value: totalsData.total_clicks?.toLocaleString() || "0",
                      change: "↑ 8%",
                      trend: "up",
                      icon: MousePointer2,
                      period: "vs last 3 months",
                    },
                  ]);
                }
              });
            }
          }}
        />
      )}

      <DeleteAdDialog
        ad={selectedAd}
        isOpen={deleteAdDialogOpen}
        onClose={() => {
          setDeleteAdDialogOpen(false);
          setSelectedAd(null);
        }}
        onSuccess={() => {
          if (session?.user?.accessToken) {
            fetchAds(session.user.accessToken, currentPage).then(
              (response: any) => {
                if (response?.data) {
                  setAds(response.data);
                }
              },
            );
            fetchAdsTotals(session.user.accessToken).then((totalsData: any) => {
              if (totalsData) {
                setAdsTotals([
                  {
                    title: "Total Ads",
                    value: totalsData.total_ads?.toString() || "0",
                    change: "+ 10%",
                    trend: "up",
                    icon: Megaphone,
                    period: "vs last 3 months",
                  },
                  {
                    title: "Active",
                    value: totalsData.active_ads?.toString() || "0",
                    change: "↓ 2.4",
                    trend: "down",
                    icon: Bell,
                    period: "vs last 3 months",
                  },
                  {
                    title: "Total Views",
                    value: totalsData.total_views?.toLocaleString() || "0",
                    change: "↑ 5.6%",
                    trend: "up",
                    icon: Eye,
                    period: "vs last 3 months",
                  },
                  {
                    title: "Total Clicks",
                    value: totalsData.total_clicks?.toLocaleString() || "0",
                    change: "↑ 8%",
                    trend: "up",
                    icon: MousePointer2,
                    period: "vs last 3 months",
                  },
                ]);
              }
            });
          }
        }}
      />
    </div>
  );
}
