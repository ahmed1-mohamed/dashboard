import { useFormContext } from "react-hook-form";
import { HelpCircle, Search } from "lucide-react";
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

interface AdTargetLinksCardProps {
  developersLoading: boolean;
  projectsLoading: boolean;
  propertiesLoading: boolean;
  developers: any[];
  projects: any[];
  properties: any[];
  developerSearch: string;
  setDeveloperSearch: (s: string) => void;
  projectSearch: string;
  setProjectSearch: (s: string) => void;
  propertySearch: string;
  setPropertySearch: (s: string) => void;
}

export function AdTargetLinksCard({
  developersLoading,
  projectsLoading,
  propertiesLoading,
  developers,
  projects,
  properties,
  developerSearch,
  setDeveloperSearch,
  projectSearch,
  setProjectSearch,
  propertySearch,
  setPropertySearch,
}: AdTargetLinksCardProps) {
  const { watch, setValue } = useFormContext();

  const handleDeveloperChange = (val: string) => {
    setValue("developerId", val);
    setValue("projectId", "");
  };

  const renderSelectOptions = () => {
    if (watch("linkTo") === "PROJECTS") {
      if (projectsLoading) {
        return (
          <div className="p-2 text-sm text-gray-500 text-center">
            Loading projects...
          </div>
        );
      }
      if (projects.length === 0) {
        return (
          <div className="p-2 text-sm text-gray-500 text-center">
            No projects available
          </div>
        );
      }
      return (
        <>
          {projects
            .filter((proj) =>
              (proj.name || "").toLowerCase().includes(projectSearch.toLowerCase())
            )
            .map((proj, index) => (
              <SelectItem key={proj.id || index} value={proj.id?.toString() || `proj-${index}`}>
                {proj.name || "Unnamed Project"}
              </SelectItem>
            ))}
        </>
      );
    } else {
      if (propertiesLoading) {
        return (
          <div className="p-2 text-sm text-gray-500 text-center">
            Loading properties...
          </div>
        );
      }
      if (properties.length === 0) {
        return (
          <div className="p-2 text-sm text-gray-500 text-center">
            No properties available
          </div>
        );
      }
      return (
        <>
          {properties
            .filter((prop) =>
              (prop.name || "").toLowerCase().includes(propertySearch.toLowerCase())
            )
            .map((prop, index) => (
              <SelectItem key={prop.id || index} value={prop.id?.toString() || `prop-${index}`}>
                {prop.name || "Unnamed Property"}
              </SelectItem>
            ))}
        </>
      );
    }
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader>
        <CardTitle>Target & Links</CardTitle>
        <CardDescription>
          Select the entity this ad directs users to.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center gap-1 mb-1.5">
              Link To <span className="text-red-500">*</span>
              <HelpCircle className="h-3 w-3 text-gray-400" />
            </Label>
            <Select
              value={watch("linkTo")}
              onValueChange={(val) => {
                setValue("linkTo", val);
                if (val === "NONE") setValue("projectId", "");
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

          <div>
            <Label className="flex items-center gap-1 mb-1.5">
              Select Developer <span className="text-red-500">*</span>
              <HelpCircle className="h-3 w-3 text-gray-400" />
            </Label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search developers..."
                value={developerSearch}
                onChange={(e) => setDeveloperSearch(e.target.value)}
                className="bg-gray-50 border-gray-200 pl-10"
              />
            </div>
            <Select
              value={watch("developerId")}
              onValueChange={handleDeveloperChange}
            >
              <SelectTrigger className="bg-gray-50 border-gray-200">
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
                          .includes(developerSearch.toLowerCase())
                      )
                      .map((dev, index) => (
                        <SelectItem key={dev.id || index} value={dev.id?.toString() || `dev-${index}`}>
                          {dev.name || "Unnamed Developer"}
                        </SelectItem>
                      ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {watch("linkTo") !== "NONE" && (
          <div>
            <Label className="flex items-center gap-1 mb-1.5">
              Select {watch("linkTo") === "PROJECTS" ? "Project" : "Property"}{" "}
              <span className="text-red-500">*</span>
              <HelpCircle className="h-3 w-3 text-gray-400" />
            </Label>
            <div className="relative mb-2">
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
                  if (watch("linkTo") === "PROJECTS")
                    setProjectSearch(e.target.value);
                  else setPropertySearch(e.target.value);
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
            <Select
              value={watch("projectId")}
              onValueChange={(val) => setValue("projectId", val)}
            >
              <SelectTrigger className="bg-gray-50 border-gray-200">
                <SelectValue
                  placeholder={`Select ${
                    watch("linkTo") === "PROJECTS" ? "Project" : "Property"
                  }`}
                />
              </SelectTrigger>
              <SelectContent>{renderSelectOptions()}</SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
