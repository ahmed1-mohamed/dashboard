import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { HelpCircle, Search, Upload } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useFormContext } from "react-hook-form";
import React from "react";

interface StepTwoProps {
  developerSearch: string;
  setDeveloperSearch: (val: string) => void;
  developersLoading: boolean;
  developers: any[];
  developerHasMore: boolean;
  developerScrollRef: React.RefObject<HTMLDivElement | null>;
  handleDeveloperChange: (val: string) => void;
  projectSearch: string;
  setProjectSearch: (val: string) => void;
  projectsLoading: boolean;
  projects: any[];
  propertySearch: string;
  setPropertySearch: (val: string) => void;
  propertiesLoading: boolean;
  properties: any[];
  adImagePreview: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CreateAdStepTwo({
  developerSearch,
  setDeveloperSearch,
  developersLoading,
  developers,
  developerHasMore,
  developerScrollRef,
  handleDeveloperChange,
  projectSearch,
  setProjectSearch,
  projectsLoading,
  projects,
  propertySearch,
  setPropertySearch,
  propertiesLoading,
  properties,
  adImagePreview,
  handleImageUpload,
}: StepTwoProps) {
  const { register, watch, setValue } = useFormContext();

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label className="flex items-center gap-1 mb-1.5">
            Select Developer
            <span className="text-red-500">*</span>
            <HelpCircle className="h-3 w-3 text-gray-400" />
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search developers..."
                value={developerSearch}
                onChange={(e) => setDeveloperSearch(e.target.value)}
                className="bg-gray-50 border-gray-200 pl-10"
              />
            </div>
          </div>
          <Select
            value={watch("developerId")}
            onValueChange={handleDeveloperChange}
          >
            <SelectTrigger className="bg-gray-50 border-gray-200 mt-2">
              <SelectValue placeholder="Select Developer" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {developersLoading && developers.length === 0 ? (
                <div className="p-2 text-sm text-gray-500 text-center">
                  Loading developers...
                </div>
              ) : developers.length === 0 ? (
                <div className="p-2 text-sm text-gray-500 text-center">
                  No developers found
                </div>
              ) : (
                <>
                  {developers
                    .filter((dev) =>
                      (dev.name || "")
                        .toLowerCase()
                        .includes((developerSearch || "").toLowerCase())
                    )
                    .map((dev) => (
                      <SelectItem
                        key={dev.id}
                        value={(dev.id || `no-id-${Math.random()}`).toString()}
                      >
                        {dev.name}
                      </SelectItem>
                    ))}
                  <div ref={developerScrollRef} className="h-4" />
                  {developersLoading && developers.length > 0 && (
                    <div className="p-2 text-sm text-gray-500 text-center">
                      Loading more...
                    </div>
                  )}
                  {!developersLoading && developerHasMore && (
                    <div className="p-2 text-sm text-gray-400 text-center text-xs">
                      Scroll for more
                    </div>
                  )}
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Link To and Position in Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="flex items-center gap-1 mb-1.5">
            Link To <span className="text-red-500">*</span>
            <HelpCircle className="h-3 w-3 text-gray-400" />
          </Label>
          <Select
            value={watch("linkTo")}
            onValueChange={(val) => {
              setValue("linkTo", val);
              if (val === "NONE") {
                setValue("projectId", "");
              }
            }}
          >
            <SelectTrigger className="bg-gray-50 border-gray-200">
              <SelectValue placeholder="Select Link Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NONE">None</SelectItem>
              <SelectItem value="PROJECTS">Project</SelectItem>
              <SelectItem value="PROPERTIES">Property</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {watch("linkTo") !== "NONE" && (
        <>
          <Label className="flex items-center gap-1 mb-1.5">
            Select {watch("linkTo") === "PROJECTS" ? "Project" : "Property"}{" "}
            <span className="text-red-500">*</span>
            <HelpCircle className="h-3 w-3 text-gray-400" />
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`Search ${
                  watch("linkTo") === "PROJECTS" ? "projects" : "properties"
                }...`}
                value={
                  watch("linkTo") === "PROJECTS"
                    ? projectSearch
                    : propertySearch
                }
                onChange={(e) => {
                  if (watch("linkTo") === "PROJECTS") {
                    setProjectSearch(e.target.value);
                  } else {
                    setPropertySearch(e.target.value);
                  }
                }}
                className="bg-gray-50 border-gray-200 pl-10"
                disabled={
                  !watch("developerId") ||
                  (watch("linkTo") === "PROJECTS"
                    ? projectsLoading
                    : propertiesLoading)
                }
              />
            </div>
          </div>
          <Select
            value={watch("projectId")}
            onValueChange={(val) => setValue("projectId", val)}
          >
            <SelectTrigger className="bg-gray-50 border-gray-200 mt-2">
              <SelectValue
                placeholder={`Select ${
                  watch("linkTo") === "PROJECTS" ? "Project" : "Property"
                }`}
              />
            </SelectTrigger>
            <SelectContent>
              {watch("linkTo") === "PROJECTS" ? (
                projectsLoading ? (
                  <div className="p-2 text-sm text-gray-500 text-center">
                    Loading projects...
                  </div>
                ) : projects.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500 text-center">
                    No projects available
                  </div>
                ) : (
                  projects
                    .filter((proj) =>
                      (proj.name || "")
                        .toLowerCase()
                        .includes((projectSearch || "").toLowerCase())
                    )
                    .map((proj) => (
                      <SelectItem
                        key={proj.id || Math.random()}
                        value={(proj.id || `no-id-${Math.random()}`).toString()}
                      >
                        {proj.name}
                      </SelectItem>
                    ))
                )
              ) : propertiesLoading ? (
                <div className="p-2 text-sm text-gray-500 text-center">
                  Loading properties...
                </div>
              ) : properties.length === 0 ? (
                <div className="p-2 text-sm text-gray-500 text-center">
                  No properties available
                </div>
              ) : (
                properties
                  .filter((prop) =>
                    (prop.name || "")
                      .toLowerCase()
                      .includes((propertySearch || "").toLowerCase())
                  )
                  .map((prop, index) => (
                    <SelectItem
                      key={index}
                      value={(prop.id || `no-id-${Math.random()}`).toString()}
                    >
                      {prop.name}
                    </SelectItem>
                  ))
              )}
            </SelectContent>
          </Select>
        </>
      )}

      <div>
        <Label className="flex items-center gap-1 mb-1.5">
          Ad Image <span className="text-red-500">*</span>
          <HelpCircle className="h-3 w-3 text-gray-400" />
        </Label>
        <div
          className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => document.getElementById("ad-image-upload")?.click()}
        >
          {adImagePreview ? (
            <img
              src={adImagePreview}
              alt="Preview"
              className="max-h-48 object-contain mb-4"
            />
          ) : (
            <Upload className="h-8 w-8 text-gray-400 mb-3" />
          )}
          <div className="text-sm text-gray-600 font-medium">
            Click to upload or drag and drop
          </div>
          <div className="text-xs text-gray-500 mt-1">
            PNG, JPG or WEBP (MAX. 2MB)
          </div>
          <Button
            type="button"
            variant="outline"
            className="mt-4 bg-teal-600 text-white border-transparent hover:bg-teal-700 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById("ad-image-upload")?.click();
            }}
          >
            Browse file
          </Button>
          <input
            id="ad-image-upload"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      <div>
        <Label className="flex items-center gap-1 mb-1.5">
          Short Description <span className="text-red-500">*</span>
          <HelpCircle className="h-3 w-3 text-gray-400" />
        </Label>
        <RichTextEditor
          content={watch("description")}
          onChange={(content) => setValue("description", content)}
        />
      </div>

      {/* Toggle Switches */}
      <div className="grid grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={watch("handover")}
            onCheckedChange={(checked) => setValue("handover", checked)}
          />
          <Label className="cursor-pointer">Handover</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={watch("developer")}
            onCheckedChange={(checked) => setValue("developer", checked)}
          />
          <Label className="cursor-pointer">Developer</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={watch("price")}
            onCheckedChange={(checked) => setValue("price", checked)}
          />
          <Label className="cursor-pointer">Price</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={watch("rate")}
            onCheckedChange={(checked) => setValue("rate", checked)}
          />
          <Label className="cursor-pointer">Rate</Label>
        </div>
      </div>

      {/* Call-to-Action Button Text */}
      <div>
        <Label className="flex items-center gap-1 mb-1.5">
          Call-to-Action Button Text
          <HelpCircle className="h-3 w-3 text-gray-400" />
        </Label>
        <Input
          placeholder="hurry Up !"
          {...register("ctaButtonText")}
          className="bg-gray-50 border-gray-200"
        />
      </div>
      <div>
        <Label className="flex items-center gap-1 mb-1.5">
          Call-to-Action Link
          <HelpCircle className="h-3 w-3 text-gray-400" />
        </Label>
        <Input
          placeholder="https://example.com"
          {...register("ctaUrl")}
          className="bg-gray-50 border-gray-200"
        />
      </div>
    </>
  );
}
