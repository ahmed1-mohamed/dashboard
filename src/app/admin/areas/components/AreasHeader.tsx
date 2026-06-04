import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface AreasHeaderProps {
  totalAreas: number;
  onAddArea: () => void;
}

export function AreasHeader({ totalAreas, onAddArea }: AreasHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-[#15042B]">Areas Management</h1>
        <Badge
          variant="outline"
          className="bg-purple-100 text-purple-700 border-purple-200 rounded-full px-2"
        >
          {totalAreas}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <Button
          className="bg-teal-600 hover:bg-teal-700 text-white gap-2 w-full sm:w-auto"
          onClick={onAddArea}
        >
          <Plus className="h-4 w-4" />
          Add New Area
        </Button>
      </div>
    </div>
  );
}
