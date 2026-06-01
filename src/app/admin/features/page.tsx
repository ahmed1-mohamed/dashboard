"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { TableActions } from "@/components/table/table-actions";
import {
  Search,
  Plus,
  Download,
  Settings2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AddFeatureModal2 } from "@/components/modals/add-feature-modal2";
import { EditFeatureModal2 } from "@/components/modals/edit-feature-modal2";
import { DeleteFeatureModal2 } from "@/components/modals/delete-feature-modal2";
import { ViewFeatureModal } from "@/components/modals/view-feature-modal";
import useDashboardAdminFeatures from "@/hooks/use-dashboardAdminFeatures";

interface ApiFeature {
  feature_id: number;
  feature_name: string;
  is_amenity: number;
  icons: string | null;
}

interface Feature {
  id: number;
  featureName: string;
  isAmenity: boolean;
  icon: string;
}

// const features: Feature[] = []; // Removed static data

export default function FeaturesManagementPage() {
  // Use custom hook
  const { featuresData } = useDashboardAdminFeatures();

  const { data: apiData, isLoading, error } = featuresData;
  console.log("API Data:", apiData);

  // Map API data to UI format
  // Fallback to empty array if no data or before load
  const features: Feature[] = Array.isArray(apiData?.data?.data!)
    ? apiData?.data?.data?.map((f: ApiFeature, index: number) => ({
        id: f.feature_id || index,
        featureName: f.feature_name || "N/A",
        isAmenity: f.is_amenity === 1,
        icon: f.icons || "",
      }))
    : [];

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddFeatureModal2Open, setIsAddFeatureModal2Open] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const itemsPerPage = 10;

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-500">Loading features...</div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load features:{" "}
        {error instanceof Error ? error.message : String(error)}
      </div>
    );

  // Filter features
  const filteredFeatures = features.filter((feature) => {
    const matchesSearch = feature.featureName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && feature.isAmenity) ||
      (statusFilter === "inactive" && !feature.isAmenity);

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredFeatures.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFeatures = filteredFeatures.slice(startIndex, endIndex);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFeatures(paginatedFeatures.map((f) => f.id));
    } else {
      setSelectedFeatures([]);
    }
  };

  const handleSelectFeature = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedFeatures([...selectedFeatures, id]);
    } else {
      setSelectedFeatures(selectedFeatures.filter((fid) => fid !== id));
    }
  };

  // const handleToggleStatus = (id: number) => {
  //   const featureToUpdate = apiData?.find(
  //     (f: ApiFeature) => (f.feature_id || f.id) === id,
  //   );

  //   if (featureToUpdate) {
  //     statusMutation.mutate({
  //       id,
  //       data: { ...featureToUpdate, is_active: !featureToUpdate.is_active },
  //     });
  //   }
  // };

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 10;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      for (let i = 1; i <= Math.min(maxVisible, totalPages); i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className="p-4 px-3 space-y-4 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Features Management
          </h1>
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-700 border-purple-200 rounded-full px-2"
          >
            {features.length}
          </Badge>
        </div>
        <Button
          className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
          onClick={() => setIsAddFeatureModal2Open(true)}
        >
          <Plus className="h-4 w-4" />
          Add New Feature
        </Button>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          {/* Search */}
          <div className="relative w-full min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for area"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200"
            />
          </div>

          {/* Amenity Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="amenity">Amenity</SelectItem>
              <SelectItem value="feature">Feature</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 border-gray-200">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="gap-2 border-gray-200">
            <Settings2 className="h-4 w-4" />
            Table settings
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-semibold text-gray-900 w-[50px] px-2">
                <Checkbox
                  checked={
                    paginatedFeatures.length > 0 &&
                    selectedFeatures.length === paginatedFeatures.length
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="font-semibold text-gray-900 w-[80px] px-2">
                ID
              </TableHead>
              <TableHead className="font-semibold text-gray-900 px-2">
                Feature Name
              </TableHead>
              <TableHead className="font-semibold text-gray-900 w-[120px] px-2">
                Is Amenity
              </TableHead>
              <TableHead className="font-semibold text-gray-900 w-[100px] px-2">
                Icon
              </TableHead>
              <TableHead className="font-semibold text-gray-900 text-center w-[80px] px-2">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedFeatures.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-gray-500"
                >
                  No features found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedFeatures.map((feature) => (
                <TableRow key={feature.id}>
                  <TableCell className="px-2">
                    <Checkbox
                      checked={selectedFeatures.includes(feature.id)}
                      onCheckedChange={(checked) =>
                        handleSelectFeature(feature.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-gray-900 px-2 text-sm">
                    {feature.id}
                  </TableCell>
                  <TableCell className="text-gray-900 px-2 text-sm font-medium">
                    {feature.featureName}
                  </TableCell>
                  <TableCell className="px-2">
                    {feature.isAmenity ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        No
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-900 px-2 text-sm">
                    {feature.icon || "-"}
                  </TableCell>
                  <TableCell className="text-center px-2">
                    <TableActions
                      onView={() => {
                        setSelectedFeature(feature);
                        setIsViewModalOpen(true);
                      }}
                      onEdit={() => {
                        setSelectedFeature(feature);
                        setIsEditModalOpen(true);
                      }}
                      onDelete={() => {
                        setSelectedFeature(feature);
                        setIsDeleteModalOpen(true);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredFeatures.length)}{" "}
          of {filteredFeatures.length > 1000 ? "1000" : filteredFeatures.length}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-8 w-8 border-gray-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {getPageNumbers().map((page, index) => (
            <Button
              key={index}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => setCurrentPage(page)}
              className={
                currentPage === page
                  ? "h-8 w-8 bg-gray-900 hover:bg-gray-800 text-white"
                  : "h-8 w-8 border-gray-200"
              }
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-8 w-8 border-gray-200"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* View Feature Modal */}
      {/* <ViewFeatureModal
        feature={selectedFeature}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedFeature(null);
        }}
        onEdit={() => {
          setIsViewModalOpen(false);
          setIsEditModalOpen(true);
        }}
        onDelete={() => {
          setIsViewModalOpen(false);
          setIsDeleteModalOpen(true);
        }}
      /> */}

      {/* Add Feature Modal 2 */}
      <AddFeatureModal2
        isOpen={isAddFeatureModal2Open}
        onClose={() => setIsAddFeatureModal2Open(false)}
        onEdit={(feature) => {
          setSelectedFeature(feature);
          setIsEditModalOpen(true);
        }}
        onDelete={(feature) => {
          setSelectedFeature(feature);
          setIsDeleteModalOpen(true);
        }}
      />

      {/* Edit Feature Modal 2 */}
      {/* <EditFeatureModal2
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedFeature(null);
        }}
        feature={selectedFeature}
      /> */}

      {/* Delete Feature Modal 2 */}
      <DeleteFeatureModal2
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedFeature(null);
        }}
        feature={selectedFeature}
      />

      {/* Add Feature Modal */}
      {/* <AddFeatureModal
        isOpen={isAddFeatureModalOpen}
        onClose={() => setIsAddFeatureModalOpen(false)}
        onSubmit={handleAddFeature}
      /> */}
    </div>
  );
}
