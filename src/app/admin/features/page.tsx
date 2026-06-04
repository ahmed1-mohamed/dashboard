"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AddFeatureModal2 } from "@/components/modals/add-feature-modal2";
import { EditFeatureModal2 } from "@/components/modals/edit-feature-modal2";
import { DeleteFeatureModal2 } from "@/components/modals/delete-feature-modal2";
import { ViewFeatureModal } from "@/components/modals/view-feature-modal";
import useDashboardAdminFeatures from "@/hooks/use-dashboardAdminFeatures";
import { featuresExportToExcel, featuresExportToPDF } from "@/lib/handle-export";

import { FeaturesHeader } from "./components/FeaturesHeader";
import { FeaturesFilters } from "./components/FeaturesFilters";
import { FeaturesTable, Feature } from "./components/FeaturesTable";

interface ApiFeature {
  feature_id: number;
  feature_name: string;
  is_amenity: number;
  icons: string | null;
}

export default function FeaturesManagementPage() {
  const { featuresData } = useDashboardAdminFeatures();
  const { data: apiData, isLoading, error } = featuresData;

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
    return <div className="p-8 text-center text-gray-500">Loading features...</div>;
  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load features: {error instanceof Error ? error.message : String(error)}
      </div>
    );

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

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 10;
    const end = Math.min(maxVisible, totalPages);
    for (let i = 1; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleView = (feature: Feature) => {
    setSelectedFeature(feature);
    setIsViewModalOpen(true);
  };

  const handleEdit = (feature: Feature) => {
    setSelectedFeature(feature);
    setIsEditModalOpen(true);
  };

  const handleDelete = (feature: Feature) => {
    setSelectedFeature(feature);
    setIsDeleteModalOpen(true);
  };

  const handleExport = (format: "pdf" | "xlsx" | "excel") => {
    if (format === "pdf") {
      featuresExportToPDF(filteredFeatures);
    } else {
      featuresExportToExcel(filteredFeatures);
    }
  };

  return (
    <div className="p-4 px-3 space-y-4 max-w-full overflow-hidden">
      <FeaturesHeader 
        featuresCount={features.length} 
        onAddFeature={() => setIsAddFeatureModal2Open(true)} 
      />

      <FeaturesFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onExport={handleExport}
      />

      <FeaturesTable 
        features={paginatedFeatures}
        selectedFeatures={selectedFeatures}
        handleSelectAll={handleSelectAll}
        handleSelectFeature={handleSelectFeature}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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

      {/* Modals */}
      <ViewFeatureModal
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
      />

      <AddFeatureModal2
        isOpen={isAddFeatureModal2Open}
        onClose={() => setIsAddFeatureModal2Open(false)}
        onEdit={(feature) => handleEdit(feature)}
        onDelete={(feature) => handleDelete(feature)}
      />

      {/* Edit Feature Modal 2 */}
      <EditFeatureModal2
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedFeature(null);
        }}
        feature={selectedFeature}
      />

      <DeleteFeatureModal2
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedFeature(null);
        }}
        feature={selectedFeature}
      />
    </div>
  );
}
