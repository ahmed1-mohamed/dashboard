import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectsErrorProps {
  error: unknown;
  onRetry: () => void;
}

export function ProjectsError({ error, onRetry }: ProjectsErrorProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <p className="text-sm text-red-800">
          <strong>Error:</strong>{" "}
          {error instanceof Error ? error.message : "Failed to load projects"}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="mt-2 border-red-200 text-red-700 hover:bg-red-100"
      >
        Try Again
      </Button>
    </div>
  );
}
