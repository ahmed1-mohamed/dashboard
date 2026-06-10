"use client";

import { useRef, useState, useEffect } from "react";
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
import { Search } from "lucide-react";
import { PropertiesInput } from "@/validators/propertiesSchema";
import {
  constructionStatusOptions,
  availabilityStatusOptions,
  statusOptions,
} from "./constants";

interface Option {
  id: string | number;
  name: string;
}

interface ProjectOption {
  project_id: string | number;
  project_name: string;
}

interface BasicInformationSectionProps {
  register: UseFormRegister<PropertiesInput>;
  control: Control<PropertiesInput>;
  errors: FieldErrors<PropertiesInput>;
  propertiesType: Option[];
  propertiesSubtype: Option[];
  projects: ProjectOption[];
}

export default function BasicInformationSection({
  register,
  control,
  errors,
  propertiesType,
  propertiesSubtype,
  projects,
}: BasicInformationSectionProps) {
  const [projectSearch, setProjectSearch] = useState("");
  const [projectPerPage, setProjectPerPage] = useState(10);
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const projectListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!isProjectOpen || !projectListRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = projectListRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setProjectPerPage((prev) => prev + 10);
      }
    };
    const listElement = projectListRef.current;
    if (listElement) {
      listElement.addEventListener("scroll", handleScroll);
      return () => listElement.removeEventListener("scroll", handleScroll);
    }
  }, [isProjectOpen]);

  const handleProjectSearch = (value: string) => {
    setProjectSearch(value);
    setProjectPerPage(10);
  };

  const filteredProjects = projects.filter((p) =>
    p.project_name.toLowerCase().includes(projectSearch.toLowerCase()),
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Basic Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Property Name */}
        <div>
          <Label htmlFor="property_name">
            Property Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="property_name"
            {...register("property_name")}
            placeholder="Property Name"
            className="mt-1"
          />
          {errors.property_name && (
            <p className="text-red-500 text-xs mt-1">
              {errors.property_name.message as string}
            </p>
          )}
        </div>

        {/* Unit Number */}
        <div>
          <Label htmlFor="unit-number">Unit Number</Label>
          <Input
            id="unit-number"
            {...register("unit_number")}
            placeholder="e.g. Unit 101"
            className="mt-1"
          />
        </div>

        {/* Project Select */}
        <div>
          <Label htmlFor="project_id">
            Project <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="project_id"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={String(field.value || "")}
                onOpenChange={(open) => {
                  setIsProjectOpen(open);
                  if (open) setProjectPerPage(10);
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <div
                    className="flex items-center border-b px-3"
                    cmdk-input-wrapper=""
                  >
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                      className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Search projects..."
                      value={projectSearch}
                      onChange={(e) => handleProjectSearch(e.target.value)}
                    />
                  </div>
                  <div
                    ref={projectListRef}
                    className="max-h-[200px] overflow-y-auto"
                  >
                    {filteredProjects.length === 0 ? (
                      <div className="flex items-center justify-center p-2 text-sm text-gray-500">
                        No projects found
                      </div>
                    ) : (
                      <>
                        {filteredProjects.slice(0, projectPerPage).map((project) => (
                          <SelectItem
                            key={project.project_id}
                            value={String(project.project_id)}
                          >
                            {project.project_name}
                          </SelectItem>
                        ))}
                        {filteredProjects.length > projectPerPage && (
                          <div className="flex items-center justify-center p-2 text-xs text-gray-400">
                            Scroll for more
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </SelectContent>
              </Select>
            )}
          />
          {errors.project_id && (
            <p className="text-red-500 text-xs mt-1">
              {errors.project_id.message as string}
            </p>
          )}
        </div>

        {/* Property Type */}
        <div>
          <Label htmlFor="property_type_id">
            Property Type <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="property_type_id"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={String(field.value || "")}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Property Type" />
                </SelectTrigger>
                <SelectContent>
                  {propertiesType.map((type) => (
                    <SelectItem key={type.id} value={String(type.id)}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.property_type_id && (
            <p className="text-red-500 text-xs mt-1">
              {errors.property_type_id.message as string}
            </p>
          )}
        </div>

        {/* Unit Sub Type */}
        <div>
          <Label htmlFor="property_subtype_id">
            Unit Sub Type <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="property_subtype_id"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={String(field.value || "")}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Sub Type" />
                </SelectTrigger>
                <SelectContent>
                  {propertiesSubtype.map((subtype) => (
                    <SelectItem key={subtype.id} value={String(subtype.id)}>
                      {subtype.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.property_subtype_id && (
            <p className="text-red-500 text-xs mt-1">
              {errors.property_subtype_id.message as string}
            </p>
          )}
        </div>

        {/* Building Name */}
        <div>
          <Label htmlFor="building_name">
            Building Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="building_name"
            {...register("building_name")}
            placeholder="Enter Building Name"
            className="mt-1"
          />
          {errors.building_name && (
            <p className="text-red-500 text-xs mt-1">
              {errors.building_name.message as string}
            </p>
          )}
        </div>

        {/* Construction Status */}
        <div>
          <Label htmlFor="construction_status">
            Construction Status <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="construction_status"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {constructionStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.construction_status && (
            <p className="text-red-500 text-xs mt-1">
              {errors.construction_status.message as string}
            </p>
          )}
        </div>

        {/* Availability Status */}
        <div>
          <Label htmlFor="availability_status">
            Availability Status <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="availability_status"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {availabilityStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.availability_status && (
            <p className="text-red-500 text-xs mt-1">
              {errors.availability_status.message as string}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <Label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <p className="text-red-500 text-xs mt-1">
              {errors.status.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mt-6">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Write description here"
          className="mt-1 min-h-[80px]"
        />
      </div>
    </div>
  );
}
