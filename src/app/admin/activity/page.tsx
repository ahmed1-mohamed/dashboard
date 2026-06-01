// "use client";

// export const dynamic = "force-dynamic";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { TableActions } from "@/components/table/table-actions";
// import {
//   Search,
//   Download,
//   Settings2,
//   ChevronLeft,
//   ChevronRight,
//   Loader2,
//   AlertCircle,
// } from "lucide-react";
// import { fetchActivityLogs, searchActivityLogs } from "@/data/api-client";

// interface UserActivity {
//   log_id: number;
//   action: string | null;
//   entity_type: string | null;
//   entity_id: number | null;
//   ip_address: string | null;
//   location: string | null;
//   old_value: Record<string, unknown>;
//   new_value: Record<string, unknown>;
//   additional_info: {
//     source: string | null;
//     time: string | null;
//     user: string | null;
//   };
//   is_favourite: boolean;
//   created_at: string | null;
//   user: {
//     id: number | null;
//     name: string | null;
//     email: string | null;
//   };
//   entity: {
//     type: string | null;
//     id: number | null;
//     title: string | null;
//     attributes: Record<string, unknown>;
//   };
// }

// interface Activity {
//   id: number;
//   user: string;
//   action: string;
//   entity: string;
//   description: string;
//   dateTime: string;
//   ipAddress: string;
// }

// export default function ActivityLogPage() {
//   const { data: session } = useSession();
//   const token = session?.user?.accessToken;

//   const [searchQuery, setSearchQuery] = useState("");
//   const [actionFilter, setActionFilter] = useState("all");
//   const [entityFilter, setEntityFilter] = useState("all");
//   const [dateFilter, setDateFilter] = useState("all");
//   const [selectedActivities, setSelectedActivities] = useState<number[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [total, setTotal] = useState(0);

//   // Fetch data from API
//   useEffect(() => {
//     const loadData = async () => {
//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);

//         let res;
//         const hasSearchOrFilters =
//           searchQuery ||
//           actionFilter !== "all" ||
//           entityFilter !== "all" ||
//           dateFilter !== "all";

//         if (hasSearchOrFilters) {
//           // Search with filters
//           res = await searchActivityLogs(
//             {
//               keyword: searchQuery,
//               per_page: itemsPerPage,
//               page: currentPage,
//             },
//             token,
//           );
//         } else {
//           // Normal fetch
//           const params = `per_page=${itemsPerPage}&page=${currentPage}`;
//           res = await fetchActivityLogs(token, params);
//         }

//         // Handle inconsistent API response structure if needed
//         const dataArray = res.data || (Array.isArray(res) ? res : []);
//         const totalCount = res.total || dataArray.length;

//         // Map API data to component interface
//         const mappedActivities: Activity[] = dataArray.map(
//           (log: UserActivity) => ({
//             id: log.log_id,
//             user: log.user?.name || "Unknown User",
//             action: log.action || "N/A",
//             entity: log.entity_type || "N/A",
//             description:
//               log.entity?.title ||
//               `${log.action} - ${log.entity_type}` ||
//               "No description",
//             dateTime: log.created_at || "N/A",
//             ipAddress: log.ip_address || log.location || "N/A",
//           }),
//         );

//         setActivities(mappedActivities);
//         setTotalPages(Math.ceil(Number(totalCount) / itemsPerPage));
//         setTotal(Number(totalCount));
//       } catch (err) {
//         console.error("Error fetching activity logs:", err);
//         setError(
//           err instanceof Error ? err.message : "Failed to load activities",
//         );
//         setActivities([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, [
//     token,
//     currentPage,
//     itemsPerPage,
//     searchQuery,
//     actionFilter,
//     entityFilter,
//     dateFilter,
//   ]);

//   // Filter activities client-side (for additional filtering beyond API)
//   const filteredActivities = activities.filter((activity) => {
//     const matchesAction =
//       actionFilter === "all" ||
//       activity.action.toLowerCase() === actionFilter.toLowerCase();
//     const matchesEntity =
//       entityFilter === "all" || activity.entity === entityFilter;
//     const matchesDate = dateFilter === "all"; // Could add date filtering logic

