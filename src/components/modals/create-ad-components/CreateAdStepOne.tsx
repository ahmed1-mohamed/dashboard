import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { HelpCircle, ChevronDown, Calendar } from "lucide-react";
import { useFormContext } from "react-hook-form";

const LOCATIONS = [
  "Home",
  "Search",
  "Featured Cards",
  "Project Listing",
  "Unit Listing",
  "Developer Listing",
  "Expert Listing",
  "Podcast Listing",
  "Shares",
  "Ai Feature",
];

interface StepOneProps {
  dateErrors: {
    startDate?: string;
    endDate?: string;
    general?: string;
  };
  validateDateTimeRange: (start: string, end: string) => void;
}

export function CreateAdStepOne({ dateErrors, validateDateTimeRange }: StepOneProps) {
  const { register, watch, setValue } = useFormContext();

  const selectedLocations = (watch("location") || []) as string[];

  const toggleLocation = (location: string) => {
    const current = Array.isArray(selectedLocations) ? selectedLocations : [];
    const updated = current.includes(location)
      ? current.filter((l) => l !== location)
      : [...current, location];
    setValue("location", updated);
  };

  return (
    <>
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="flex items-center gap-1 mb-1.5">
            Ad Type <span className="text-red-500">*</span>
            <HelpCircle className="h-3 w-3 text-gray-400" />
          </Label>
          <Select
            value={watch("type")}
            onValueChange={(val) => setValue("type", val)}
          >
            <SelectTrigger className="bg-gray-50 border-gray-200">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="banner">Banner</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="pop_up">Pop-up</SelectItem>
              <SelectItem value="full_page">Full Page</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="flex items-center gap-1 mb-1.5">
            Platform <span className="text-red-500">*</span>
            <HelpCircle className="h-3 w-3 text-gray-400" />
          </Label>
          <Select
            value={watch("platform")}
            onValueChange={(val) => setValue("platform", val)}
          >
            <SelectTrigger className="bg-gray-50 border-gray-200">
              <SelectValue placeholder="Select Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="mobile">Mobile App Only</SelectItem>
              <SelectItem value="web">Web</SelectItem>
              <SelectItem value="android">Android</SelectItem>
              <SelectItem value="ios">IOS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {watch("type") === "pop_up" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center gap-1 mb-1.5">
              Width
              <HelpCircle className="h-3 w-3 text-gray-400" />
            </Label>
            <Select
              value={watch("width")}
              onValueChange={(val) => setValue("width", val)}
            >
              <SelectTrigger className="bg-gray-50 border-gray-200">
                <SelectValue placeholder="Select Width" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full_screen">Full Screen</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="flex items-center gap-1 mb-1.5">
              Position
              <HelpCircle className="h-3 w-3 text-gray-400" />
            </Label>
            <Select
              value={watch("position")}
              onValueChange={(val) => setValue("position", val)}
            >
              <SelectTrigger className="bg-gray-50 border-gray-200">
                <SelectValue placeholder="Select Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top_left">Top left</SelectItem>
                <SelectItem value="top_center">Top center</SelectItem>
                <SelectItem value="top_right">Top right</SelectItem>
                <SelectItem value="middle_left">Middle left</SelectItem>
                <SelectItem value="middle_center">Middle center</SelectItem>
                <SelectItem value="middle_right">Middle right</SelectItem>
                <SelectItem value="bottom_left">Bottom left</SelectItem>
                <SelectItem value="bottom_center">Bottom center</SelectItem>
                <SelectItem value="bottom_right">Bottom right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="flex items-center gap-1 mb-1.5">
            Location <span className="text-red-500">*</span>
            <HelpCircle className="h-3 w-3 text-gray-400" />
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between bg-gray-50 border-gray-200 font-normal hover:bg-gray-50 text-left"
              >
                <span className="truncate">
                  {selectedLocations.length > 0
                    ? selectedLocations.join(", ")
                    : "Select Location"}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              {LOCATIONS.map((loc) => (
                <DropdownMenuCheckboxItem
                  key={loc}
                  checked={selectedLocations.includes(loc)}
                  onCheckedChange={() => toggleLocation(loc)}
                >
                  {loc}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <Label className="flex items-center gap-1 mb-1.5">
            Country <span className="text-red-500">*</span>
            <HelpCircle className="h-3 w-3 text-gray-400" />
          </Label>
          <Select
            value={watch("country")}
            onValueChange={(val) => setValue("country", val)}
          >
            <SelectTrigger className="bg-gray-50 border-gray-200">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Egypt">Egypt</SelectItem>
              <SelectItem value="Oman">Oman</SelectItem>
              <SelectItem value="UAE">UAE</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
              aria-invalid={!!dateErrors.startDate}
              aria-describedby={
                dateErrors.startDate ? "startDate-error" : undefined
              }
              onChange={(e) => {
                register("startDate").onChange(e);
                validateDateTimeRange(e.target.value, watch("endDate"));
              }}
            />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          {dateErrors.startDate && (
            <p
              id="startDate-error"
              className="text-xs text-red-500 mt-1"
              role="alert"
              aria-live="polite"
            >
              {dateErrors.startDate}
            </p>
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
              aria-invalid={!!dateErrors.endDate}
              aria-describedby={
                dateErrors.endDate ? "endDate-error" : undefined
              }
              min={watch("startDate") || undefined}
              onChange={(e) => {
                register("endDate").onChange(e);
                validateDateTimeRange(watch("startDate"), e.target.value);
              }}
            />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Leave empty for ongoing campaigns
          </p>
          {dateErrors.endDate && (
            <p
              id="endDate-error"
              className="text-xs text-red-500 mt-1"
              role="alert"
              aria-live="polite"
            >
              {dateErrors.endDate}
            </p>
          )}
        </div>
      </div>
      {dateErrors.general && (
        <div
          className="p-3 rounded-md bg-red-50 border border-red-200"
          role="alert"
          aria-live="polite"
        >
          <p className="text-sm text-red-600">{dateErrors.general}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
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
    </>
  );
}
