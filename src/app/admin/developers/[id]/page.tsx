"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { EditDeveloperModal } from "@/components/modals/edit-developer-modal";
import { useDeveloperDetails } from "@/hooks/use-developer-details";
import {
  MapPin,
  Calendar,
  Phone,
  ChevronLeft,
  Download,
  Edit,
  Home,
  Building2,
  FileText,
  ChevronRight,
  Plus,
  Star,
} from "lucide-react";

interface Unit {
  id: number;
  unitNumber: string;
  project: string;
  type: string;
  area: string;
}

export default function DeveloperDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: developerId } = use(params);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("projects");
  const [selectedUnits, setSelectedUnits] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { developer, isLoading, isError, error, toggleTop, isTogglingTop } =
    useDeveloperDetails(Number(developerId));

  const handleToggleTopDeveloper = (checked: boolean) => {
    toggleTop(checked);
  };

  const itemsPerPage = 10;

  const projects = developer?.project || [];
  const units: Unit[] = [];

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

  const handleSelectUnit = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedUnits([...selectedUnits, id]);
    } else {
      setSelectedUnits(selectedUnits.filter((uid) => uid !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-gray-600">
            Loading developer details...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="mx-auto h-12 w-12 text-red-600">⚠️</div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Error Loading Developer
          </h2>
          <p className="mt-2 text-gray-600">
            {error instanceof Error
              ? error.message
              : "Failed to load developer"}
          </p>
          <Button
            onClick={() => router.push("/admin/developers")}
            className="mt-6 bg-teal-600 hover:bg-teal-700"
          >
            Back to Developers
          </Button>
        </div>
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-500">No developer data available</p>
          <Button
            onClick={() => router.push("/admin/developers")}
            className="mt-6 bg-teal-600 hover:bg-teal-700"
          >
            Back to Developers
          </Button>
        </div>
      </div>
    );
  }

  const totalUnits = projects.reduce(
    (sum: any, p: any) => sum + (p.total_units || 0),
    0,
  );
  const availableUnits = projects.reduce(
    (sum: any, p: any) => sum + (p.available_units || 0),
    0,
  );
  const bookedUnits = totalUnits - availableUnits;

  return (
    <div className="p-4 px-3 space-y-4 max-w-full overflow-hidden">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Home</span>
        <ChevronRight className="h-4 w-4" />
        <span>Developers</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">{developer.name}</span>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin/developers")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Developer Details</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            {developer.logo ? (
              <img
                src={developer.logo}
                alt={developer.name}
                className="w-16 h-16 rounded-lg object-contain"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-600">
                {developer.name?.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {developer.name}
                </h2>
                {developer.is_top === 1 && (
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                )}
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <span
                    className={`inline-flex h-2 w-2 rounded-full ${developer.status === "active"
                        ? "bg-green-500"
                        : "bg-gray-400"
                      }`}
                  />
                  <span className="capitalize">{developer.status}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Phone className="h-4 w-4" />
              Contact
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download Developer
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Projects</p>
            <p className="text-2xl font-bold text-gray-900">
              {projects.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Active Projects</p>
            <p className="text-2xl font-bold text-gray-900">
              {developer.active_projects_count || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Completed Projects</p>
            <p className="text-2xl font-bold text-gray-900">
              {developer.completed_projects_count || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Units</p>
            <p className="text-2xl font-bold text-gray-900">
              {developer.total_units_count ?? totalUnits ?? "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Av Units</p>
            <p className="text-2xl font-bold text-gray-900">
              {developer.available_units_count ?? availableUnits ?? "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Booked Units</p>
            <p className="text-2xl font-bold text-gray-900">
              {developer.booked_units_count ?? (bookedUnits >= 0 ? bookedUnits : "-")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              About Developer
            </h3>
            <div
              className="text-sm text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: developer.description || "No description available.",
              }}
            />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Name</span>
                <span className="text-sm text-gray-900 font-medium">
                  {developer.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email</span>
                <span className="text-sm text-gray-900 font-medium">
                  {developer.email || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Phone</span>
                <span className="text-sm text-gray-900 font-medium">
                  {developer.phone_number || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Is Top Developer</span>
                <div className="flex items-center gap-2">
                  <Switch
                    id="is-top-developer-toggle"
                    checked={developer.is_top === 1}
                    onCheckedChange={handleToggleTopDeveloper}
                    disabled={isTogglingTop}
                  />
                  <span className="text-sm text-gray-900 font-medium">
                    {developer.is_top === 1 ? "Yes" : "No"}
                  </span>
                </div>
              </div>
              {developer.website && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Website</span>
                  <a
                    href={developer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                  >
                    {developer.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
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
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-all ${activeTab === tab.id
                        ? "bg-white text-teal-600 border-t-2 border-teal-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                      }`}
                  >
                    <tab.icon
                      className={`h-4 w-4 ${activeTab === tab.id ? "text-teal-600" : "text-gray-400"
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
                                  className={`text-xs ${project.status === "ongoing"
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
                                  {new Date(
                                    project.launch_date,
                                  ).toLocaleDateString()}
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
                                    handleSelectUnit(
                                      unit.id,
                                      checked as boolean,
                                    )
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
                            <td
                              colSpan={5}
                              className="px-3 py-12 text-center text-gray-500"
                            >
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
                        Showing {startIndex + 1}-
                        {Math.min(endIndex, units.length)} of{" "}
                        {units.length > 1000 ? "1000" : units.length}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          disabled={currentPage === 1}
                          className="h-8 w-8"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {Array.from(
                          { length: Math.min(totalPages, 8) },
                          (_, i) => i + 1,
                        ).map((page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
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
                        ))}
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
                        <div key={plan.payment_plan_id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-lg text-gray-900">{plan.name}</h4>
                            <Badge className={plan.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-700"}>
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
                    Upload documents related to this developer such as licenses,
                    contracts, or certificates.
                  </p>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
                    <Plus className="h-4 w-4" />
                    Upload Document
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Developer Modal */}
      {/* <EditDeveloperModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
        }}
        developerId={Number(developerId)}
        data={developer}
        onSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: ["developerDetails", developerId],
          });
          setIsEditModalOpen(false);
        }}
      /> */}
    </div>
  );
}
