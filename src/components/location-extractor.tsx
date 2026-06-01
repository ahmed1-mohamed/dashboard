"use client";

import { useState } from "react";
import { Input } from "rizzui/input";
import { Button } from "rizzui/button";
import { Select } from "rizzui/select";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

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

type Option = {
  label: string;
  value: string;
};

interface LocationExtractorProps {
  onLocationChange: (location: LocationData) => void;
  initialLocation?: LocationData;
  token?: string;
  country?: string;
}

export default function LocationExtractor({
  onLocationChange,
  initialLocation,
  token,
  country = "Egypt",
}: LocationExtractorProps) {
  const [googleMapLink, setGoogleMapLink] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationData, setLocationData] = useState<LocationData>(
    initialLocation || {
      latitude: 0,
      longitude: 0,
      landmark: "",
      city_id: "",
      north_side: "",
      south_side: "",
      east_side: "",
      west_side: "",
      google_map_link: "",
      area_id: "",
    },
  );
  const [cityOptions, setCityOptions] = useState<Option[]>([]);
  const [areaOptions, setAreaOptions] = useState<Option[]>([]);

  const isValidGoogleMapsLink = (url: string) => {
    const trimmed = url.trim();
    return /^https:\/\/(maps\.app\.goo\.gl\/|goo\.gl\/maps\/|www\.google\.[a-z.]+\/maps\/)/.test(
      trimmed,
    );
  };

  const expandShortUrl = async (
    shortUrl: string,
  ): Promise<{ lat: number; lng: number } | null> => {
    const res = await fetch(
      `/api/expand-url?shortUrl=${encodeURIComponent(shortUrl)}`,
    );
    const data: any = await res.json();
    return extractCoordinatesFromUrl(data.longUrl);
  };

  const extractCoordinatesFromUrl = (
    url: string,
  ): { lat: number; lng: number } | null => {
    try {
      const decodedUrl = decodeURIComponent(url);

      const patterns = [
        { regex: /@(-?\d+\.?\d*),(-?\d+\.?\d*)/, latFirst: true },
        { regex: /!3d(-?\d+\.?\d*).*?!4d(-?\d+\.?\d*)/, latFirst: true },
        { regex: /!4d(-?\d+\.?\d*).*?!3d(-?\d+\.?\d*)/, latFirst: false },
        { regex: /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/, latFirst: true },
        { regex: /[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/, latFirst: true },
        { regex: /[?&]center=(-?\d+\.?\d*),(-?\d+\.?\d*)/, latFirst: true },
        { regex: /[?&]sll=(-?\d+\.?\d*),(-?\d+\.?\d*)/, latFirst: true },
        { regex: /place\/.*?@(-?\d+\.?\d*),(-?\d+\.?\d*)/, latFirst: true },
        { regex: /data=.*?3d(-?\d+\.?\d*).*?4d(-?\d+\.?\d*)/, latFirst: true },
        {
          regex:
            /1s0x[a-f0-9]+:0x[a-f0-9]+.*?3d(-?\d+\.?\d*).*?4d(-?\d+\.?\d*)/,
          latFirst: true,
        },
        { regex: /pb=.*?2d(-?\d+\.?\d*).*?3d(-?\d+\.?\d*)/, latFirst: false },
      ];

      for (const { regex, latFirst } of patterns) {
        const match = decodedUrl.match(regex);
        if (match) {
          const lat = latFirst ? parseFloat(match[1]) : parseFloat(match[2]);
          const lng = latFirst ? parseFloat(match[2]) : parseFloat(match[1]);

          if (
            !isNaN(lat) &&
            !isNaN(lng) &&
            lat >= -90 &&
            lat <= 90 &&
            lng >= -180 &&
            lng <= 180
          ) {
            return { lat, lng };
          }
        }
      }

      return null;
    } catch (error) {
      console.error("Error extracting coordinates:", error);
      return null;
    }
  };

  const getLocationDetails = async (
    lat: number,
    lng: number,
  ): Promise<Partial<LocationData> | null> => {
    try {
      const API_KEY = "AIzaSyA7pPVZpga50Hvurvanqkal3QEF9LPbG-g";
      if (!API_KEY) {
        throw new Error("Google Maps API key not found");
      }

      const geocodeResponse = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`,
      );

      if (!geocodeResponse.ok) {
        throw new Error("Failed to fetch location data");
      }

      const geocodeData: any = await geocodeResponse.json();

      if (geocodeData.results && geocodeData.results.length > 0) {
        const result = geocodeData.results[0];
        const addressComponents = result.address_components;

        let city_id = "";
        let area_id = "";
        let landmark = result.formatted_address;

        for (const component of addressComponents) {
          const types = component.types;

          if (types.includes("sublocality") || types.includes("neighborhood")) {
            area_id = component.long_name;
          } else if (types.includes("locality")) {
            city_id = component.long_name;
          } else if (
            types.includes("administrative_area_level_2") &&
            !city_id
          ) {
            city_id = component.long_name;
          }
        }

        // Fetch cities and areas
        await fetchCitiesAndAreas();

        const directionalData = await getDirectionalReferences(lat, lng);
        return {
          latitude: lat,
          longitude: lng,
          landmark: landmark || "Unknown Location",
          city_id: city_id || "Unknown City",
          north_side: directionalData.north || "N/A",
          south_side: directionalData.south || "N/A",
          east_side: directionalData.east || "N/A",
          west_side: directionalData.west || "N/A",
          area_id: area_id || "Unknown Area",
        };
      }

      return null;
    } catch (error) {
      console.error("Error getting location details:", error);
      throw error;
    }
  };

  const getDirectionalReferences = async (lat: number, lng: number) => {
    const res = await fetch(`/api/get-nearby?lat=${lat}&lng=${lng}`);
    const data: any = await res.json();
    return data;
  };

  const fetchCitiesAndAreas = async () => {
    try {
      // Fetch cities
      const citiesRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cities?country=${country}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const citiesJson: any = await citiesRes.json();
      const citiesData = citiesJson.data;
      const formattedCities = citiesData.map((city: any) => ({
        label: city.name,
        value: city.name,
      }));
      setCityOptions(formattedCities);

      // Fetch areas
      const areasRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/areas?country=${country}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const areasJson: any = await areasRes.json();
      const areasData = areasJson.data;
      const formattedAreas = areasData.map((area: any) => ({
        label: area.area_name,
        value: area.area_name,
      }));
      setAreaOptions(formattedAreas);
    } catch (error) {
      console.error("Failed to fetch cities/areas:", error);
    }
  };

  const handleFetchData = async () => {
    if (!googleMapLink.trim()) {
      toast.error("Please enter a Google Maps link");
      return;
    }

    if (!isValidGoogleMapsLink(googleMapLink)) {
      toast.error("Invalid Google Maps link format.");
      return;
    }

    setIsLoadingLocation(true);
    try {
      const coordinates = await expandShortUrl(googleMapLink);

      if (!coordinates) {
        toast.error("Invalid Google Maps URL. Please provide a valid link.");
        return;
      }

      const details = await getLocationDetails(
        coordinates.lat,
        coordinates.lng,
      );

      if (details) {
        const updatedLocation = {
          ...details,
          google_map_link: googleMapLink,
        } as LocationData;

        setLocationData(updatedLocation);
        onLocationChange(updatedLocation);
        toast.success("Location details extracted successfully!");
      } else {
        toast.error(
          "Could not extract location details from the provided link.",
        );
      }
    } catch (error) {
      console.error("Error processing Google Maps link:", error);
      toast.error("Error processing the Google Maps link. Please try again.");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleLocationFieldChange = (
    field: keyof LocationData,
    value: string | number,
  ) => {
    const updatedLocation = {
      ...locationData,
      [field]: value,
    };
    setLocationData(updatedLocation);
    onLocationChange(updatedLocation);
  };

  type Direction = "north_side" | "south_side" | "east_side" | "west_side";
  const directionKeys: Direction[] = [
    "north_side",
    "south_side",
    "east_side",
    "west_side",
  ];

  return (
    <div className="space-y-4">
      {/* Google Maps Link Input */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            label="Google Maps Link"
            placeholder="Paste any Google Maps link here..."
            value={googleMapLink}
            onChange={(e) => setGoogleMapLink(e.target.value)}
            disabled={isLoadingLocation}
          />
        </div>
        <div className="flex items-end">
          <Button
            onClick={handleFetchData}
            disabled={isLoadingLocation}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isLoadingLocation ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fetching...
              </>
            ) : (
              "Fetch Data"
            )}
          </Button>
        </div>
      </div>

      {isLoadingLocation && (
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processing Google Maps link...</span>
        </div>
      )}

      {/* Location Details */}
      {locationData.latitude !== 0 && locationData.longitude !== 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <h3 className="mb-3 font-medium text-green-900">
            📍 Location Details (Editable):
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {/* Coordinates */}
            <div className="text-sm">
              <label className="font-medium text-green-800">Latitude:</label>
              <input
                type="number"
                step="0.000001"
                value={locationData.latitude}
                onChange={(e) =>
                  handleLocationFieldChange(
                    "latitude",
                    parseFloat(e.target.value),
                  )
                }
                className="mt-1 w-full rounded border border-green-300 bg-white px-2 py-1 text-green-700"
              />
            </div>
            <div className="text-sm">
              <label className="font-medium text-green-800">Longitude:</label>
              <input
                type="number"
                step="0.000001"
                value={locationData.longitude}
                onChange={(e) =>
                  handleLocationFieldChange(
                    "longitude",
                    parseFloat(e.target.value),
                  )
                }
                className="mt-1 w-full rounded border border-green-300 bg-white px-2 py-1 text-green-700"
              />
            </div>

            {/* Landmark */}
            <div className="text-sm">
              <label className="font-medium text-green-800">Landmark:</label>
              <input
                type="text"
                value={locationData.landmark}
                onChange={(e) =>
                  handleLocationFieldChange("landmark", e.target.value)
                }
                className="mt-1 w-full rounded border border-green-300 bg-white px-2 py-1 text-green-700"
              />
            </div>

            {/* City */}
            <div className="text-sm">
              <label className="font-medium text-green-800">City:</label>
              <Select
                value={
                  cityOptions.find(
                    (opt) => opt.value === locationData.city_id,
                  ) || null
                }
                onChange={(value: unknown) => {
                  const option = value as Option | null;
                  handleLocationFieldChange("city_id", option?.value || "");
                }}
                options={cityOptions}
                placeholder="Select a city"
              />
            </div>

            {/* Area */}
            <div className="text-sm">
              <label className="font-medium text-green-800">Area:</label>
              <Select
                value={
                  areaOptions.find(
                    (opt) => opt.value === locationData.area_id,
                  ) || null
                }
                onChange={(value: unknown) => {
                  const option = value as Option | null;
                  handleLocationFieldChange("area_id", option?.value || "");
                }}
                options={areaOptions}
                placeholder="Select an area"
              />
            </div>

            {/* Directional References */}
            <div className="col-span-full text-sm">
              <label className="font-medium text-green-800">
                Directional References:
              </label>
            </div>

            {directionKeys.map((side) => (
              <div key={side} className="text-xs text-green-600">
                <label className="font-medium capitalize">
                  {side.replace("_side", "")}:
                </label>
                <input
                  type="text"
                  value={locationData[side]}
                  onChange={(e) =>
                    handleLocationFieldChange(side, e.target.value)
                  }
                  className="mt-1 w-full rounded border border-green-300 bg-white px-2 py-1 text-green-700"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