//     return matchesAction && matchesEntity && matchesDate;
//   });

//   const paginatedActivities = filteredActivities;

//   const handleSelectAll = (checked: boolean) => {
//     if (checked) {
//       setSelectedActivities(paginatedActivities.map((a) => a.id));
//     } else {
//       setSelectedActivities([]);
//     }
//   };

//   const handleSelectActivity = (id: number, checked: boolean) => {
//     if (checked) {
//       setSelectedActivities([...selectedActivities, id]);
//     } else {
//       setSelectedActivities(selectedActivities.filter((aid) => aid !== id));
//     }
//   };

//   const getPageNumbers = () => {
//     const pages: number[] = [];
//     const maxVisible = 10;

//     if (totalPages <= maxVisible) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       for (let i = 1; i <= Math.min(maxVisible, totalPages); i++) {
//         pages.push(i);
//       }
//     }

//     return pages;
//   };

//   return (
//     <div className="p-4 px-3 space-y-4 max-w-full overflow-hidden">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
//       </div>

//       {/* Filters and Actions */}
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
//           {/* Search */}
//           <div className="relative w-full min-w-[200px] max-w-xs">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//             <Input
//               placeholder="Search in log"
//               value={searchQuery}
//               onChange={(e) => {
//                 setSearchQuery(e.target.value);
//                 setCurrentPage(1); // Reset to first page on search
//               }}
//               className="pl-10 bg-white border-gray-200"
//             />
//           </div>

//           {/* Actions Filter */}
//           <Select value={actionFilter} onValueChange={setActionFilter}>
//             <SelectTrigger className="w-[100px]">
//               <SelectValue placeholder="Actions" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Actions</SelectItem>
//               <SelectItem value="create">Create</SelectItem>
//               <SelectItem value="update">Update</SelectItem>
//               <SelectItem value="delete">Delete</SelectItem>
//               <SelectItem value="login">Login</SelectItem>
//               <SelectItem value="export">Export</SelectItem>
//               <SelectItem value="view">View</SelectItem>
//               <SelectItem value="add_favourite">Add Favourite</SelectItem>
//             </SelectContent>
//           </Select>

//           {/* Entities Filter */}
//           <Select value={entityFilter} onValueChange={setEntityFilter}>
//             <SelectTrigger className="w-[100px]">
//               <SelectValue placeholder="Entities" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Entities</SelectItem>
//               <SelectItem value="Project">Project</SelectItem>
//               <SelectItem value="Unit">Unit</SelectItem>
//               <SelectItem value="Developer">Developer</SelectItem>
//               <SelectItem value="Property">Property</SelectItem>
//               <SelectItem value="User">User</SelectItem>
//             </SelectContent>
//           </Select>

