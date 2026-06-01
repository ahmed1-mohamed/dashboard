"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  MapPin,
  Upload,
  Image as ImageIcon,
  Video,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProjectSchema,
  CreateProjectInput,
} from "@/validators/create-project.schema";
import useDashboardAdminProjectsCreateData from "@/hooks/use-dashboardAdminProjectsCreateData";
import useCitiesByCountry from "@/hooks/use-cities-by-country";
import useAreasByCountry from "@/hooks/use-areas-by-country";
import useCreateProject, {
  type CreateProjectWithMediaParams,
} from "@/hooks/use-create-project";
import useExpandUrl from "@/hooks/use-expand-url";
import useGetNearby from "@/hooks/use-get-nearby";
import useGetLocationDetails from "@/hooks/use-get-location-details";
import imageCompression from "browser-image-compression";

interface LocationData {
  latitude: number;
  longitude: number;
  landmark: string;
  city_id: string;
  north_side: string;
  south_side: string;
  east_side: string;
  west_side: string;
  google_map_link: string;
  area_id?: string;
}

type Option = {
  label: string;
  value: string;
};

// Media Item interface for handling multiple media files
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

// Processing configuration
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

type City = {
  id: number;
  name: string;
};

type Area = {
  id: number;
  area_name: string;
};

interface CreateProjectResponse {
  data?: {
    project_id?: number;
    project_name?: string;
  };
}

