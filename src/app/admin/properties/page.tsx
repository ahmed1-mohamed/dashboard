"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TableActions } from "@/components/table/table-actions";
import {
  Plus,
  Search,
  Download,
  Settings2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PropertiesDataType } from "@/types";
import { EditPropertyModal } from "@/components/modals/edit-property-modal";
import useDashboardAdminProperties from "@/hooks/use-dashboardAdminPropertiesData";

interface Property {
  id: number;
  unitNumber: string;
  project_name: string;
  type: string;
  area: string;
  floor: string;
  price: string;
  property_name: string;
  status: "Reserved" | "Available";
}

const fallbackProperties: Property[] = [];

export default function PropertiesPage() {
  const router = useRouter();
  const { data: session } = useSession();

  // Pagination & Sorting state
  const [perPage, setPerPage] = useState(15);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("property_id");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<number[]>([]);
  const [selectedDevelopers, setSelectedDevelopers] = useState<number[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCountries, selectedDevelopers, selectedProjects]);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<number | null>(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<number | null>(null);

  // Fetch properties with custom hook
  const filters = {
    sort_by: [sortBy],
    sort_order: [sortOrder],
    country_id: selectedCountries,
    developer_id: selectedDevelopers,
    project_id: selectedProjects,
    search: debouncedSearch,
    per_page: perPage,
    page: page,
  };

  const {
    data: propertiesData,
    total,
    isLoading,
    isError,
    error,
    refetch,
  } = useDashboardAdminProperties(page, perPage, filters);
  console.log("Fetched properties data:", propertiesData);

  // Delete property mutation
  const deletePropertyMutation = {
    async mutate(propertyId: number) {
      if (!session?.user?.accessToken) return;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        },
      );
      if (!res.ok) {
        throw new Error("Failed to delete property");
      }
      return res.json();
    },
    async onSuccess() {
      refetch();
    },
  };

  const handleDelete = async (propertyId: number) => {
    try {
      await deletePropertyMutation.mutate(propertyId);
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
    } catch (err) {
      console.error("Error deleting property:", err);
    }
  };

  // Map API data to component interface
  // Map API data to component interface
  const properties: Property[] = (propertiesData || []).map((prop: any) => ({
    id: prop.property_id,
    unitNumber: prop.property_no || prop.property_name || "N/A",
    project_name: prop.project_name?.toString() || "N/A",
    type: prop.type || prop.property_subtype || "N/A",
    area: prop.size
      ? `${prop.size} sqm`
      : prop.plot_size
        ? `${prop.plot_size} sqm`
        : "N/A",
    floor: "N/A",
    price: prop.price ? `${Number(prop.price).toLocaleString()} AED` : "N/A",
    property_name: prop.property_name?.toString() || "N/A",
    status: prop.availability_status === "available" ? "Available" : "Reserved",
  }));

  const filteredProperties = properties;
  const paginatedProperties = properties;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProperties(filteredProperties.map((p) => p.id));
    } else {
      setSelectedProperties([]);
    }
  };

  const handleSelectProperty = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedProperties([...selectedProperties, id]);
    } else {
      setSelectedProperties(selectedProperties.filter((pid) => pid !== id));
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 10;

    if (pagesNo <= maxVisible) {
      for (let i = 1; i <= pagesNo; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (page > 3) {
        pages.push("...");
      }
      let start = Math.max(2, page - 2);
      let end = Math.min(pagesNo - 1, page + 2);
      if (page <= 3) {
        start = 2;
        end = Math.min(maxVisible - 2, pagesNo - 1);
      }
      if (page >= pagesNo - 2) {
        start = Math.max(2, pagesNo - maxVisible + 2);
        end = pagesNo - 1;
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (page < pagesNo - 2) {
        pages.push("...");
      }
      pages.push(pagesNo);
    }
    return pages;
  };

  const isSearching = debouncedSearch.trim() !== "";
  const effectiveTotal = typeof total === "number" ? total : 0;
  const pagesNo = Math.max(1, Math.ceil(effectiveTotal / perPage) || 1);

  // const getPageNumbers = () => {
  //   mutationFn: async (propertyId: number) => {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}`,
  //       {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     if (!res.ok) {
  //       throw new Error("Failed to delete property");
  //     }
  //     return res.json();
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["properties"] });
  //     setDeleteDialogOpen(false);
  //     setPropertyToDelete(null);
  //   },
  // });

  // Map API data to component interface
  // const properties: Property[] = (propertiesData || []).map(
  //   (prop: any) => ({
  //     id: prop.property_id,
  //     unitNumber: prop.property_no || prop.property_name || "N/A",
  //     project: prop.project_id?.toString() || "N/A", // Would need project name from another endpoint
  //     type: prop.property_type || prop.property_subtype || "N/A",
  //     area: prop.size ? `${prop.size} sqm` : prop.plot_size ? `${prop.plot_size} sqm` : "N/A",
  //     floor: "N/A", // Not available in current API response
  //     price: prop.price ? `${Number(prop.price).toLocaleString()} AED` : "N/A",
  //     p: prop.bedrooms?.toString() || "N/A",
  //     status: prop.availability_status === "available" ? "Available" : "Reserved",
  //   }),
  // );

  // Client-side search filter (optional, for local filtering)
  // const filteredProperties = properties.filter((property) => {
  //   const matchesSearch =
  //     searchQuery === "" ||
  //     property.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     property.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     property.type.toLowerCase().includes(searchQuery.toLowerCase());
  //   return matchesSearch;
  // });

  // const paginatedproperties = filteredproperties;

  // const handleselectall = (checked: boolean) => {
  //   if (checked) {
  //     setselectedproperties(filteredproperties.map((p) => p.id));
  //   } else {
  //     setselectedproperties([]);
  //   }
  // };

  // const handleselectproperty = (id: number, checked: boolean) => {
  //   if (checked) {
  //     setselectedproperties([...selectedproperties, id]);
  //   } else {
  //     setselectedproperties(selectedproperties.filter((pid) => pid !== id));
  //   }
  // };

  // const getpagenumbers = () => {
  //   const pages: (number | string)[] = [];
  //   const maxvisible = 10;

  //   if (pagesno <= maxvisible) {
  //     for (let i = 1; i <= pagesno; i++) {
  //       pages.push(i);
  //     }
  //   } else {
  //     // always show first page
  //     pages.push(1);

  //     // add ellipsis if needed after first page
  //     if (page > 3) {
  //       pages.push("...");
  //     }

  //     // calculate start and end for middle pages
  //     let start = math.max(2, page - 2);
  //     let end = math.min(pagesno - 1, page + 2);

  //     // adjust if at the beginning
  //     if (page <= 3) {
  //       start = 2;
  //       end = math.min(maxvisible - 2, pagesno - 1);
  //     }

  //     // adjust if at the end
  //     if (page >= pagesno - 2) {
  //       start = math.max(2, pagesno - maxvisible + 2);
  //       end = pagesno - 1;
  //     }

  //     for (let i = start; i <= end; i++) {
  //       pages.push(i);
  //     }

  //     // add ellipsis if needed before last page
  //     if (page < pagesno - 2) {
  //       pages.push("...");
  //     }

  //     // always show last page
  //     pages.push(pagesno);
  //   }

  //   return pages;
  // };

  return (
    <div className="p-4 px-3 space-y-4 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-700 border-purple-200 rounded-full px-2"
          >
            {effectiveTotal}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
            onClick={() => router.push("/admin/properties/create")}
          >
            <Plus className="h-4 w-4" />
            Create New Property
          </Button>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          {/* Search */}
          <div className="relative w-full min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for properties"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200"
            />
          </div>

          {/* Country Filter - You can populate this dynamically */}
          <Select
            value={
              selectedCountries.length > 0
                ? selectedCountries[0].toString()
                : "all"
            }
            onValueChange={(val) =>
              setSelectedCountries(val === "all" ? [] : [Number(val)])
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {/* Add dynamic country options here */}
            </SelectContent>
          </Select>

          {/* Developer Filter - You can populate this dynamically */}
          <Select
            value={
              selectedDevelopers.length > 0
                ? selectedDevelopers[0].toString()
                : "all"
            }
            onValueChange={(val) =>
              setSelectedDevelopers(val === "all" ? [] : [Number(val)])
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Developer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Developers</SelectItem>
              {/* Add dynamic developer options here */}
            </SelectContent>
          </Select>

          {/* Project Filter - You can populate this dynamically */}
          <Select
            value={
              selectedProjects.length > 0
                ? selectedProjects[0].toString()
                : "all"
            }
            onValueChange={(val) =>
              setSelectedProjects(val === "all" ? [] : [Number(val)])
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {/* Add dynamic project options here */}
            </SelectContent>
          </Select>

          {/* All Filters */}
          <Select defaultValue="all">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="All Filters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Filters</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 border-gray-200">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="gap-2 border-gray-200">
            <Settings2 className="h-4 w-4" />
            Table settings
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-600">Loading properties...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            <strong>Error:</strong>{" "}
            {error?.message || "Failed to load properties"}
          </p>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-[35px] px-2">
                <Checkbox
                  checked={
                    filteredProperties.length > 0 &&
                    selectedProperties.length === filteredProperties.length
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="font-semibold text-gray-900 w-[80px] px-2 text-sm">
                Unit Number
              </TableHead>
              <TableHead className="font-semibold text-gray-900 w-[110px] px-2 text-sm">
                property name
              </TableHead>
              <TableHead className="font-semibold text-gray-900 w-[140px] px-2 text-sm">
                Type
              </TableHead>
              <TableHead className="font-semibold text-gray-900 w-[70px] px-2 text-sm">
                Area
              </TableHead>
              <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
                Floor
              </TableHead>
              <TableHead className="font-semibold text-gray-900 w-[110px] px-2 text-sm">
                Price
              </TableHead>
              <TableHead className="font-semibold text-gray-900 w-[40px] px-2 text-sm">
                Project name
              </TableHead>
              <TableHead className="font-semibold text-gray-900 w-[90px] px-2 text-sm">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-900 text-center w-[50px] px-2 text-sm">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProperties.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="h-24 text-center text-gray-500"
                >
                  No properties found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="px-2">
                    <Checkbox
                      checked={selectedProperties.includes(property.id)}
                      onCheckedChange={(checked) =>
                        handleSelectProperty(property.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-teal-600 font-medium px-2 text-sm">
                    <button
                      onClick={() => router.push(`/admin/properties/${property.id}`)}
                      className="text-teal-600 hover:text-teal-800 active:text-teal-900 transition-colors cursor-pointer text-left focus:outline-none"
                    >
                      {property.unitNumber}
                    </button>
                  </TableCell>
                  <TableCell className="text-gray-900 px-2 text-sm truncate">
                    {property.property_name}
                  </TableCell>
                  <TableCell className="text-gray-900 px-2 text-sm truncate">
                    {property.type}
                  </TableCell>
                  <TableCell className="text-gray-900 px-2 text-xs">
                    {property.area}
                  </TableCell>
                  <TableCell className="text-gray-900 px-2 text-sm">
                    {property.floor}
                  </TableCell>
                  <TableCell className="text-gray-900 px-2 text-sm">
                    {property.price}
                  </TableCell>
                  <TableCell className="text-gray-900 px-2 text-sm">
                    {property.project_name}
                  </TableCell>
                  <TableCell className="px-2">
                    <Badge
                      variant="outline"
                      className={
                        property.status === "Reserved"
                          ? "bg-orange-50 text-orange-700 border-orange-200 text-[10px] px-1"
                          : "bg-green-50 text-green-700 border-green-200 text-[10px] px-1"
                      }
                    >
                      {property.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center px-2">
                    <TableActions
                      onView={() =>
                        router.push(`/admin/properties/${property.id}`)
                      }
                      onEdit={() => {
                        setPropertyToEdit(property.id);
                        setEditModalOpen(true);
                      }}
                      onDelete={() => {
                        setPropertyToDelete(property.id);
                        setDeleteDialogOpen(true);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagesNo > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">
              Showing {effectiveTotal === 0 ? 0 : (page - 1) * perPage + 1}-
              {Math.min(page * perPage, effectiveTotal)} of {effectiveTotal}
            </div>
            {/* Per Page Select */}
            <Select
              value={perPage.toString()}
              onValueChange={(val) => {
                const newPerPage = Number(val);
                setPerPage(newPerPage);
                const newPagesNo = Math.ceil(total / newPerPage);
                setPage((prevPage) => Math.min(prevPage, newPagesNo || 1));
              }}
            >
              <SelectTrigger className="w-[90px] h-8">
                <SelectValue placeholder="Per Page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 / page</SelectItem>
                <SelectItem value="30">30 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
                <SelectItem value="100">100 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1">
            {/* First Page */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="h-8 w-8 border-gray-200"
              title="First Page"
            >
              <ChevronLeft className="h-3 w-3" />
              <ChevronLeft className="h-3 w-3 -ml-2" />
            </Button>
            {/* Previous Page */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-8 w-8 border-gray-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {getPageNumbers().map((pageNum, index) =>
              typeof pageNum === "number" ? (
                <Button
                  key={index}
                  variant={page === pageNum ? "default" : "outline"}
                  size="icon"
                  onClick={() => setPage(pageNum)}
                  className={
                    page === pageNum
                      ? "h-8 w-8 bg-gray-900 hover:bg-gray-800 text-white"
                      : "h-8 w-8 border-gray-200"
                  }
                >
                  {pageNum}
                </Button>
              ) : (
                <span key={index} className="px-2 text-gray-400 text-sm">
                  {pageNum}
                </span>
              ),
            )}
            {/* Next Page */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.min(pagesNo, p + 1))}
              disabled={page === pagesNo}
              className="h-8 w-8 border-gray-200"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            {/* Last Page */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(pagesNo)}
              disabled={page === pagesNo}
              className="h-8 w-8 border-gray-200"
              title="Last Page"
            >
              <ChevronRight className="h-3 w-3" />
              <ChevronRight className="h-3 w-3 -ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Per Page Select (when no pagination needed) */}
      {pagesNo <= 1 && effectiveTotal > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">
              Showing 1-{effectiveTotal} of {effectiveTotal}
            </div>
            {/* Per Page Select */}
            <Select
              value={perPage.toString()}
              onValueChange={(val) => {
                const newPerPage = Number(val);
                setPerPage(newPerPage);
                const newPagesNo = Math.ceil(total / newPerPage);
                setPage((prevPage) => Math.min(prevPage, newPagesNo || 1));
              }}
            >
              <SelectTrigger className="w-[90px] h-8">
                <SelectValue placeholder="Per Page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 / page</SelectItem>
                <SelectItem value="30">30 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
                <SelectItem value="100">100 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Property</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this property? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (propertyToDelete) {
                  deletePropertyMutation.mutate(propertyToDelete);
                }
              }}
            // disabled={deletePropertyMutation.isPending}
            >
              {/* {deletePropertyMutation.isPending ? "Deleting..." : "Delete"} */}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Property Modal */}
      {/* <EditPropertyModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setPropertyToEdit(null);
        }}
        propertyId={propertyToEdit || 0}
      /> */}
    </div>
  );
}
