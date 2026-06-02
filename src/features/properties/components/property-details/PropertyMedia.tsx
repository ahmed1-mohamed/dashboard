import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";

interface Media {
  media_url: string;
}

export function PropertyMedia({ medias, propertyName }: { medias?: Media[], propertyName: string }) {
  return (
    <Card>
      <CardContent className="p-0">
        {medias && medias.length > 0 ? (
          <div className="aspect-video relative">
            <img
              src={medias[0].media_url}
              alt={propertyName}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ) : (
          <div className="aspect-video bg-muted flex items-center justify-center rounded-lg">
            <Building2 className="h-24 w-24 text-muted-foreground/20" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
