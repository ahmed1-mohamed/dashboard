"use client";

import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertiesInput } from "@/validators/propertiesSchema";
import {
  finishingStatusOptions,
  furnishStatusOptions,
  ownershipTypeOptions,
  viewOptions,
} from "./constants";

interface UnitDetailsSectionProps {
  register: UseFormRegister<PropertiesInput>;
  control: Control<PropertiesInput>;
  errors: FieldErrors<PropertiesInput>;
}

export default function UnitDetailsSection({
  register,
  control,
  errors,
}: UnitDetailsSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Unit Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Unit Size */}
        <div>
          <Label htmlFor="size">
            Unit (m²) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="size"
            type="number"
            {...register("size", { valueAsNumber: true })}
            placeholder="10 m size"
            className="mt-1"
          />
          {errors.size && (
            <p className="text-red-500 text-xs mt-1">
              {errors.size.message as string}
            </p>
          )}
        </div>

        {/* Bedrooms */}
        <div>
          <Label htmlFor="bedrooms">
            Number of bedrooms <span className="text-red-500">*</span>
          </Label>
          <Input
            id="bedrooms"
            type="number"
            {...register("bedrooms", { valueAsNumber: true })}
            placeholder="Number of bedrooms"
            className="mt-1"
          />
          {errors.bedrooms && (
            <p className="text-red-500 text-xs mt-1">
              {errors.bedrooms.message as string}
            </p>
          )}
        </div>

        {/* Bathrooms */}
        <div>
          <Label htmlFor="bathrooms">
            Number of bathrooms <span className="text-red-500">*</span>
          </Label>
          <Input
            id="bathrooms"
            type="number"
            {...register("bathrooms", { valueAsNumber: true })}
            placeholder="Number of bathrooms"
            className="mt-1"
          />
          {errors.bathrooms && (
            <p className="text-red-500 text-xs mt-1">
              {errors.bathrooms.message as string}
            </p>
          )}
        </div>

        {/* Floor */}
        <div>
          <Label htmlFor="floor">Floor</Label>
          <Input
            id="floor"
            {...register("floor")}
            placeholder="Floor"
            className="mt-1"
          />
        </div>

        {/* View */}
        <div>
          <Label htmlFor="view">View</Label>
          <Controller
            name="view"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select View" />
                </SelectTrigger>
                <SelectContent>
                  {viewOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Finishing Status */}
        <div>
          <Label htmlFor="finishing_status">Finishing Type</Label>
          <Controller
            name="finishing_status"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Finishing" />
                </SelectTrigger>
                <SelectContent>
                  {finishingStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Furnish Status */}
        <div>
          <Label htmlFor="furnish_status">Furnish Status</Label>
          <Controller
            name="furnish_status"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Furnish Status" />
                </SelectTrigger>
                <SelectContent>
                  {furnishStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Ownership Type */}
        <div>
          <Label htmlFor="ownership_type">Ownership Type</Label>
          <Controller
            name="ownership_type"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Ownership Type" />
                </SelectTrigger>
                <SelectContent>
                  {ownershipTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Plot Size */}
        <div>
          <Label htmlFor="plot_size">Plot size</Label>
          <Input
            id="plot_size"
            type="number"
            {...register("plot_size", { valueAsNumber: true })}
            placeholder="Plot Size"
            className="mt-1"
          />
        </div>

        {/* BUA Size */}
        <div>
          <Label htmlFor="bua_size">Built size</Label>
          <Input
            id="bua_size"
            type="number"
            {...register("bua_size", { valueAsNumber: true })}
            placeholder="Built Size"
            className="mt-1"
          />
        </div>

        {/* Maid Room */}
        <div className="flex items-center space-x-2 mt-8">
          <Controller
            name="maid_room"
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="maid_room"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label
                  htmlFor="maid_room"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Maid Room
                </label>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
