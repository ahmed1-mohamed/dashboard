"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Building2,
  Globe,
  Navigation,
  Compass,
  Calendar,
  ExternalLink,
  Edit2,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocationDetails } from "@/features/locations/hooks/useLocationDetails";

interface Project {
  project_id: number;
  project_name: string;
  project_type: string;
  status: string;
  total_units: number;
  available_units: number;
  price_range: string;
  launch_date: string;
  completion_date: string;
}

interface LocationDetail {
  location_id: number;
  landmark: string;
  google_map_link: string;
  latitude: string;
  longitude: string;
  north_side: string;
  south_side: string;
  east_side: string;
  west_side: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  area: {
    area_name: string;
    region: string;
    description: string;
    population: number;
    major_landmarks: string[];
  } | null;
  city: {
    id: number;
    name: string;
  } | null;
  projects: Project[];
  buildings: unknown[];
}

const statusColors: Record<string, string> = {
  ongoing: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  upcoming: "bg-amber-50 text-amber-700 border-amber-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

function InfoCard({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
        <Icon className="w-4 h-4 text-teal-600" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-gray-900 break-words">{value || "N/A"}</p>
      </div>
    </div>
  );
}

function DirectionCard({ direction, value }: { direction: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 p-3 bg-white rounded-lg border border-gray-100 shadow-sm text-center">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{direction}</span>
      <span className="text-sm font-medium text-gray-900">{value || "N/A"}</span>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
      <Skeleton className="h-40 rounded-xl" />
    </div>
  );
}

export default function LocationViewPage() {
  const router = useRouter();
  const params = useParams();
  const locationId = Number(params.id);

  const { locationData } = useLocationDetails(locationId);
  const { data, isLoading, isError, error } = locationData;

  if (isLoading) return <LoadingSkeleton />;

  if (isError) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 flex flex-col items-center gap-3">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <p className="text-red-800 font-medium">
            {error instanceof Error ? error.message : "Failed to load location"}
          </p>
          <Button variant="outline" onClick={() => router.back()} className="border-red-200 text-red-700 hover:bg-red-100">
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  const loc = (data as { data?: LocationDetail } | undefined)?.data;
  if (!loc) return null;

  const cityName = loc.city?.name ?? "N/A";
  const areaName = loc.area?.area_name ?? "N/A";
  const regionName = loc.area?.region ?? "N/A";
  const hasMapLink = !!loc.google_map_link;
  const hasCoords = !!loc.latitude && !!loc.longitude;

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-teal-600 shrink-0" />
              {loc.landmark}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {areaName} · {cityName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button variant="outline" size="sm" className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
          <Button size="sm" className="gap-2 bg-teal-600 hover:bg-teal-700 text-white">
            <Edit2 className="w-4 h-4" /> Edit
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-500" /> Location Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoCard label="City" value={cityName} icon={Building2} />
              <InfoCard label="Area" value={areaName} icon={MapPin} />
              <InfoCard label="Region" value={regionName} icon={Navigation} />
              <InfoCard label="Landmark" value={loc.landmark} icon={Compass} />
              {hasCoords && (
                <>
                  <InfoCard label="Latitude" value={loc.latitude} icon={Navigation} />
                  <InfoCard label="Longitude" value={loc.longitude} icon={Navigation} />
                </>
              )}
            </div>
          </div>

          {/* Borders / Directions */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Compass className="w-4 h-4 text-teal-500" /> Surrounding Borders
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <DirectionCard direction="North" value={loc.north_side} />
              <DirectionCard direction="South" value={loc.south_side} />
              <DirectionCard direction="East" value={loc.east_side} />
              <DirectionCard direction="West" value={loc.west_side} />
            </div>
          </div>

          {/* Projects */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-500" /> Projects
              <Badge className="ml-auto bg-teal-50 text-teal-700 border border-teal-200 text-xs font-medium">
                {loc.projects.length}
              </Badge>
            </h2>
            {loc.projects.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No projects linked to this location.</p>
            ) : (
              <div className="space-y-3">
                {loc.projects.map((project) => (
                  <div
                    key={project.project_id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-teal-200 hover:bg-teal-50/30 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{project.project_name}</p>
                      <p className="text-xs text-gray-500 capitalize mt-0.5">{project.project_type}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`text-xs border ${statusColors[project.status] ?? "bg-gray-50 text-gray-600 border-gray-200"} capitalize`}>
                        {project.status}
                      </Badge>
                      <span className="text-xs text-gray-500">{project.available_units}/{project.total_units} units</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Map / Link */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-500" /> Map
            </h2>
            {hasCoords ? (
              <div className="space-y-3">
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                  <iframe
                    title="Location Map"
                    className="w-full h-full"
                    loading="lazy"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(loc.longitude) - 0.01},${Number(loc.latitude) - 0.01},${Number(loc.longitude) + 0.01},${Number(loc.latitude) + 0.01}&layer=mapnik&marker=${loc.latitude},${loc.longitude}`}
                  />
                </div>
                {hasMapLink && (
                  <a
                    href={loc.google_map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-teal-200 text-teal-700 text-sm font-medium hover:bg-teal-50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" /> Open in Google Maps
                  </a>
                )}
              </div>
            ) : hasMapLink ? (
              <a
                href={loc.google_map_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-teal-200 text-teal-700 text-sm font-medium hover:bg-teal-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Open in Google Maps
              </a>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No map data available.</p>
            )}
          </div>

          {/* Area Info */}
          {loc.area && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-500" /> Area Details
              </h2>
              <div className="space-y-3">
                {loc.area.description && (
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-5">{loc.area.description}</p>
                )}
                {loc.area.population > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Population</span>
                    <span className="font-semibold text-gray-900">{loc.area.population.toLocaleString()}</span>
                  </div>
                )}
                {loc.area.major_landmarks?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Major Landmarks</p>
                    <div className="flex flex-wrap gap-1.5">
                      {loc.area.major_landmarks.map((lm) => (
                        <Badge key={lm} className="bg-purple-50 text-purple-700 border border-purple-200 text-xs">
                          {lm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-500" /> Record Info
            </h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Location ID</span>
                <span className="font-mono font-semibold text-gray-900">#{loc.location_id}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Created</span>
                <span className="font-medium text-gray-900 text-xs">{new Date(loc.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Updated</span>
                <span className="font-medium text-gray-900 text-xs">{new Date(loc.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
