"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle } from "lucide-react";
import { deleteProjectMedia } from "@/data/api-client";

interface Media {
  media_id: number;
  media_url: string;
  media_type?: string;
}

interface DeleteProjectMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  media: Media | null;
}

export function DeleteProjectMediaModal({
  isOpen,
  onClose,
  projectId,
  media,
}: DeleteProjectMediaModalProps) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user.accessToken;

  const mutation = useMutation({
    mutationFn: () => deleteProjectMedia((media! as any).id || media!.media_id, token!),
    onSuccess: () => {
      toast.success("Media deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projectDetails", String(projectId)],
      });
      onClose();
    },
    onError: (error: any) => {
      console.error("Failed to delete media:", error);
      toast.error(error.message || "Failed to delete media. Please try again.");
    },
  });

  const handleConfirm = () => {
    mutation.mutate();
  };

  if (!isOpen || !media) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Delete Media</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                Are you sure you want to delete this media?
              </p>
              <p className="mt-1 text-sm text-gray-500">
                This action cannot be undone. The media will be permanently
                removed from this project.
              </p>
            </div>
          </div>

          {/* Media Preview */}
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="aspect-video overflow-hidden rounded bg-gray-200">
              <img
                src={media.media_url}
                alt="Media to delete"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={mutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {mutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
