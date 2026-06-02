import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Feature {
  feature_id: number;
  feature_name: string;
}

export function PropertyFeatures({ features }: { features?: Feature[] }) {
  if (!features || features.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Features & Amenities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {features.map((feature) => (
            <Badge key={feature.feature_id} variant="secondary">
              {feature.feature_name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