//           {/* Date Filter */}
//           <Select value={dateFilter} onValueChange={setDateFilter}>
//             <SelectTrigger className="w-[100px]">
//               <SelectValue placeholder="Date" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Dates</SelectItem>
//               <SelectItem value="today">Today</SelectItem>
//               <SelectItem value="week">This Week</SelectItem>
//               <SelectItem value="month">This Month</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex items-center gap-2">
//           <Button variant="outline" className="gap-2 border-gray-200">
//             <Download className="h-4 w-4" />
//             Export
//           </Button>
//           <Button variant="outline" className="gap-2 border-gray-200">
//             <Settings2 className="h-4 w-4" />
//             Table settings
//           </Button>
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading && (
//         <div className="flex items-center justify-center py-12">
//           <div className="text-center">
//             <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
//             <p className="mt-4 text-sm text-gray-600">Loading activities...</p>
//           </div>
//         </div>
//       )}

//       {/* Error State */}
//       {error && !loading && (
//         <div className="rounded-lg border border-red-200 bg-red-50 p-4">
//           <p className="text-sm text-red-800">
//             <strong>Error:</strong> {error}
//           </p>
//         </div>
//       )}

//       {/* Table */}
//       {!loading && !error && (
//         <div className="rounded-lg border border-gray-200 bg-white overflow-hidden overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow className="bg-gray-50 hover:bg-gray-50">
//                 <TableHead className="w-[35px] px-2">
//                   <Checkbox
//                     checked={
//                       paginatedActivities.length > 0 &&
//                       selectedActivities.length === paginatedActivities.length
//                     }
//                     onCheckedChange={handleSelectAll}
//                   />
//                 </TableHead>
//                 <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
//                   User
//                 </TableHead>
//                 <TableHead className="font-semibold text-gray-900 w-[80px] px-2 text-sm">
//                   Action
//                 </TableHead>
//                 <TableHead className="font-semibold text-gray-900 w-[80px] px-2 text-sm">
//                   Entity
//                 </TableHead>
//                 <TableHead className="font-semibold text-gray-900 w-[200px] px-2 text-sm">
//                   Description
//                 </TableHead>
//                 <TableHead className="font-semibold text-gray-900 w-[130px] px-2 text-sm">
//                   Date & Time
//                 </TableHead>
//                 <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
//                   IP Address
//                 </TableHead>
//                 <TableHead className="font-semibold text-gray-900 text-center w-[50px] px-2 text-sm">
//                   Actions
//                 </TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {paginatedActivities.length === 0 ? (
//                 <TableRow>
//                   <TableCell
//                     colSpan={8}
//                     className="h-24 text-center text-gray-500"
//                   >
//                     No activities found.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 paginatedActivities.map((activity) => (
//                   <TableRow key={activity.id}>
//                     <TableCell className="px-2">
//                       <Checkbox
//                         checked={selectedActivities.includes(activity.id)}
//                         onCheckedChange={(checked) =>
//                           handleSelectActivity(activity.id, checked as boolean)
//                         }
//                       />
//                     </TableCell>
//                     <TableCell className="text-gray-900 px-2 text-xs font-medium truncate">
//                       {activity.user}
//                     </TableCell>
//                     <TableCell className="text-gray-900 px-2 text-xs">
//                       {activity.action}
//                     </TableCell>
//                     <TableCell className="text-gray-900 px-2 text-xs">
//                       {activity.entity}
//                     </TableCell>
//                     <TableCell className="text-gray-900 px-2 text-xs truncate">
//                       {activity.description}
//                     </TableCell>
//                     <TableCell className="text-gray-900 px-2 text-xs">
//                       {activity.dateTime}
//                     </TableCell>
//                     <TableCell className="text-gray-900 px-2 text-xs">
//                       {activity.ipAddress}
//                     </TableCell>
//                     <TableCell className="text-center px-2">
//                       <TableActions
//                         onView={() => console.log("View", activity.id)}
//                         onEdit={() => console.log("Edit", activity.id)}
//                         onDelete={() => console.log("Delete", activity.id)}
//                       />
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       )}

//       {/* Pagination */}
//       {!loading && !error && paginatedActivities.length > 0 && (
//         <div className="flex items-center justify-between">
//           <div className="text-sm text-gray-500">
//             Showing {(currentPage - 1) * itemsPerPage + 1}-
//             {Math.min(currentPage * itemsPerPage, total)} of {total}
//           </div>
//           <div className="flex items-center gap-1">
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//               className="h-8 w-8 border-gray-200"
//             >
//               <ChevronLeft className="h-4 w-4" />
//             </Button>
//             {getPageNumbers().map((page, index) => (
//               <Button
//                 key={index}
//                 variant={currentPage === page ? "default" : "outline"}
//                 size="icon"
//                 onClick={() => setCurrentPage(page)}
//                 className={
//                   currentPage === page
//                     ? "h-8 w-8 bg-gray-900 hover:bg-gray-800 text-white"
//                     : "h-8 w-8 border-gray-200"
//                 }
//               >
//                 {page}
//               </Button>
//             ))}
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//               disabled={currentPage === totalPages}
//               className="h-8 w-8 border-gray-200"
//             >
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
export default function Page() {
  return <div>page</div>;
}
