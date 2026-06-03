import { MapPin, Globe, Calendar, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LocationDetail } from "../../types";

interface LocationSidePanelProps {
  loc: LocationDetail;
  area: LocationDetail["area"];
  hasCoords: boolean;
  hasMapLink: boolean;
}

export function LocationSidePanel({ loc, area, hasCoords, hasMapLink }: LocationSidePanelProps) {
  return (
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
      {area && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-teal-500" /> Area Details
          </h2>
          <div className="space-y-3">
            {area.description && (
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-5">{area.description}</p>
            )}
            {area.population > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Population</span>
                <span className="font-semibold text-gray-900">{area.population.toLocaleString()}</span>
              </div>
            )}
            {area.major_landmarks?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Major Landmarks</p>
                <div className="flex flex-wrap gap-1.5">
                  {area.major_landmarks.map((lm) => (
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
  );
}
