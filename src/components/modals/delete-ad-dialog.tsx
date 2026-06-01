"use client";

import { useState } from "react";
import { ConfirmModal } from "@/components/ui/modal";
import { useSession } from "next-auth/react";
import { deleteAd } from "@/data/api-client";
import { toast } from "sonner";

interface Ad {
  creative_id: string;
  creative_title: string;
  type: string;
  platform: "Web" | "Mobile" | "Both";
  country: string;
  location: string;
  views: number;
  clicks: number;
  ctr: string;
  status: string;
}

interface DeleteAdDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ad: Ad | null;
  onSuccess?: () => void;
}

export function DeleteAdDialog({
  isOpen,
  onClose,
  ad,
  onSuccess,
}: DeleteAdDialogProps) {
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!session?.user?.accessToken || !ad) return;

    setIsDeleting(true);
    try {
      await deleteAd(parseInt(ad.creative_id), session.user.accessToken);
      toast.success("Advertisement deleted successfully!");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Error deleting ad:", error);
      toast.error(
        error?.response?.data?.message || "Failed to delete advertisement",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleDelete}
      title="Delete Advertisement"
      description={
        ad
          ? `Are you sure you want to delete "${ad.creative_title}"? This action cannot be undone.`
          : "Are you sure you want to delete this advertisement? This action cannot be undone."
      }
      confirmText={isDeleting ? "Deleting..." : "Delete"}
      cancelText="Cancel"
      variant="destructive"
      isLoading={isDeleting}
    />
  );
}
