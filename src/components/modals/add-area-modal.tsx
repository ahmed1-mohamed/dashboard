"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateArea } from "@/hooks/use-create-area";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { areaSchema, type AreaInput } from "@/validators/area.schema";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { MapPin, Loader2, Search } from "lucide-react";

interface AddAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: AreaInput) => void;
}

export function AddAreaModal({ isOpen, onClose, onSubmit }: AddAreaModalProps) {
  const [googleMapLink, setGoogleMapLink] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const { createArea, isCreating } = useCreateArea();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AreaInput>({
    resolver: zodResolver(areaSchema),
    defaultValues: {
      dld_area_name: "",
      latitude: undefined,
      longitude: undefined,
      description: "",
    },
  });

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
    setGoogleMapLink("");
    onClose();
  };

  // URL expansion and coordinate extraction logic
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

      setValue("latitude", coordinates.lat);
      setValue("longitude", coordinates.lng);
      toast.success("Coordinates extracted successfully!");
      
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
            <Label htmlFor="dld_area_name">
              Area Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dld_area_name"
              placeholder="e.g. Marina"
              {...register("dld_area_name")}
              className="mt-1"
            />
            {errors.dld_area_name && (
              <p className="text-xs text-red-500 mt-1">
                {errors.dld_area_name.message}
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
        </form>
      </div>
    </Modal>
  );
}
