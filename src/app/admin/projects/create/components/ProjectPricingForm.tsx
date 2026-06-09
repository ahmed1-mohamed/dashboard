import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateProjectInput } from "@/validators/create-project.schema";

interface ProjectPricingFormProps {
  form: UseFormReturn<CreateProjectInput>;
}

export function ProjectPricingForm({ form }: ProjectPricingFormProps) {
  const { register, watch, setValue, formState: { errors } } = form;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Pricing</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select value={watch("currency") || ""} onValueChange={(value) => setValue("currency", value)}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select currency" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="AED">AED</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EGP">EGP</SelectItem>
            </SelectContent>
          </Select>
          {errors.currency && <p className="text-sm text-red-500 mt-1">{errors.currency.message}</p>}
        </div>
        <div>
          <Label htmlFor="min-price">Min Price <span className="text-red-500">*</span></Label>
          <Input id="min-price" type="number" placeholder="500000" className="mt-1" {...register("price_min")} />
          {errors.price_min && <p className="text-sm text-red-500 mt-1">{errors.price_min.message}</p>}
        </div>
        <div>
          <Label htmlFor="max-price">Max Price <span className="text-red-500">*</span></Label>
          <Input id="max-price" type="number" placeholder="1000000" className="mt-1" {...register("price_max")} />
          {errors.price_max && <p className="text-sm text-red-500 mt-1">{errors.price_max.message}</p>}
        </div>
        <div>
          <Label htmlFor="price-per-min">Price per m (Min) <span className="text-red-500">*</span></Label>
          <Input id="price-per-min" type="number" placeholder="500" className="mt-1" {...register("price_sq_min")} />
          {errors.price_sq_min && <p className="text-sm text-red-500 mt-1">{errors.price_sq_min.message}</p>}
        </div>
        <div>
          <Label htmlFor="price-per-max">Price per m (Max) <span className="text-red-500">*</span></Label>
          <Input id="price-per-max" type="number" placeholder="1000" className="mt-1" {...register("price_sq_max")} />
          {errors.price_sq_max && <p className="text-sm text-red-500 mt-1">{errors.price_sq_max.message}</p>}
        </div>
        <div>
          <Label htmlFor="project-area">Project Area (m) <span className="text-red-500">*</span></Label>
          <Input id="project-area" type="number" placeholder="5000" className="mt-1" {...register("project_size")} />
          {errors.project_size && <p className="text-sm text-red-500 mt-1">{errors.project_size.message}</p>}
        </div>
      </div>
    </div>
  );
}
