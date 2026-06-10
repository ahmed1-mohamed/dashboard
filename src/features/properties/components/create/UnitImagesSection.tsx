"use client";

import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface UnitImagesSectionProps {
  imagePreviews: string[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

export default function UnitImagesSection({
  imagePreviews,
  onImageUpload,
  onRemoveImage,
}: UnitImagesSectionProps) {
  const handleBrowseClick = () => {
    document.getElementById("file-upload")?.click();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Unit Images</h2>
      <div>
        <Label>Unit Images</Label>
        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={onImageUpload}
            className="sr-only"
            id="file-upload"
          />
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-sm text-gray-600"
          >
            Click to upload or drag and drop
          </label>
          <p className="text-xs text-gray-500 mt-2">
            SVG, PNG, JPG or GIF (MAX. 800x400px)
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={handleBrowseClick}
          >
            Browse file
          </Button>
        </div>
      </div>

      {imagePreviews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
