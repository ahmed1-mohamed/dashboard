"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ConfirmModal } from "@/components/ui/modal";
import { deleteLocation } from "@/data/api-client";
import { toast } from "sonner";

interface Location {
  location_id: number;
  location_landmark: string;
  city_name: string;
  country_name: string;
  area_name: string;
  created_at: string;
  projects_count: number;
}

interface DeleteLocationModalProps {
  location: Location | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteLocationModal({
  location,
  isOpen,
  onClose,
  onSuccess,
}: DeleteLocationModalProps) {
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!session?.user?.accessToken || !location) return;

    try {
      setIsDeleting(true);
      await deleteLocation(location.location_id, session.user.accessToken);
      toast.success("Location deleted successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting location:", error);
      toast.error("Failed to delete location");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Delete Location"
      description={
        location
          ? `Are you sure you want to delete "${location.location_landmark}"? This action cannot be undone.`
          : "Are you sure you want to delete this location? This action cannot be undone."
      }
      confirmText={isDeleting ? "Deleting..." : "Delete"}
      cancelText="Cancel"
      variant="destructive"
      isLoading={isDeleting}
    />
  );
}
