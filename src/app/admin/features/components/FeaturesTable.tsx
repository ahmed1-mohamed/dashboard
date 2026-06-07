import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableActions } from "@/components/table/table-actions";
import { useTableSettings } from "@/hooks/use-table-settings";

export interface Feature {
  id: number;
  featureName: string;
  isAmenity: boolean;
  icon: string;
}

interface FeaturesTableProps {
  settings: ReturnType<typeof useTableSettings>;
  features: Feature[];
  selectedFeatures: number[];
  handleSelectAll: (checked: boolean) => void;
  handleSelectFeature: (id: number, checked: boolean) => void;
  onView: (feature: Feature) => void;
  onEdit: (feature: Feature) => void;
  onDelete: (feature: Feature) => void;
}

export function FeaturesTable({
  settings,
  features,
  selectedFeatures,
  handleSelectAll,
  handleSelectFeature,
  onView,
  onEdit,
  onDelete,
}: FeaturesTableProps) {
  const getDensityClass = () => {
    switch (settings.settings.density) {
      case "compact": return "py-1.5 px-2";
      case "spacious": return "py-4 px-2";
      case "comfortable":
      default: return "py-2.5 px-2";
    }
  };

  const densityClass = getDensityClass();

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="font-semibold text-gray-900 w-[50px] px-2">
              <Checkbox
                checked={
                  features.length > 0 &&
                  selectedFeatures.length === features.length
                }
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            {settings.isColumnVisible("id") && (
              <TableHead className="font-semibold text-gray-900 w-[80px] px-2">ID</TableHead>
            )}
            {settings.isColumnVisible("featureName") && (
              <TableHead className="font-semibold text-gray-900 px-2">Feature Name</TableHead>
            )}
            {settings.isColumnVisible("isAmenity") && (
              <TableHead className="font-semibold text-gray-900 w-[120px] px-2">Is Amenity</TableHead>
            )}
            {settings.isColumnVisible("icon") && (
              <TableHead className="font-semibold text-gray-900 w-[100px] px-2">Icon</TableHead>
            )}
            {settings.isColumnVisible("actions") && (
              <TableHead className="font-semibold text-gray-900 text-center w-[80px] px-2">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center text-gray-500"
              >
                No features found.
              </TableCell>
            </TableRow>
          ) : (
            features.map((feature) => (
              <TableRow key={feature.id}>
                <TableCell className={`px-2 ${densityClass}`}>
                  <Checkbox
                    checked={selectedFeatures.includes(feature.id)}
                    onCheckedChange={(checked) =>
                      handleSelectFeature(feature.id, checked as boolean)
                    }
                  />
                </TableCell>
                {settings.isColumnVisible("id") && (
                  <TableCell className={`text-gray-900 px-2 text-sm ${densityClass}`}>
                    {feature.id}
                  </TableCell>
                )}
                {settings.isColumnVisible("featureName") && (
                  <TableCell className={`px-2 text-sm font-semibold ${densityClass}`}>
                    <span 
                      onClick={() => onView(feature)}
                      className="cursor-pointer text-[#15042B] hover:text-[#007A55] transition-colors duration-200"
                    >
                      {feature.featureName}
                    </span>
                  </TableCell>
                )}
                {settings.isColumnVisible("isAmenity") && (
                  <TableCell className={`px-2 ${densityClass}`}>
                    {feature.isAmenity ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        No
                      </span>
                    )}
                  </TableCell>
                )}
                {settings.isColumnVisible("icon") && (
                  <TableCell className={`text-gray-900 px-2 text-sm ${densityClass}`}>
                    {feature.icon || "-"}
                  </TableCell>
                )}
                {settings.isColumnVisible("actions") && (
                  <TableCell className={`text-center px-2 ${densityClass}`}>
                    <TableActions
                      onView={() => onView(feature)}
                      onEdit={() => onEdit(feature)}
                      onDelete={() => onDelete(feature)}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
