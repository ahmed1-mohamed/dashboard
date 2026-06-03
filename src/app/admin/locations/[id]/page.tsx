"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocationDetails } from "@/features/locations/hooks/useLocationDetails";
import { LocationDetail } from "@/features/locations/types";
import { LocationHeader } from "@/features/locations/components/view/LocationHeader";
import { LocationMainDetails } from "@/features/locations/components/view/LocationMainDetails";
import { LocationProjectsList } from "@/features/locations/components/view/LocationProjectsList";
import { LocationSidePanel } from "@/features/locations/components/view/LocationSidePanel";
import { LocationLoadingSkeleton } from "@/features/locations/components/view/LocationLoadingSkeleton";

export default function LocationViewPage() {
  const router = useRouter();
  const params = useParams();
  const locationId = Number(params.id);

  const { locationData } = useLocationDetails(locationId);
  const { data, isLoading, isError, error } = locationData;

  if (isLoading) return <LocationLoadingSkeleton />;

  if (isError) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
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

  const payload = (data as any)?.data;
  const loc = (payload?.data ? payload.data : payload) as LocationDetail | undefined;
  if (!loc) return null;

  const cityName = loc.city?.name ?? "N/A";
  const areaName = loc.area?.area_name ?? "N/A";
  const regionName = loc.area?.region ?? "N/A";
  const hasMapLink = !!loc.google_map_link;
  const hasCoords = !!loc.latitude && !!loc.longitude;
  const projects = loc.projects || [];
  const area = loc.area || null;

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <LocationHeader
        landmark={loc.landmark}
        cityName={cityName}
        areaName={areaName}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <LocationMainDetails
            loc={loc}
            cityName={cityName}
            areaName={areaName}
            regionName={regionName}
            hasCoords={hasCoords}
          />
          <LocationProjectsList projects={projects} />
        </div>

        <LocationSidePanel
          loc={loc}
          area={area}
          hasCoords={hasCoords}
          hasMapLink={hasMapLink}
        />
      </div>
    </div>
  );
}
