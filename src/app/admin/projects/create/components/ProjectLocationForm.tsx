import { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { LocationData, Option } from "../types";
import useCitiesByCountry from "@/hooks/use-cities-by-country";
import useAreasByCountry from "@/hooks/use-areas-by-country";
import useExpandUrl from "@/hooks/use-expand-url";
import useGetNearby from "@/hooks/use-get-nearby";
import useGetLocationDetails from "@/hooks/use-get-location-details";

interface ProjectLocationFormProps {
  locationData: LocationData;
  setLocationData: React.Dispatch<React.SetStateAction<LocationData>>;
  country: string;
  setCountry: React.Dispatch<React.SetStateAction<string>>;
  setCountryId: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export function ProjectLocationForm({
  locationData,
  setLocationData,
  country,
  setCountry,
  setCountryId,
}: ProjectLocationFormProps) {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [googleMapsLinkError, setGoogleMapsLinkError] = useState<string | null>(null);
  const [cityFound, setCityFound] = useState(true);
  const [areaError, setAreaError] = useState(false);
  const areaErrorRef = useRef<HTMLDivElement | null>(null);
  
  const [options, setOptions] = useState<Option[]>([]);
  const [options2, setOptions2] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(locationData.city_id || "");
  const [selectedOption2, setSelectedOption2] = useState<string | null>(locationData.area_id || "");

  const { expandUrl } = useExpandUrl();
  const { getNearby } = useGetNearby();
  const { getLocationDetails } = useGetLocationDetails();

  // Fetch cities when country changes
  const citiesQuery = useCitiesByCountry(country);
  useEffect(() => {
    const response = citiesQuery.data;
    if (!response) {
      setOptions([]);
      return;
    }
    
    let citiesArray: any[] = [];
    const rawData = response.data;
    if (Array.isArray(rawData)) {
      citiesArray = rawData;
    } else {
      const nested = (rawData as any)?.data;
      if (Array.isArray(nested)) {
        citiesArray = nested;
      } else if (Array.isArray((nested as any)?.data)) {
        citiesArray = (nested as any).data;
      }
    }

    if (citiesArray.length > 0) {
      setOptions(citiesArray.map((city: any) => ({ label: city.name || city.city_name, value: city.name || city.city_name })));
    } else {
      setOptions([]);
    }
  }, [citiesQuery.data]);

  // Fetch areas when country changes
  const areasQuery = useAreasByCountry(country);
  useEffect(() => {
    const response = areasQuery.data;
    if (!response) {
      setOptions2([]);
      return;
    }
    
    let areasArray: any[] = [];
    const rawData = response.data;
    if (Array.isArray(rawData)) {
      areasArray = rawData;
    } else {
      const nested = (rawData as any)?.data;
      if (Array.isArray(nested)) {
        areasArray = nested;
      } else if (Array.isArray((nested as any)?.data)) {
        areasArray = (nested as any).data;
      } else if (Array.isArray((rawData as any)?.dldAreas)) {
        areasArray = (rawData as any).dldAreas;
      }
    }

    if (areasArray.length > 0) {
      setOptions2(areasArray.map((area: any) => ({ label: area.area_name || area.dld_area_name, value: area.area_name || area.dld_area_name })));
    } else {
      setOptions2([]);
    }
  }, [areasQuery.data]);

  // Check if city is found
  useEffect(() => {
    const flag = options.find((opt) => opt.value === selectedOption) ?? null;
    setCityFound(flag !== null);
  }, [selectedOption, options]);

  const isValidGoogleMapsLink = (url: string) => {
    const trimmed = url.trim();
    return /^https:\/\/(maps\.app\.goo\.gl\/|goo\.gl\/maps\/|www\.google\.[a-z.]+\/maps\/)/.test(trimmed);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocationData((prev) => ({
      ...prev,
      [name]: name === "latitude" || name === "longitude" ? parseFloat(value) : value,
    }));
  };

  const handleGoogleMapLink = async (url: string) => {
    if (!url.trim()) {
      setLocationData({
        latitude: 0, longitude: 0, landmark: "", city_id: "",
        north_side: "", south_side: "", east_side: "", west_side: "",
        google_map_link: "", area_id: "",
      });
      setGoogleMapsLinkError("Invalid Google Maps link format.");
      return;
    }

    setIsLoadingLocation(true);
    try {
      const coordinates = await expandUrl(url);
      if (!coordinates) {
        toast.error("Invalid Google Maps URL. Please provide a valid link.");
        setGoogleMapsLinkError("Invalid Google Maps link format.");
        return;
      }

      const geocodeData = await getLocationDetails({ lat: coordinates.lat, lng: coordinates.lng });
      if (!geocodeData.results || geocodeData.results.length === 0) {
        toast.error("Could not extract location details from the provided link.");
        setGoogleMapsLinkError("Invalid Google Maps link format.");
        return;
      }

      const result = geocodeData.results[0];
      const addressComponents = result.address_components;
      let city_id = ""; let area_id = ""; let state = "";
      let detectedCountry = ""; let country_id = 0;
      const landmark = result.formatted_address;

      for (const component of addressComponents) {
        const types = component.types;
        if (types.includes("sublocality") || types.includes("neighborhood")) area_id = component.long_name;
        else if (types.includes("locality")) city_id = component.long_name;
        else if (types.includes("administrative_area_level_2") && !city_id) city_id = component.long_name;
        else if (types.includes("administrative_area_level_1")) state = component.long_name;
        else if (types.includes("country")) {
          detectedCountry = component.long_name.toLowerCase();
          if (detectedCountry === "united arab emirates") detectedCountry = "UAE";
          else if (detectedCountry === "egypt") detectedCountry = "Egypt";
          else if (detectedCountry === "oman") detectedCountry = "Oman";
          
          if (detectedCountry === "Egypt") country_id = 1;
          else if (detectedCountry === "UAE") country_id = 2;
          else if (detectedCountry === "Oman") country_id = 3;
        }
      }

      const directionalData = await getNearby({ lat: coordinates.lat, lng: coordinates.lng });

      setCountry(detectedCountry);
      setCountryId(country_id);

      const locationDataFinal: LocationData = {
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        landmark: landmark || "Unknown Location",
        city_id: city_id || state || "Unknown City",
        north_side: directionalData.north || "N/A",
        south_side: directionalData.south || "N/A",
        east_side: directionalData.east || "N/A",
        west_side: directionalData.west || "N/A",
        google_map_link: url,
        area_id: area_id || "Unknown Area",
      };

      setLocationData(locationDataFinal);
      toast.success("Location details extracted successfully!");
      setSelectedOption(locationDataFinal.city_id);
      setSelectedOption2(locationDataFinal.area_id ?? "");
      setGoogleMapsLinkError(null);
    } catch (error) {
      console.error("Error processing Google Maps link:", error);
      setGoogleMapsLinkError("Invalid Google Maps link format.");
      toast.error("Error processing the Google Maps link. Please try again.");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Location</h2>
        <div className="space-y-6">
          <div>
            <Label htmlFor="google-maps">Google Maps Link <span className="text-red-500">*</span></Label>
            <div className="flex gap-2 mt-1">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="google-maps"
                  placeholder="https://maps.google.com"
                  className="pl-10"
                  value={locationData.google_map_link}
                  onChange={(e) => {
                    const url = e.target.value;
                    setLocationData((prev) => ({ ...prev, google_map_link: url }));
                    if (!isValidGoogleMapsLink(url) && url.trim()) {
                      setGoogleMapsLinkError("Invalid Google Maps link format.");
                    } else {
                      setGoogleMapsLinkError(null);
                    }
                  }}
                  disabled={isLoadingLocation}
                />
              </div>
              <Button
                type="button"
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => handleGoogleMapLink(locationData.google_map_link)}
                disabled={isLoadingLocation}
              >
                {isLoadingLocation ? "Processing..." : "Fetch Data"}
              </Button>
            </div>
            {googleMapsLinkError && <p className="text-sm text-red-600 mt-1">{googleMapsLinkError}</p>}
            {isLoadingLocation && (
              <div className="flex items-center space-x-2 text-sm text-blue-600 mt-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                <span>Processing Google Maps link...</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude <span className="text-red-500">*</span></Label>
              <Input id="latitude" type="number" step="any" placeholder="25.2048" className="mt-1" value={locationData.latitude || ""} onChange={handleChange} name="latitude" />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude <span className="text-red-500">*</span></Label>
              <Input id="longitude" type="number" step="any" placeholder="55.2708" className="mt-1" value={locationData.longitude || ""} onChange={handleChange} name="longitude" />
            </div>
            <div>
              <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
              <Select
                value={selectedOption || ""}
                onValueChange={(value) => {
                  setSelectedOption(value);
                  setLocationData((prev) => ({ ...prev, city_id: value }));
                }}
              >
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select City" /></SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!cityFound && <p className="text-sm text-red-500 mt-1">City not found in database</p>}
            </div>
            <div ref={areaErrorRef}>
              <Label htmlFor="area">Area <span className="text-red-500">*</span></Label>
              <Select
                value={selectedOption2 || ""}
                onValueChange={(value) => {
                  setSelectedOption2(value);
                  setLocationData((prev) => ({ ...prev, area_id: value }));
                }}
              >
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select Area" /></SelectTrigger>
                <SelectContent>
                  {options2.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {areaError && <p className="text-sm text-red-500 mt-1">Area is not valid</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Directional References</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div><Label htmlFor="south-side">South side <span className="text-red-500">*</span></Label><Input id="south-side" className="mt-1" value={locationData.south_side} onChange={handleChange} name="south_side" /></div>
          <div><Label htmlFor="east-side">East side <span className="text-red-500">*</span></Label><Input id="east-side" className="mt-1" value={locationData.east_side} onChange={handleChange} name="east_side" /></div>
          <div><Label htmlFor="west-side">West side <span className="text-red-500">*</span></Label><Input id="west-side" className="mt-1" value={locationData.west_side} onChange={handleChange} name="west_side" /></div>
          <div><Label htmlFor="north-side">North side <span className="text-red-500">*</span></Label><Input id="north-side" className="mt-1" value={locationData.north_side} onChange={handleChange} name="north_side" /></div>
          <div><Label htmlFor="landmark">Landmark <span className="text-red-500">*</span></Label><Input id="landmark" className="mt-1" value={locationData.landmark} onChange={handleChange} name="landmark" /></div>
        </div>
      </div>
    </>
  );
}
