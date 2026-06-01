"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddAreaData } from "@/hooks/use-add-area";
import { useCreateArea } from "@/hooks/use-create-area";
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
import { areaSchema, type AreaInput } from "@/validators/area.schema";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { X, MapPin, Loader2, Search } from "lucide-react";

interface AddAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: AreaInput) => void;
}

export function AddAreaModal({ isOpen, onClose, onSubmit }: AddAreaModalProps) {
  const [landmarkInput, setLandmarkInput] = useState("");
  const [googleMapLink, setGoogleMapLink] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const { dldAreas } = useAddAreaData(isOpen);
  const { createArea, isCreating } = useCreateArea();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<AreaInput>({
    resolver: zodResolver(areaSchema),
    defaultValues: {
      area_name: "",
      region: "",
      latitude: undefined,
      longitude: undefined,
      description: "",
      population: undefined,
      dld_area_id: undefined,
      major_landmarks: [],
    },
  });

  const majorLandmarks = watch("major_landmarks") || [];

  const onSubmitForm = async (data: AreaInput) => {
    try {
      await createArea(data);
      handleClose();
      if (onSubmit) {
        onSubmit(data);
      }
    } catch (error) {
      console.error("Failed to create area:", error);
    }
  };

  const handleClose = () => {
    reset();
    setLandmarkInput("");
    setGoogleMapLink("");
    onClose();
  };

  const addLandmark = () => {
    if (landmarkInput.trim()) {
      setValue("major_landmarks", [...majorLandmarks, landmarkInput.trim()]);
      setLandmarkInput("");
    }
  };

  const removeLandmark = (index: number) => {
    const updated = majorLandmarks.filter((_, i) => i !== index);
    setValue("major_landmarks", updated);
  };

  const handleLandmarkKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addLandmark();
    }
  };

  // URL expansion and coordinate extraction logic from projects create page
  const expandShortUrl = async (shortUrl: string): Promise<string | null> => {
    try {
      const res = await fetch(
        `/api/expand-url?shortUrl=${encodeURIComponent(shortUrl)}`,
      );
      const data = await res.json();
      return data.longUrl || null;
    } catch (error) {
      console.error("Error expanding URL:", error);
      return null;
    }
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
  ): Promise<{
    latitude: number;
    longitude: number;
    region: string;
  } | null> => {
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

      const geocodeData = await geocodeResponse.json();

      if (geocodeData.results && geocodeData.results.length > 0) {
        const result = geocodeData.results[0];
        const addressComponents = result.address_components;

        let region = "";

        for (const component of addressComponents) {
          const types = component.types;

          if (types.includes("sublocality") || types.includes("neighborhood")) {
            region = component.long_name;
          } else if (types.includes("locality") && !region) {
            region = component.long_name;
          } else if (types.includes("administrative_area_level_2") && !region) {
            region = component.long_name;
          } else if (types.includes("administrative_area_level_1") && !region) {
            region = component.long_name;
          }
        }

        return {
          latitude: lat,
          longitude: lng,
          region: region || result.formatted_address,
        };
      }

      return null;
    } catch (error) {
      console.error("Error getting location details:", error);
      return null;
    }
  };

  const handleExtractFromGoogleMaps = async () => {
    if (!googleMapLink.trim()) {
      toast.error("Please enter a Google Maps link");
      return;
    }

    setIsExtracting(true);
    try {
      // First try to expand short URL
      let expandedUrl = googleMapLink;
      if (
        googleMapLink.includes("goo.gl") ||
        googleMapLink.includes("maps.app goo.gl")
      ) {
        const expanded = await expandShortUrl(googleMapLink);
        if (expanded) {
          expandedUrl = expanded;
        }
      }

      const coordinates = extractCoordinatesFromUrl(expandedUrl);

      if (!coordinates) {
        toast.error("Invalid Google Maps URL. Please provide a valid link.");
        return;
      }

      const details = await getLocationDetails(
        coordinates.lat,
        coordinates.lng,
      );

      if (details) {
        setValue("latitude", details.latitude);
        setValue("longitude", details.longitude);
        setValue("region", details.region);
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
      setIsExtracting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Area"
      size="md"
      showCloseButton={false}
      footer={
        <div className="flex gap-3 justify-end w-full">
          <Button variant="outline" onClick={handleClose} disabled={isCreating}>
            Close
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleSubmit(onSubmitForm)}
            disabled={isCreating}
          >
            {isCreating ? "Adding..." : "Add Area"}
          </Button>
        </div>
      }
    >
      <div ref={modalContentRef} className="max-h-[70vh] overflow-y-auto pr-2">
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-5">
          {/* Google Maps Link */}
          <div>
            <Label htmlFor="google_map_link">Google Maps Link</Label>
            <div className="flex gap-2 mt-1">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="google_map_link"
                  placeholder="https://maps.google.com"
                  className="pl-10"
                  value={googleMapLink}
                  onChange={(e) => setGoogleMapLink(e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleExtractFromGoogleMaps}
                disabled={isExtracting || !googleMapLink.trim()}
              >
                {isExtracting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Area Name */}
          <div>
            <Label htmlFor="area_name">
              Area Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="area_name"
              placeholder="e.g. Marina"
              {...register("area_name")}
              className="mt-1"
            />
            {errors.area_name && (
              <p className="text-xs text-red-500 mt-1">
                {errors.area_name.message}
              </p>
            )}
          </div>

          {/* Region */}
          <div>
            <Label htmlFor="region">
              Region <span className="text-red-500">*</span>
            </Label>
            <Input
              id="region"
              placeholder="e.g. Dubai Marina"
              {...register("region")}
              className="mt-1"
            />
            {errors.region && (
              <p className="text-xs text-red-500 mt-1">
                {errors.region.message}
              </p>
            )}
          </div>

          {/* Latitude and Longitude Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="e.g. 25.0805"
                {...register("latitude", { valueAsNumber: true })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="e.g. 55.1403"
                {...register("longitude", { valueAsNumber: true })}
                className="mt-1"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="e.g. Waterfront community"
              {...register("description")}
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Population and DLD Area ID Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="population">Population</Label>
              <Input
                id="population"
                type="number"
                placeholder="e.g. 120000"
                {...register("population", { valueAsNumber: true })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="dld_area_id">DLD Area</Label>
              <Controller
                name="dld_area_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) =>
                      field.onChange(value ? Number(value) : undefined)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select DLD Area" />
                    </SelectTrigger>
                    <SelectContent>
                      {dldAreas.map((area) => (
                        <SelectItem
                          key={area.area_id}
                          value={String(area.area_id)}
                        >
                          {area.area_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Major Landmarks */}
          <div>
            <Label htmlFor="major_landmarks">Major Landmarks</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="major_landmarks"
                placeholder="e.g. Marina Mall"
                value={landmarkInput}
                onChange={(e) => setLandmarkInput(e.target.value)}
                onKeyDown={handleLandmarkKeyDown}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addLandmark}
                disabled={!landmarkInput.trim()}
              >
                Add
              </Button>
            </div>
            {majorLandmarks.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {majorLandmarks.map((landmark, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-sm"
                  >
                    {landmark}
                    <button
                      type="button"
                      onClick={() => removeLandmark(index)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
}
