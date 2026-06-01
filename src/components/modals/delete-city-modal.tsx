"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ConfirmModal } from "@/components/ui/modal";
import { deleteCity } from "@/data/api-client";
import { toast } from "sonner";

interface City {
  id: number;
  name: string;
  areaName: string;
  countryName: string;
  locationsCount: number;
  projectsCount: number;
  createdAt: string;
  updatedAt: string;
  status: boolean;
}

interface DeleteCityModalProps {
  city: City | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteCityModal({
  city,
  isOpen,
  onClose,
  onSuccess,
}: DeleteCityModalProps) {
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!session?.user?.accessToken || !city) return;

    try {
      setIsDeleting(true);
      await deleteCity(city.id, session.user.accessToken);
      toast.success("City deleted successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting city:", error);
      toast.error("Failed to delete city");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Delete City"
      description={
        city
          ? `Are you sure you want to delete "${city.name}"? This action cannot be undone.`
          : "Are you sure you want to delete this city? This action cannot be undone."
      }
      confirmText={isDeleting ? "Deleting..." : "Delete"}
      cancelText="Cancel"
      variant="destructive"
      isLoading={isDeleting}
    />
  );
}
