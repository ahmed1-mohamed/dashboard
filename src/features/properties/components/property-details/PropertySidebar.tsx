import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertySidebarProps {
  property: any;
}

export function PropertySidebar({ property }: PropertySidebarProps) {
  return (
    <div className="space-y-6">
      {/* Price Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Price
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">
            {property.price
              ? `AED ${Number(property.price).toLocaleString()}`
              : "N/A"}
          </p>
          <p className="text-sm text-muted-foreground">
            {property.property_type && property.property_type[0]
              ? property.property_type[0].name
              : "Property"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
          <CardDescription>Additional details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge
                variant={property.status === "active" ? "success" : "outline"}
              >
                {property.status}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Furnish Status:</span>
              <span className="font-medium">
                {property.furnish_status || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Construction Status:
              </span>
              <span className="font-medium">
                {property.construction_status || "N/A"}
              </span>
            </div>
            {property.parking_spaces !== undefined && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Parking Spaces:</span>
                <span className="font-medium">
                  {property.parking_spaces}
                </span>
              </div>
            )}
            {property.project && property.project[0] && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Project:</span>
                <span className="font-medium">
                  {property.project[0].project_name}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Viewing
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Phone className="mr-2 h-4 w-4" />
            Contact Agent
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <DollarSign className="mr-2 h-4 w-4" />
            Make Reservation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
