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
import { Developer } from "../types";

interface DevelopersTableProps {
  developers: Developer[];
  selectedDevelopers: number[];
  onSelectAll: (checked: boolean) => void;
  onSelectDeveloper: (id: number, checked: boolean) => void;
  onToggleStatus: (id: number, newStatus: boolean) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function DevelopersTable({
  developers,
  selectedDevelopers,
  onSelectAll,
  onSelectDeveloper,
  onToggleStatus,
  onEdit,
  onDelete,
}: DevelopersTableProps) {
  const router = useRouter();

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="w-[35px] px-2">
              <Checkbox
                checked={
                  developers.length > 0 &&
                  selectedDevelopers.length === developers.length
                }
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[140px] px-2 text-sm">
              Developer
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
              Country
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[80px] px-2 text-sm">
              City
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[70px] px-2 text-sm">
              Projects
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[130px] px-2 text-sm">
              Website
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[180px] px-2 text-sm">
              Email
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[120px] px-2 text-sm">
              Contact
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[90px] px-2 text-sm">
              Status
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {developers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center text-gray-500">
                No developers found.
              </TableCell>
            </TableRow>
          ) : (
            developers.map((developer) => (
              <TableRow
                key={developer.id}
                className="text-gray-900 text-sm font-medium hover:text-teal-600 active:text-teal-800 transition-colors cursor-pointer text-left focus:outline-none"
                onClick={() => router.push(`/admin/developers/${developer.id}`)}
              >
                <TableCell className="px-2" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedDevelopers.includes(developer.id)}
                    onCheckedChange={(checked) =>
                      onSelectDeveloper(developer.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell className="px-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 hover:text-teal-600 hover-bg-gray-200 hover:border-teal-200 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200">
                      {developer.logo ? (
                        <img
                          src={developer.logo}
                          alt={developer.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-500">
                          {developer.name.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-gray-900 text-sm">
                      {developer.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-900 px-2 text-sm">
                  {developer.countries}
                </TableCell>
                <TableCell
                  className="text-gray-900 px-2 text-sm truncate max-w-[80px]"
                  title={developer.cities}
                >
                  {developer.cities}
                </TableCell>
                <TableCell className="px-2">
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    {developer.projects}
                  </Badge>
                </TableCell>
                <TableCell className="px-2" onClick={(e) => e.stopPropagation()}>
                  <a
                    href={developer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:text-teal-700 hover:underline text-sm truncate max-w-[120px] inline-block"
                  >
                    {developer.website}
                  </a>
                </TableCell>
                <TableCell className="text-gray-900 px-2 text-sm truncate max-w-[160px]">
                  {developer.email}
                </TableCell>
                <TableCell className="text-gray-900 px-2 text-sm">
                  {developer.contact}
                </TableCell>
                <TableCell className="px-2" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={developer.status}
                      onCheckedChange={(checked) =>
                        onToggleStatus(developer.id, checked)
                      }
                      className="data-[state=checked]:bg-teal-600"
                    />
                    <Badge
                      variant={developer.status ? "default" : "secondary"}
                      className={
                        developer.status
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }
                    >
                      {developer.status ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="px-2" onClick={(e) => e.stopPropagation()}>
                  <TableActions
                    onView={() => router.push(`/admin/developers/${developer.id}`)}
                    onEdit={() => onEdit(developer.id)}
                    onDelete={() => onDelete(developer.id)}
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
