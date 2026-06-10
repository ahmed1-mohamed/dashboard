"use client";

import { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PropertiesInput } from "@/validators/propertiesSchema";

interface UnitLicenseSectionProps {
  register: UseFormRegister<PropertiesInput>;
}

export default function UnitLicenseSection({ register }: UnitLicenseSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Unit License</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="broker_license">Broker License</Label>
          <Input
            id="broker_license"
            {...register("broker_license")}
            placeholder="Broker License"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="agent_license">Agent License</Label>
          <Input
            id="agent_license"
            {...register("agent_license")}
            placeholder="Agent License"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="dld_permit_number">DLD Permit Number</Label>
          <Input
            id="dld_permit_number"
            {...register("dld_permit_number")}
            placeholder="DLD Permit Number"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="dld_barcode">DLD Barcode</Label>
          <Input
            id="dld_barcode"
            {...register("dld_barcode")}
            placeholder="DLD Barcode"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="reference_listed">Reference Listed</Label>
          <Input
            id="reference_listed"
            {...register("reference_listed")}
            placeholder="Reference Listed"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="zone_name">Zone Name</Label>
          <Input
            id="zone_name"
            {...register("zone_name")}
            placeholder="Zone Name"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="parking_spaces">Parking Spaces</Label>
          <Input
            id="parking-spaces"
            type="number"
            {...register("parking_spaces", { valueAsNumber: true })}
            placeholder="Parking Spaces"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}
