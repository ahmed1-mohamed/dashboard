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

export interface Feature {
  id: number;
  featureName: string;
  isAmenity: boolean;
  icon: string;
}

interface FeaturesTableProps {
  features: Feature[];
  selectedFeatures: number[];
  handleSelectAll: (checked: boolean) => void;
  handleSelectFeature: (id: number, checked: boolean) => void;
  onView: (feature: Feature) => void;
  onEdit: (feature: Feature) => void;
  onDelete: (feature: Feature) => void;
}

export function FeaturesTable({
  features,
  selectedFeatures,
  handleSelectAll,
  handleSelectFeature,
  onView,
  onEdit,
  onDelete,
}: FeaturesTableProps) {
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
            <TableHead className="font-semibold text-gray-900 w-[80px] px-2">
              ID
            </TableHead>
            <TableHead className="font-semibold text-gray-900 px-2">
              Feature Name
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[120px] px-2">
              Is Amenity
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[100px] px-2">
              Icon
            </TableHead>
            <TableHead className="font-semibold text-gray-900 text-center w-[80px] px-2">
              Actions
            </TableHead>
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
                <TableCell className="px-2">
                  <Checkbox
                    checked={selectedFeatures.includes(feature.id)}
                    onCheckedChange={(checked) =>
                      handleSelectFeature(feature.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell className="text-gray-900 px-2 text-sm">
                  {feature.id}
                </TableCell>
                <TableCell className="px-2 text-sm font-semibold">
                  <span 
                    onClick={() => onView(feature)}
                    className="cursor-pointer text-[#15042B] hover:text-[#007A55] transition-colors duration-200"
                  >
                    {feature.featureName}
                  </span>
                </TableCell>
                <TableCell className="px-2">
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
                <TableCell className="text-gray-900 px-2 text-sm">
                  {feature.icon || "-"}
                </TableCell>
                <TableCell className="text-center px-2">
                  <TableActions
                    onView={() => onView(feature)}
                    onEdit={() => onEdit(feature)}
                    onDelete={() => onDelete(feature)}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
