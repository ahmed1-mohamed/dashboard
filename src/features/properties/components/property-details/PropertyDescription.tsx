import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function PropertyDescription({ description }: { description?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Description</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="text-muted-foreground leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: description || "No description available",
          }}
        />
      </CardContent>
    </Card>
  );
}
