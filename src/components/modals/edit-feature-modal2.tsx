"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import useDashboardAdminFeatures from "@/hooks/use-dashboardAdminFeatures";
import { AdminFeaturesService } from "@/services/AdminFeaturesService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Loader2 } from "lucide-react";

interface EditFeatureModal2Props {
  isOpen: boolean;
  onClose: () => void;
  feature: {
    id: number;
    featureName: string;
    isAmenity: boolean;
    icon: string;
  } | null;
}

export function EditFeatureModal2({
  isOpen,
  onClose,
  feature,
}: EditFeatureModal2Props) {
  const [selectedFileName, setSelectedFileName] = useState<string>("No file chosen");
  const [category, setCategory] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
  } = useForm<{ feature_name: string; feature_name_ar?: string; icons: string }>({
    defaultValues: {
      feature_name: "",
      icons: "",
    },
  });

  const { editFeatureMutation } = useDashboardAdminFeatures();

  // Fetch full details of the feature
  const { data: featureDetails, isLoading: isFetching } = useQuery({
    queryKey: ["featureDetails", feature?.id],
    queryFn: async () => {
      const response = await AdminFeaturesService.getFeature(feature!.id);
      return (response as any).data?.data || (response as any).data || response;
    },
    enabled: isOpen && feature?.id != null,
  });

  useEffect(() => {
    if (featureDetails || feature) {
      const displayFeature = featureDetails || feature;
      const fName = displayFeature.feature_name || feature?.featureName || "";
      const isAm = featureDetails ? displayFeature.is_amenity === 1 : feature?.isAmenity;
      const icn = displayFeature.icons || feature?.icon || "";
      
      setValue("feature_name", fName);
      setCategory(isAm ? "amenity" : "feature");
      setSelectedFileName(icn || "No file chosen");
    }
  }, [featureDetails, feature, setValue]);

  const handleFormSubmit = async (formData: any) => {
    if (!feature?.id) return;

    try {
      const isAmenity = category === "amenity" ? 1 : 0;
      const apiPayload = {
        feature_name: formData.feature_name,
        is_amenity: isAmenity,
        icons: formData.icons || selectedFileName !== "No file chosen" ? selectedFileName : "",
      };

      await editFeatureMutation.mutateAsync({ id: feature.id, data: apiPayload as any });
      handleClose();
    } catch (error) {
      console.error("Failed to update feature:", error);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedFileName("No file chosen");
    setCategory("");
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setValue("icons", file.name);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl overflow-hidden relative flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[#15042B]">Edit Feature</h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          {/* Progress bar line */}
          <div className="w-full h-0.5 bg-gray-100 relative rounded-full">
            <div className="absolute right-10 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </div>
        </div>

        {/* Form Body */}
        {isFetching ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 pt-0 space-y-5 flex-1 overflow-y-auto">
            {/* File Upload */}
            <div>
              <Label className="text-sm font-semibold text-[#15042B] mb-2 block">Upload Feature Icon</Label>
              <div className="flex gap-4 items-start">
                <div className="w-16 h-16 rounded-xl bg-[#9333EA] flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div 
                    className="flex items-center border border-gray-200 rounded-lg overflow-hidden cursor-pointer w-full bg-white hover:bg-gray-50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="bg-gray-50 px-4 py-2.5 border-r border-gray-200 text-sm font-medium text-gray-600 whitespace-nowrap">
                      Choose files
                    </div>
                    <div className="px-4 py-2.5 text-sm text-gray-500 truncate flex-1">
                      {selectedFileName}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 font-medium">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".svg,.png,.jpg,.jpeg,.gif"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>

            {/* Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="feature_name" className="text-sm font-semibold text-[#15042B]">
                  Feature name ( EN ) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="feature_name"
                  {...register("feature_name", { required: true })}
                  placeholder="e.g. Swimming pool"
                  className="py-2.5 bg-gray-50/50 border-gray-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="feature_name_ar" className="text-sm font-semibold text-[#15042B]">
                  Feature name ( AR ) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="feature_name_ar"
                  {...register("feature_name_ar", { required: false })}
                  placeholder="e.g. Swimming pool"
                  className="py-2.5 bg-gray-50/50 border-gray-200"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-[#15042B]">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="w-full bg-gray-50/50 border-gray-200 py-2.5 h-auto text-gray-500">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amenity">Amenity</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Separator */}
            <div className="w-full h-px bg-gray-100 my-2" />

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="text-gray-600 bg-white hover:bg-gray-50 px-6 py-2.5 h-auto"
              >
                Close
              </Button>
              <Button
                type="submit"
                disabled={editFeatureMutation.isPending || !category}
                className="bg-[#007A55] hover:bg-[#007a55e0] text-white px-6 py-2.5 h-auto font-medium"
              >
                {editFeatureMutation.isPending ? "Updating..." : "Update Feature"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
