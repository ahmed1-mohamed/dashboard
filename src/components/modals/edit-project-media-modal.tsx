"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { X, Image as ImageIcon, Video } from "lucide-react";
import { editProjectMedia } from "@/data/api-client";

interface Media {
  media_id: number;
  media_url: string;
  media_type: string;
  description?: string;
  is_primary?: number | boolean;
  my_order?: number | boolean;
}

interface EditProjectMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  media: Media | null;
}

export function EditProjectMediaModal({
  isOpen,
  onClose,
  projectId,
  media,
}: EditProjectMediaModalProps) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user.accessToken;

  const [description, setDescription] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [myOrder, setMyOrder] = useState(false);

  useEffect(() => {
    if (media) {
      setDescription(media.description || "");
      setIsPrimary(Boolean(media.is_primary));
      setMyOrder(Boolean(media.my_order));
    }
  }, [media]);

  const mutation = useMutation({
    mutationFn: (data: any) => editProjectMedia(media!.media_id, data, token!),
    onSuccess: () => {
      toast.success("Media updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projectDetails", String(projectId)],
      });
      onClose();
    },
    onError: (error: any) => {
      console.error("Update error:", error);
      toast.error(error.message || "Failed to update media. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      description: description.trim(),
      is_primary: isPrimary,
      my_order: myOrder,
    };
    mutation.mutate(payload);
  };

  if (!isOpen || !media) return null;
  const isVideo = media.media_type === "video";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Edit Media</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Media Preview */}
          <div className="mb-4">
            <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
              {isVideo ? (
                <video
                  src={media.media_url}
                  className="h-full w-full object-cover"
                  controls
                />
              ) : (
                <img
                  src={media.media_url}
                  alt="Media preview"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              {isVideo ? (
                <Video className="h-4 w-4" />
              ) : (
                <ImageIcon className="h-4 w-4" />
              )}
              <span className="capitalize">{media.media_type}</span>
            </div>
          </div>
          {/* Description */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          {/* Options */}
          <div className="mb-4 space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm">Set as primary image</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={myOrder}
                onChange={(e) => setMyOrder(e.target.checked)}
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm">Include in media order</span>
            </label>
          </div>
          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
