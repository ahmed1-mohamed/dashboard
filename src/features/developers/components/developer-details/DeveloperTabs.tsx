import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Home,
  MapPin,
  Plus,
} from "lucide-react";
import { DeveloperData } from "@/hooks/use-developer-details";

interface Unit {
  id: string;
  unitNumber: string;
  project: string;
  type: string;
  area: string;
}

interface DeveloperTabsProps {
  developer: DeveloperData;
  projects: any[];
  units: Unit[];
}

export function DeveloperTabs({ developer, projects, units }: DeveloperTabsProps) {
  const [activeTab, setActiveTab] = useState("projects");
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(units.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUnits = units.slice(startIndex, endIndex);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUnits(paginatedUnits.map((u) => u.id));
    } else {
      setSelectedUnits([]);
    }
  };

  const handleSelectUnit = (unitId: string, checked: boolean) => {
    if (checked) {
      setSelectedUnits((prev) => [...prev, unitId]);
    } else {
      setSelectedUnits((prev) => prev.filter((id) => id !== unitId));
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-2">
        <div className="flex gap-1">
          {[
            { id: "projects", label: "Projects", icon: Building2 },
            { id: "payment", label: "Payment Plans", icon: FileText },
            { id: "units", label: "Units", icon: Home },
            { id: "documents", label: "Documents", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-all ${
                activeTab === tab.id
                  ? "bg-white text-teal-600 border-t-2 border-teal-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              <tab.icon
                className={`h-4 w-4 ${
                  activeTab === tab.id ? "text-teal-600" : "text-gray-400"
                }`}
              />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === "projects" && (
          <div>
            <div className="flex items-center justify-end mb-4">
              <Button
                variant="outline"
                className="gap-2 bg-purple-600 text-white hover:bg-purple-700"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
            <div className="space-y-4">
              {projects.length > 0 ? (
                projects.map((project: any) => (
                  <div
                    key={project.project_id}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg text-gray-900">
                          {project.project_name}
                        </h4>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            className={`text-xs ${
                              project.status === "ongoing"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : project.status === "completed"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                            }`}
                          >
                            {project.status || "Active"}
                          </Badge>
                          {project.project_type && (
                            <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                              {project.project_type}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Building2 className="h-4 w-4 text-teal-600" />
                        <span className="font-medium">
                          {project.total_units || 0} Units
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Home className="h-4 w-4 text-teal-600" />
                        <span className="font-medium">
                          {project.available_units || 0} Available
                        </span>
                      </div>
                      {project.project_size && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="h-4 w-4 text-teal-600" />
                          <span className="font-medium">
                            {project.project_size} sqft
                          </span>
                        </div>
                      )}
                      {project.launch_date && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="h-4 w-4 text-teal-600" />
                          <span className="font-medium">
                            {new Date(project.launch_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    {project.price_range && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Price Range: </span>
                        {project.price_range}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No projects available</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "units" && (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-3 text-left">
                      <Checkbox
                        checked={
                          paginatedUnits.length > 0 &&
                          selectedUnits.length === paginatedUnits.length
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900">
                      Unit Number
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900">
                      Project
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900">
                      Type
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900">
                      Area
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUnits.length > 0 ? (
                    paginatedUnits.map((unit) => (
                      <tr
                        key={unit.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-3 py-3">
                          <Checkbox
                            checked={selectedUnits.includes(unit.id)}
                            onCheckedChange={(checked) =>
                              handleSelectUnit(unit.id, checked as boolean)
                            }
                          />
                        </td>
                        <td className="px-3 py-3 text-sm text-teal-600 font-semibold">
                          {unit.unitNumber}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-900 font-medium">
                          {unit.project}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-700">
                          {unit.type}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-700">
                          {unit.area}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-3 py-12 text-center text-gray-500">
                        No units available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 0 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Showing {startIndex + 1}-{Math.min(endIndex, units.length)} of{" "}
                  {units.length > 1000 ? "1000" : units.length}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="icon"
                        onClick={() => setCurrentPage(page)}
                        className={
                          currentPage === page
                            ? "h-8 w-8 bg-gray-900 hover:bg-gray-800 text-white"
                            : "h-8 w-8"
                        }
                      >
                        {page}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "payment" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Payment Plans</h3>
            </div>
            <div className="space-y-4">
              {developer.paymentPlans && developer.paymentPlans.length > 0 ? (
                developer.paymentPlans.map((plan: any) => (
                  <div
                    key={plan.payment_plan_id}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-lg text-gray-900">
                        {plan.name}
                      </h4>
                      <Badge
                        className={
                          plan.status === "active"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-50 text-gray-700"
                        }
                      >
                        {plan.status || "Active"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                    {plan.total_cost && (
                      <div className="text-sm font-medium text-gray-900">
                        Total Cost: {Number(plan.total_cost).toLocaleString()} AED
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No payment plans available for this developer.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No documents yet
            </h3>
            <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">
              Upload documents related to this developer such as licenses, contracts, or
              certificates.
            </p>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
              <Plus className="h-4 w-4" />
              Upload Document
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
