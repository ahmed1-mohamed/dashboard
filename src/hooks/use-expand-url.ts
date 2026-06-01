"use client";

import { useMutation } from "@tanstack/react-query";

interface ExpandUrlResponse {
  longUrl: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

export default function useExpandUrl() {
  const mutation = useMutation<Coordinates, Error, string>({
    mutationFn: async (shortUrl: string) => {
      const res = await fetch(
        `/api/expand-url?shortUrl=${encodeURIComponent(shortUrl)}`,
      );
      if (!res.ok) {
        throw new Error("Failed to expand URL");
      }
      const data: ExpandUrlResponse = await res.json();
      const coords = extractCoordinatesFromUrl(data.longUrl);
      if (!coords) {
        throw new Error("Could not extract coordinates from URL");
      }
      return coords;
    },
  });

  return {
    expandUrl: mutation.mutateAsync,
    isExpanding: mutation.isPending,
    error: mutation.error,
  };
}

function extractCoordinatesFromUrl(
  url: string,
): { lat: number; lng: number } | null {
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
}
