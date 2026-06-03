import { Badge } from "@/components/ui/badge";
import { Home } from "lucide-react";
import { Property } from "../../types";

interface UnitsTabProps {
  properties: Property[];
  currency: string;
}

export function UnitsTab({ properties, currency }: UnitsTabProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          Properties/Units ({properties?.length || 0})
        </h3>
      </div>
      {properties && properties.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-gray-200 bg-gray-50 text-gray-900 font-semibold">
              <tr>
                <th className="px-4 py-3">Unit No</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Beds/Baths/Parking</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Availability</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium text-teal-600">
                    {property.property_no}
                  </td>
                  <td className="px-4 py-3">
                    {property.propertytype?.name || "-"} -{" "}
                    {property.propertysubtype?.name || "-"}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {Number(property.price).toLocaleString()} {currency}
                  </td>
                  <td className="px-4 py-3">{property.size} sqm</td>
                  <td className="px-4 py-3 text-gray-500">
                    {property.bedrooms} Beds • {property.bathrooms} Baths •{" "}
                    {property.parking_spaces} P
                  </td>
                  <td className="px-4 py-3">
                    <Badge className="bg-gray-100 text-gray-700 capitalize">
                      {property.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      className={
                        property.availability_status === "available"
                          ? "bg-green-100 text-green-700 capitalize"
                          : "bg-red-100 text-red-700 capitalize"
                      }
                    >
                      {property.availability_status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Home className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            0 units available
          </h3>
          <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">
            No units have been added to this project yet.
          </p>
        </div>
      )}
    </div>
  );
}
