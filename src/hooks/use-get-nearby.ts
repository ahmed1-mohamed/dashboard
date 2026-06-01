"use client";

import { useMutation } from "@tanstack/react-query";

interface DirectionalReferencesResponse {
  north: string;
  south: string;
  east: string;
  west: string;
}

export default function useGetNearby() {
  const mutation = useMutation<DirectionalReferencesResponse, Error, {
    lat: number;
    lng: number;
  }>({
    mutationFn: async ({ lat, lng }) => {
      const res = await fetch(`/api/get-nearby?lat=${lat}&lng=${lng}`);
      if (!res.ok) {
        throw new Error("Failed to get nearby locations");
      }
      const data: DirectionalReferencesResponse = await res.json();
      return data;
    },
  });

  return {
    getNearby: mutation.mutateAsync,
    isFetching: mutation.isPending,
    error: mutation.error,
  };
}
