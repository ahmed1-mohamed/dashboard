"use client";

import { use, useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import {
  X,
  Upload,
  Video,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import imageCompression from "browser-image-compression";
import { addProjectMedia } from "@/data/api-client";

interface MediaItem {
  file?: File;
  originalFile?: File;
  description: string;
  is_primary: boolean;
  my_order: boolean;
  preview: string;
  isProcessed: boolean;
  media_type: "image" | "video" | "floor_plan" | "3D_tour";
  media_url?: string;
  originalSize?: number;
  compressedSize?: number;
  resizedWidth?: number;
  resizedHeight?: number;
}

interface ProcessingConfig {
  enabled: boolean;
  imageSize: { width: number; height: number };
  maxSizeMB: number;
  quality: number;
  watermarkEnabled: boolean;
  watermarkOpacity: number;
  watermarkPosition:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center";
  maintainAspectRatio: boolean;
  watermarkSize: number;
}

interface AddProjectMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
}

export function AddProjectMediaModal({
  isOpen,
  onClose,
  projectId,
}: AddProjectMediaModalProps) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user.accessToken;

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoLink, setVideoLink] = useState("");
  const [watermarkLoaded, setWatermarkLoaded] = useState(false);
  const [watermarkImage, setWatermarkImage] = useState<HTMLImageElement | null>(
    null,
  );
  const [selectedMediaType, setSelectedMediaType] = useState<string>("image");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const config: ProcessingConfig = {
    enabled: true,
    imageSize: { width: 1024, height: 768 },
    maxSizeMB: 0.5,
    quality: 85,
    watermarkEnabled: true,
    watermarkOpacity: 100,
    watermarkPosition: "bottom-right",
    maintainAspectRatio: false,
    watermarkSize: 30,
  };

  const mutation = useMutation({
    mutationFn: (data: any) => addProjectMedia(data, token!),
    onSuccess: () => {
      toast.success("Media uploaded successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projectDetails", String(projectId)],
      });
      setMediaItems([]);
      onClose();
    },
    onError: (error: any) => {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload media. Please try again.");
    },
  });

  // Load watermark image
  useEffect(() => {
    if (!isOpen) return;

    const loadWatermarkImage = () => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        setWatermarkImage(img);
        setWatermarkLoaded(true);
      };
      img.onerror = () => {
        setWatermarkLoaded(false);
      };
      img.src = "/logo_media.png";
    };

    if (config.watermarkEnabled) {
      loadWatermarkImage();
    }
  }, [isOpen, config.watermarkEnabled]);

  function resizeImageDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth = 1024,
    maxHeight = 768,
  ): { width: number; height: number } {
    const widthRatio = originalWidth / maxWidth;
    const heightRatio = originalHeight / maxHeight;
    const ratio = Math.min(widthRatio, heightRatio);

    if (
      Math.round(originalHeight + originalHeight * ratio) > 768 &&
      Math.round(originalWidth + originalWidth * ratio) > 1024
    ) {
      return { width: 1024, height: 768 };
    }
    if (Math.round(originalHeight + originalHeight * ratio) > 768) {
      return {
        width: Math.round(originalWidth + originalWidth * ratio),
        height: 768,
      };
    }
    if (Math.round(originalWidth + originalWidth * ratio) > 1024) {
      return {
        width: 1024,
        height: Math.round(originalHeight + originalHeight * ratio),
      };
    }
    return {
      width: Math.round(originalWidth + originalWidth * ratio),
      height: Math.round(originalHeight + originalHeight * ratio),
    };
  }

  const processImage = useCallback(
    async (
      file: File,
    ): Promise<{ file: File; width: number; height: number }> => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");

        const originalImage = await new Promise<HTMLImageElement>(
          (resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
          },
        );

        const { width: newWidth, height: newHeight } = resizeImageDimensions(
          originalImage.width,
          originalImage.height,
          config.imageSize.width,
          config.imageSize.height,
        );

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.fillStyle = "transparent";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

        if (config.watermarkEnabled && watermarkImage && watermarkLoaded) {
          ctx.globalAlpha = config.watermarkOpacity / 100;
          const watermarkWidth = 500;
          const watermarkHeight = 300;
          let x = 0,
            y = 0;
          const margin = 20;

          switch (config.watermarkPosition) {
            case "top-left":
              x = margin;
              y = margin;
              break;
            case "top-right":
              x = canvas.width - watermarkWidth - margin;
              y = margin;
              break;
            case "bottom-left":
              x = margin;
              y = canvas.height - watermarkHeight - margin;
              break;
            case "bottom-right":
              x = canvas.width - watermarkWidth - margin;
              y = canvas.height - watermarkHeight - margin;
              break;
            case "center":
              x = (canvas.width - watermarkWidth) / 2;
              y = (canvas.height - watermarkHeight) / 2;
              break;
          }
          ctx.drawImage(watermarkImage, x, y, watermarkWidth, watermarkHeight);
          ctx.globalAlpha = 1.0;
        }

        const processedBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (blob) =>
              blob ? resolve(blob) : reject(new Error("Failed to create blob")),
            "image/jpeg",
            config.quality / 100,
          );
        });

        let finalBlob = processedBlob;
        if (processedBlob.size > config.maxSizeMB * 1024 * 1024) {
          const tempFile = new File([processedBlob], file.name, {
            type: "image/jpeg",
          });
          const compressedFile = await imageCompression(tempFile, {
            maxSizeMB: config.maxSizeMB,
            maxWidthOrHeight: Math.max(
              config.imageSize.width,
              config.imageSize.height,
            ),
            useWebWorker: true,
            initialQuality: (config.quality - 10) / 100,
            fileType: "image/jpeg",
          });
          finalBlob = compressedFile;
        }

        const processedFile = new File([finalBlob], file.name, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });

        URL.revokeObjectURL(originalImage.src);
        return { file: processedFile, width: newWidth, height: newHeight };
      } catch (error) {
        console.error("Image processing error:", error);
        toast.error("Failed to process image. Using original file.");
        return { file, width: 0, height: 0 };
      }
    },
    [config, watermarkImage, watermarkLoaded],
  );

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || !selectedMediaType) return;

      const validFiles = Array.from(files).filter((file) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
          toast.error(`${file.name} is not a valid image file`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;
      if (
        config.watermarkEnabled &&
        !watermarkLoaded &&
        selectedMediaType === "image"
      ) {
        toast.error("Watermark is enabled but not loaded. Please wait.");
        return;
      }

      setIsProcessing(true);
      try {
        const processedItems: MediaItem[] = [];
        for (const file of validFiles) {
          const originalSize = file.size;
          const processedFile =
            config.enabled && selectedMediaType === "image"
              ? await processImage(file).then((p) => p.file)
              : file;

          const { width: w, height: h } =
            config.enabled && selectedMediaType === "image"
              ? await processImage(file)
              : { width: 0, height: 0 };

          const preview = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(processedFile);
          });

          const newMediaItem: MediaItem = {
            file: processedFile,
            originalFile: file,
            description: "",
            is_primary: false,
            my_order: false,
            preview,
            isProcessed: config.enabled && selectedMediaType === "image",
            media_type: selectedMediaType as MediaItem["media_type"],
            originalSize,
            compressedSize: processedFile.size,
            resizedWidth: w,
            resizedHeight: h,
          };
          processedItems.push(newMediaItem);
        }
        setMediaItems((prev) => [...prev, ...processedItems]);
        toast.success(
          `${processedItems.length} file(s) processed successfully!`,
        );
      } catch (error) {
        toast.error("Error processing images");
        console.error("Processing error:", error);
      } finally {
        setIsProcessing(false);
      }
    },
    [
      config.enabled,
      config.watermarkEnabled,
      watermarkLoaded,
      processImage,
      selectedMediaType,
    ],
  );

  const handleVideoLink = () => {
    if (!videoLink.trim()) {
      toast.error("Please enter a valid video URL");
      return;
    }
    try {
      new URL(videoLink);
    } catch {
      toast.error("Please enter a valid URL format");
      return;
    }

    const newMediaItem: MediaItem = {
      description: "",
      is_primary: false,
      my_order: false,
      preview: "/videoo.png",
      isProcessed: false,
      media_url: videoLink,
      media_type: "video",
    };

    setMediaItems((prev) => [...prev, newMediaItem]);
    setVideoLink("");
    toast.success("Video link added successfully!");
  };

  const updateMediaItem = (
    index: number,
    field: keyof MediaItem,
    value: any,
  ) => {
    setMediaItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const removeMediaItem = (index: number) => {
    setMediaItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mediaItems.length === 0) {
      toast.error("Please select at least one image or add a video link");
      return;
    }

    const formData = new FormData();
    formData.append("project_id", projectId.toString());

    const imageItems = mediaItems.filter(
      (item) =>
        item.media_type === "image" ||
        item.media_type === "floor_plan" ||
        item.media_type === "3D_tour",
    );
    const videoItems = mediaItems.filter((item) => item.media_type === "video");
    const orderedItems = [...imageItems, ...videoItems];

    imageItems.forEach((item) => {
      if (item.file) {
        formData.append("medias[]", item.file);
      }
    });

    const mediaMeta = orderedItems.map((item) => ({
      description: item.description,
      is_primary: item.is_primary ? 1 : 0,
      my_order: item.my_order ? 1 : 0,
      media_type: item.media_type,
      ...(item.media_type === "video" && { media_url: item.media_url }),
    }));
    formData.append("media_meta", JSON.stringify(mediaMeta));

    mutation.mutate(formData as any);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Add Project Media</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
            aria-label="Close"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Media Type Selection */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">Media Type</label>
            <div className="flex gap-2">
              {[
                { value: "image", label: "Image", icon: ImageIcon },
                { value: "floor_plan", label: "Floor Plan", icon: ImageIcon },
                { value: "3D_tour", label: "3D Tour", icon: ImageIcon },
                { value: "video", label: "Video", icon: Video },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setSelectedMediaType(type.value)}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2 ${
                    selectedMediaType === type.value
                      ? "border-teal-600 bg-teal-50 text-teal-600"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <type.icon className="h-4 w-4" />
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* File Upload */}
          {selectedMediaType !== "video" && (
            <div className="mb-4">
              <label htmlFor="file-upload">
                <input
                  id="file-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
                <span className="cursor-pointer">Upload Images</span>
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-8 hover:border-teal-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <Upload className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">
                  {isProcessing ? "Processing..." : "Click to upload images"}
                </span>
              </button>
            </div>
          )}

          {/* Video Link */}
          {selectedMediaType === "video" && (
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Video URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  placeholder="Enter video URL"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Button
                  type="button"
                  onClick={handleVideoLink}
                  disabled={!videoLink.trim()}
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Add Video
                </Button>
              </div>
            </div>
          )}

          {/* Media Items Preview */}
          {mediaItems.length > 0 && (
            <div className="mb-4">
              <h3 className="mb-2 text-sm font-medium">
                Selected Media ({mediaItems.length})
              </h3>
              <div className="max-h-60 space-y-3 overflow-y-auto">
                {mediaItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg border p-2"
                  >
                    <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                      <img
                        src={item.preview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) =>
                          updateMediaItem(index, "description", e.target.value)
                        }
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                      />
                      <div className="flex gap-4">
                        <label className="flex items-center gap-1 text-xs">
                          <input
                            type="checkbox"
                            checked={item.is_primary}
                            onChange={(e) =>
                              updateMediaItem(
                                index,
                                "is_primary",
                                e.target.checked,
                              )
                            }
                            className="rounded"
                          />
                          Primary
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                          <input
                            type="checkbox"
                            checked={item.my_order}
                            onChange={(e) =>
                              updateMediaItem(
                                index,
                                "my_order",
                                e.target.checked,
                              )
                            }
                            className="rounded"
                          />
                          Order
                        </label>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMediaItem(index)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remove media item"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mediaItems.length === 0 || mutation.isPending}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {mutation.isPending ? "Uploading..." : "Upload Media"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
