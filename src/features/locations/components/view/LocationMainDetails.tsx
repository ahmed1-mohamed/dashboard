import { Building2, MapPin, Navigation, Compass, Globe } from "lucide-react";
import { InfoCard, DirectionCard } from "./SharedCards";
import { LocationDetail } from "../../types";

interface LocationMainDetailsProps {
  loc: LocationDetail;
  cityName: string;
  areaName: string;
  regionName: string;
  hasCoords: boolean;
}

export function LocationMainDetails({
  loc,
  cityName,
  areaName,
  regionName,
  hasCoords,
}: LocationMainDetailsProps) {
  return (
    <>
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
    </>
  );
}
