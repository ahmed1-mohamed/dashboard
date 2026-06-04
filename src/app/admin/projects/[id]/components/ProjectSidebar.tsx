import { Badge } from "@/components/ui/badge";
import { ExternalLink, MapPin, Building, Calendar, DollarSign, Target, Expand } from "lucide-react";
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
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="text-sm uppercase tracking-wider font-semibold text-slate-500 mb-4">
            Developer
          </h3>
          <div className="flex items-start gap-4 mb-5">
            {data.developer.logo ? (
              <div className="p-1 rounded-xl bg-white border border-slate-100 shadow-sm shrink-0">
                <img
                  src={data.developer.logo}
                  alt="Developer Logo"
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-lg object-cover"
                />
              </div>
            ) : (
              <div className="w-14 h-14 shrink-0 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl font-bold text-slate-500">
                {data.developer.name?.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div className="pt-1 overflow-hidden">
              <h4 className="font-bold text-slate-900 truncate">
                {data.developer.name}
              </h4>
              <Badge className="bg-teal-50 text-teal-700 hover:bg-teal-100 border-teal-200 text-xs mt-2 transition-colors">
                {data.developer.status || "Verified Developer"}
              </Badge>
            </div>
          </div>
          <div className="space-y-3 text-sm mb-5 divide-y divide-slate-100/50">
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-500">Email</span>
              <span className="text-slate-900 font-medium truncate ml-4">{data.developer.email}</span>
            </div>
            {data.developer.website && (
              <div className="flex justify-between items-center pt-3">
                <span className="text-slate-500">Website</span>
                <span className="text-slate-900 font-medium truncate ml-4">
                  {data.developer.website}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-3">
              <span className="text-slate-500">Phone</span>
              <span className="text-slate-900 font-medium">
                {data.developer.phone_number}
              </span>
            </div>
          </div>
          {data.developer.description && (
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                {data.developer.description}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Project Details Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h3 className="text-sm uppercase tracking-wider font-semibold text-slate-500 mb-4">
          Project Overview
        </h3>
        <div className="space-y-4 text-sm divide-y divide-slate-100/50">
          <div className="flex justify-between items-center pt-1">
            <div className="flex items-center gap-2 text-slate-500">
              <Expand className="w-4 h-4" />
              <span>Total Area</span>
            </div>
            <span className="text-slate-900 font-semibold bg-slate-50 px-2 py-0.5 rounded-md">
              {data.project_size || "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center pt-3">
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="w-4 h-4" />
              <span>Launch Date</span>
            </div>
            <span className="text-slate-900 font-medium">
              {data.launch_date || "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center pt-3">
            <div className="flex items-center gap-2 text-slate-500">
              <Target className="w-4 h-4" />
              <span>Delivery Date</span>
            </div>
            <span className="text-slate-900 font-medium">
              {data.completion_date || "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center pt-3">
            <div className="flex items-center gap-2 text-slate-500">
              <DollarSign className="w-4 h-4" />
              <span>Price Range</span>
            </div>
            <span className="text-slate-900 font-medium">
              {data.price_range || "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center pt-3">
            <div className="flex items-center gap-2 text-slate-500">
              <Building className="w-4 h-4" />
              <span>Buildings</span>
            </div>
            <span className="text-slate-900 font-medium">
              {buildingsCount}
            </span>
          </div>
          <div className="flex justify-between items-center pt-3">
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin className="w-4 h-4" />
              <span>Project Type</span>
            </div>
            <span className="text-slate-900 font-medium">
              {data.project_type || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Location Card */}
      {data.location && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="text-sm uppercase tracking-wider font-semibold text-slate-500 mb-4">
            Location Data
          </h3>
          <div className="space-y-3 text-sm divide-y divide-slate-100/50">
            {data.location.city && (
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">City</span>
                <span className="text-slate-900 font-medium">
                  {data.location.city.name}
                </span>
              </div>
            )}
            {data.location.area && (
              <div className="flex justify-between pt-3">
                <span className="text-slate-500">Area</span>
                <span className="text-slate-900 font-medium">
                  {data.location.area.area_name}
                </span>
              </div>
            )}
            {data.location.north_side && (
              <div className="flex justify-between pt-3">
                <span className="text-slate-500">North Side</span>
                <span className="text-slate-900 text-right w-1/2 line-clamp-1" title={data.location.north_side}>
                  {data.location.north_side}
                </span>
              </div>
            )}
            {data.location.south_side && (
              <div className="flex justify-between pt-3">
                <span className="text-slate-500">South Side</span>
                <span className="text-slate-900 text-right w-1/2 line-clamp-1" title={data.location.south_side}>
                  {data.location.south_side}
                </span>
              </div>
            )}
            {data.location.east_side && (
              <div className="flex justify-between pt-3">
                <span className="text-slate-500">East Side</span>
                <span className="text-slate-900 text-right w-1/2 line-clamp-1" title={data.location.east_side}>
                  {data.location.east_side}
                </span>
              </div>
            )}
            {data.location.west_side && (
              <div className="flex justify-between pt-3">
                <span className="text-slate-500">West Side</span>
                <span className="text-slate-900 text-right w-1/2 line-clamp-1" title={data.location.west_side}>
                  {data.location.west_side}
                </span>
              </div>
            )}
            {data.location.landmark && (
              <div className="pt-3">
                <span className="text-slate-500 block mb-1">Landmark</span>
                <span className="text-slate-900 font-medium">
                  {data.location.landmark}
                </span>
              </div>
            )}
            {data.location.latitude && data.location.longitude && (
              <div className="pt-3">
                <span className="text-slate-500 block mb-1">
                  Coordinates
                </span>
                <span className="text-slate-900 font-mono bg-slate-50 px-2 py-1 rounded">
                  {data.location.latitude}° N, {data.location.longitude}° E
                </span>
              </div>
            )}
            {data.location.google_map_link && (
              <div className="pt-4">
                <a
                  href={data.location.google_map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full rounded-xl bg-teal-600 hover:bg-teal-700 px-4 py-2.5 text-white font-medium transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  View on Google Maps
                  <ExternalLink className="ml-2 h-4 w-4 opacity-70" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
