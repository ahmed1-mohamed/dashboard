"use client";

import React from "react";
import {
  Calendar,
  MapPin,
  Globe,
  Monitor,
  Smartphone,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";

export const getPlatformIcon = (platform: string) => {
  switch (platform?.toLowerCase()) {
    case "web":
      return <Monitor className="w-4 h-4" />;
    case "mobile":
      return <Smartphone className="w-4 h-4" />;
    default:
      return <Globe className="w-4 h-4" />;
  }
};

export const formatDate = (dateString: string | null | undefined) => {
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

export const getCountryName = (countryId: number | null | undefined) => {
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

export function AdBasicInfo({ adDetails }: { adDetails: any }) {
  return (
    <div className="border-t pt-4">
      <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <span className="text-sm">Creative ID</span>
          </div>
          <p className="font-medium text-gray-900">{adDetails?.creative_id || "Not set"}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <span className="text-sm">Campaign ID</span>
          </div>
          <p className="font-medium text-gray-900">{adDetails?.campaign_id || "Not set"}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <span className="text-sm">Placement ID</span>
          </div>
          <p className="font-medium text-gray-900">{adDetails?.placement_id || "Not set"}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <span className="text-sm">Entity Type</span>
          </div>
          <p className="font-medium text-gray-900 capitalize">{adDetails?.entity_type?.toLowerCase() || "Not set"}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <span className="text-sm">Entity ID</span>
          </div>
          <p className="font-medium text-gray-900">{adDetails?.entity_id || "Not set"}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <span className="text-sm">Weight/Priority</span>
          </div>
          <p className="font-medium text-gray-900">{adDetails?.weight || "Not set"}</p>
        </div>
      </div>
    </div>
  );
}

export function AdDetailsSection({ adDetails }: { adDetails: any }) {
  return (
    <div className="border-t pt-4">
      <h4 className="font-medium text-gray-900 mb-3">Ad Details</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <span className="text-sm">Title</span>
          </div>
          <p className="font-medium text-gray-900">{adDetails?.title || "Not set"}</p>
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
          <p className="font-medium text-gray-900">{adDetails?.placement?.format || "Not set"}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            {getPlatformIcon(adDetails?.placement?.platform)}
            <span className="text-sm">Platform</span>
          </div>
          <p className="font-medium text-gray-900 capitalize">{adDetails?.placement?.platform || "Not set"}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Globe className="w-4 h-4" />
            <span className="text-sm">Country</span>
          </div>
          <p className="font-medium text-gray-900">{getCountryName(adDetails?.country_id)}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Location</span>
          </div>
          <p className="font-medium text-gray-900 capitalize">{adDetails?.placement?.location || "Not set"}</p>
        </div>
      </div>
    </div>
  );
}

export function AdCTADetails({ adDetails }: { adDetails: any }) {
  return (
    <div className="border-t pt-4">
      <h4 className="font-medium text-gray-900 mb-3">CTA Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <span className="text-sm">CTA Label</span>
          </div>
          <p className="font-medium text-gray-900">{adDetails?.cta_label || "Not set"}</p>
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
  );
}

export function AdImage({ adDetails }: { adDetails: any }) {
  if (!adDetails?.image_url) return null;
  return (
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
            className="max-w-md w-full h-auto rounded-lg border border-gray-200"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function AdPlacementDetails({ adDetails }: { adDetails: any }) {
  if (!adDetails?.placement) return null;
  return (
    <div className="border-t pt-4">
      <h4 className="font-medium text-gray-900 mb-3">Placement Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <span className="text-sm">Placement ID</span>
          </div>
          <p className="font-medium text-gray-900">{adDetails.placement.placement_id}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <span className="text-sm">Code</span>
          </div>
          <p className="font-medium text-gray-900">{adDetails.placement.code || "Not set"}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <span className="text-sm">Name</span>
          </div>
          <p className="font-medium text-gray-900">{adDetails.placement.name || "Not set"}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <span className="text-sm">Format</span>
          </div>
          <p className="font-medium text-gray-900 capitalize">{adDetails.placement.format || "Not set"}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <span className="text-sm">Billing Unit</span>
          </div>
          <p className="font-medium text-gray-900 capitalize">{adDetails.placement.billing_unit || "Not set"}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <span className="text-sm">Default Price Credits</span>
          </div>
          <p className="font-medium text-gray-900">{adDetails.placement.default_price_credits || "Not set"}</p>
        </div>
      </div>
    </div>
  );
}

export function AdEntityDetails({ adDetails }: { adDetails: any }) {
  if (!adDetails?.entity) return null;
  return (
    <div className="border-t pt-4">
      <h4 className="font-medium text-gray-900 mb-3">Linked Entity</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adDetails.entity_type === "PROJECTS" ? (
          <>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <span className="text-sm">Project ID</span>
              </div>
              <p className="font-medium text-gray-900">{adDetails.entity.project_id || "Not set"}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <span className="text-sm">Project Name</span>
              </div>
              <p className="font-medium text-gray-900">{adDetails.entity.project_name || "Not set"}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <span className="text-sm">Project Type</span>
              </div>
              <p className="font-medium text-gray-900 capitalize">{adDetails.entity.project_type || "Not set"}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <span className="text-sm">Status</span>
              </div>
              <p className="font-medium text-gray-900 capitalize">{adDetails.entity.status || "Not set"}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <span className="text-sm">Total Units</span>
              </div>
              <p className="font-medium text-gray-900">{adDetails.entity.total_units ?? "Not set"}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <span className="text-sm">Available Units</span>
              </div>
              <p className="font-medium text-gray-900">{adDetails.entity.available_units ?? "Not set"}</p>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <span className="text-sm">Property ID</span>
              </div>
              <p className="font-medium text-gray-900">{adDetails.entity.property_id || "Not set"}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <span className="text-sm">Property Name</span>
              </div>
              <p className="font-medium text-gray-900">{adDetails.entity.property_name || "Not set"}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <span className="text-sm">Property No</span>
              </div>
              <p className="font-medium text-gray-900">{adDetails.entity.property_no || "Not set"}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <span className="text-sm">Status</span>
              </div>
              <p className="font-medium text-gray-900 capitalize">{adDetails.entity.status || "Not set"}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <span className="text-sm">Price</span>
              </div>
              <p className="font-medium text-gray-900">
                {adDetails.entity.price ? `$${parseFloat(adDetails.entity.price).toLocaleString()}` : "Not set"}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <span className="text-sm">Size</span>
              </div>
              <p className="font-medium text-gray-900">{adDetails.entity.size ? `${adDetails.entity.size} sqm` : "Not set"}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <span className="text-sm">Bedrooms</span>
              </div>
              <p className="font-medium text-gray-900">{adDetails.entity.bedrooms ?? "Not set"}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <span className="text-sm">Bathrooms</span>
              </div>
              <p className="font-medium text-gray-900">{adDetails.entity.bathrooms ?? "Not set"}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function AdTimestamps({ adDetails }: { adDetails: any }) {
  return (
    <div className="border-t pt-4">
      <h4 className="font-medium text-gray-900 mb-3">Timestamps</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Created At</span>
          </div>
          <p className="font-medium text-gray-900">{formatDate(adDetails?.created_at)}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Updated At</span>
          </div>
          <p className="font-medium text-gray-900">{formatDate(adDetails?.updated_at)}</p>
        </div>

        {adDetails?.deleted_at && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Deleted At</span>
            </div>
            <p className="font-medium text-gray-900">{formatDate(adDetails.deleted_at)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
