"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Building2,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Maximize,
  Calendar,
  User,
  Phone,
  Mail,
  Edit,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { use } from "react";
import { fetchPropertyDetails } from "@/data/api-client";
import { PropertiesDataType } from "@/types";
import { EditPropertyModal } from "@/components/modals/edit-property-modal";

export default function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user.accessToken;
  const queryClient = useQueryClient();

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["propertyDetails", id],
    queryFn: () => fetchPropertyDetails(Number(id), token!),
    select: (data) => {
      // fetchPropertyDetails already returns response.data.data (the property object)
      const property = data;
      if (!property) return null;
      // Transform API response to match UI expectations
      return {
        ...property,
        // Map property_type from object to array format
        property_type: property.property_type ? [property.property_type] : [],
        // Map project from object to array format
        project: property.project ? [property.project] : [],
        // Handle floor (not available in API, set to N/A)
        floor: "N/A",
        // Map zone_name to area_name for UI compatibility
        area_name: property.zone_name || "N/A",
        // Map features to include feature_id if not present
        features: property.features?.map((f: any, index: number) => ({
          ...f,
          feature_id: f.feature_id || index + 1,
        })) || [],
      };
    },
    enabled: !!token,
  });

  // Delete property mutation
  const deletePropertyMutation = useMutation({
    mutationFn: async (propertyId: number) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to delete property");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      router.push("/admin/properties");
    },
  });

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  if (isError)
    return (
      <div className="p-4 text-center text-red-500">
        Error: {(error as Error).message}
      </div>
    );
  if (!data)
    return (
      <div className="p-4 text-center text-gray-500">No data available</div>
    );

  const property = data as PropertiesDataType;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/properties">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {property.property_name}
          </h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <MapPin className="h-4 w-4" />
            {property.area_name || "N/A"}
          </p>
        </div>
        <Badge
          variant={
            property.availability_status === "available"
              ? "success"
              : property.availability_status === "unavailable"
                ? "outline"
                : "warning"
          }
          className="text-sm"
        >
          {property.availability_status}
        </Badge>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={() => setEditModalOpen(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Property
        </Button>
        <Button
          variant="destructive"
          className="ml-auto"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Property Image */}
          <Card>
            <CardContent className="p-0">
              {property.medias && property.medias.length > 0 ? (
                <div className="aspect-video relative">
                  <img
                    src={property.medias[0].media_url}
                    alt={property.property_name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Building2 className="h-24 w-24 text-muted-foreground/20" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: property.description || "No description available",
                }}
              />
            </CardContent>
          </Card>

          {/* Details */}
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
                    <p className="font-semibold">
                      {property.bedrooms || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Bath className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                    <p className="font-semibold">
                      {property.bathrooms || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Maximize className="h-5 w-5 text-primary" />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Area</p>
                    <p className="font-semibold">
                      {property.size ? `${property.size} sqm` : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Floor</p>
                    <p className="font-semibold">{property.floor || "N/A"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities/Features */}
          {property.features && property.features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Features & Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((feature) => (
                    <Badge key={feature.feature_id} variant="secondary">
                      {feature.feature_name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
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

          {/* Property Info */}
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
                    variant={
                      property.status === "active" ? "success" : "outline"
                    }
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
                    <span className="text-muted-foreground">
                      Parking Spaces:
                    </span>
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

          {/* Quick Actions */}
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
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Property</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this property? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deletePropertyMutation.mutate(Number(id));
              }}
              disabled={deletePropertyMutation.isPending}
            >
              {deletePropertyMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Property Modal */}
      {/* <EditPropertyModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        propertyId={Number(id)}
      /> */}
    </div>
  );
}
