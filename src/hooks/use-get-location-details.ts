"use client";

import { useMutation } from "@tanstack/react-query";

interface GeocodeResponse {
  results: Array<{
    formatted_address: string;
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
  }>;
  status: string;
}

export default function useGetLocationDetails() {
  const mutation = useMutation<GeocodeResponse, Error, {
    lat: number;
    lng: number;
  }>({
    mutationFn: async ({ lat, lng }) => {
      const API_KEY = "AIzaSyA7pPVZpga50Hvurvanqkal3QEF9LPbG-g";
      if (!API_KEY) {
        throw new Error("Google Maps API key not found");
      }

      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`,
      );

      if (!res.ok) {
        throw new Error("Failed to fetch location data");
      }

      const data: GeocodeResponse = await res.json();
      return data;
    },
  });

  return {
    getLocationDetails: mutation.mutateAsync,
    isFetching: mutation.isPending,
    error: mutation.error,
  };
}
