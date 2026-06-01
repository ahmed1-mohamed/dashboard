"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import LocationExtractor from "@/components/location-extractor";
import { Button } from "rizzui/button";
import toast from "react-hot-toast";

interface LocationData {
  latitude: number;
  longitude: number;
  landmark: string;
  city_id: string;
  north_side: string;
  south_side: string;
  east_side: string;
  west_side: string;
  google_map_link: string;
  area_id?: string;
}

/**
 * Example component showing how to use the LocationExtractor component
 *
 * Usage:
 * 1. Import the LocationExtractor component
 * 2. Create state to hold location data
 * 3. Pass onLocationChange callback to handle location updates
 * 4. Optionally pass initialLocation, token, and country props
 */
export default function LocationExtractorExample() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [locationData, setLocationData] = useState<LocationData | null>(null);

  const handleLocationChange = (location: LocationData) => {
    setLocationData(location);
    console.log("Location updated:", location);
  };

  const handleSubmit = () => {
    if (!locationData) {
      toast.error("Please extract location data first");
      return;
    }

    // Use locationData in your form submission
    console.log("Submitting with location:", locationData);
    toast.success("Location data ready for submission!");

    // Example: Send to API
    // const payload = {
    //   ...otherFormData,
    //   location: locationData
    // };
    // await createProject(payload);
  };

  return (
    <div className="mx-auto max-w-4xl rounded-xl bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold">Location Extractor Example</h2>

      <div className="space-y-6">
        <LocationExtractor
          onLocationChange={handleLocationChange}
          token={token}
          country="Egypt" // or "UAE", "Oman", etc.
        />

        {locationData && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="mb-2 font-semibold">Current Location Data:</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(locationData, null, 2)}
            </pre>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Submit with Location Data
          </Button>
        </div>
      </div>
    </div>
  );
}
