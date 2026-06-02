import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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

interface ProjectsTableProps {
  projects: Project[];
  selectedProjects: number[];
  onSelectAll: (checked: boolean) => void;
  onSelectProject: (id: number, checked: boolean) => void;
  onVisibilityToggle: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function ProjectsTable({
  projects,
  selectedProjects,
  onSelectAll,
  onSelectProject,
  onVisibilityToggle,
  onEdit,
  onDelete,
}: ProjectsTableProps) {
  const router = useRouter();

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
            <TableHead className="font-semibold text-gray-900 w-[140px] px-2 text-sm">
              Timeline
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
              Visibility
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
              Status
            </TableHead>
            <TableHead className="font-semibold text-gray-900 text-center w-[50px] px-2 text-sm">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="h-24 text-center text-gray-500">
                No projects found.
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
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
                      {project.available_units} / {project.total_units}
                    </span>
                    <span className="text-[10px] text-gray-500">available</span>
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
                <TableCell className="px-2">
                  <div className="flex flex-col text-xs space-y-1">
                    <div className="flex items-center justify-between text-gray-500">
                      <span>Launch:</span>
                      <span className="text-gray-900">{project.launch_date}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-500">
                      <span>Completion:</span>
                      <span className="text-gray-900">{project.completion_date}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-2">
                  <Switch
                    checked={project.is_visible}
                    onCheckedChange={() => onVisibilityToggle(project.id)}
                  />
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
                  <TableActions
                    onView={() => router.push(`/admin/projects/${project.id}`)}
                    onEdit={() => onEdit(project.id)}
                    onDelete={() => onDelete(project.id)}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