export default function CreateProjectPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const token = session?.user?.accessToken as string | undefined;
  // const developerId = session?.user?.user_developer_relationship?.developer_id;
  const roleId = session?.user?.role_id as number | undefined;

  const [country, setCountry] = useState("");
  const [cityFound, setCityFound] = useState(true);
  const [areaError, setAreaError] = useState(false);
  const areaErrorRef = useRef<HTMLDivElement | null>(null);
  const [dateValidationError, setDateValidationError] = useState<string | null>(
    null,
  );

  const [locationData, setLocationData] = useState<LocationData>({
    latitude: 0,
    longitude: 0,
    landmark: "",
    city_id: "",
    north_side: "",
    south_side: "",
    east_side: "",
    west_side: "",
    google_map_link: "",
    area_id: "",
  });

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [googleMapsLinkError, setGoogleMapsLinkError] = useState<string | null>(
    null,
  );
  const [options, setOptions] = useState<Option[]>([]);
  const [options2, setOptions2] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>("");
  const [selectedOption2, setSelectedOption2] = useState<string | null>("");

  // Media handling state
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [videoLink, setVideoLink] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [watermarkImage, setWatermarkImage] = useState<HTMLImageElement | null>(
    null,
  );
  const [watermarkLoaded, setWatermarkLoaded] = useState(false);
  const [countryId, setCountryId] = useState<number>();
  const [mediaType, setMediaType] = useState<
    "image" | "video" | "floor_plan" | "3D_tour"
  >("image");
  const [barcodeFile, setBarcodeFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  // Enhanced configuration with better defaults
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      project_name: "",
      status: undefined,
      total_units: undefined,
      available_units: undefined,
      launch_date: "",
      completion_date: "",
      project_size: "",
      description: "",
      currency: "",
      price_min: "",
      price_max: "",
      price_sq_min: "",
      price_sq_max: "",
      price_range: "",
      price_range_SQ: "",
      project_type: undefined,
      developer_id: undefined,
    },
  });

  // Fetch developers
  const { developersData } = useDashboardAdminProjectsCreateData(countryId);

  // Fetch cities when country changes
  const citiesQuery = useCitiesByCountry(country);

   useEffect(() => {
     const response = citiesQuery.data;
     if (!response) {
       setOptions([]);
       return;
     }
     // response is AxiosResponse; response.data is the body
      const body = response.data;
      // The API might return array directly or wrapped in { data: [...] }
      const citiesArray: any[] | undefined = Array.isArray(body)
        ? body
        : (body as any)?.data;

     if (Array.isArray(citiesArray)) {
       const formattedOptions = citiesArray.map((city: any) => ({
         label: city.name,
         value: city.name,
       }));
       setOptions(formattedOptions);
     } else {
       setOptions([]);
     }
   }, [citiesQuery.data]);

  // Fetch areas when country changes
  const areasQuery = useAreasByCountry(country);

   useEffect(() => {
     const response = areasQuery.data;
     if (!response) {
       setOptions2([]);
       return;
     }
      const body = response.data;
      const areasArray: any[] | undefined = Array.isArray(body)
        ? body
        : (body as any)?.data;

     if (Array.isArray(areasArray)) {
       const formattedOptions = areasArray.map((area: any) => ({
         label: area.area_name,
         value: area.area_name,
       }));
       setOptions2(formattedOptions);
     } else {
       setOptions2([]);
     }
   }, [areasQuery.data]);

  // Check if city is found
  useEffect(() => {
    const flag = options.find((opt) => opt.value === selectedOption) ?? null;
    if (flag == null) {
      setCityFound(false);
    } else {
      setCityFound(true);
    }
  }, [selectedOption, options]);

  // Auto-set developer_id based on roleId
  useEffect(() => {
    if (roleId == 3 && developersData.data?.[0]?.developer_id) {
      setValue("developer_id", developersData.data[0].developer_id, {
        shouldValidate: true,
      });
    }
  }, [roleId, developersData.data, setValue]);

  // Real-time date validation: completion_date must be on or after launch_date
  useEffect(() => {
    const launchDate = watch("launch_date");
    const completionDate = watch("completion_date");

    if (launchDate && completionDate) {
      const launch = new Date(launchDate);
      const completion = new Date(completionDate);

      if (completion < launch) {
        setDateValidationError("Completion date must be after launch date");
        toast.error("Completion date must be after launch date");
      } else {
        setDateValidationError(null);
      }
    } else {
      setDateValidationError(null);
    }
  }, [watch]);

  // Load watermark image on component mount
  useEffect(() => {
    const loadWatermarkImage = () => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        setWatermarkImage(img);
        setWatermarkLoaded(true);
        console.log("Watermark image loaded successfully");
      };

      img.onerror = () => {
        console.error("Failed to load watermark image");
        setWatermarkLoaded(false);
        toast.error("Failed to load watermark image");
      };

      img.src = "/logo_media.png";
    };

    if (config.watermarkEnabled) {
      loadWatermarkImage();
    }
  }, [config.watermarkEnabled]);

  // Helper function to resize image dimensions
  const resizeImageDimensions = (
    originalWidth: number,
    originalHeight: number,
    maxWidth = 1024,
    maxHeight = 768,
  ): { width: number; height: number } => {
    const widthRatio = originalWidth / maxWidth;
    const heightRatio = originalHeight / maxHeight;
    const ratio = Math.min(widthRatio, heightRatio);

    if (
      Math.round(originalHeight + originalHeight * ratio) > 768 &&
      Math.round(originalWidth + originalWidth * ratio) > 1024
    ) {
      return {
        width: 1024,
        height: 768,
      };
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
  };

  // Enhanced image processing function
  const processImage = useCallback(
    async (file: File): Promise<File> => {
      try {
        // Step 1: Create canvas for precise resizing
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          throw new Error("Could not get canvas context");
        }

        const originalImage = await new Promise<HTMLImageElement>(
          (resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
          },
        );

        // Set exact canvas dimensions
        const { width: newWidth, height: newHeight } = resizeImageDimensions(
          originalImage.width,
          originalImage.height,
          config.imageSize.width,
          config.imageSize.height,
        );

        canvas.width = newWidth;
        canvas.height = newHeight;

        // Step 2: Draw image with exact dimensions
        ctx.fillStyle = "transparent";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw image to fill entire canvas (stretching if needed)
        ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

        // Step 3: Add watermark if enabled
        if (config.watermarkEnabled && watermarkImage && watermarkLoaded) {
          ctx.globalAlpha = config.watermarkOpacity / 100;

          const watermarkWidth = 500;
          const watermarkHeight = 300;

          // Calculate position
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

          // Draw watermark
          ctx.drawImage(watermarkImage, x, y, watermarkWidth, watermarkHeight);
          ctx.globalAlpha = 1.0;
        }

        // Step 4: Convert canvas to blob with high compression
        const processedBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Failed to create blob"));
              }
            },
            "image/jpeg",
            config.quality / 100,
          );
        });

        // Step 5: Further compress if still too large
        let finalBlob = processedBlob;

        if (processedBlob.size > config.maxSizeMB * 1024 * 1024) {
          console.log("Further compression needed...");

          // Use imageCompression as fallback for additional compression
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

        // Create final file
        const processedFile = new File([finalBlob], file.name, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });

        // Clean up
        URL.revokeObjectURL(originalImage.src);

        return processedFile;
      } catch (error) {
        console.error("Image processing error:", error);
        toast.error("Failed to process image. Using original file.");
        return file;
      }
    },
    [config, watermarkImage, watermarkLoaded],
  );

  // Handle video link
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

  // Handle file selection
  const handleMediaFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files) return;

      const validFiles = Array.from(files).filter((file) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
          toast.error(`${file.name} is not a valid image file`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      // Check if watermark is enabled but not loaded
      if (config.watermarkEnabled && !watermarkLoaded) {
        toast.error(
          "Watermark is enabled but not loaded. Please wait or disable watermark.",
        );
        return;
      }

      setIsProcessing(true);

      try {
        const processedItems: MediaItem[] = [];

        for (const file of validFiles) {
          const originalSize = file.size;

          const processedFile = config.enabled
            ? await processImage(file)
            : file;

          const compressedSize = processedFile.size;

          // Create preview
          const preview = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(processedFile);
          });

          const newMediaItem: MediaItem = {
            file: processedFile,
            originalFile: file,
            description: "",
            is_primary: mediaItems.length === 0 && processedItems.length === 0,
            my_order: false,
            preview,
            isProcessed: config.enabled,
            media_type: mediaType,
            originalSize,
            compressedSize,
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
      mediaType,
      mediaItems.length,
    ],
  );

  // Update media item
  const updateMediaItem = (
    index: number,
    field: keyof MediaItem,
    value: string | boolean,
  ) => {
    setMediaItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  // Remove media item
  const removeMediaItem = (index: number) => {
    setMediaItems((prev) => prev.filter((_, i) => i !== index));
  };

  const isValidGoogleMapsLink = (url: string) => {
    const trimmed = url.trim();
    return /^https:\/\/(maps\.app\.goo\.gl\/|goo\.gl\/maps\/|www\.google\.[a-z.]+\/maps\/)/.test(
      trimmed,
    );
  };

  const handleGoogleMapLink = async (url: string) => {
    if (!url.trim()) {
      setLocationData({
        latitude: 0,
        longitude: 0,
        landmark: "",
        city_id: "",
        north_side: "",
        south_side: "",
        east_side: "",
        west_side: "",
        google_map_link: "",
        area_id: "",
      });
      setGoogleMapsLinkError("Invalid Google Maps link format.");
      return;
    }

    setIsLoadingLocation(true);
    try {
      // Expand short URL
      const coordinates = await expandUrl(url);
      if (!coordinates) {
        toast.error("Invalid Google Maps URL. Please provide a valid link.");
        setGoogleMapsLinkError("Invalid Google Maps link format.");
        return;
      }

      // Get geocode data
      const geocodeData = await getLocationDetails({
        lat: coordinates.lat,
        lng: coordinates.lng,
      });

      if (!geocodeData.results || geocodeData.results.length === 0) {
        toast.error("Could not extract location details from the provided link.");
        setGoogleMapsLinkError("Invalid Google Maps link format.");
        return;
      }

      const result = geocodeData.results[0];
      const addressComponents = result.address_components;

      let city_id = "";
      let area_id = "";
      const landmark = result.formatted_address;
      let state = "";
      let detectedCountry = "";
      let country_id = 0;

      for (const component of addressComponents) {
        const types = component.types;
        if (types.includes("sublocality") || types.includes("neighborhood")) {
          area_id = component.long_name;
        } else if (types.includes("locality")) {
          city_id = component.long_name;
        } else if (types.includes("administrative_area_level_2") && !city_id) {
          city_id = component.long_name;
        } else if (types.includes("administrative_area_level_1")) {
          state = component.long_name;
        } else if (types.includes("country")) {
          detectedCountry = component.long_name.toLowerCase();
          if (detectedCountry === "united arab emirates") detectedCountry = "UAE";
          else if (detectedCountry === "egypt") detectedCountry = "Egypt";
          else if (detectedCountry === "oman") detectedCountry = "Oman";
          if (detectedCountry === "Egypt") country_id = 1;
          else if (detectedCountry === "UAE") country_id = 2;
          else if (detectedCountry === "Oman") country_id = 3;
        }
      }

      // Get directional references
      const directionalData = await getNearby({
        lat: coordinates.lat,
        lng: coordinates.lng,
      });

      // Set country state
      setCountry(detectedCountry);
      setCountryId(country_id);

      const locationDataFinal: LocationData = {
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        landmark: landmark || "Unknown Location",
        city_id: city_id || state || "Unknown City",
        north_side: directionalData.north || "N/A",
        south_side: directionalData.south || "N/A",
        east_side: directionalData.east || "N/A",
        west_side: directionalData.west || "N/A",
        google_map_link: url,
        area_id: area_id || "Unknown Area",
      };

      setLocationData(locationDataFinal);
      toast.success("Location details extracted successfully!");
      setSelectedOption(locationDataFinal.city_id);
      setSelectedOption2(locationDataFinal.area_id ?? "");
      setGoogleMapsLinkError(null);
    } catch (error) {
      console.error("Error processing Google Maps link:", error);
      setGoogleMapsLinkError("Invalid Google Maps link format.");
      toast.error("Error processing the Google Maps link. Please try again.");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setLocationData((prev) => {
      const key = name as keyof LocationData;

      return {
        ...prev,
        [key]:
          key === "latitude" || key === "longitude" ? parseFloat(value) : value,
      };
    });
  };

   // Custom hook for creating project with media
   const { createProject, isCreating } = useCreateProject();

   // Hooks for Google Maps processing
   const { expandUrl } = useExpandUrl();
   const { getNearby } = useGetNearby();
   const { getLocationDetails } = useGetLocationDetails();

   const handleSubmitForm = async () => {
    if (!locationData.city_id) {
      toast.error("Please select a valid city");
      return;
    }

    if (!locationData.google_map_link) {
      toast.error("Please provide a Google Maps link");
      return;
    }

    const formData: CreateProjectWithMediaParams = {
      ...watch(),
      location: locationData,
      mediaItems: mediaItems.map((item) => ({
        file: item.file,
        description: item.description,
        is_primary: item.is_primary,
        my_order: item.my_order,
        media_type: item.media_type,
        media_url: item.media_url,
      })),
    };

    try {
      await createProject(formData);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => router.push("/admin/projects")}
                className="text-gray-600 hover:text-gray-900"
              >
                ←
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Create New Project
              </h1>
            </div>
            <p className="text-sm text-gray-500">
              Home &gt; Projects &gt; Create Project
            </p>
          </div>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleSubmitForm}
            disabled={isCreating || !!dateValidationError}
          >
            {isCreating ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitForm();
          }}
          className="space-y-6"
        >
          {/* Location Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Location
            </h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="google-maps">
                  Google Maps Link <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2 mt-1">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="google-maps"
                      placeholder="https://maps.google.com"
                      className="pl-10"
                      value={locationData.google_map_link}
                      onChange={(e) => {
                        const url = e.target.value;
                        setLocationData((prev) => ({
                          ...prev,
                          google_map_link: url,
                        }));
                        if (!isValidGoogleMapsLink(url) && url.trim()) {
                          setGoogleMapsLinkError(
                            "Invalid Google Maps link format.",
                          );
                        } else {
                          setGoogleMapsLinkError(null);
                        }
                      }}
                      disabled={isLoadingLocation}
                    />
                  </div>
                  <Button
                    type="button"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() =>
                      handleGoogleMapLink(locationData.google_map_link)
                    }
                    disabled={isLoadingLocation}
                  >
                    {isLoadingLocation ? "Processing..." : "Fetch Data"}
                  </Button>
                </div>
                {googleMapsLinkError && (
                  <p className="text-sm text-red-600 mt-1">
                    {googleMapsLinkError}
                  </p>
                )}
                {isLoadingLocation && (
                  <div className="flex items-center space-x-2 text-sm text-blue-600 mt-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                    <span>Processing Google Maps link...</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="latitude">
                    Latitude <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="25.2048"
                    className="mt-1"
                    value={locationData.latitude || ""}
                    onChange={(e) => handleChange(e)}
                    name="latitude"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">
                    Longitude <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="55.2708"
                    className="mt-1"
                    value={locationData.longitude || ""}
                    onChange={(e) => handleChange(e)}
                    name="longitude"
                  />
                </div>
                <div>
                  <Label htmlFor="city">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedOption || ""}
                    onValueChange={(value) => {
                      setSelectedOption(value);
                      setLocationData((prev) => ({
                        ...prev,
                        city_id: value,
                      }));
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!cityFound && (
                    <p className="text-sm text-red-500 mt-1">
                      City not found in database
                    </p>
                  )}
                </div>
                <div ref={areaErrorRef}>
                  <Label htmlFor="area">
                    Area <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedOption2 || ""}
                    onValueChange={(value) => {
                      setSelectedOption2(value);
                      setLocationData((prev) => ({
                        ...prev,
                        area_id: value,
                      }));
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Area" />
                    </SelectTrigger>
                    <SelectContent>
                      {options2.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {areaError && (
                    <p className="text-sm text-red-500 mt-1">
                      Area is not valid
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Directional References */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Directional References
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="south-side">
                  south side <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="south-side"
                  placeholder="Near Burj Khalifa"
                  className="mt-1"
                  value={locationData.south_side}
                  onChange={(e) => handleChange(e)}
                  name="south_side"
                />
              </div>
              <div>
                <Label htmlFor="east-side">
                  east side <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="east-side"
                  placeholder="Near Burj Khalifa"
                  className="mt-1"
                  value={locationData.east_side}
                  onChange={(e) => handleChange(e)}
                  name="east_side"
                />
              </div>
              <div>
                <Label htmlFor="west-side">
                  west side <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="west-side"
                  placeholder="Near Burj Khalifa"
                  className="mt-1"
                  value={locationData.west_side}
                  onChange={(e) => handleChange(e)}
                  name="west_side"
                />
              </div>
              <div>
                <Label htmlFor="north-side">
                  north side <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="north-side"
                  placeholder="Near Burj Khalifa"
                  className="mt-1"
                  value={locationData.north_side}
                  onChange={(e) => handleChange(e)}
                  name="north_side"
                />
              </div>
              <div>
                <Label htmlFor="landmark">
                  Landmark <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="landmark"
                  placeholder="Near Burj Khalifa"
                  className="mt-1"
                  value={locationData.landmark}
                  onChange={(e) => handleChange(e)}
                  name="landmark"
                />
              </div>
            </div>
          </div>

          {/* Short Description */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-2">
              <Label htmlFor="description">
                Short Description <span className="text-red-500">*</span>
              </Label>
            </div>
            <RichTextEditor
              content={watch("description") || ""}
              onChange={(content) => setValue("description", content)}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Two-Column Layout for Basic Info and Units Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="project-name">
                    Project Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="project-name"
                    placeholder="e.g. Gulf Tower"
                    className="mt-1"
                    {...register("project_name")}
                  />
                  {errors.project_name && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.project_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="developer">Developer</Label>
                  <Select
                    value={String(watch("developer_id") || "")}
                    onValueChange={(value) =>
                      setValue("developer_id", parseInt(value))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select developer" />
                    </SelectTrigger>
                    <SelectContent>
                      {developersData.data?.map((developer: any) => (
                        <SelectItem
                          key={developer.developer_id}
                          value={String(developer.developer_id)}
                        >
                          {developer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.developer_id && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.developer_id.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="project-type">
                    Project type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch("project_type") || ""}
                    onValueChange={(value) => setValue("project_type", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="mixed-use">Mixed-Use</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.project_type && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.project_type.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={country}
                    onValueChange={(value) => setCountry(value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UAE">UAE</SelectItem>
                      <SelectItem value="Egypt">Egypt</SelectItem>
                      <SelectItem value="Oman">Oman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={watch("status") || ""}
                    onValueChange={(value) => setValue("status", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Units Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Units Information
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="total-units">
                    Total Units <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="total-units"
                    type="number"
                    placeholder="2555"
                    className="mt-1"
                    {...register("total_units", { valueAsNumber: true })}
                  />
                  {errors.total_units && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.total_units.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="available-units">
                    Available Units <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="available-units"
                    type="number"
                    placeholder="45"
                    className="mt-1"
                    {...register("available_units", { valueAsNumber: true })}
                  />
                  {errors.available_units && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.available_units.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="launch-date">
                    Launch Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="launch-date"
                    type="date"
                    placeholder="mm/dd/yyyy"
                    className="mt-1"
                    {...register("launch_date")}
                  />
                  {errors.launch_date && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.launch_date.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="completion-date">Completion Date</Label>
                  <Input
                    id="completion-date"
                    type="date"
                    placeholder="mm/dd/yyyy"
                    className="mt-1"
                    {...register("completion_date")}
                  />
                  {errors.completion_date && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.completion_date.message}
                    </p>
                  )}
                  {dateValidationError && (
                    <p className="text-sm text-red-500 mt-1">
                      {dateValidationError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="currency">
                  Currency <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watch("currency") || ""}
                  onValueChange={(value) => setValue("currency", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AED">AED</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EGP">EGP</SelectItem>
                  </SelectContent>
                </Select>
                {errors.currency && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.currency.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="min-price">
                  Min Price <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="min-price"
                  type="number"
                  placeholder="500000"
                  className="mt-1"
                  {...register("price_min")}
                />
                {errors.price_min && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.price_min.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="max-price">
                  Max Price <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="max-price"
                  type="number"
                  placeholder="1000000"
                  className="mt-1"
                  {...register("price_max")}
                />
                {errors.price_max && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.price_max.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="price-per-min">
                  Price per m (Min) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price-per-min"
                  type="number"
                  placeholder="500"
                  className="mt-1"
                  {...register("price_sq_min")}
                />
                {errors.price_sq_min && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.price_sq_min.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="price-per-max">
                  Price per m (Max) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price-per-max"
                  type="number"
                  placeholder="1000"
                  className="mt-1"
                  {...register("price_sq_max")}
                />
                {errors.price_sq_max && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.price_sq_max.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="project-area">
                  Project Area (m) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="project-area"
                  type="number"
                  placeholder="5000"
                  className="mt-1"
                  {...register("project_size")}
                />
              </div>
            </div>
          </div>

          {/* Project Images & Media */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Project Media
            </h2>

            {/* Media Type Selection */}
            <div className="mb-6">
              <Label className="mb-2 block">Media Type</Label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setMediaType("image")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                    mediaType === "image"
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <ImageIcon className="h-5 w-5" />
                  Images
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType("floor_plan")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                    mediaType === "floor_plan"
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <ImageIcon className="h-5 w-5" />
                  Floor Plans
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType("3D_tour")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                    mediaType === "3D_tour"
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <ImageIcon className="h-5 w-5" />
                  3D Tours
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType("video")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                    mediaType === "video"
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Video className="h-5 w-5" />
                  Videos
                </button>
              </div>
            </div>

            {/* Video Link Input */}
            {mediaType === "video" && (
              <div className="mb-6">
                <Label htmlFor="video-link" className="mb-2 block">
                  Video URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="video-link"
                    placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleVideoLink}
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    Add Video
                  </Button>
                </div>
              </div>
            )}

            {/* Image Upload for non-video types */}
            {mediaType !== "video" && (
              <div className="mb-6">
                <div className="flex items-center gap-6">
                  {/* Upload Button */}
                  <div className="w-32 h-32">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleMediaFileSelect(e.target.files)}
                      className="sr-only"
                      id="project-media"
                      disabled={isProcessing}
                    />
                    <label
                      htmlFor="project-media"
                      className="w-full h-full bg-teal-500 hover:bg-teal-600 rounded-lg border-2 border-dashed border-teal-600 flex items-center justify-center cursor-pointer transition-colors"
                    >
                      {isProcessing ? (
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <div className="text-center text-white">
                          <Upload className="h-8 w-8 mx-auto mb-2" />
                          <span className="text-sm">Upload</span>
                        </div>
                      )}
                    </label>
                  </div>

                  {message && (
                    <p
                      className={`text-sm ${
                        message.includes("error")
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {message}
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {config.enabled && mediaType === "image"
                    ? `Images will be processed: max ${config.maxSizeMB}MB, ${config.quality}% quality, ${config.imageSize.width}x${config.imageSize.height}px with watermark`
                    : "Select image files to upload"}
                </p>
              </div>
            )}

            {/* Media Items Grid */}
            {mediaItems.length > 0 && (
              <div className="mt-6">
                <h3 className="text-md font-semibold text-gray-900 mb-4">
                  Uploaded Media ({mediaItems.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mediaItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex gap-4">
                        {/* Preview */}
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <img
                            src={item.preview}
                            alt={`Media ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xs font-medium px-2 py-1 bg-teal-100 text-teal-800 rounded">
                              {item.media_type.replace("_", " ")}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeMediaItem(index)}
                              className="text-red-500 hover:text-red-700"
                              aria-label="Remove media item"
                              title="Remove media item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <Input
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) =>
                              updateMediaItem(
                                index,
                                "description",
                                e.target.value,
                              )
                            }
                            className="h-8 text-sm mb-2"
                          />
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 text-xs">
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
                                className="rounded border-gray-300"
                              />
                              Primary
                            </label>
                            <label className="flex items-center gap-2 text-xs">
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
                                className="rounded border-gray-300"
                              />
                              Order
                            </label>
                          </div>
                          {item.file && (
                            <p className="text-xs text-gray-500 mt-2">
                              {item.originalSize && item.compressedSize
                                ? `${(item.originalSize / 1024).toFixed(1)}KB → ${(
                                    item.compressedSize / 1024
                                  ).toFixed(1)}KB`
                                : ""}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Errors */}
          {errors.root && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{errors.root.message}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
