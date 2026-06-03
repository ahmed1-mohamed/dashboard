import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Project } from "../../types";

const statusColors: Record<string, string> = {
  ongoing: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  upcoming: "bg-amber-50 text-amber-700 border-amber-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export function LocationProjectsList({ projects }: { projects: Project[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
        <Building2 className="w-4 h-4 text-teal-500" /> Projects
        <Badge className="ml-auto bg-teal-50 text-teal-700 border border-teal-200 text-xs font-medium">
          {projects.length}
        </Badge>
      </h2>
      {projects.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No projects linked to this location.</p>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.project_id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-teal-200 hover:bg-teal-50/30 transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">{project.project_name}</p>
                <p className="text-xs text-gray-500 capitalize mt-0.5">{project.project_type}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={`text-xs border ${statusColors[project.status] ?? "bg-gray-50 text-gray-600 border-gray-200"} capitalize`}>
                  {project.status}
                </Badge>
                <span className="text-xs text-gray-500">{project.available_units}/{project.total_units} units</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
