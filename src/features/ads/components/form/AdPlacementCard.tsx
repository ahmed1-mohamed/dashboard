import { useFormContext } from "react-hook-form";
import { HelpCircle, ChevronDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

export function AdPlacementCard() {
  const { watch, setValue } = useFormContext();

  const selectedLocations = (watch("location") || []) as string[];

  const toggleLocation = (location: string) => {
    const current = Array.isArray(selectedLocations) ? selectedLocations : [];
    const updated = current.includes(location)
      ? current.filter((l) => l !== location)
      : [...current, location];
    setValue("location", updated);
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader>
        <CardTitle>Placement & Platform</CardTitle>
        <CardDescription>Where and how the ad will be displayed.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-1 mb-1.5">
                Width <HelpCircle className="h-3 w-3 text-gray-400" />
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
                Position <HelpCircle className="h-3 w-3 text-gray-400" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </CardContent>
    </Card>
  );
}
