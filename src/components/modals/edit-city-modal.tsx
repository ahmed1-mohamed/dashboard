"use client";

import { useState, useEffect } from "react";
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
import { Check, Loader2 } from "lucide-react";
import { useEditCityData } from "@/hooks/use-edit-city";
import { useCityActions } from "@/hooks/use-city-actions";

interface Country {
  id: number;
  name: string;
}

interface State {
  id: number;
  name: string;
  country_id: number;
  created_at: string | null;
  updated_at: string | null;
  country?: {
    id: number;
    name: string;
  };
}

interface CityDetails {
  id: number;
  name: string;
  created_at: string | null;
  updated_at: string | null;
  country: {
    id: number;
    name: string;
    language: string;
    phone_no: string;
    whatsapp_no: string;
    email: string;
    timezone: string;
    currency: string;
    dimension_unit: string;
    created_at: string | null;
    updated_at: string | null;
  };
  state: {
    id: number;
    name: string;
    country_id: number;
    created_at: string | null;
    updated_at: string | null;
  };
}

interface EditCityModalProps {
  cityId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditCityModal({
  cityId,
  isOpen,
  onClose,
  onSuccess,
}: EditCityModalProps) {
  return <>page</>;
  // const [formData, setFormData] = useState({
  //   cityName: "",
  //   countryId: 0,
  //   countryName: "",
  //   stateId: 0,
  //   stateName: "",
  // });

  // // Fetch data
  // const { cityData, countries, states, loading } = useEditCityData(cityId, isOpen, formData.countryId || undefined);

  // const { updateCity, isUpdating } = useCityActions();

  // // Set form data from fetched city
  // useEffect(() => {
  //   if (cityData?.data) {
  //     const data = cityData.data;
  //     setFormData({
  //       cityName: data.name || "",
  //       countryId: data.country?.id || 0,
  //       countryName: data.country?.name || "",
  //       stateId: data.state?.id || 0,
  //       stateName: data.state?.name || "",
  //     });
  //   }
  // }, [cityData]);



  // const handleCountryChange = (countryId: string) => {
  //   const country = countries.find((c) => c.id.toString() === countryId);
  //   setFormData({
  //     ...formData,
  //     countryId: country ? country.id : 0,
  //     countryName: country ? country.name : "",
  //     stateId: 0,
  //     stateName: "",
  //   });
  //   setStates([]);
  // };

  // const handleStateChange = (stateId: string) => {
  //   const state = states.find((s) => s.id.toString() === stateId);
  //   setFormData({
  //     ...formData,
  //     stateId: state ? state.id : 0,
  //     stateName: state ? state.name : "",
  //   });
  // };

  // const handleSubmit = async () => {
  //   // Validate required fields
  //   if (!formData.cityName || !formData.countryId || !formData.stateId) {
  //     toast.error("Please fill in all required fields");
  //     return;
  //   }

  //   await updateCity({
  //     cityId,
  //     data: {
  //       name: formData.cityName,
  //       state_id: formData.stateId,
  //     },
  //   });
  //   onSuccess();
  //   onClose();
  // };

  // const handleClose = () => {
  //   // Reset form
  //   setFormData({
  //     cityName: "",
  //     countryId: 0,
  //     countryName: "",
  //     stateId: 0,
  //     stateName: "",
  //   });
  //   setStates([]);
  //   setCityData(null);
  //   onClose();
  // };

  // if (!isOpen) return null;



  // return (
  //   <Modal
  //     isOpen={isOpen}
  //     onClose={handleClose}
  //     title="Edit City"
  //     size="md"
  //     showCloseButton={false}
  //     footer={
  //       <div className="flex gap-3 justify-end w-full">
  //         <Button variant="outline" onClick={handleClose}>
  //           Cancel
  //         </Button>
  //         <Button
  //           className="bg-teal-600 hover:bg-teal-700 text-white"
  //           onClick={handleSubmit}
  //           disabled={
  //             isUpdating ||
  //             !formData.cityName ||
  //             !formData.countryId ||
  //             !formData.stateId
  //           }
  //         >
  //           {isSaving ? (
  //             <>
  //               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
  //               Saving...
  //             </>
  //           ) : (
  //             <>
  //               <Check className="w-4 h-4 mr-2" />
  //               Save Changes
  //             </>
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
  //       <div className="space-y-5">
  //         {/* City ID (Read-only) */}
  //         <div className="p-3 bg-gray-50 rounded-lg">
  //           <span className="text-sm text-gray-500">City ID: </span>
  //           <span className="font-medium text-gray-900">{cityId}</span>
  //         </div>

  //         {/* City Name */}
  //         <div>
  //           <Label htmlFor="edit-city-name">
  //             City name <span className="text-red-500">*</span>
  //           </Label>
  //           <Input
  //             id="edit-city-name"
  //             placeholder="e.g. Nasr City"
  //             value={formData.cityName}
  //             onChange={(e) =>
  //               setFormData({ ...formData, cityName: e.target.value })
  //             }
  //             className="mt-1"
  //           />
  //         </div>

  //         {/* Country and State Row */}
  //         <div className="grid grid-cols-2 gap-4">
  //           <div>
  //             <Label htmlFor="edit-country">
  //               Country <span className="text-red-500">*</span>
  //             </Label>
  //             <Select
  //               value={formData.countryId ? formData.countryId.toString() : ""}
  //               onValueChange={handleCountryChange}
  //               disabled={loading}
  //             >
  //               <SelectTrigger className="mt-1">
  //                 <SelectValue
  //                   placeholder={loading ? "Loading..." : "Select country"}
  //                 />
  //               </SelectTrigger>
  //               <SelectContent>
  //                 {countries.map((country) => (
  //                   <SelectItem key={country.id} value={country.id.toString()}>
  //                     {country.name}
  //                   </SelectItem>
  //                 ))}
  //               </SelectContent>
  //             </Select>
  //           </div>
  //           <div>
  //             <Label htmlFor="edit-state">
  //               State <span className="text-red-500">*</span>
  //             </Label>
  //             <Select
  //               value={formData.stateId ? formData.stateId.toString() : ""}
  //               onValueChange={handleStateChange}
  //               disabled={!formData.countryId || loading}
  //             >
  //               <SelectTrigger className="mt-1">
  //                 <SelectValue
  //                   placeholder={
  //                     loading
  //                       ? "Loading..."
  //                       : !formData.countryId
  //                         ? "Select country first"
  //                         : "Select state"
  //                   }
  //                 />
  //               </SelectTrigger>
  //               <SelectContent>
  //                 {states.map((state) => (
  //                   <SelectItem key={state.id} value={state.id.toString()}>
  //                     {state.name}
  //                   </SelectItem>
  //                 ))}
  //               </SelectContent>
  //             </Select>
  //           </div>
  //         </div>
  //       </div>
  //     )}
  //   </Modal>
  // );
}
