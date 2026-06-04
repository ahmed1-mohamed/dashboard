import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableActions } from "@/components/table/table-actions";
import { useRouter } from "next/navigation";
import { Project } from "../types";
import { Eye, EyeOff, CheckCircle2, XCircle, Download } from "lucide-react";

interface ProjectsTableProps {
  projects: Project[];
  selectedProjects: number[];
  onSelectAll: (checked: boolean) => void;
  onSelectProject: (id: number, checked: boolean) => void;
  onActiveToggle: (id: number, checked: boolean) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onImport?: (id: number, name: string) => void;
}

export function ProjectsTable({
  projects,
  selectedProjects,
  onSelectAll,
  onSelectProject,
  onActiveToggle,
  onEdit,
  onDelete,
  onImport,
}: ProjectsTableProps) {
  const router = useRouter();

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-lg border border-gray-200 shadow-sm animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 mb-4 bg-gray-50 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No projects found</h3>
        <p className="text-sm text-gray-500 text-center max-w-sm">We couldn't find any projects matching your criteria. Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="w-[35px] px-2">
              <Checkbox
                checked={
                  projects.length > 0 &&
                  selectedProjects.length === projects.length
                }
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[110px] px-2 text-sm cursor-pointer hover:bg-gray-100">
              Project
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[110px] px-2 text-sm">
              Developer
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[70px] px-2 text-sm">
              Units
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[90px] px-2 text-sm">
              City
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[90px] px-2 text-sm">
              Type
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[80px] px-2 text-sm">
              Price
            </TableHead>

            <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
              Visibility
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
              Status
            </TableHead>
            <TableHead className="font-semibold text-gray-900 text-center w-[90px] px-2 text-sm">
              Import
            </TableHead>
            <TableHead className="font-semibold text-gray-900 text-center w-[50px] px-2 text-sm">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} className="hover:bg-gray-50">
              <TableCell className="px-2">
                <Checkbox
                  checked={selectedProjects.includes(project.id)}
                  onCheckedChange={(checked) =>
                    onSelectProject(project.id, checked as boolean)
                  }
                />
              </TableCell>
              <TableCell className="text-teal-600 font-medium px-2 text-sm">
                <button
                  onClick={() => router.push(`/admin/projects/${project.id}`)}
                  className="text-gray-900 text-sm font-medium hover:text-teal-600 active:text-teal-800 transition-colors cursor-pointer text-left focus:outline-none"
                >
                  {project.name}
                </button>
              </TableCell>
              <TableCell className="text-gray-900 px-2 text-sm truncate max-w-[110px]">
                {project.developer_name}
              </TableCell>
              <TableCell className="px-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {project.country_dimension_unit}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-gray-900 px-2 text-sm">
                {project.city_name}
              </TableCell>
              <TableCell className="text-gray-900 px-2 text-sm">
                {project.projectType}
              </TableCell>
              <TableCell className="text-gray-900 px-2 text-sm">
                {project.price_range}
              </TableCell>
              <TableCell className="px-2" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-2">
                  <Switch
                    disabled
                    checked={project.is_active ?? false}
                    onCheckedChange={(checked) => onActiveToggle(project.id, checked)}
                    className="data-[state=checked]:bg-green-500 transition-colors duration-300 shadow-sm"
                  />
                  <Badge
                    variant={project.is_active ? "default" : "secondary"}
                    className={`transition-all duration-500 flex items-center justify-center w-6 h-6 p-0 rounded-full shadow-sm ${project.is_active
                      ? "bg-green-100 border-green-300"
                      : "bg-gray-100 border-gray-200"
                      }`}
                  >
                    {project.is_active ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 animate-in fade-in zoom-in spin-in-12 duration-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-400 animate-in fade-in zoom-in -spin-in-12 duration-500" />
                    )}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="px-2">
                <Badge
                  variant="outline"
                  className={
                    project.status.toLowerCase() === "under construction" ||
                      project.status.toLowerCase() === "upcoming"
                      ? "bg-blue-50 text-blue-700 border-blue-200 text-[10px] px-1"
                      : project.status.toLowerCase() === "completed" ||
                        project.status.toLowerCase() === "ready for handover"
                        ? "bg-green-50 text-green-700 border-green-200 text-[10px] px-1"
                        : "bg-gray-50 text-gray-700 border-gray-200 text-[10px] px-1"
                  }
                >
                  {project.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center px-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onImport?.(project.id, project.name);
                  }}
                  className="bg-white border-gray-100 shadow-lg hover:bg-teal-50 h-8 py-4 px-3 text-md"
                >
                  <Download className="w-3 h-3 mr-1" /> Import
                </Button>
              </TableCell>
              <TableCell className="text-center px-2">
                <TableActions
                  onView={() => router.push(`/admin/projects/${project.id}`)}
                  onEdit={() => onEdit(project.id)}
                  onDelete={() => onDelete(project.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}