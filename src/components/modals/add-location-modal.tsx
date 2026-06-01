"use client";

import { useState, useCallback } from "react";
import { useAddLocationData, useAddLocation } from "@/hooks/use-add-location";
import useExpandUrl from "@/hooks/use-expand-url";
import useGetNearby from "@/hooks/use-get-nearby";
import useGetLocationDetails from "@/hooks/use-get-location-details";
import { LocationInput } from "@/validators/location.schema";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Navigation,
  Landmark,
  FileText,
  Loader2,
  Search,
} from "lucide-react";
import { toast } from "sonner";

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface LocationFormData {
  // Location identification
  locationName: string;

  // IDs
  areaId: string;
  cityId: string;

  // Map and coordinates
  googleMapLink: string;
  latitude: string;
  longitude: string;

  // Boundaries
  northSide: string;
  southSide: string;
  eastSide: string;
  westSide: string;

  // Additional info
  landmark: string;
  description: string;
}

export function AddLocationModal({ isOpen, onClose }: AddLocationModalProps) {
  const { cities, areas, isLoadingCities, isLoadingAreas } =
    useAddLocationData(isOpen);
  const { addLocation, isAddingLocation } = useAddLocation();
  const [isExtracting, setIsExtracting] = useState(false);
  const [googleMapsLinkError, setGoogleMapsLinkError] = useState<string | null>(
    null,
  );

  const [formData, setFormData] = useState<LocationFormData>({
    locationName: "",
    areaId: "",
    cityId: "",
    googleMapLink: "",
    latitude: "",
    longitude: "",
    northSide: "",
    southSide: "",
    eastSide: "",
    westSide: "",
    landmark: "",
    description: "",
  });

  // Hooks for Google Maps processing
  const { expandUrl, isExpanding } = useExpandUrl();
  const { getNearby, isFetching: isFetchingNearby } = useGetNearby();
  const { getLocationDetails, isFetching: isFetchingLocationDetails } =
    useGetLocationDetails();

  const isProcessing =
    isExtracting ||
    isExpanding ||
    isFetchingNearby ||
    isFetchingLocationDetails;

  const isValidGoogleMapsLink = (url: string) => {
    const trimmed = url.trim();
    return /^https:\/\/(maps\.app\.goo\.gl\/|goo\.gl\/maps\/|www\.google\.[a-z.]+\/maps\/)/.test(
      trimmed,
    );
  };

  const handleGoogleMapLinkChange = (value: string) => {
    setFormData({ ...formData, googleMapLink: value });
    if (!isValidGoogleMapsLink(value) && value.trim()) {
      setGoogleMapsLinkError("Invalid Google Maps link format.");
    } else {
      setGoogleMapsLinkError(null);
    }
  };

  const extractLocationDetails = useCallback(
    async (link: string) => {
      if (!link.trim()) {
        setFormData((prev) => ({
          ...prev,
          googleMapLink: "",
          latitude: "",
          longitude: "",
          landmark: "",
          cityId: "",
          areaId: "",
          northSide: "",
          southSide: "",
          eastSide: "",
          westSide: "",
        }));
        setGoogleMapsLinkError("Invalid Google Maps link format.");
        return;
      }

      setIsExtracting(true);
      setGoogleMapsLinkError(null);

      try {
        // Expand short URL
        const coordinates = await expandUrl(link);
        if (!coordinates) {
          toast.error("Invalid Google Maps URL. Please provide a valid link.");
          setGoogleMapsLinkError("Invalid Google Maps link format.");
          return;
        }

        // Get geocode data
        const geocodeData = await getLocationDetails({
          lat: coordinates.lat,
          lng: coordinates.lng,
        });

        if (!geocodeData.results || geocodeData.results.length === 0) {
          toast.error(
            "Could not extract location details from the provided link.",
          );
          setGoogleMapsLinkError("Invalid Google Maps link format.");
          return;
        }

        const result = geocodeData.results[0];
        const addressComponents = result.address_components;

        let cityName = "";
        let areaName = "";

        for (const component of addressComponents) {
          const types = component.types;
          if (types.includes("sublocality") || types.includes("neighborhood")) {
            areaName = component.long_name;
          } else if (types.includes("locality")) {
            cityName = component.long_name;
          } else if (
            types.includes("administrative_area_level_2") &&
            !cityName
          ) {
            cityName = component.long_name;
          } else if (types.includes("administrative_area_level_1")) {
            if (!cityName) cityName = component.long_name;
          }
        }

        // Get directional references
        const directionalData = await getNearby({
          lat: coordinates.lat,
          lng: coordinates.lng,
        });

        // Update form with extracted data
        setFormData((prev) => ({
          ...prev,
          googleMapLink: link,
          latitude: String(coordinates.lat),
          longitude: String(coordinates.lng),
          cityId: cityName || prev.cityId,
          areaId: areaName || prev.areaId,
          landmark: result.formatted_address || prev.landmark,
          northSide: directionalData.north || "",
          southSide: directionalData.south || "",
          eastSide: directionalData.east || "",
          westSide: directionalData.west || "",
        }));

        toast.success("Location details extracted successfully!");
      } catch (error) {
        console.error("Error extracting location details:", error);
        setGoogleMapsLinkError("Invalid Google Maps link format.");
        toast.error("Failed to extract location details. Please try again.");
      } finally {
        setIsExtracting(false);
      }
    },
    [expandUrl, getLocationDetails, getNearby],
  );

  const handleExtractLocation = () => {
    if (formData.googleMapLink.trim()) {
      extractLocationDetails(formData.googleMapLink);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.areaId || !formData.cityId) {
      toast.error("Please select both City and Area");
      return;
    }

    const locationData: LocationInput = {
      location_name_en: formData.locationName,
      location_name_ar: formData.locationName,
      city_id: formData.cityId ? Number(formData.cityId) : undefined,
      area_id: formData.areaId ? Number(formData.areaId) : undefined,
      google_map_link: formData.googleMapLink,
      latitude: formData.latitude ? Number(formData.latitude) : undefined,
      longitude: formData.longitude ? Number(formData.longitude) : undefined,
      north_side: formData.northSide || undefined,
      south_side: formData.southSide || undefined,
      east_side: formData.eastSide || undefined,
      west_side: formData.westSide || undefined,
      landmark: formData.landmark,
      description: formData.description || undefined,
    };

    try {
      await addLocation(locationData);
      handleClose();
    } catch (error) {
      console.error("Error adding location:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      locationName: "",
      areaId: "",
      cityId: "",
      googleMapLink: "",
      latitude: "",
      longitude: "",
      northSide: "",
      southSide: "",
      eastSide: "",
      westSide: "",
      landmark: "",
      description: "",
    });
    setGoogleMapsLinkError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Location"
      size="lg"
      showCloseButton={false}
      footer={
        <div className="flex gap-3 justify-end w-full">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleSubmit}
            disabled={isAddingLocation || isProcessing}
          >
            {isAddingLocation ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Location"
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Location Name */}
        <div>
          <Label htmlFor="location-name">
            Location Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="location-name"
            placeholder="e.g. Central Plaza"
            value={formData.locationName}
            onChange={(e) =>
              setFormData({ ...formData, locationName: e.target.value })
            }
            className="mt-1"
          />
        </div>

        {/* Google Maps Link with Extract Button */}
        <div>
          <Label htmlFor="google-map-link">
            Google Maps Link <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-2 mt-1">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="google-map-link"
                placeholder="https://maps.google.com/?q=40.7128,-74.0060"
                value={formData.googleMapLink}
                onChange={(e) => handleGoogleMapLinkChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              type="button"
              onClick={handleExtractLocation}
              disabled={!formData.googleMapLink.trim() || isProcessing}
              className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Extract
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Paste a Google Maps link and click Extract to auto-fill location
            details
          </p>
        </div>

        {/* City and Area Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Select
              value={formData.cityId}
              onValueChange={(value) =>
                setFormData({ ...formData, cityId: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue
                  placeholder={
                    isLoadingCities ? "Loading cities..." : "Select a city"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.value} value={city.value}>
                    {city.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="area">Area</Label>
            <Select
              value={formData.areaId}
              onValueChange={(value) =>
                setFormData({ ...formData, areaId: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue
                  placeholder={
                    isLoadingAreas ? "Loading areas..." : "Select an area"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area.value} value={area.value}>
                    {area.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Coordinates Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              placeholder="e.g. 40.7128"
              value={formData.latitude}
              onChange={(e) =>
                setFormData({ ...formData, latitude: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              placeholder="e.g. -74.0060"
              value={formData.longitude}
              onChange={(e) =>
                setFormData({ ...formData, longitude: e.target.value })
              }
              className="mt-1"
            />
          </div>
        </div>

        {/* Boundaries Section */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            Boundaries
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="north-side">North Side</Label>
              <Input
                id="north-side"
                placeholder="e.g. Main Street"
                value={formData.northSide}
                onChange={(e) =>
                  setFormData({ ...formData, northSide: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="south-side">South Side</Label>
              <Input
                id="south-side"
                placeholder="e.g. Park Avenue"
                value={formData.southSide}
                onChange={(e) =>
                  setFormData({ ...formData, southSide: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="east-side">East Side</Label>
              <Input
                id="east-side"
                placeholder="e.g. River Road"
                value={formData.eastSide}
                onChange={(e) =>
                  setFormData({ ...formData, eastSide: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="west-side">West Side</Label>
              <Input
                id="west-side"
                placeholder="e.g. Highway 101"
                value={formData.westSide}
                onChange={(e) =>
                  setFormData({ ...formData, westSide: e.target.value })
                }
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Landmark */}
        <div>
          <Label htmlFor="landmark" className="flex items-center gap-2">
            <Landmark className="h-4 w-4" />
            Landmark
          </Label>
          <Input
            id="landmark"
            placeholder="e.g. Central Plaza"
            value={formData.landmark}
            onChange={(e) =>
              setFormData({ ...formData, landmark: e.target.value })
            }
            className="mt-1"
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Describe the location..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="mt-1"
            rows={3}
          />
        </div>
      </div>
    </Modal>
  );
}
