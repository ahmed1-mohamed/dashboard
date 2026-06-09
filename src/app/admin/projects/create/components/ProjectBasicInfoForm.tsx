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
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { CreateProjectInput } from "@/validators/create-project.schema";

interface ProjectBasicInfoFormProps {
  form: UseFormReturn<CreateProjectInput>;
  developersData: any[];
  country: string;
  setCountry: React.Dispatch<React.SetStateAction<string>>;
}

export function ProjectBasicInfoForm({
  form,
  developersData,
  country,
  setCountry,
}: ProjectBasicInfoFormProps) {
  const { register, watch, setValue, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      {/* Short Description */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-2">
          <Label htmlFor="description">Short Description <span className="text-red-500">*</span></Label>
        </div>
        <RichTextEditor
          content={watch("description") || ""}
          onChange={(content) => setValue("description", content)}
        />
        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
        <div className="space-y-4">
          <div id="error-project_name">
            <Label htmlFor="project-name">Project Name <span className="text-red-500">*</span></Label>
            <Input id="project-name" placeholder="e.g. Gulf Tower" className={`mt-1 ${errors.project_name ? "border-red-500 focus-visible:ring-red-500" : ""}`} {...register("project_name")} />
            {errors.project_name && <p className="text-sm text-red-500 mt-1">{errors.project_name.message}</p>}
          </div>
          <div id="error-developer_id">
            <Label htmlFor="developer">Developer <span className="text-red-500">*</span></Label>
            <Select
              value={String(watch("developer_id") || "")}
              onValueChange={(value) => setValue("developer_id", value)}
            >
              <SelectTrigger className={`mt-1 ${errors.developer_id ? "border-red-500 focus:ring-red-500" : ""}`}><SelectValue placeholder="Select developer" /></SelectTrigger>
              <SelectContent>
                {developersData?.map((developer: any) => {
                  const id = developer.developer_id || developer.id;
                  const name = developer.developer_name || developer.name;
                  return (
                    <SelectItem key={id} value={String(id)}>
                      {name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {errors.developer_id && <p className="text-sm text-red-500 mt-1">{errors.developer_id.message}</p>}
          </div>
          <div id="error-project_type">
            <Label htmlFor="project-type">Project type <span className="text-red-500">*</span></Label>
            <Select value={watch("project_type") || ""} onValueChange={(value) => setValue("project_type", value as any)}>
              <SelectTrigger className={`mt-1 ${errors.project_type ? "border-red-500 focus:ring-red-500" : ""}`}><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="mixed-use">Mixed-Use</SelectItem>
              </SelectContent>
            </Select>
            {errors.project_type && <p className="text-sm text-red-500 mt-1">{errors.project_type.message}</p>}
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Select value={country} onValueChange={(value) => setCountry(value)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select Country" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="UAE">UAE</SelectItem>
                <SelectItem value="Egypt">Egypt</SelectItem>
                <SelectItem value="Oman">Oman</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div id="error-status">
            <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
            <Select value={watch("status") || ""} onValueChange={(value) => setValue("status", value as any)}>
              <SelectTrigger className={`mt-1 ${errors.status ? "border-red-500 focus:ring-red-500" : ""}`}><SelectValue placeholder="Select Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ongoing">Under Construction / Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="upcoming">Upcoming / Planned</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
