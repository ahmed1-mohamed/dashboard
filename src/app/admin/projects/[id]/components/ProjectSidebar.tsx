import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { ProjectData } from "../types";

interface ProjectSidebarProps {
  data: ProjectData;
  buildingsCount: number;
}

export function ProjectSidebar({ data, buildingsCount }: ProjectSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Developer Card */}
      {data.developer && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Developer
          </h3>
          <div className="flex items-start gap-3 mb-4">
            {data.developer.logo ? (
              <img
                src={data.developer.logo}
                alt="Developer Logo"
                width={48}
                height={48}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600">
                {data.developer.name?.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="font-semibold text-gray-900">
                {data.developer.name}
              </h4>
              <Badge className="bg-green-50 text-green-700 border-green-200 text-xs mt-1">
                {data.developer.status || "Verified Developer"}
              </Badge>
            </div>
          </div>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Email Address</span>
              <span className="text-gray-900">{data.developer.email}</span>
            </div>
            {data.developer.website && (
              <div className="flex justify-between">
                <span className="text-gray-600">Website</span>
                <span className="text-gray-900">
                  {data.developer.website}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Phone Number</span>
              <span className="text-gray-900">
                {data.developer.phone_number}
              </span>
            </div>
          </div>
          {data.developer.description && (
            <p className="text-xs text-gray-600 mb-4">
              {data.developer.description}
            </p>
          )}
        </div>
      )}

      {/* Project Details Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Project Details
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Area</span>
            <span className="text-gray-900 font-medium">
              {data.project_size || "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Launch Date</span>
            <span className="text-gray-900 font-medium">
              {data.launch_date}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery Date</span>
            <span className="text-gray-900 font-medium">
              {data.completion_date}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Price Range</span>
            <span className="text-gray-900 font-medium">
              {data.price_range}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Number of Buildings</span>
            <span className="text-gray-900 font-medium">
              {buildingsCount}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Project Type</span>
            <span className="text-gray-900 font-medium">
              {data.project_type}
            </span>
          </div>
        </div>
      </div>

      {/* Location Card */}
      {data.location && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Location
          </h3>
          <div className="space-y-3 text-sm">
            {data.location.city && (
              <div className="flex justify-between">
                <span className="text-gray-600">City</span>
                <span className="text-gray-900 font-medium">
                  {data.location.city.name}
                </span>
              </div>
            )}
            {data.location.area && (
              <div className="flex justify-between">
                <span className="text-gray-600">Area</span>
                <span className="text-gray-900 font-medium">
                  {data.location.area.area_name}
                </span>
              </div>
            )}
            {data.location.north_side && (
              <div className="flex justify-between">
                <span className="text-gray-600">North Side</span>
                <span className="text-gray-900 font-medium">
                  {data.location.north_side}
                </span>
              </div>
            )}
            {data.location.south_side && (
              <div className="flex justify-between">
                <span className="text-gray-600">South Side</span>
                <span className="text-gray-900 font-medium">
                  {data.location.south_side}
                </span>
              </div>
            )}
            {data.location.east_side && (
              <div className="flex justify-between">
                <span className="text-gray-600">East Side</span>
                <span className="text-gray-900 font-medium">
                  {data.location.east_side}
                </span>
              </div>
            )}
            {data.location.west_side && (
              <div className="flex justify-between">
                <span className="text-gray-600">West Side</span>
                <span className="text-gray-900 font-medium">
                  {data.location.west_side}
                </span>
              </div>
            )}
            {data.location.landmark && (
              <div className="pt-2 border-t border-gray-200">
                <span className="text-gray-600 block mb-1">Landmark</span>
                <span className="text-gray-900 text-xs">
                  {data.location.landmark}
                </span>
              </div>
            )}
            {data.location.latitude && data.location.longitude && (
              <div className="pt-2 border-t border-gray-200">
                <span className="text-gray-600 block mb-1">
                  Coordinates
                </span>
                <span className="text-gray-900 text-xs">
                  {data.location.latitude}° N, {data.location.longitude}° E
                </span>
              </div>
            )}
            {data.location.google_map_link && (
              <a
                href={data.location.google_map_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex w-fit justify-between rounded-md bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600"
              >
                View on Google Maps{" "}
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
