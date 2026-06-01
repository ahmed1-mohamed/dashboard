"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/modal";
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
import { MapPin } from "lucide-react";
import {
  createProjectSchema,
  CreateProjectInput,
} from "@/validators/create-project.schema";
import { editProject, fetchProjectsDetails } from "@/data/api-client";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { DeveloperCreateDataType } from "@/types";
import { EditProjectInput } from "@/validators/edit-project.schema";

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
  description?: string;
}

type Option = {
  label: string;
  value: string;
};

interface CityType {
  name: string;
}

interface AreaType {
  area_name: string;
}

interface CityApiResponse {
  data: CityType[];
}

interface AreaApiResponse {
  data: AreaType[];
}

interface ExpandUrlResponse {
  longUrl: string;
}

interface GeocodeResponse {
  results: Array<{
    formatted_address: string;
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
  }>;
  status: string;
}

interface DirectionalReferencesResponse {
  north: string;
  south: string;
  east: string;
  west: string;
}

interface EditProjectSubmissionData extends CreateProjectInput {
  price_range: string;
  price_range_SQ: string;
  barcode: File | null;
  location: LocationData;
  milestone_id?: number;
  phase?: string;
  permit_no?: string;
}

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number | undefined;
}

export function EditDeveloperProjectModal({
  isOpen,
  onClose,
  projectId,
}: EditProjectModalProps) {
  // const { data: session } = useSession();
  // const queryClient = useQueryClient();
  // const token = session?.user?.accessToken;
  // const developerId = session?.user?.user_developer_relationship?.developer_id;
  // const [country, setCountry] = useState("");
  // const [cityFound, setCityFound] = useState(true);
  // const [dateValidationError, setDateValidationError] = useState<string | null>(
  //   null,
  // );
  // const [areaError, setAreaError] = useState(false);
  // const areaErrorRef = useRef<HTMLDivElement | null>(null);
  // const [isLocationReady, setIsLocationReady] = useState(false);
  // const [file, setFile] = useState<File | null>(null);
  // const [locationData, setLocationData] = useState<LocationData>({
  //   latitude: 0,
  //   longitude: 0,
  //   landmark: "",
  //   city_id: "",
  //   north_side: "",
  //   south_side: "",
  //   east_side: "",
  //   west_side: "",
  //   google_map_link: "",
  //   area_id: "",
  //   description: "",
  // });
  // const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  // const [googleMapsLinkError, setGoogleMapsLinkError] = useState<string | null>(
  //   null,
  // );
  // const [options, setOptions] = useState<Option[]>([]);
  // const [options2, setOptions2] = useState<Option[]>([]);
  // const [selectedOption, setSelectedOption] = useState<string | null>("");
  // const [selectedOption2, setSelectedOption2] = useState<string | null>("");
  // const {
  //   register,
  //   handleSubmit,
  //   setValue,
  //   watch,
  //   reset,
  //   control,
  //   setError,
  //   formState: { errors },
  // } = useForm<CreateProjectInput>({
  //   resolver: zodResolver(createProjectSchema),
  //   defaultValues: {
  //     project_name: "",
  //     status: undefined,
  //     total_units: undefined,
  //     available_units: undefined,
  //     launch_date: "",
  //     completion_date: "",
  //     project_size: "",
  //     description: "",
  //     currency: "",
  //     price_min: "",
  //     price_max: "",
  //     price_sq_min: "",
  //     price_sq_max: "",
  //     price_range: "",
  //     price_range_SQ: "",
  //     project_type: undefined,
  //     developer_id: undefined,
  //     milestone_id: undefined,
  //     phase: "",
  //     permit_no: "",
  //   },
  // });
  // // Fetch project details
  // const { data: projectData, isLoading: isLoadingProject } = useQuery({
  //   queryKey: ["projectDetails", String(projectId)],
  //   queryFn: () => fetchProjectsDetails(Number(projectId), token!),
  //   enabled: !!token && !!projectId && isOpen,
  // });
  // // Fetch developers
  // const { data: developersData = [] } = useQuery<DeveloperCreateDataType[]>({
  //   queryKey: ["developers"],
  //   queryFn: async () => {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/developers/all`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );
  //     const json: { data: DeveloperCreateDataType[] } = await res.json();
  //     return json.data || [];
  //   },
  //   enabled: !!token && isOpen,
  // });
  // const choosenDeveloper = developersData.find(
  //   (dev) => dev.developer_id === developerId,
  // );
  // // Fetch cities when country changes
  // useEffect(() => {
  //   const fetchCities = async () => {
  //     if (!country || !token) return;
  //     try {
  //       const res = await fetch(
  //         `${process.env.NEXT_PUBLIC_API_URL}/cities/all?country=${country}`,
  //         { headers: { Authorization: `Bearer ${token}` } },
  //       );
  //       const resJson: CityApiResponse = await res.json();
  //       const formattedOptions = resJson.data.map((city) => ({
  //         label: city.name,
  //         value: city.name,
  //       }));
  //       setOptions(formattedOptions);
  //     } catch (error) {
  //       console.error("Failed to fetch cities:", error);
  //     }
  //   };
  //   fetchCities();
  // }, [country, token]);
  // // Fetch areas when country changes
  // useEffect(() => {
  //   const fetchAreas = async () => {
  //     if (!country || !token) return;
  //     try {
  //       const res = await fetch(
  //         `${process.env.NEXT_PUBLIC_API_URL}/areas/all?country=${country}`,
  //         { headers: { Authorization: `Bearer ${token}` } },
  //       );
  //       const resJson: AreaApiResponse = await res.json();
  //       const formattedOptions = resJson.data.map((area) => ({
  //         label: area.area_name,
  //         value: area.area_name,
  //       }));
  //       setOptions2(formattedOptions);
  //     } catch (error) {
  //       console.error("Failed to fetch areas:", error);
  //     }
  //   };
  //   fetchAreas();
  // }, [country, token]);
  // // Check if city is found
  // useEffect(() => {
  //   const flag = options.find((opt) => opt.value === selectedOption) ?? null;
  //   if (flag == null) {
  //     setCityFound(false);
  //   } else {
  //     setCityFound(true);
  //   }
  // }, [selectedOption, options]);
  // // Real-time date validation
  // useEffect(() => {
  //   const launchDate = watch("launch_date");
  //   const completionDate = watch("completion_date");
  //   if (launchDate && completionDate) {
  //     const launch = new Date(launchDate);
  //     const completion = new Date(completionDate);
  //     if (completion < launch) {
  //       setDateValidationError("Completion date must be after launch date");
  //     } else {
  //       setDateValidationError(null);
  //     }
  //   } else {
  //     setDateValidationError(null);
  //   }
  // }, [watch("launch_date"), watch("completion_date")]);
  // // Reset form when project data changes
  // // useEffect(() => {
  // //   if (projectData && isOpen) {
  // //     // Parse price_range (format: "0-1991365.00")
  // //     let priceMin = "0";
  // //     let priceMax = "0";
  // //     if (projectData.price_range) {
  // //       const priceParts = projectData.price_range.split("-");
  // //       if (priceParts.length >= 2) {
  // //         priceMin = priceParts[0];
  // //         priceMax = priceParts[1];
  // //       }
  // //     }
  // //     // Parse price_range_SQ (format: "7-1686")
  // //     let priceSqMin = "0";
  // //     let priceSqMax = "0";
  // //     if (projectData.price_range_SQ) {
  // //       const priceSqParts = projectData.price_range_SQ.split("-");
  // //       if (priceSqParts.length >= 2) {
  // //         priceSqMin = priceSqParts[0];
  // //         priceSqMax = priceSqParts[1];
  // //       }
  // //     }
  // //     console.log(projectData);
  // //     reset({
  // //       project_name: projectData.project_name ?? "",
  // //       status: projectData.status ?? "",
  // //       total_units: projectData.total_units ?? 0,
  // //       available_units: projectData.available_units ?? 0,
  // //       launch_date: projectData.launch_date ?? "",
  // //       completion_date: projectData.completion_date ?? "",
  // //       project_size: projectData.project_size ?? "",
  // //       description: projectData.description ?? "",
  // //       currency: projectData.currency ?? "AED",
  // //       price_min: priceMin,
  // //       price_max: priceMax,
  // //       price_sq_min: priceSqMin,
  // //       price_sq_max: priceSqMax,
  // //       price_range: projectData.price_range ?? "",
  // //       price_range_SQ: projectData.price_range_SQ ?? "",
  // //       project_type: projectData.project_type ?? "",
  // //       developer_id: projectData.developer?.developer_id ?? 0,
  // //       is_active: projectData.is_active ?? 1,
  // //       location_id: projectData.location?.location_id,
  // //     });
  // //     // Set location data
  // //     if (projectData.location) {
  // //       setLocationData({
  // //         latitude: parseFloat(projectData.location.latitude) || 0,
  // //         longitude: parseFloat(projectData.location.longitude) || 0,
  // //         landmark: projectData.location.landmark ?? "",
  // //         city_id: projectData.location.city?.name ?? "",
  // //         north_side: projectData.location.north_side ?? "",
  // //         south_side: projectData.location.south_side ?? "",
  // //         east_side: projectData.location.east_side ?? "",
  // //         west_side: projectData.location.west_side ?? "",
  // //         google_map_link: projectData.location.google_map_link ?? "",
  // //         area_id: projectData.location.area?.area_name ?? "",
  // //       });
  // //       setSelectedOption(projectData.location.city?.name ?? "");
  // //       setSelectedOption2(projectData.location.area?.area_name ?? "");
  // //       // Set country based on country ID: 1 = Egypt, 2 = UAE, 3 = Oman
  // //       const countryId = projectData.location.city?.country?.id;
  // //       let detectedCountry = "";
  // //       if (countryId === 1) {
  // //         detectedCountry = "Egypt";
  // //       } else if (countryId === 2) {
  // //         detectedCountry = "UAE";
  // //       } else if (countryId === 3) {
  // //         detectedCountry = "Oman";
  // //       } else if (projectData.location.city?.country?.name) {
  // //         // Fallback to country name if ID doesn't match
  // //         detectedCountry = projectData.location.city.country.name;
  // //       }
  // //       if (detectedCountry) {
  // //         setCountry(detectedCountry);
  // //         // Fetch cities and areas for the detected country
  // //         const fetchCities = async () => {
  // //           if (!token) return;
  // //           try {
  // //             const res = await fetch(
  // //               `${process.env.NEXT_PUBLIC_API_URL}/cities?country=${detectedCountry}`,
  // //               { headers: { Authorization: `Bearer ${token}` } },
  // //             );
  // //             const resJson: CityApiResponse = await res.json();
  // //             const formattedOptions = resJson.data.map((city) => ({
  // //               label: city.name,
  // //               value: city.name,
  // //             }));
  // //             setOptions(formattedOptions);
  // //           } catch (error) {
  // //             console.error("Failed to fetch cities:", error);
  // //           }
  // //         };
  // //         const fetchAreas = async () => {
  // //           if (!token) return;
  // //           try {
  // //             const res = await fetch(
  // //               `${process.env.NEXT_PUBLIC_API_URL}/areas?country=${detectedCountry}`,
  // //               { headers: { Authorization: `Bearer ${token}` } },
  // //             );
  // //             const resJson: AreaApiResponse = await res.json();
  // //             const formattedOptions = resJson.data.map((area) => ({
  // //               label: area.area_name,
  // //               value: area.area_name,
  // //             }));
  // //             setOptions2(formattedOptions);
  // //           } catch (error) {
  // //             console.error("Failed to fetch areas:", error);
  // //           }
  // //         };
  // //         fetchCities();
  // //         fetchAreas();
  // //       }
  // //     }
  // //   }
  // // }, [projectData, reset, isOpen]);
  // useEffect(() => {
  //   if (!projectData || !isOpen) return;
  //   // ---------- detect country ----------
  //   if (projectData.location) {
  //     const countryId = projectData.location.city?.country?.id;
  //     let detectedCountry = "";
  //     if (countryId === 1) detectedCountry = "Egypt";
  //     else if (countryId === 2) detectedCountry = "UAE";
  //     else if (countryId === 3) detectedCountry = "Oman";
  //     else detectedCountry = projectData.location.city?.country?.name || "";
  //     setCountry(detectedCountry);
  //     // ---------- set location only (NO RESET HERE) ----------
  //     setLocationData({
  //       latitude: parseFloat(projectData.location.latitude) || 0,
  //       longitude: parseFloat(projectData.location.longitude) || 0,
  //       landmark: projectData.location.landmark ?? "",
  //       city_id: projectData.location.city?.name ?? "",
  //       north_side: projectData.location.north_side ?? "",
  //       south_side: projectData.location.south_side ?? "",
  //       east_side: projectData.location.east_side ?? "",
  //       west_side: projectData.location.west_side ?? "",
  //       google_map_link: projectData.location.google_map_link ?? "",
  //       area_id: projectData.location.area?.area_name ?? "",
  //       description: projectData.location.description ?? "",
  //     });
  //     setSelectedOption(projectData.location.city?.name ?? "");
  //     setSelectedOption2(projectData.location.area?.area_name ?? "");
  //   }
  // }, [projectData, isOpen]);
  // useEffect(() => {
  //   if (!projectData) return;
  //   const cityExists = options.some(
  //     (opt) => opt.value === projectData.location?.city?.id,
  //   );
  //   const areaExists = options2.some(
  //     (opt) => opt.value === projectData.location?.area?.area_id,
  //   );
  //   if (cityExists && areaExists) {
  //     setIsLocationReady(true);
  //   }
  // }, [options, options2, projectData]);
  // useEffect(() => {
  //   if (!projectData) return;
  //   let priceMin = "0";
  //   let priceMax = "0";
  //   if (projectData.price_range) {
  //     const parts = projectData.price_range.split("-");
  //     if (parts.length >= 2) {
  //       priceMin = parts[0];
  //       priceMax = parts[1];
  //     }
  //   }
  //   let priceSqMin = "0";
  //   let priceSqMax = "0";
  //   if (projectData.price_range_SQ) {
  //     const parts = projectData.price_range_SQ.split("-");
  //     if (parts.length >= 2) {
  //       priceSqMin = parts[0];
  //       priceSqMax = parts[1];
  //     }
  //   }
  //   reset({
  //     project_name: projectData.project_name ?? "",
  //     status: projectData.status ?? "",
  //     total_units: projectData.total_units ?? 0,
  //     available_units: projectData.available_units ?? 0,
  //     launch_date: projectData.launch_date ?? "",
  //     completion_date: projectData.completion_date ?? "",
  //     project_size: projectData.project_size ?? "",
  //     description: projectData.description ?? "",
  //     currency: projectData.currency ?? "AED",
  //     price_min: priceMin,
  //     price_max: priceMax,
  //     price_sq_min: priceSqMin,
  //     price_sq_max: priceSqMax,
  //     price_range: projectData.price_range ?? "",
  //     price_range_SQ: projectData.price_range_SQ ?? "",
  //     project_type: projectData.project_type ?? "",
  //     developer_id: projectData.developer?.developer_id ?? 0,
  //     is_active: projectData.is_active ?? 1,
  //     location_id: projectData.location?.location_id,
  //     milestone_id: projectData.milestone_id ?? undefined,
  //     phase: projectData.phase ?? "",
  //     permit_no: projectData.permit_no ?? "",
  //   });
  // }, [isLocationReady, projectData, reset]);
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setLocationData((prev) => ({
  //     ...prev,
  //     [name]:
  //       name === "latitude" || name === "longitude"
  //         ? parseFloat(value) || 0
  //         : value,
  //   }));
  // };
  // // Expand short URL and extract coordinates
  // const expandShortUrl = async (
  //   shortUrl: string,
  // ): Promise<{ lat: number; lng: number } | null> => {
  //   const res = await fetch(
  //     `/api/expand-url?shortUrl=${encodeURIComponent(shortUrl)}`,
  //   );
  //   const data: ExpandUrlResponse = await res.json();
  //   return extractCoordinatesFromUrl(data.longUrl);
  // };
  // // Extract coordinates from Google Maps URL with more comprehensive patterns
  // const extractCoordinatesFromUrl = (
  //   url: string,
  // ): { lat: number; lng: number } | null => {
  //   try {
  //     const decodedUrl = decodeURIComponent(url);
  //     const patterns = [
  //       { regex: /@(-?\d+\.?\d*),(-?\d+\.?\d*)/, latFirst: true },
  //       { regex: /!3d(-?\d+\.?\d*).*?!4d(-?\d+\.?\d*)/, latFirst: true },
  //       { regex: /!4d(-?\d+\.?\d*).*?!3d(-?\d+\.?\d*)/, latFirst: false },
  //       { regex: /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/, latFirst: true },
  //       { regex: /[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/, latFirst: true },
  //       { regex: /[?&]center=(-?\d+\.?\d*),(-?\d+\.?\d*)/, latFirst: true },
  //       { regex: /[?&]sll=(-?\d+\.?\d*),(-?\d+\.?\d*)/, latFirst: true },
  //       { regex: /place\/.*?@(-?\d+\.?\d*),(-?\d+\.?\d*)/, latFirst: true },
  //       { regex: /data=.*?3d(-?\d+\.?\d*).*?4d(-?\d+\.?\d*)/, latFirst: true },
  //       {
  //         regex:
  //           /1s0x[a-f0-9]+:0x[a-f0-9]+.*?3d(-?\d+\.?\d*).*?4d(-?\d+\.?\d*)/,
  //         latFirst: true,
  //       },
  //       { regex: /pb=.*?2d(-?\d+\.?\d*).*?3d(-?\d+\.?\d*)/, latFirst: false },
  //     ];
  //     for (const { regex, latFirst } of patterns) {
  //       const match = decodedUrl.match(regex);
  //       if (match) {
  //         const lat = latFirst ? parseFloat(match[1]) : parseFloat(match[2]);
  //         const lng = latFirst ? parseFloat(match[2]) : parseFloat(match[1]);
  //         if (
  //           !isNaN(lat) &&
  //           !isNaN(lng) &&
  //           lat >= -90 &&
  //           lat <= 90 &&
  //           lng >= -180 &&
  //           lng <= 180
  //         ) {
  //           return { lat, lng };
  //         }
  //       }
  //     }
  //     return null;
  //   } catch (error) {
  //     console.error("Error extracting coordinates:", error);
  //     return null;
  //   }
  // };
  // // Get location details including city, area, and country from coordinates
  // const getLocationDetails = async (
  //   lat: number,
  //   lng: number,
  // ): Promise<LocationData | null> => {
  //   try {
  //     const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  //     if (!API_KEY) {
  //       throw new Error("Google Maps API key not found");
  //     }
  //     const geocodeResponse = await fetch(
  //       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`,
  //     );
  //     if (!geocodeResponse.ok) {
  //       throw new Error("Failed to fetch location data");
  //     }
  //     const geocodeData: GeocodeResponse = await geocodeResponse.json();
  //     if (geocodeData.results && geocodeData.results.length > 0) {
  //       const result = geocodeData.results[0];
  //       const addressComponents = result.address_components;
  //       let city_id = "";
  //       let area_id = "";
  //       const landmark = result.formatted_address;
  //       let state = "";
  //       for (const component of addressComponents) {
  //         const types = component.types;
  //         if (types.includes("sublocality") || types.includes("neighborhood")) {
  //           area_id = component.long_name;
  //         } else if (types.includes("locality")) {
  //           city_id = component.long_name;
  //         } else if (
  //           types.includes("administrative_area_level_2") &&
  //           !city_id
  //         ) {
  //           city_id = component.long_name;
  //         } else if (types.includes("administrative_area_level_1")) {
  //           state = component.long_name;
  //         } else if (types.includes("country")) {
  //           let detectedCountry = component.long_name.toLowerCase();
  //           if (detectedCountry === "united arab emirates")
  //             detectedCountry = "UAE";
  //           else if (detectedCountry === "egypt") detectedCountry = "Egypt";
  //           else if (detectedCountry === "oman") detectedCountry = "Oman";
  //           setCountry(detectedCountry);
  //         }
  //       }
  //       const directionalData = await getDirectionalReferences(lat, lng);
  //       return {
  //         latitude: lat,
  //         longitude: lng,
  //         landmark: landmark || "Unknown Location",
  //         city_id: city_id || state || "Unknown City",
  //         north_side: directionalData?.north || "N/A",
  //         south_side: directionalData?.south || "N/A",
  //         east_side: directionalData?.east || "N/A",
  //         west_side: directionalData?.west || "N/A",
  //         google_map_link: locationData.google_map_link,
  //         area_id: area_id || "Unknown Area",
  //         description: locationData.description,
  //       };
  //     }
  //     return null;
  //   } catch (error) {
  //     console.error("Error getting location details:", error);
  //     throw error;
  //   }
  // };
  // // Get directional references from coordinates
  // const getDirectionalReferences = async (
  //   lat: number,
  //   lng: number,
  // ): Promise<DirectionalReferencesResponse | null> => {
  //   try {
  //     const response = await fetch(`/api/get-nearby?lat=${lat}&lng=${lng}`);
  //     if (!response.ok) {
  //       throw new Error("Failed to get directional references");
  //     }
  //     return await response.json();
  //   } catch (error) {
  //     console.error("Error getting directional references:", error);
  //     return null;
  //   }
  // };
  // // Handle Google Maps link processing - using the pattern from create/page.tsx
  // const handleGoogleMapsLink = async () => {
  //   const link = locationData.google_map_link;
  //   if (!link.trim()) {
  //     setLocationData({
  //       latitude: 0,
  //       longitude: 0,
  //       landmark: "",
  //       city_id: "",
  //       north_side: "",
  //       south_side: "",
  //       east_side: "",
  //       west_side: "",
  //       google_map_link: "",
  //       area_id: "",
  //       description: locationData.description,
  //     });
  //     setGoogleMapsLinkError("Invalid Google Maps link format.");
  //     return;
  //   }
  //   setIsLoadingLocation(true);
  //   try {
  //     const coordinates = await expandShortUrl(link);
  //     if (!coordinates) {
  //       toast.error("Invalid Google Maps URL. Please provide a valid link.");
  //       setGoogleMapsLinkError("Invalid Google Maps link format.");
  //       return;
  //     }
  //     const details = await getLocationDetails(
  //       coordinates.lat,
  //       coordinates.lng,
  //     );
  //     if (details) {
  //       setLocationData(details);
  //       toast.success("Location details extracted successfully!");
  //       setSelectedOption(details.city_id);
  //       setSelectedOption2(details.area_id ?? "");
  //       setGoogleMapsLinkError(null);
  //     } else {
  //       toast.error(
  //         "Could not extract location details from the provided link.",
  //       );
  //       setGoogleMapsLinkError("Invalid Google Maps link format.");
  //     }
  //   } catch (error) {
  //     console.error("Error processing Google Maps link:", error);
  //     setGoogleMapsLinkError("Invalid Google Maps link format.");
  //     toast.error("Error processing the Google Maps link. Please try again.");
  //   } finally {
  //     setIsLoadingLocation(false);
  //   }
  // };
  // const mutation = useMutation({
  //   mutationFn: (data: any) => {
  //     if (!token) throw new Error("Not authenticated");
  //     if (!projectId) throw new Error("Project ID is required");
  //     return editProject(projectId, data, token);
  //   },
  //   onSuccess: () => {
  //     toast.success("Project updated successfully!");
  //     queryClient.invalidateQueries({ queryKey: ["projects"] });
  //     if (projectId) {
  //       queryClient.invalidateQueries({
  //         queryKey: ["projectDetails", String(projectId)],
  //       });
  //     }
  //     onClose();
  //   },
  //   onError: (error: any) => {
  //     console.log(error);
  //     const axiosError = error as AxiosError<{
  //       status?: string;
  //       errors?: Record<string, string>[];
  //       message?: string;
  //     }>;
  //     const errorList = axiosError?.response?.data?.errors;
  //     const flatMessages = errorList
  //       ? Object.values(errorList)
  //           .map((errObj) => Object.values(errObj))
  //           .flat()
  //           .join(", ")
  //       : "";
  //     const fallbackMessage =
  //       axiosError.response?.data?.message ||
  //       axiosError.message ||
  //       "Failed to update project.";
  //     setError("root", { message: flatMessages || fallbackMessage });
  //     toast.error(flatMessages || fallbackMessage);
  //   },
  // });
  // const handleClose = () => {
  //   reset();
  //   setLocationData({
  //     latitude: 0,
  //     longitude: 0,
  //     landmark: "",
  //     city_id: "",
  //     north_side: "",
  //     south_side: "",
  //     east_side: "",
  //     west_side: "",
  //     google_map_link: "",
  //     area_id: "",
  //     description: "",
  //   });
  //   setSelectedOption("");
  //   setSelectedOption2("");
  //   setCountry("");
  //   setOptions([]);
  //   setOptions2([]);
  //   onClose();
  // };
  // const handleFormSubmit = (formData: CreateProjectInput) => {
  //   if (dateValidationError) {
  //     toast.error(dateValidationError);
  //     return;
  //   }
  //   if (selectedOption2 == "Unknown Area") {
  //     setAreaError(true);
  //     areaErrorRef.current?.scrollIntoView({ behavior: "smooth" });
  //   } else {
  //     setAreaError(false);
  //     if (googleMapsLinkError != "Invalid Google Maps link format.") {
  //       const data = {
  //         ...formData,
  //         price_range: `${formData.price_min}-${formData.price_max}`,
  //         price_range_SQ: `${formData.price_sq_min}-${formData.price_sq_max}`,
  //         barcode: file,
  //         location: locationData,
  //       };
  //       // Transform the data to match the desired payload structure with nested location
  //       const apiData = {
  //         project_name: data.project_name,
  //         status: data.status,
  //         project_type: data.project_type,
  //         launch_date: data.launch_date,
  //         completion_date: data.completion_date ?? "",
  //         milestone_id: data.milestone_id || null,
  //         developer_id: data.developer_id,
  //         location: {
  //           google_map_link: data.location.google_map_link,
  //           north_side: data.location.north_side,
  //           south_side: data.location.south_side,
  //           east_side: data.location.east_side,
  //           west_side: data.location.west_side,
  //           landmark: data.location.landmark,
  //           description: data.location.description ?? "",
  //           latitude: data.location.latitude,
  //           longitude: data.location.longitude,
  //           area_id: data.location.area_id ?? "",
  //           city_id: data.location.city_id ?? "",
  //         },
  //         available_units: data.available_units,
  //         total_units: data.total_units,
  //         price_range: data.price_range,
  //         price_range_SQ: data.price_range_SQ,
  //         description: data.description ?? "",
  //         project_size: data.project_size ?? "",
  //         phase: data.phase ?? "",
  //         is_active: data.is_active ? 1 : 0,
  //         currency: data.currency,
  //         permit_no: data.permit_no ?? null,
  //       };
  //       console.log("Data being sent to the server:", apiData);
  //       mutation.mutate(apiData);
  //     }
  //   }
  // };
  // return (
  //   <Modal
  //     isOpen={isOpen}
  //     onClose={handleClose}
  //     title="Edit Project"
  //     size="full"
  //     showCloseButton={false}
  //     footer={
  //       <div className="flex gap-3">
  //         <Button
  //           variant="outline"
  //           onClick={handleClose}
  //           disabled={mutation.isPending}
  //         >
  //           Close
  //         </Button>
  //         <Button
  //           className="bg-teal-600 hover:bg-teal-700 text-white"
  //           onClick={handleSubmit(handleFormSubmit)}
  //           disabled={mutation.isPending || !!dateValidationError}
  //         >
  //           {mutation.isPending ? "Updating..." : "Update Project"}
  //         </Button>
  //       </div>
  //     }
  //   >
  //     <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
  //       {isLoadingProject ? (
  //         <div className="flex items-center justify-center py-12">
  //           <div className="text-center">
  //             <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
  //             <p className="mt-4 text-sm text-gray-600">
  //               Loading project data...
  //             </p>
  //           </div>
  //         </div>
  //       ) : (
  //         <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
  //           {/* Location Section */}
  //           <div className="bg-white rounded-lg border border-gray-200 p-6">
  //             <h2 className="text-lg font-semibold text-gray-900 mb-6">
  //               Location
  //             </h2>
  //             <div className="space-y-4">
  //               <div>
  //                 <Label htmlFor="google-maps-link">Google Maps Link</Label>
  //                 <div className="flex gap-2 mt-1">
  //                   <div className="relative flex-1">
  //                     <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
  //                     <Input
  //                       id="google-maps-link"
  //                       placeholder="Paste Google Maps link here..."
  //                       className="pl-10"
  //                       value={locationData.google_map_link}
  //                       onChange={(e) =>
  //                         setLocationData((prev) => ({
  //                           ...prev,
  //                           google_map_link: e.target.value,
  //                         }))
  //                       }
  //                     />
  //                   </div>
  //                   <Button
  //                     type="button"
  //                     onClick={handleGoogleMapsLink}
  //                     disabled={isLoadingLocation}
  //                     className="bg-teal-600 hover:bg-teal-700 text-white"
  //                   >
  //                     {isLoadingLocation ? "Processing..." : "Fetch Data"}
  //                   </Button>
  //                 </div>
  //                 {googleMapsLinkError && (
  //                   <p className="text-sm text-red-500 mt-1">
  //                     {googleMapsLinkError}
  //                   </p>
  //                 )}
  //                 {isLoadingLocation && (
  //                   <div className="flex items-center space-x-2 text-sm text-blue-600 mt-2">
  //                     <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
  //                     <span>Processing Google Maps link...</span>
  //                   </div>
  //                 )}
  //               </div>
  //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  //                 <div>
  //                   <Label htmlFor="latitude">
  //                     Latitude <span className="text-red-500">*</span>
  //                   </Label>
  //                   <Input
  //                     id="latitude"
  //                     type="number"
  //                     step="any"
  //                     placeholder="25.2048"
  //                     className="mt-1"
  //                     value={locationData.latitude || ""}
  //                     onChange={(e) => handleChange(e)}
  //                     name="latitude"
  //                   />
  //                 </div>
  //                 <div>
  //                   <Label htmlFor="longitude">
  //                     Longitude <span className="text-red-500">*</span>
  //                   </Label>
  //                   <Input
  //                     id="longitude"
  //                     type="number"
  //                     step="any"
  //                     placeholder="55.2708"
  //                     className="mt-1"
  //                     value={locationData.longitude || ""}
  //                     onChange={(e) => handleChange(e)}
  //                     name="longitude"
  //                   />
  //                 </div>
  //                 <div>
  //                   <Label htmlFor="city">
  //                     City <span className="text-red-500">*</span>
  //                   </Label>
  //                   <Select
  //                     value={selectedOption || ""}
  //                     onValueChange={(value) => {
  //                       setSelectedOption(value);
  //                       setLocationData((prev) => ({
  //                         ...prev,
  //                         city_id: value,
  //                       }));
  //                     }}
  //                   >
  //                     <SelectTrigger className="mt-1">
  //                       <SelectValue placeholder="Select City" />
  //                     </SelectTrigger>
  //                     <SelectContent>
  //                       {options.map((option) => (
  //                         <SelectItem key={option.value} value={option.value}>
  //                           {option.label}
  //                         </SelectItem>
  //                       ))}
  //                     </SelectContent>
  //                   </Select>
  //                   {!cityFound && (
  //                     <p className="text-sm text-red-500 mt-1">
  //                       City not found in database
  //                     </p>
  //                   )}
  //                 </div>
  //                 <div ref={areaErrorRef}>
  //                   <Label htmlFor="area">
  //                     Area <span className="text-red-500">*</span>
  //                   </Label>
  //                   <Select
  //                     value={selectedOption2 || ""}
  //                     onValueChange={(value) => {
  //                       setSelectedOption2(value);
  //                       setLocationData((prev) => ({
  //                         ...prev,
  //                         area_id: value,
  //                       }));
  //                     }}
  //                   >
  //                     <SelectTrigger className="mt-1">
  //                       <SelectValue placeholder="Select Area" />
  //                     </SelectTrigger>
  //                     <SelectContent>
  //                       {options2.map((option) => (
  //                         <SelectItem key={option.value} value={option.value}>
  //                           {option.label}
  //                         </SelectItem>
  //                       ))}
  //                     </SelectContent>
  //                   </Select>
  //                   {areaError && (
  //                     <p className="text-sm text-red-500 mt-1">
  //                       Area is not valid
  //                     </p>
  //                   )}
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //           {/* Directional References */}
  //           <div className="bg-white rounded-lg border border-gray-200 p-6">
  //             <h2 className="text-lg font-semibold text-gray-900 mb-6">
  //               Directional References
  //             </h2>
  //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
  //               <div>
  //                 <Label htmlFor="south-side">
  //                   South Side <span className="text-red-500">*</span>
  //                 </Label>
  //                 <Input
  //                   id="south-side"
  //                   placeholder="Near Burj Khalifa"
  //                   className="mt-1"
  //                   value={locationData.south_side}
  //                   onChange={(e) => handleChange(e)}
  //                   name="south_side"
  //                 />
  //               </div>
  //               <div>
  //                 <Label htmlFor="east-side">
  //                   East Side <span className="text-red-500">*</span>
  //                 </Label>
  //                 <Input
  //                   id="east-side"
  //                   placeholder="Near Burj Khalifa"
  //                   className="mt-1"
  //                   value={locationData.east_side}
  //                   onChange={(e) => handleChange(e)}
  //                   name="east_side"
  //                 />
  //               </div>
  //               <div>
  //                 <Label htmlFor="west-side">
  //                   West Side <span className="text-red-500">*</span>
  //                 </Label>
  //                 <Input
  //                   id="west-side"
  //                   placeholder="Near Burj Khalifa"
  //                   className="mt-1"
  //                   value={locationData.west_side}
  //                   onChange={(e) => handleChange(e)}
  //                   name="west_side"
  //                 />
  //               </div>
  //               <div>
  //                 <Label htmlFor="north-side">
  //                   North Side <span className="text-red-500">*</span>
  //                 </Label>
  //                 <Input
  //                   id="north-side"
  //                   placeholder="Near Burj Khalifa"
  //                   className="mt-1"
  //                   value={locationData.north_side}
  //                   onChange={(e) => handleChange(e)}
  //                   name="north_side"
  //                 />
  //               </div>
  //               <div>
  //                 <Label htmlFor="landmark">
  //                   Landmark <span className="text-red-500">*</span>
  //                 </Label>
  //                 <Input
  //                   id="landmark"
  //                   placeholder="Near Burj Khalifa"
  //                   className="mt-1"
  //                   value={locationData.landmark}
  //                   onChange={(e) => handleChange(e)}
  //                   name="landmark"
  //                 />
  //               </div>
  //             </div>
  //           </div>
  //           {/* Short Description */}
  //           <div className="bg-white rounded-lg border border-gray-200 p-6">
  //             <div className="mb-2">
  //               <Label htmlFor="description">Short Description</Label>
  //             </div>
  //             <RichTextEditor
  //               content={watch("description") || ""}
  //               onChange={(content) => setValue("description", content)}
  //             />
  //             {errors.description && (
  //               <p className="text-sm text-red-500 mt-1">
  //                 {errors.description.message}
  //               </p>
  //             )}
  //             {/* Description Preview with HTML */}
  //             {/* {watch("description") && (
  //               <div className="mt-4 p-4 bg-gray-50 rounded-lg">
  //                 <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
  //                 <div
  //                   className="prose prose-sm max-w-none text-gray-600"
  //                   dangerouslySetInnerHTML={{ __html: watch("description") || "" }}
  //                 />
  //               </div>
  //             )} */}
  //           </div>
  //           {/* Two-Column Layout for Basic Info and Units Info */}
  //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  //             {/* Basic Information */}
  //             <div className="bg-white rounded-lg border border-gray-200 p-6">
  //               <h2 className="text-lg font-semibold text-gray-900 mb-6">
  //                 Basic Information
  //               </h2>
  //               <div className="space-y-4">
  //                 <div>
  //                   <Label htmlFor="project-name">
  //                     Project Name <span className="text-red-500">*</span>
  //                   </Label>
  //                   <Input
  //                     id="project-name"
  //                     placeholder="e.g. Gulf Tower"
  //                     className="mt-1"
  //                     {...register("project_name")}
  //                   />
  //                   {errors.project_name && (
  //                     <p className="text-sm text-red-500 mt-1">
  //                       {errors.project_name.message}
  //                     </p>
  //                   )}
  //                 </div>
  //                 <div>
  //                   <Label htmlFor="developer">Developer</Label>
  //                   <Input
  //                     name="developer_id"
  //                     type="hidden"
  //                     value={choosenDeveloper?.developer_id}
  //                   />
  //                   <Input
  //                     id="developer"
  //                     className="mt-1"
  //                     value={choosenDeveloper?.name || ""}
  //                     disabled
  //                   />
  //                 </div>
  //                 <div>
  //                   <Label htmlFor="project-type">
  //                     Project type <span className="text-red-500">*</span>
  //                   </Label>
  //                   <Select
  //                     value={watch("project_type") || ""}
  //                     onValueChange={(value) => setValue("project_type", value)}
  //                   >
  //                     <SelectTrigger className="mt-1">
  //                       <SelectValue placeholder="Select type" />
  //                     </SelectTrigger>
  //                     <SelectContent>
  //                       <SelectItem value="residential">Residential</SelectItem>
  //                       <SelectItem value="commercial">Commercial</SelectItem>
  //                       <SelectItem value="mixed-use">Mixed-Use</SelectItem>
  //                     </SelectContent>
  //                   </Select>
  //                   {errors.project_type && (
  //                     <p className="text-sm text-red-500 mt-1">
  //                       {errors.project_type.message}
  //                     </p>
  //                   )}
  //                 </div>
  //                 <div>
  //                   <Label htmlFor="country">Country</Label>
  //                   <Select
  //                     value={country}
  //                     onValueChange={(value) => setCountry(value)}
  //                   >
  //                     <SelectTrigger className="mt-1">
  //                       <SelectValue placeholder="Select Country" />
  //                     </SelectTrigger>
  //                     <SelectContent>
  //                       <SelectItem value="UAE">UAE</SelectItem>
  //                       <SelectItem value="Egypt">Egypt</SelectItem>
  //                       <SelectItem value="Oman">Oman</SelectItem>
  //                     </SelectContent>
  //                   </Select>
  //                 </div>
  //                 <div>
  //                   <Label htmlFor="status">Status</Label>
  //                   <Select
  //                     value={watch("status") || ""}
  //                     onValueChange={(value) => setValue("status", value)}
  //                   >
  //                     <SelectTrigger className="mt-1">
  //                       <SelectValue placeholder="Select Status" />
  //                     </SelectTrigger>
  //                     <SelectContent>
  //                       <SelectItem value="ongoing">Ongoing</SelectItem>
  //                       <SelectItem value="completed">Completed</SelectItem>
  //                       <SelectItem value="upcoming">Upcoming</SelectItem>
  //                     </SelectContent>
  //                   </Select>
  //                 </div>
  //               </div>
  //             </div>
  //             {/* Units Information */}
  //             <div className="bg-white rounded-lg border border-gray-200 p-6">
  //               <h2 className="text-lg font-semibold text-gray-900 mb-6">
  //                 Units Information
  //               </h2>
  //               <div className="space-y-4">
  //                 <div>
  //                   <Label htmlFor="total-units">
  //                     Total Units <span className="text-red-500">*</span>
  //                   </Label>
  //                   <Input
  //                     id="total-units"
  //                     type="number"
  //                     placeholder="2555"
  //                     className="mt-1"
  //                     {...register("total_units", { valueAsNumber: true })}
  //                   />
  //                   {errors.total_units && (
  //                     <p className="text-sm text-red-500 mt-1">
  //                       {errors.total_units.message}
  //                     </p>
  //                   )}
  //                 </div>
  //                 <div>
  //                   <Label htmlFor="available-units">
  //                     Available Units <span className="text-red-500">*</span>
  //                   </Label>
  //                   <Input
  //                     id="available-units"
  //                     type="number"
  //                     placeholder="45"
  //                     className="mt-1"
  //                     {...register("available_units", { valueAsNumber: true })}
  //                   />
  //                   {errors.available_units && (
  //                     <p className="text-sm text-red-500 mt-1">
  //                       {errors.available_units.message}
  //                     </p>
  //                   )}
  //                 </div>
  //                 <div>
  //                   <Label htmlFor="launch-date">
  //                     Launch Date <span className="text-red-500">*</span>
  //                   </Label>
  //                   <Input
  //                     id="launch-date"
  //                     type="date"
  //                     placeholder="mm/dd/yyyy"
  //                     className="mt-1"
  //                     {...register("launch_date")}
  //                   />
  //                   {errors.launch_date && (
  //                     <p className="text-sm text-red-500 mt-1">
  //                       {errors.launch_date.message}
  //                     </p>
  //                   )}
  //                 </div>
  //                 <div>
  //                   <Label htmlFor="completion-date">Completion Date</Label>
  //                   <Input
  //                     id="completion-date"
  //                     type="date"
  //                     placeholder="mm/dd/yyyy"
  //                     className="mt-1"
  //                     {...register("completion_date")}
  //                   />
  //                   {errors.completion_date && (
  //                     <p className="text-sm text-red-500 mt-1">
  //                       {errors.completion_date.message}
  //                     </p>
  //                   )}
  //                   {dateValidationError && (
  //                     <p className="text-sm text-red-500 mt-1">
  //                       {dateValidationError}
  //                     </p>
  //                   )}
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //           {/* Pricing */}
  //           <div className="bg-white rounded-lg border border-gray-200 p-6">
  //             <h2 className="text-lg font-semibold text-gray-900 mb-6">
  //               Pricing
  //             </h2>
  //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //               <div>
  //                 <Label htmlFor="currency">
  //                   Currency <span className="text-red-500">*</span>
  //                 </Label>
  //                 <Select
  //                   value={watch("currency") || ""}
  //                   onValueChange={(value) => setValue("currency", value)}
  //                 >
  //                   <SelectTrigger className="mt-1">
  //                     <SelectValue placeholder="Select currency" />
  //                   </SelectTrigger>
  //                   <SelectContent>
  //                     <SelectItem value="AED">AED</SelectItem>
  //                     <SelectItem value="USD">USD</SelectItem>
  //                     <SelectItem value="EGP">EGP</SelectItem>
  //                   </SelectContent>
  //                 </Select>
  //                 {errors.currency && (
  //                   <p className="text-sm text-red-500 mt-1">
  //                     {errors.currency.message}
  //                   </p>
  //                 )}
  //               </div>
  //               <div>
  //                 <Label htmlFor="min-price">
  //                   Min Price <span className="text-red-500">*</span>
  //                 </Label>
  //                 <Input
  //                   id="min-price"
  //                   type="number"
  //                   placeholder="500000"
  //                   className="mt-1"
  //                   {...register("price_min")}
  //                 />
  //                 {errors.price_min && (
  //                   <p className="text-sm text-red-500 mt-1">
  //                     {errors.price_min.message}
  //                   </p>
  //                 )}
  //               </div>
  //               <div>
  //                 <Label htmlFor="max-price">
  //                   Max Price <span className="text-red-500">*</span>
  //                 </Label>
  //                 <Input
  //                   id="max-price"
  //                   type="number"
  //                   placeholder="1000000"
  //                   className="mt-1"
  //                   {...register("price_max")}
  //                 />
  //                 {errors.price_max && (
  //                   <p className="text-sm text-red-500 mt-1">
  //                     {errors.price_max.message}
  //                   </p>
  //                 )}
  //               </div>
  //               <div>
  //                 <Label htmlFor="price-per-min">
  //                   Price per m (Min) <span className="text-red-500">*</span>
  //                 </Label>
  //                 <Input
  //                   id="price-per-min"
  //                   type="number"
  //                   placeholder="500"
  //                   className="mt-1"
  //                   {...register("price_sq_min")}
  //                 />
  //                 {errors.price_sq_min && (
  //                   <p className="text-sm text-red-500 mt-1">
  //                     {errors.price_sq_min.message}
  //                   </p>
  //                 )}
  //               </div>
  //               <div>
  //                 <Label htmlFor="price-per-max">
  //                   Price per m (Max) <span className="text-red-500">*</span>
  //                 </Label>
  //                 <Input
  //                   id="price-per-max"
  //                   type="number"
  //                   placeholder="1000"
  //                   className="mt-1"
  //                   {...register("price_sq_max")}
  //                 />
  //                 {errors.price_sq_max && (
  //                   <p className="text-sm text-red-500 mt-1">
  //                     {errors.price_sq_max.message}
  //                   </p>
  //                 )}
  //               </div>
  //               <div>
  //                 <Label htmlFor="project-area">
  //                   Project Area (m) <span className="text-red-500">*</span>
  //                 </Label>
  //                 <Input
  //                   id="project-area"
  //                   type="number"
  //                   placeholder="5000"
  //                   className="mt-1"
  //                   {...register("project_size")}
  //                 />
  //               </div>
  //             </div>
  //           </div>
  //         </form>
  //       )}
  //     </div>
  //   </Modal>
  // );
}
