import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreateProjectInput } from "@/validators/create-project.schema";

interface ProjectUnitsFormProps {
  form: UseFormReturn<CreateProjectInput>;
  dateValidationError: string | null;
}

export function ProjectUnitsForm({ form, dateValidationError }: ProjectUnitsFormProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Units Information</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="total-units">Total Units <span className="text-red-500">*</span></Label>
          <Input id="total-units" type="number" placeholder="2555" className="mt-1" {...register("total_units")} />
          {errors.total_units && <p className="text-sm text-red-500 mt-1">{errors.total_units.message}</p>}
        </div>
        <div>
          <Label htmlFor="available-units">Available Units <span className="text-red-500">*</span></Label>
          <Input id="available-units" type="number" placeholder="45" className="mt-1" {...register("available_units")} />
          {errors.available_units && <p className="text-sm text-red-500 mt-1">{errors.available_units.message}</p>}
        </div>
        <div>
          <Label htmlFor="launch-date">Launch Date <span className="text-red-500">*</span></Label>
          <Input id="launch-date" type="date" placeholder="mm/dd/yyyy" className="mt-1" {...register("launch_date")} />
          {errors.launch_date && <p className="text-sm text-red-500 mt-1">{errors.launch_date.message}</p>}
        </div>
        <div>
          <Label htmlFor="completion-date">Completion Date</Label>
          <Input id="completion-date" type="date" placeholder="mm/dd/yyyy" className="mt-1" {...register("completion_date")} />
          {errors.completion_date && <p className="text-sm text-red-500 mt-1">{errors.completion_date.message}</p>}
          {dateValidationError && <p className="text-sm text-red-500 mt-1">{dateValidationError}</p>}
        </div>
      </div>
    </div>
  );
}
