"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface OffersLoadingProps {
  message?: string;
}

interface OffersErrorProps {
  error: unknown;
  onRetry: () => void;
}

export function OffersLoading({ message = "Loading offers..." }: OffersLoadingProps) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center space-y-3">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent" />
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    </div>
  );
}

export function OffersError({ error, onRetry }: OffersErrorProps) {
  const message =
    error instanceof Error ? error.message : "Failed to load offers";
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
        <p className="text-sm text-red-800">
          <strong>Error:</strong> {message}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="mt-3 border-red-200 text-red-700 hover:bg-red-100"
      >
        Try Again
      </Button>
    </div>
  );
}
