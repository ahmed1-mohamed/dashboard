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
import { CheckCircle2, XCircle } from "lucide-react";

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

  if (developers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-lg border border-gray-200 shadow-sm animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 mb-4 bg-gray-50 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No developers found</h3>
        <p className="text-sm text-gray-500 text-center max-w-sm">We couldn't find any developers matching your criteria. Try adjusting your search or filters.</p>
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
            {developers.map((developer) => (
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
                      className="data-[state=checked]:bg-green-500 transition-colors duration-300 shadow-sm"
                    />
                    <Badge
                      variant={developer.status ? "default" : "secondary"}
                      className={`transition-all duration-500 flex items-center justify-center w-6 h-6 p-0 rounded-full shadow-sm ${
                        developer.status
                          ? "bg-green-100 border-green-300"
                          : "bg-gray-100 border-gray-200"
                      }`}
                    >
                      {developer.status ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 animate-in fade-in zoom-in spin-in-12 duration-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 animate-in fade-in zoom-in -spin-in-12 duration-500" />
                      )}
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
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
