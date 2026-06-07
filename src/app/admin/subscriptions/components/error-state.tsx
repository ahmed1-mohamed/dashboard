import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ErrorState = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="bg-red-50 p-4 rounded-full mb-4">
      <AlertCircle className="w-8 h-8 text-red-500" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Failed to load data
    </h3>
    <p className="text-gray-500 mb-4 max-w-md">{error}</p>
    <Button onClick={onRetry} variant="outline" className="gap-2">
      <RefreshCw className="w-4 h-4" />
      Try Again
    </Button>
  </div>
);
