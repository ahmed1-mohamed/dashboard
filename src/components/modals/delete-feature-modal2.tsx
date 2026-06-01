"use client";

import { ConfirmModal } from "@/components/ui/modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { deleteFeature } from "@/data/api-client";
import toast from "react-hot-toast";

interface Feature {
  id: number;
  featureName: string;
  isAmenity: boolean;
  icon: string;
}

interface DeleteFeatureModal2Props {
  isOpen: boolean;
  onClose: () => void;
  feature: Feature | null;
}

export function DeleteFeatureModal2({
  isOpen,
  onClose,
  feature,
}: DeleteFeatureModal2Props) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const mutation = useMutation({
    mutationFn: async () => {
      if (!feature || !token) throw new Error("Missing feature or token");
      return deleteFeature(feature.id, token);
    },
    onSuccess: () => {
      toast.success("Feature deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["features"] });
      handleClose();
    },
    onError: () => {
      toast.error("Failed to delete Feature. Please try again.");
    },
  });

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    mutation.mutate();
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title="Delete Feature"
      description={
        feature
          ? `Are you sure you want to delete "${feature.featureName}"? This action cannot be undone.`
          : "Are you sure you want to delete this feature? This action cannot be undone."
      }
      confirmText={mutation.isPending ? "Deleting..." : "Delete"}
      cancelText="Cancel"
      variant="destructive"
      isLoading={mutation.isPending}
    />
  );
}
