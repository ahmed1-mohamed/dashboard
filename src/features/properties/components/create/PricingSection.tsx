"use client";

import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form";
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
import { PropertiesInput } from "@/validators/propertiesSchema";
import { currencyOptions } from "./constants";

interface PricingSectionProps {
  register: UseFormRegister<PropertiesInput>;
  control: Control<PropertiesInput>;
  errors: FieldErrors<PropertiesInput>;
}

export default function PricingSection({
  register,
  control,
  errors,
}: PricingSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Pricing Options
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Currency */}
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Price */}
        <div>
          <Label htmlFor="price">
            Price <span className="text-red-500">*</span>
          </Label>
          <Input
            id="price"
            type="number"
            {...register("price", { valueAsNumber: true })}
            placeholder="Price"
            className="mt-1"
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">
              {errors.price.message as string}
            </p>
          )}
        </div>

        {/* Price per m² */}
        <div>
          <Label htmlFor="price-per-m2">Price per (m²)</Label>
          <Input
            id="price-per-m2"
            type="number"
            {...register("price_per_m2", { valueAsNumber: true })}
            placeholder="Include/Exclude"
            className="mt-1"
          />
        </div>
      </div>

      {/* Price Description */}
      <div className="mt-6">
        <Label htmlFor="price-description">Price terms or description</Label>
        <Textarea
          id="price-description"
          {...register("price_description")}
          placeholder="Write description here"
          className="mt-1 min-h-[80px]"
        />
      </div>
    </div>
  );
}
