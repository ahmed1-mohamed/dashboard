"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  propertiesSchema,
  PropertiesInput,
} from "@/validators/propertiesSchema";
import {
  usePropertyTypes,
  usePropertySubtypes,
  useProjectsForSelect,
} from "@/hooks/use-property-data";
import useCreateProperty from "@/hooks/use-create-property";

import PropertyPageHeader from "@/features/properties/components/create/PropertyPageHeader";
import BasicInformationSection from "@/features/properties/components/create/BasicInformationSection";
import PricingSection from "@/features/properties/components/create/PricingSection";
import UnitImagesSection from "@/features/properties/components/create/UnitImagesSection";
import UnitDetailsSection from "@/features/properties/components/create/UnitDetailsSection";
import UnitLicenseSection from "@/features/properties/components/create/UnitLicenseSection";

export default function CreatePropertyPage() {
  const router = useRouter();

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PropertiesInput>({
    resolver: zodResolver(propertiesSchema),
    defaultValues: {
      maid_room: false,
    },
  });

  const { data: propertiesType = [] } = usePropertyTypes();
  const { data: propertiesSubtype = [] } = usePropertySubtypes();
  const { data: projects = [] } = useProjectsForSelect();

  const { createProperty, isCreating } = useCreateProperty();

  const handleFormSubmit = async (formData: PropertiesInput) => {
    const data = {
      ...formData,
      price: formData.price ? Number(formData.price) : undefined,
      size: formData.size ? Number(formData.size) : undefined,
      parking_spaces: formData.parking_spaces
        ? Number(formData.parking_spaces)
        : undefined,
      bua_size: formData.bua_size ? Number(formData.bua_size) : undefined,
      plot_size: formData.plot_size ? Number(formData.plot_size) : undefined,
    };
    try {
      await createProperty(data);
      router.push("/admin/properties");
    } catch {}
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PropertyPageHeader onCancel={() => router.push("/admin/properties")} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          <BasicInformationSection
            register={register}
            control={control}
            errors={errors}
            propertiesType={propertiesType}
            propertiesSubtype={propertiesSubtype}
            projects={projects}
          />

          <PricingSection
            register={register}
            control={control}
            errors={errors}
          />

          <UnitImagesSection
            imagePreviews={imagePreviews}
            onImageUpload={handleImageUpload}
            onRemoveImage={handleRemoveImage}
          />

          <UnitDetailsSection
            register={register}
            control={control}
            errors={errors}
          />

          <UnitLicenseSection register={register} />

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4">
            {errors.root && (
              <div className="text-red-500 text-sm">{errors.root.message}</div>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/properties")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white"
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
