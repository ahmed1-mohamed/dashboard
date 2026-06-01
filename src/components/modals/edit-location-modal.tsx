"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Navigation,
  Landmark,
  FileText,
  Loader2,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { useEditLocationData } from "@/hooks/use-edit-location";
import { useLocationActions } from "@/hooks/use-location-actions";



interface EditLocationModalProps {
  locationId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface DirectionalReferences {
  north?: string;
  south?: string;
  east?: string;
  west?: string;
}

export function EditLocationModal({
  locationId,
  isOpen,
  onClose,
  onSuccess,
}: EditLocationModalProps) {
  // const [formData, setFormData] = useState({
  //   locationName: "",
  //   areaId: "",
  //   cityId: "",
  //   googleMapLink: "",
  //   latitude: "",
  //   longitude: "",
  //   northSide: "",
  //   southSide: "",
  //   eastSide: "",
  //   westSide: "",
  //   landmark: "",
  //   description: "",
  // });

  // const [isExtracting, setIsExtracting] = useState(false);

  // // Fetch data
  // const { locationData, cities, areas, loading } = useEditLocationData(locationId, isOpen);
  // const { updateLocation, isUpdating } = useLocationActions();

  // // Set form data from fetched location
  // useEffect(() => {
  //   if (locationData) {
  //     const data = locationData;
  //     setFormData({
  //       locationName: data.area?.area_name || "",
  //       areaId: String(data.area?.area_id || ""),
  //       cityId: String(data.city?.id || ""),
  //       googleMapLink: data.google_map_link || "",
  //       latitude: data.latitude || "",
  //       longitude: data.longitude || "",
  //       northSide: data.north_side || "",
  //       southSide: data.south_side || "",
  //       eastSide: data.east_side || "",
  //       westSide: data.west_side || "",
  //       landmark: data.landmark || "",
  //       description: data.description || "",
  //     });
  //   }
  // }, [locationData]);



  // // Check if URL is a short Google Maps link that needs expansion
  // const isShortGoogleMapsUrl = (url: string): boolean => {
  //   const shortPatterns = [
  //     /maps\.app\.goo\.gl/i,
  //     /goo\.gl\/maps/i,
  //     /goo\.gl\/m/i,
  //   ];
  //   return shortPatterns.some((pattern) => pattern.test(url));
  // };

  // // Expand short URL to get the full URL
  // const expandShortUrl = async (url: string): Promise<string | null> => {
  //   try {
  //     const response = await fetch(
  //       `/api/expand-url?shortUrl=${encodeURIComponent(url)}`,
  //     );
  //     if (!response.ok) return null;
  //     const data = await response.json();
  //     return data.longUrl || null;
  //   } catch (error) {
  //     console.error("Error expanding URL:", error);
  //     return null;
  //   }
  // };

  // // Extract coordinates from Google Maps link
  // const extractCoordinatesFromLink = async (
  //   link: string,
  // ): Promise<{ lat: number; lng: number } | null> => {
  //   let urlToProcess = link;

  //   if (isShortGoogleMapsUrl(link)) {
  //     toast.info("Expanding short link...");
  //     const expandedUrl = await expandShortUrl(link);
  //     if (!expandedUrl) {
  //       toast.error(
  //         "Could not expand the short link. Please use a full Google Maps link.",
  //       );
  //       return null;
  //     }
  //     urlToProcess = expandedUrl;
  //   }

  //   const match =
  //     urlToProcess.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/) ||
  //     urlToProcess.match(/q=(-?\d+\.?\d*),(-?\d+\.?\d*)/) ||
  //     urlToProcess.match(/place\/(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  //   if (match) {
  //     return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  //   }
  //   return null;
  // };

  // // Get directional references from API
  // const getDirectionalReferences = async (
  //   lat: number,
  //   lng: number,
  // ): Promise<DirectionalReferences> => {
  //   try {
  //     const res = await fetch(`/api/get-nearby?lat=${lat}&lng=${lng}`);
  //     const data = await res.json();
  //     return data;
  //   } catch (error) {
  //     console.error("Error getting directional references:", error);
  //     return {};
  //   }
  // };

  // // Extract location details using Google Geocoding API
  // const extractLocationDetails = async (link: string) => {
  //   const coords = await extractCoordinatesFromLink(link);
  //   if (!coords) {
  //     toast.error("Invalid Google Maps link. Could not extract coordinates.");
  //     return;
  //   }

  //   setIsExtracting(true);

  //   try {
  //     const API_KEY = "AIzaSyA7pPVZpga50Hvurvanqkal3QEF9LPbG-g";
  //     if (!API_KEY) {
  //       toast.error("Google Maps API key not configured");
  //       return;
  //     }

  //     const geocodeResponse = await fetch(
  //       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${API_KEY}`,
  //     );

  //     if (!geocodeResponse.ok) {
  //       throw new Error("Failed to fetch location data");
  //     }

  //     const geocodeData = await geocodeResponse.json();

  //     if (geocodeData.results && geocodeData.results.length > 0) {
  //       const result = geocodeData.results[0];
  //       const addressComponents = result.address_components;

  //       let cityNameExtracted = "";
  //       let areaNameExtracted = "";

  //       for (const component of addressComponents) {
  //         const types = component.types;

  //         if (types.includes("sublocality") || types.includes("neighborhood")) {
  //           areaNameExtracted = component.long_name;
  //         } else if (types.includes("locality")) {
  //           cityNameExtracted = component.long_name;
  //         } else if (
  //           types.includes("administrative_area_level_2") &&
  //           !cityNameExtracted
  //         ) {
  //           cityNameExtracted = component.long_name;
  //         } else if (types.includes("administrative_area_level_1")) {
  //           if (!cityNameExtracted) cityNameExtracted = component.long_name;
  //         }
  //       }

  //       const directionalData = await getDirectionalReferences(
  //         coords.lat,
  //         coords.lng,
  //       );

  //       setFormData((prev) => ({
  //         ...prev,
  //         googleMapLink: link,
  //         latitude: String(coords.lat),
  //         longitude: String(coords.lng),
  //         cityId: cityNameExtracted || prev.cityId,
  //         areaId: areaNameExtracted || prev.areaId,
  //         landmark: result.formatted_address || prev.landmark,
  //         northSide: directionalData.north || "",
  //         southSide: directionalData.south || "",
  //         eastSide: directionalData.east || "",
  //         westSide: directionalData.west || "",
  //       }));

  //       toast.success("Location details extracted successfully!");
  //     } else {
  //       toast.error("Could not find location details for the provided link.");
  //     }
  //   } catch (error) {
  //     console.error("Error extracting location details:", error);
  //     toast.error("Failed to extract location details. Please try again.");
  //   } finally {
  //     setIsExtracting(false);
  //   }
  // };

  // const handleGoogleMapLinkChange = (value: string) => {
  //   setFormData({ ...formData, googleMapLink: value });
  // };

  // const handleExtractLocation = () => {
  //   if (formData.googleMapLink) {
  //     extractLocationDetails(formData.googleMapLink);
  //   }
  // };

  // const handleSubmit = async () => {
  //   if (!formData.areaId || !formData.cityId) {
  //     toast.error("Please select both City and Area");
  //     return;
  //   }

  //   const payload = {
  //     location_name_en: formData.locationName,
  //     location_name_ar: formData.locationName,
  //     area_id: Number(formData.areaId) || 1,
  //     city_id: Number(formData.cityId) || 1,
  //     google_map_link: formData.googleMapLink,
  //     north_side: formData.northSide,
  //     south_side: formData.southSide,
  //     east_side: formData.eastSide,
  //     west_side: formData.westSide,
  //     landmark: formData.landmark ? [formData.landmark] : undefined,
  //     description: formData.description,
  //     latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
  //     longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
  //   };

  //   await updateLocation({ locationId, data: payload });
  //   onSuccess();
  //   onClose();
  // };

  // const handleClose = () => {
  //   onClose();
  // };

  // if (!isOpen) return null;

  // return (
  //   <Modal
  //     isOpen={isOpen}
  //     onClose={handleClose}
  //     title="Edit Location"
  //     size="lg"
  //     showCloseButton={false}
  //     footer={
  //       <div className="flex gap-3 justify-end w-full">
  //         <Button variant="outline" onClick={handleClose}>
  //           Close
  //         </Button>
  //         <Button
  //           className="bg-teal-600 hover:bg-teal-700 text-white"
  //           onClick={handleSubmit}
  //           disabled={isUpdating || loading}
  //         >
  //           {isUpdating ? (
  //             <>
  //               <Loader2 className="h-4 w-4 mr-2 animate-spin" />
  //               Saving...
  //             </>
  //           ) : (
  //             "Save Changes"
  //           )}
  //         </Button>
  //       </div>
  //     }
  //   >
  //     {loading ? (
  //       <div className="flex items-center justify-center py-12">
  //         <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
  //       </div>
  //     ) : (
  //       <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
  //         {/* Location Name */}
  //         <div>
  //           <Label htmlFor="location-name">
  //             Location Name <span className="text-red-500">*</span>
  //           </Label>
  //           <Input
  //             id="location-name"
  //             placeholder="e.g. Central Plaza"
  //             value={formData.locationName}
  //             onChange={(e) =>
  //               setFormData({ ...formData, locationName: e.target.value })
  //             }
  //             className="mt-1"
  //           />
  //         </div>

  //         {/* Google Maps Link with Extract Button */}
  //         <div>
  //           <Label htmlFor="google-map-link">
  //             Google Maps Link <span className="text-red-500">*</span>
  //           </Label>
  //           <div className="flex gap-2 mt-1">
  //             <div className="relative flex-1">
  //               <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
  //               <Input
  //                 id="google-map-link"
  //                 placeholder="https://maps.google.com/?q=40.7128,-74.0060"
  //                 value={formData.googleMapLink}
  //                 onChange={(e) => handleGoogleMapLinkChange(e.target.value)}
  //                 className="pl-10"
  //               />
  //             </div>
  //             <Button
  //               type="button"
  //               onClick={handleExtractLocation}
  //               disabled={!formData.googleMapLink || isExtracting}
  //               className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
  //             >
  //               {isExtracting ? (
  //                 <Loader2 className="h-4 w-4 animate-spin" />
  //               ) : (
  //                 <>
  //                   <Search className="h-4 w-4 mr-2" />
  //                   Extract
  //                 </>
  //               )}
  //             </Button>
  //           </div>
  //           <p className="text-xs text-gray-500 mt-1">
  //             Paste a Google Maps link and click Extract to auto-fill location
  //             details
  //           </p>
  //         </div>

  //         {/* City and Area Row */}
  //         <div className="grid grid-cols-2 gap-4">
  //           <div>
  //             <Label htmlFor="city">City</Label>
  //             <Select
  //               value={formData.cityId}
  //               onValueChange={(value) =>
  //                 setFormData({ ...formData, cityId: value })
  //               }
  //             >
  //               <SelectTrigger className="mt-1">
  //                 <SelectValue
  //                   placeholder={
  //                     loadingCities ? "Loading cities..." : "Select a city"
  //                   }
  //                 />
  //               </SelectTrigger>
  //               <SelectContent>
  //                 {cities.map((city) => (
  //                   <SelectItem key={city.value} value={city.value}>
  //                     {city.label}
  //                   </SelectItem>
  //                 ))}
  //               </SelectContent>
  //             </Select>
  //           </div>
  //           <div>
  //             <Label htmlFor="area">Area</Label>
  //             <Select
  //               value={formData.areaId}
  //               onValueChange={(value) =>
  //                 setFormData({ ...formData, areaId: value })
  //               }
  //             >
  //               <SelectTrigger className="mt-1">
  //                 <SelectValue
  //                   placeholder={
  //                     loadingAreas ? "Loading areas..." : "Select an area"
  //                   }
  //                 />
  //               </SelectTrigger>
  //               <SelectContent>
  //                 {areas.map((area) => (
  //                   <SelectItem key={area.value} value={area.value}>
  //                     {area.label}
  //                   </SelectItem>
  //                 ))}
  //               </SelectContent>
  //             </Select>
  //           </div>
  //         </div>

  //         {/* Coordinates Row */}
  //         <div className="grid grid-cols-2 gap-4">
  //           <div>
  //             <Label htmlFor="latitude">Latitude</Label>
  //             <Input
  //               id="latitude"
  //               placeholder="e.g. 40.7128"
  //               value={formData.latitude}
  //               onChange={(e) =>
  //                 setFormData({ ...formData, latitude: e.target.value })
  //               }
  //               className="mt-1"
  //             />
  //           </div>
  //           <div>
  //             <Label htmlFor="longitude">Longitude</Label>
  //             <Input
  //               id="longitude"
  //               placeholder="e.g. -74.0060"
  //               value={formData.longitude}
  //               onChange={(e) =>
  //                 setFormData({ ...formData, longitude: e.target.value })
  //               }
  //               className="mt-1"
  //             />
  //           </div>
  //         </div>

  //         {/* Boundaries Section */}
  //         <div className="border-t pt-4">
  //           <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
  //             <Navigation className="h-4 w-4" />
  //             Boundaries
  //           </h4>
  //           <div className="grid grid-cols-2 gap-4">
  //             <div>
  //               <Label htmlFor="north-side">North Side</Label>
  //               <Input
  //                 id="north-side"
  //                 placeholder="e.g. Main Street"
  //                 value={formData.northSide}
  //                 onChange={(e) =>
  //                   setFormData({ ...formData, northSide: e.target.value })
  //                 }
  //                 className="mt-1"
  //               />
  //             </div>
  //             <div>
  //               <Label htmlFor="south-side">South Side</Label>
  //               <Input
  //                 id="south-side"
  //                 placeholder="e.g. Park Avenue"
  //                 value={formData.southSide}
  //                 onChange={(e) =>
  //                   setFormData({ ...formData, southSide: e.target.value })
  //                 }
  //                 className="mt-1"
  //               />
  //             </div>
  //             <div>
  //               <Label htmlFor="east-side">East Side</Label>
  //               <Input
  //                 id="east-side"
  //                 placeholder="e.g. River Road"
  //                 value={formData.eastSide}
  //                 onChange={(e) =>
  //                   setFormData({ ...formData, eastSide: e.target.value })
  //                 }
  //                 className="mt-1"
  //               />
  //             </div>
  //             <div>
  //               <Label htmlFor="west-side">West Side</Label>
  //               <Input
  //                 id="west-side"
  //                 placeholder="e.g. Highway 101"
  //                 value={formData.westSide}
  //                 onChange={(e) =>
  //                   setFormData({ ...formData, westSide: e.target.value })
  //                 }
  //                 className="mt-1"
  //               />
  //             </div>
  //           </div>
  //         </div>

  //         {/* Landmark */}
  //         <div>
  //           <Label htmlFor="landmark" className="flex items-center gap-2">
  //             <Landmark className="h-4 w-4" />
  //             Landmark
  //           </Label>
  //           <Input
  //             id="landmark"
  //             placeholder="e.g. Central Plaza"
  //             value={formData.landmark}
  //             onChange={(e) =>
  //               setFormData({ ...formData, landmark: e.target.value })
  //             }
  //             className="mt-1"
  //           />
  //         </div>

  //         {/* Description */}
  //         <div>
  //           <Label htmlFor="description" className="flex items-center gap-2">
  //             <FileText className="h-4 w-4" />
  //             Description
  //           </Label>
  //           <Textarea
  //             id="description"
  //             placeholder="Describe the location..."
  //             value={formData.description}
  //             onChange={(e) =>
  //               setFormData({ ...formData, description: e.target.value })
  //             }
  //             className="mt-1"
  //             rows={3}
  //           />
  //         </div>
  //       </div>
  //     )}
  //   </Modal>
  // );
}
