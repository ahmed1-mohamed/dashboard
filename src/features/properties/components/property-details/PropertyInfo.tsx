import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bed, Bath, Maximize, Calendar } from "lucide-react";

interface PropertyInfoProps {
  bedrooms: number | string;
  bathrooms: number | string;
  size: string;
  floor: string;
}

export function PropertyInfo({ bedrooms, bathrooms, size, floor }: PropertyInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bed className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bedrooms</p>
              <p className="font-semibold">{bedrooms || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bath className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bathrooms</p>
              <p className="font-semibold">{bathrooms || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Maximize className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Area</p>
              <p className="font-semibold">{size ? `${size} sqm` : "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Floor</p>
              <p className="font-semibold">{floor || "N/A"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
