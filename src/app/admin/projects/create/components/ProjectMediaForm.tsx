import { useState, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Video, Trash2 } from "lucide-react";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { MediaItem, ProcessingConfig } from "../types";

interface ProjectMediaFormProps {
  mediaItems: MediaItem[];
  setMediaItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

export function ProjectMediaForm({ mediaItems, setMediaItems }: ProjectMediaFormProps) {
  const [mediaType, setMediaType] = useState<"image" | "video" | "floor_plan" | "3D_tour">("image");
  const [videoLink, setVideoLink] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [watermarkImage, setWatermarkImage] = useState<HTMLImageElement | null>(null);
  const [watermarkLoaded, setWatermarkLoaded] = useState(false);

  const [config] = useState<ProcessingConfig>({
    enabled: true,
    imageSize: { width: 1024, height: 768 },
    maxSizeMB: 0.5,
    quality: 85,
    watermarkEnabled: true,
    watermarkOpacity: 100,
    watermarkPosition: "bottom-right",
    maintainAspectRatio: false,
    watermarkSize: 30,
  });

  useEffect(() => {
    const loadWatermarkImage = () => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        setWatermarkImage(img);
        setWatermarkLoaded(true);
      };
      img.onerror = () => {
        setWatermarkLoaded(false);
        toast.error("Failed to load watermark image");
      };
      img.src = "/logo_media.png";
    };
    if (config.watermarkEnabled) loadWatermarkImage();
  }, [config.watermarkEnabled]);

  const resizeImageDimensions = (originalWidth: number, originalHeight: number, maxWidth = 1024, maxHeight = 768) => {
    const widthRatio = originalWidth / maxWidth;
    const heightRatio = originalHeight / maxHeight;
    const ratio = Math.min(widthRatio, heightRatio);

    if (Math.round(originalHeight + originalHeight * ratio) > 768 && Math.round(originalWidth + originalWidth * ratio) > 1024) return { width: 1024, height: 768 };
    if (Math.round(originalHeight + originalHeight * ratio) > 768) return { width: Math.round(originalWidth + originalWidth * ratio), height: 768 };
    if (Math.round(originalWidth + originalWidth * ratio) > 1024) return { width: 1024, height: Math.round(originalHeight + originalHeight * ratio) };
    return { width: Math.round(originalWidth + originalWidth * ratio), height: Math.round(originalHeight + originalHeight * ratio) };
  };

  const processImage = useCallback(async (file: File): Promise<File> => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      const originalImage = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });

      const { width: newWidth, height: newHeight } = resizeImageDimensions(originalImage.width, originalImage.height, config.imageSize.width, config.imageSize.height);
      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

      if (config.watermarkEnabled && watermarkImage && watermarkLoaded) {
        ctx.globalAlpha = config.watermarkOpacity / 100;
        const watermarkWidth = 500;
        const watermarkHeight = 300;
        const margin = 20;
        let x = canvas.width - watermarkWidth - margin;
        let y = canvas.height - watermarkHeight - margin;
        
        ctx.drawImage(watermarkImage, x, y, watermarkWidth, watermarkHeight);
        ctx.globalAlpha = 1.0;
      }

      const processedBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => { if (blob) resolve(blob); else reject(new Error("Failed to create blob")); }, "image/jpeg", config.quality / 100);
      });

      let finalBlob = processedBlob;
      if (processedBlob.size > config.maxSizeMB * 1024 * 1024) {
        const tempFile = new File([processedBlob], file.name, { type: "image/jpeg" });
        finalBlob = await imageCompression(tempFile, {
          maxSizeMB: config.maxSizeMB,
          maxWidthOrHeight: Math.max(config.imageSize.width, config.imageSize.height),
          useWebWorker: true,
          initialQuality: (config.quality - 10) / 100,
          fileType: "image/jpeg",
        });
      }

      const processedFile = new File([finalBlob], file.name, { type: "image/jpeg", lastModified: Date.now() });
      URL.revokeObjectURL(originalImage.src);
      return processedFile;
    } catch (error) {
      console.error("Image processing error:", error);
      toast.error("Failed to process image. Using original file.");
      return file;
    }
  }, [config, watermarkImage, watermarkLoaded]);

  const handleMediaFileSelect = useCallback(async (files: FileList | null) => {
    if (!files) return;
    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;
    if (config.watermarkEnabled && !watermarkLoaded) {
      toast.error("Watermark is enabled but not loaded. Please wait or disable watermark.");
      return;
    }

    setIsProcessing(true);
    try {
      const processedItems: MediaItem[] = [];
      for (const file of validFiles) {
        const processedFile = config.enabled ? await processImage(file) : file;
        const preview = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(processedFile);
        });

        processedItems.push({
          file: processedFile,
          originalFile: file,
          description: "",
          is_primary: mediaItems.length === 0 && processedItems.length === 0,
          my_order: false,
          preview,
          isProcessed: config.enabled,
          media_type: mediaType,
          originalSize: file.size,
          compressedSize: processedFile.size,
        });
      }

      setMediaItems(prev => [...prev, ...processedItems]);
      toast.success(`${processedItems.length} file(s) processed successfully!`);
    } catch (error) {
      toast.error("Error processing images");
    } finally {
      setIsProcessing(false);
    }
  }, [config, watermarkLoaded, processImage, mediaType, mediaItems.length, setMediaItems]);

  const handleVideoLink = () => {
    if (!videoLink.trim()) { toast.error("Please enter a valid video URL"); return; }
    try { new URL(videoLink); } catch { toast.error("Please enter a valid URL format"); return; }

    setMediaItems(prev => [...prev, {
      description: "", is_primary: false, my_order: false,
      preview: "/videoo.png", isProcessed: false,
      media_url: videoLink, media_type: "video"
    }]);
    setVideoLink("");
    toast.success("Video link added successfully!");
  };

  const updateMediaItem = (index: number, field: keyof MediaItem, value: string | boolean) => {
    setMediaItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const removeMediaItem = (index: number) => {
    setMediaItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Media</h2>
      <div className="mb-6">
        <Label className="mb-2 block">Media Type</Label>
        <div className="flex gap-4">
          <button type="button" onClick={() => setMediaType("image")} className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${mediaType === "image" ? "bg-teal-500 text-white border-teal-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}><ImageIcon className="h-5 w-5" /> Images</button>
          <button type="button" onClick={() => setMediaType("floor_plan")} className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${mediaType === "floor_plan" ? "bg-teal-500 text-white border-teal-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}><ImageIcon className="h-5 w-5" /> Floor Plans</button>
          <button type="button" onClick={() => setMediaType("3D_tour")} className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${mediaType === "3D_tour" ? "bg-teal-500 text-white border-teal-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}><ImageIcon className="h-5 w-5" /> 3D Tours</button>
          <button type="button" onClick={() => setMediaType("video")} className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${mediaType === "video" ? "bg-teal-500 text-white border-teal-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}><Video className="h-5 w-5" /> Videos</button>
        </div>
      </div>

      {mediaType === "video" ? (
        <div className="mb-6">
          <Label htmlFor="video-link" className="mb-2 block">Video URL</Label>
          <div className="flex gap-2">
            <Input id="video-link" placeholder="Enter video URL (YouTube, Vimeo, etc.)" value={videoLink} onChange={(e) => setVideoLink(e.target.value)} className="flex-1" />
            <Button type="button" onClick={handleVideoLink} className="bg-teal-600 hover:bg-teal-700 text-white">Add Video</Button>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <div className="flex items-center gap-6">
            <div className="w-32 h-32">
              <input type="file" accept="image/*" multiple onChange={(e) => handleMediaFileSelect(e.target.files)} className="sr-only" id="project-media" disabled={isProcessing} />
              <label htmlFor="project-media" className="w-full h-full bg-teal-500 hover:bg-teal-600 rounded-lg border-2 border-dashed border-teal-600 flex items-center justify-center cursor-pointer transition-colors">
                {isProcessing ? <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <div className="text-center text-white"><Upload className="h-8 w-8 mx-auto mb-2" /><span className="text-sm">Upload</span></div>}
              </label>
            </div>
            {message && <p className={`text-sm ${message.includes("error") ? "text-red-500" : "text-green-500"}`}>{message}</p>}
          </div>
          <p className="text-sm text-gray-500 mt-2">{config.enabled && mediaType === "image" ? `Images will be processed: max ${config.maxSizeMB}MB, ${config.quality}% quality, ${config.imageSize.width}x${config.imageSize.height}px with watermark` : "Select image files to upload"}</p>
        </div>
      )}

      {mediaItems.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-semibold text-gray-900 mb-4">Uploaded Media ({mediaItems.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaItems.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0"><img src={item.preview} alt={`Media ${index + 1}`} className="w-full h-full object-cover rounded-lg" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-medium px-2 py-1 bg-teal-100 text-teal-800 rounded">{item.media_type.replace("_", " ")}</span>
                      <button type="button" onClick={() => removeMediaItem(index)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                    </div>
                    <Input placeholder="Description" value={item.description} onChange={(e) => updateMediaItem(index, "description", e.target.value)} className="h-8 text-sm mb-2" />
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={item.is_primary} onChange={(e) => updateMediaItem(index, "is_primary", e.target.checked)} className="rounded border-gray-300" /> Primary</label>
                      <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={item.my_order} onChange={(e) => updateMediaItem(index, "my_order", e.target.checked)} className="rounded border-gray-300" /> Order</label>
                    </div>
                    {item.file && <p className="text-xs text-gray-500 mt-2">{item.originalSize && item.compressedSize ? `${(item.originalSize / 1024).toFixed(1)}KB → ${(item.compressedSize / 1024).toFixed(1)}KB` : ""}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
