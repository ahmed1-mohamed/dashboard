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
import { PropertyMedia } from "@/features/properties/components/property-details/PropertyMedia";
import { PropertyDescription } from "@/features/properties/components/property-details/PropertyDescription";
import { PropertyInfo } from "@/features/properties/components/property-details/PropertyInfo";
import { PropertyFeatures } from "@/features/properties/components/property-details/PropertyFeatures";
import { PropertySidebar } from "@/features/properties/components/property-details/PropertySidebar";

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

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["propertyDetails", id],
    queryFn: () => fetchPropertyDetails(Number(id), token!),
    select: (data) => {
      const property = data as any;
      if (!property) return null;
      return {
        ...property,
        property_type: property?.property_type ? [property.property_type] : [],
        project: property.project ? [property.project] : [],
        floor: "N/A",
        area_name: property.zone_name || "N/A",
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
        <div className="md:col-span-2 space-y-6">
          <PropertyMedia medias={property.medias} propertyName={property.property_name} />
          <PropertyDescription description={property.description} />
          <PropertyInfo 
            bedrooms={property.bedrooms} 
            bathrooms={property.bathrooms} 
            size={property.size} 
            floor={property.floor} 
          />
          <PropertyFeatures features={property.features} />
        </div>

        {/* Sidebar */}
        <PropertySidebar property={property} />
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
