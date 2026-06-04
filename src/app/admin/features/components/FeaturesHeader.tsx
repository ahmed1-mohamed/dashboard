import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FeaturesHeaderProps {
  featuresCount: number;
  onAddFeature: () => void;
}

export function FeaturesHeader({ featuresCount, onAddFeature }: FeaturesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Features Management</h1>
        <Badge
          variant="outline"
          className="bg-purple-100 text-purple-700 border-purple-200 rounded-full px-2"
        >
          {featuresCount}
        </Badge>
      </div>
      <Button
        className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
        onClick={onAddFeature}
      >
        <Plus className="h-4 w-4" />
        Add New Feature
      </Button>
    </div>
  );
}
