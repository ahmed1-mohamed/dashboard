"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Video as VideoIcon, Image as ImageIcon } from "lucide-react";
import { Media } from "../types";
import { AddProjectMediaModal } from "@/components/modals/add-project-media-modal";
import { DeleteProjectMediaModal } from "@/components/modals/delete-project-media-modal";

import { EditProjectMediaModal } from "@/components/modals/edit-project-media-modal";

interface ProjectMediaProps {
  projectId: number;
  medias: Media[];
}

export function ProjectMedia({ projectId, medias }: ProjectMediaProps) {
  const [isAddMediaModalOpen, setIsAddMediaModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [isEditMediaModalOpen, setIsEditMediaModalOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<Media | null>(null);
  const [isDeleteMediaModalOpen, setIsDeleteMediaModalOpen] = useState(false);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          Project Media <span className="text-slate-500 font-medium text-sm ml-2">({medias?.length || 0})</span>
        </h3>
        <Button
          onClick={() => setIsAddMediaModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm hover:shadow-md transition-all gap-2 rounded-full px-5"
        >
          <Plus className="h-4 w-4" />
          Add Media
        </Button>
      </div>

      {medias && medias.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {medias.map((media, index) => (
            <div
              key={media.media_id || index}
              className="group relative aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200/50"
            >
              {media.media_type === "video" ? (
                <video
                  src={media.media_url}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  controls
                />
              ) : (
                <img
                  src={media.media_url}
                  alt={media.description || "Project media"}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                <button
                  onClick={() => {
                    setEditingMedia(media);
                    setIsEditMediaModalOpen(true);
                  }}
                  className="p-2.5 bg-white/90 hover:bg-white text-slate-700 hover:text-teal-600 rounded-full shadow-sm transition-all hover:scale-110"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setMediaToDelete(media);
                    setIsDeleteMediaModalOpen(true);
                  }}
                  className="p-2.5 bg-white/90 hover:bg-white text-red-600 hover:text-red-700 rounded-full shadow-sm transition-all hover:scale-110"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Media type badge */}
              <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
                {media.media_type === "video" ? (
                  <span className="px-2.5 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-medium rounded-md shadow-sm flex items-center gap-1.5">
                    <VideoIcon className="h-3.5 w-3.5" />
                    Video
                  </span>
                ) : media.media_type === "floor_plan" ? (
                  <span className="px-2.5 py-1 bg-purple-600/90 backdrop-blur-sm text-white text-xs font-medium rounded-md shadow-sm">
                    Floor Plan
                  </span>
                ) : media.media_type === "3D_tour" ? (
                  <span className="px-2.5 py-1 bg-amber-600/90 backdrop-blur-sm text-white text-xs font-medium rounded-md shadow-sm">
                    3D Tour
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-slate-800/80 backdrop-blur-sm text-white text-xs font-medium rounded-md shadow-sm flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5" />
                    Image
                  </span>
                )}
                {/* Primary badge */}
                {media.is_primary === 1 && (
                  <span className="px-2.5 py-1 bg-yellow-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-md shadow-sm w-fit">
                    Primary
                  </span>
                )}
              </div>

              {/* Description */}
              {media.description && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent p-4 pt-8">
                  <p className="text-white text-xs font-medium line-clamp-2 leading-relaxed">
                    {media.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
            <ImageIcon className="h-8 w-8 text-slate-300" />
          </div>
          <h4 className="text-slate-700 font-medium mb-1">No media found</h4>
          <p className="text-slate-500 text-sm mb-4">Upload images or videos to showcase this project.</p>
          <Button
            onClick={() => setIsAddMediaModalOpen(true)}
            variant="outline"
            className="text-teal-600 border-teal-200 hover:bg-teal-50 rounded-full px-6"
          >
            Upload Media
          </Button>
        </div>
      )}

      {/* Media Modals */}
      <AddProjectMediaModal
        isOpen={isAddMediaModalOpen}
        onClose={() => setIsAddMediaModalOpen(false)}
        projectId={projectId}
      />
      
      <EditProjectMediaModal
        isOpen={isEditMediaModalOpen}
        onClose={() => {
          setIsEditMediaModalOpen(false);
          setEditingMedia(null);
        }}
        projectId={projectId}
        media={editingMedia}
      />

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
