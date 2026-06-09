"use client";

import { useState, useEffect } from "react";
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
import { useAddCityData } from "@/hooks/use-add-city";

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

interface AddCityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CityFormData) => void;
}

export interface CityFormData {
  cityName: string;
  countryId: number;
  countryName: string;
  stateId: number;
  stateName: string;
}

export function AddCityModal({ isOpen, onClose, onSubmit }: AddCityModalProps) {
  const { data: session } = useSession();
  const { countries, states, loading, loadStates } = useAddCityData(isOpen);
  const [loadingStates, setLoadingStates] = useState(false);
  const [states1, setState] = useState([]);

  const [formData, setFormData] = useState<CityFormData>({
    cityName: "",
    countryId: 0,
    countryName: "",
    stateId: 0,
    stateName: "",
  });

  const handleCountryChange = async (countryId: string) => {
    const country = countries.find((c) => c.id.toString() === countryId);
    setFormData({
      ...formData,
      countryId: country ? country.id : 0,
      countryName: country ? country.name : "",
      stateId: 0,
      stateName: "",
    });
    if (country) {
      setLoadingStates(true);
      await loadStates(country.name);
      setLoadingStates(false);
    }
  };

  const handleStateChange = (stateId: string) => {
    const state = states.find((s) => s.id.toString() === stateId);
    setFormData({
      ...formData,
      stateId: state ? state.id : 0,
      stateName: state ? state.name : "",
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({
      cityName: "",
      countryId: 0,
      countryName: "",
      stateId: 0,
      stateName: "",
    });
    setState([]);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      cityName: "",
      countryId: 0,
      countryName: "",
      stateId: 0,
      stateName: "",
    });
    setState([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add City"
      size="md"
      showCloseButton={false}
      footer={
        <div className="flex gap-3 justify-end w-full">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleSubmit}
            disabled={
              !formData.cityName || !formData.countryId || !formData.stateId
            }
          >
            Add City
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <div>
          <Label htmlFor="city-name">
            City name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="city-name"
            placeholder="e.g. Nasr City"
            value={formData.cityName}
            onChange={(e) =>
              setFormData({ ...formData, cityName: e.target.value })
            }
            className="mt-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="country">
              Country <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.countryId ? formData.countryId.toString() : ""}
              onValueChange={handleCountryChange}
              disabled={loading}
            >
              <SelectTrigger className="mt-1">
                <SelectValue
                  placeholder={loading ? "Loading..." : "Select country"}
                />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.id} value={country.id.toString()}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="state">
              State <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.stateId ? formData.stateId.toString() : ""}
              onValueChange={handleStateChange}
              disabled={!formData.countryName || loadingStates}
            >
              <SelectTrigger className="mt-1">
                <SelectValue
                  placeholder={
                    loadingStates
                      ? "Loading..."
                      : !formData.countryName
                        ? "Select country first"
                        : "Select state"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.id} value={state.id.toString()}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Modal>
  );
}