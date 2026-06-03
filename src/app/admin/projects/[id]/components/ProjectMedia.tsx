"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Video as VideoIcon, Image as ImageIcon } from "lucide-react";
import { Media } from "../types";
import { AddProjectMediaModal } from "@/components/modals/add-project-media-modal";
import { DeleteProjectMediaModal } from "@/components/modals/delete-project-media-modal";

// import { EditProjectMediaModal } from "@/components/modals/edit-project-media-modal";

interface ProjectMediaProps {
  projectId: number;
  medias: Media[];
}

export function ProjectMedia({ projectId, medias }: ProjectMediaProps) {
  const [isAddMediaModalOpen, setIsAddMediaModalOpen] = useState(false);
  // const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  // const [isEditMediaModalOpen, setIsEditMediaModalOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<Media | null>(null);
  const [isDeleteMediaModalOpen, setIsDeleteMediaModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Project Media ({medias?.length || 0})
        </h3>
        <Button
          onClick={() => setIsAddMediaModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Media
        </Button>
      </div>

      {medias && medias.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {medias.map((media, index) => (
            <div
              key={media.media_id || index}
              className="group relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
            >
              {media.media_type === "video" ? (
                <video
                  src={media.media_url}
                  className="h-full w-full object-cover"
                  controls
                />
              ) : (
                <img
                  src={media.media_url}
                  alt={media.description || "Project media"}
                  className="h-full w-full object-cover"
                />
              )}

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    // setEditingMedia(media);
                    // setIsEditMediaModalOpen(true);
                  }}
                  className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setMediaToDelete(media);
                    setIsDeleteMediaModalOpen(true);
                  }}
                  className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Media type badge */}
              <div className="absolute top-2 left-2">
                {media.media_type === "video" ? (
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded flex items-center gap-1">
                    <VideoIcon className="h-3 w-3" />
                    Video
                  </span>
                ) : media.media_type === "floor_plan" ? (
                  <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
                    Floor Plan
                  </span>
                ) : media.media_type === "3D_tour" ? (
                  <span className="px-2 py-1 bg-orange-600 text-white text-xs rounded">
                    3D Tour
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-teal-600 text-white text-xs rounded flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" />
                    Image
                  </span>
                )}
              </div>

              {/* Primary badge */}
              {media.is_primary === 1 && (
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded">
                    Primary
                  </span>
                </div>
              )}

              {/* Description */}
              {media.description && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                  <p className="text-white text-xs truncate">
                    {media.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>No media added yet. Click "Add Media" to get started.</p>
        </div>
      )}

      {/* Media Modals */}
      <AddProjectMediaModal
        isOpen={isAddMediaModalOpen}
        onClose={() => setIsAddMediaModalOpen(false)}
        projectId={projectId}
      />
      
      {/* <EditProjectMediaModal
        isOpen={isEditMediaModalOpen}
        onClose={() => {
          setIsEditMediaModalOpen(false);
          setEditingMedia(null);
        }}
        projectId={projectId}
        media={editingMedia}
      /> */}

      <DeleteProjectMediaModal
        isOpen={isDeleteMediaModalOpen}
        onClose={() => {
          setIsDeleteMediaModalOpen(false);
          setMediaToDelete(null);
        }}
        projectId={projectId}
        media={mediaToDelete}
      />
    </div>
  );
}
