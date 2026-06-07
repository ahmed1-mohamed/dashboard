"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { fetchAd } from "@/data/api-client";
import {
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Globe,
  Monitor,
  Smartphone,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";
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

interface ViewAdModalProps {
  ad: Ad | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSuccess?: () => void;
}

export function ViewAdModal({
  ad,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onSuccess,
}: ViewAdModalProps) {
  const { data: session } = useSession();
  const [adDetails, setAdDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && ad) {
      fetchAdDetails();
    }
  }, [isOpen, ad]);

  const fetchAdDetails = async () => {
    if (!session?.user?.accessToken || !ad) return;

    setLoading(true);
    try {
      const response = await fetchAd(ad.creative_id, session.user.accessToken);
      setAdDetails(response);
    } catch (error: any) {
      console.error("Error fetching ad details:", error);
      toast.error(
        error?.response?.data?.message || "Failed to load ad details",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !ad) return null;

  const getPlatformIcon = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case "web":
        return <Monitor className="w-4 h-4" />;
      case "mobile":
        return <Smartphone className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCountryName = (countryId: number | null | undefined) => {
    switch (countryId) {
      case 1:
        return "Egypt";
      case 2:
        return "UAE";
      case 3:
        return "Oman";
      default:
        return "Not set";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Advertisement Details"
      size="xl"
      showCloseButton={true}
      scrollable={true}
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-600">Loading ad details...</p>
          </div>
        </div>
      ) : (
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2 space-y-6">
          {/* Ad Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center">
                <span className="text-teal-600 font-semibold text-lg">
                  {(adDetails?.placement?.format || ad.type || "A")
                    .charAt(0)
                    .toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {adDetails?.title || ad.creative_title}
                </h3>
                <p className="text-sm text-gray-500">
                  ID: {adDetails?.creative_id || ad.creative_id}
                </p>
              </div>
            </div>
            <Badge
              variant={
                (adDetails?.status || ad.status) === "active"
                  ? "success"
                  : "secondary"
              }
              className={
                (adDetails?.status || ad.status) === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }
            >
              {(adDetails?.status || ad.status) === "active"
                ? "Active"
                : "Inactive"}
            </Badge>
          </div>

          {/* Basic Information */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Basic Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <span className="text-sm">Creative ID</span>
                </div>
                <p className="font-medium text-gray-900">
                  {adDetails?.creative_id || "Not set"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <span className="text-sm">Campaign ID</span>
                </div>
                <p className="font-medium text-gray-900">
                  {adDetails?.campaign_id || "Not set"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <span className="text-sm">Placement ID</span>
                </div>
                <p className="font-medium text-gray-900">
                  {adDetails?.placement_id || "Not set"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <span className="text-sm">Entity Type</span>
                </div>
                <p className="font-medium text-gray-900 capitalize">
                  {adDetails?.entity_type?.toLowerCase() || "Not set"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <span className="text-sm">Entity ID</span>
                </div>
                <p className="font-medium text-gray-900">
                  {adDetails?.entity_id || "Not set"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <span className="text-sm">Weight/Priority</span>
                </div>
                <p className="font-medium text-gray-900">
                  {adDetails?.weight || "Not set"}
                </p>
              </div>
            </div>
          </div>

          {/* Ad Details */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Ad Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <span className="text-sm">Title</span>
                </div>
                <p className="font-medium text-gray-900">
                  {adDetails?.title || "Not set"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <span className="text-sm">Subtitle</span>
                </div>
                <div 
                  className="font-medium text-gray-900 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: adDetails?.subtitle || "Not set" }}
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <span className="text-sm">Type/Format</span>
                </div>
                <p className="font-medium text-gray-900">
                  {adDetails?.placement?.format || ad.type || "Not set"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  {getPlatformIcon(
                    adDetails?.placement?.platform || ad.platform,
                  )}
                  <span className="text-sm">Platform</span>
                </div>
                <p className="font-medium text-gray-900 capitalize">
                  {adDetails?.placement?.platform || ad.platform || "Not set"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">Country</span>
                </div>
                <p className="font-medium text-gray-900">
                  {getCountryName(adDetails?.country_id)}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Location</span>
                </div>
                <p className="font-medium text-gray-900 capitalize">
                  {adDetails?.placement?.location || ad.location || "Not set"}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Details */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">CTA Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <span className="text-sm">CTA Label</span>
                </div>
                <p className="font-medium text-gray-900">
                  {adDetails?.cta_label || "Not set"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm">CTA URL</span>
                </div>
                {adDetails?.cta_url ? (
                  <a
                    href={adDetails.cta_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-teal-600 hover:text-teal-700 break-all"
                  >
                    {adDetails.cta_url}
                  </a>
                ) : (
                  <p className="font-medium text-gray-900">Not set</p>
                )}
              </div>
            </div>
          </div>

          {/* Image */}
          {adDetails?.image_url && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Image</h4>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-sm">Image URL</span>
                </div>
                <a
                  href={adDetails.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-teal-600 hover:text-teal-700 break-all"
                >
                  {adDetails.image_url}
                </a>
                <div className="mt-3">
                  <img
                    src={adDetails.image_url}
                    alt={adDetails.title || "Ad image"}
                    className="max-w-full h-auto rounded-lg border border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Placement Details */}
          {adDetails?.placement && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">
                Placement Details
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <span className="text-sm">Placement ID</span>
                  </div>
                  <p className="font-medium text-gray-900">
                    {adDetails.placement.placement_id}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <span className="text-sm">Code</span>
                  </div>
                  <p className="font-medium text-gray-900">
                    {adDetails.placement.code || "Not set"}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <span className="text-sm">Name</span>
                  </div>
                  <p className="font-medium text-gray-900">
                    {adDetails.placement.name || "Not set"}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <span className="text-sm">Format</span>
                  </div>
                  <p className="font-medium text-gray-900 capitalize">
                    {adDetails.placement.format || "Not set"}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <span className="text-sm">Billing Unit</span>
                  </div>
                  <p className="font-medium text-gray-900 capitalize">
                    {adDetails.placement.billing_unit || "Not set"}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <span className="text-sm">Default Price Credits</span>
                  </div>
                  <p className="font-medium text-gray-900">
                    {adDetails.placement.default_price_credits || "Not set"}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <span className="text-sm">Is Active</span>
                  </div>
                  <p className="font-medium text-gray-900">
                    {adDetails.placement.is_active ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Entity Details */}
          {adDetails?.entity && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Linked Entity</h4>
              <div className="grid grid-cols-2 gap-4">
                {adDetails.entity_type === "PROJECTS" ? (
                  <>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <span className="text-sm">Project ID</span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {adDetails.entity.project_id || "Not set"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <span className="text-sm">Project Name</span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {adDetails.entity.project_name || "Not set"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <span className="text-sm">Project Type</span>
                      </div>
                      <p className="font-medium text-gray-900 capitalize">
                        {adDetails.entity.project_type || "Not set"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <span className="text-sm">Status</span>
                      </div>
                      <p className="font-medium text-gray-900 capitalize">
                        {adDetails.entity.status || "Not set"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <span className="text-sm">Total Units</span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {adDetails.entity.total_units ?? "Not set"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <span className="text-sm">Available Units</span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {adDetails.entity.available_units ?? "Not set"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <span className="text-sm">Price Range</span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {adDetails.entity.price_range || "Not set"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <span className="text-sm">Project Size</span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {adDetails.entity.project_size || "Not set"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <span className="text-sm">Launch Date</span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {adDetails.entity.launch_date || "Not set"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <span className="text-sm">Completion Date</span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {adDetails.entity.completion_date || "Not set"}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <span className="text-sm">Property ID</span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {adDetails.entity.property_id || "Not set"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <span className="text-sm">Property Name</span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {adDetails.entity.property_name || "Not set"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <span className="text-sm">Property No</span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {adDetails.entity.property_no || "Not set"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <span className="text-sm">Status</span>
                      </div>
                      <p className="font-medium text-gray-900 capitalize">
                        {adDetails.entity.status || "Not set"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <span className="text-sm">Price</span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {adDetails.entity.price
                          ? `$${parseFloat(adDetails.entity.price).toLocaleString()}`
                          : "Not set"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <span className="text-sm">Size</span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {adDetails.entity.size
                          ? `${adDetails.entity.size} sqm`
                          : "Not set"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <span className="text-sm">Bedrooms</span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {adDetails.entity.bedrooms ?? "Not set"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <span className="text-sm">Bathrooms</span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {adDetails.entity.bathrooms ?? "Not set"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <span className="text-sm">Parking Spaces</span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {adDetails.entity.parking_spaces ?? "Not set"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <span className="text-sm">Availability Status</span>
                      </div>
                      <p className="font-medium text-gray-900 capitalize">
                        {adDetails.entity.availability_status || "Not set"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <span className="text-sm">Construction Status</span>
                      </div>
                      <p className="font-medium text-gray-900 capitalize">
                        {adDetails.entity.construction_status || "Not set"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <span className="text-sm">Furnish Status</span>
                      </div>
                      <p className="font-medium text-gray-900 capitalize">
                        {adDetails.entity.furnish_status || "Not set"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <span className="text-sm">Finishing Status</span>
                      </div>
                      <p className="font-medium text-gray-900 capitalize">
                        {adDetails.entity.finishing_status || "Not set"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Timestamps</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Created At</span>
                </div>
                <p className="font-medium text-gray-900">
                  {formatDate(adDetails?.created_at)}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Updated At</span>
                </div>
                <p className="font-medium text-gray-900">
                  {formatDate(adDetails?.updated_at)}
                </p>
              </div>

              {adDetails?.deleted_at && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Deleted At</span>
                  </div>
                  <p className="font-medium text-gray-900">
                    {formatDate(adDetails.deleted_at)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={onDelete}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <Button
              onClick={onEdit}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
