import { useFormContext } from "react-hook-form";
import { HelpCircle, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdBasicInfoCardProps {
  dateErrors: { startDate?: string; endDate?: string; general?: string };
  validateDateTimeRange: (start: string, end: string) => void;
}

export function AdBasicInfoCard({
  dateErrors,
  validateDateTimeRange,
}: AdBasicInfoCardProps) {
  const { register, watch, setValue } = useFormContext();

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Main details and scheduling for this ad.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="flex items-center gap-1 mb-1.5">
            Ad Title <span className="text-red-500">*</span>
            <HelpCircle className="h-3 w-3 text-gray-400" />
          </Label>
          <Input
            placeholder="e.g., Luxury Beachfront Villas - Summer Sale"
            {...register("title", { required: true })}
            className="bg-gray-50 border-gray-200"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="flex items-center gap-1 mb-1.5">
              Status <span className="text-red-500">*</span>
              <HelpCircle className="h-3 w-3 text-gray-400" />
            </Label>
            <Select
              value={watch("status")}
              onValueChange={(val) => setValue("status", val)}
            >
              <SelectTrigger className="bg-gray-50 border-gray-200">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="ended">Ended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="flex items-center gap-1 mb-1.5">
              Priority Level ( 1 - 10 ) <span className="text-red-500">*</span>
              <HelpCircle className="h-3 w-3 text-gray-400" />
            </Label>
            <Input
              type="number"
              min="1"
              max="10"
              placeholder="1"
              {...register("priority", { required: true, min: 1, max: 10 })}
              className="bg-gray-50 border-gray-200"
            />
          </div>
          <div>
            <Label className="flex items-center gap-1 mb-1.5">
              Billing Unit <span className="text-red-500">*</span>
              <HelpCircle className="h-3 w-3 text-gray-400" />
            </Label>
            <Select
              value={watch("billing_unit")}
              onValueChange={(val) => setValue("billing_unit", val)}
            >
              <SelectTrigger className="bg-gray-50 border-gray-200">
                <SelectValue placeholder="Select Billing Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="click">Click</SelectItem>
                <SelectItem value="view">View</SelectItem>
                <SelectItem value="impression">Impression</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center gap-1 mb-1.5" htmlFor="startDate">
              Start Date <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="startDate"
                type="date"
                {...register("startDate", { required: true })}
                className={`bg-gray-50 pl-10 ${
                  dateErrors.startDate
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-gray-200"
                }`}
                onChange={(e) => {
                  register("startDate").onChange(e);
                  validateDateTimeRange(e.target.value, watch("endDate"));
                }}
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {dateErrors.startDate && (
              <p className="text-xs text-red-500 mt-1">{dateErrors.startDate}</p>
            )}
          </div>

          <div>
            <Label className="flex items-center gap-1 mb-1.5" htmlFor="endDate">
              End Date
            </Label>
            <div className="relative">
              <Input
                id="endDate"
                type="date"
                {...register("endDate")}
                className={`bg-gray-50 pl-10 ${
                  dateErrors.endDate
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-gray-200"
                }`}
                min={watch("startDate") || undefined}
                onChange={(e) => {
                  register("endDate").onChange(e);
                  validateDateTimeRange(watch("startDate"), e.target.value);
                }}
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {dateErrors.endDate && (
              <p className="text-xs text-red-500 mt-1">{dateErrors.endDate}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
