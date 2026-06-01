"use client";

import { ConfirmModal } from "@/components/ui/modal";

interface DeleteFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  feature: {
    feature_id: number;
    feature_name: string;
    value?: string | null;
    description?: string | null;
    is_amenity?: number;
    icons?: string | null;
  } | null;
  isDeleting?: boolean;
}

export function DeleteFeatureModal({
  isOpen,
  onClose,
  onConfirm,
  feature,
  isDeleting = false,
}: DeleteFeatureModalProps) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Feature"
      description={
        feature
          ? `Are you sure you want to delete "${feature.feature_name}"? This action cannot be undone.`
          : "Are you sure you want to delete this feature? This action cannot be undone."
      }
      confirmText={isDeleting ? "Deleting..." : "Delete"}
      cancelText="Cancel"
      variant="destructive"
      isLoading={isDeleting}
    />
  );
}
