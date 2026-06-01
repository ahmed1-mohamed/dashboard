// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
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
// } from "lucide-react";
// import { fetchReservations } from "@/data/api-client";

// interface Booking {
//   id: number;
//   bookingNumber: string;
//   user_name: string;
//   project_name: string;
//   country: string;
//   createdDate: string;
//   expiry_date: string;
//   types: string;
//   last_status: string;
// }

// interface ApiReservation {
//   reservation_id: number;
//   last_status: string;
//   created_at: string;
//   expiry_date?: string;
//   user_name: string;
//   property?: {
//     property_type?: {
//       property_type_name: string;
//     };
//   };
//   project_name: string;
//   country: string;
// }

// const fallbackBookings: Booking[] = [];

// export default function BookingsPage() {
//   const { data: session } = useSession();
//   const router = useRouter();

//   const [bookings, setBookings] = useState<Booking[]>(fallbackBookings);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [countryFilter, setCountryFilter] = useState("all");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [typeFilter, setTypeFilter] = useState("all");
//   const [expiryDateFilter, setExpiryDateFilter] = useState("all");
//   const [selectedBookings, setSelectedBookings] = useState<number[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);

//   const itemsPerPage = 10;

//   useEffect(() => {
//     async function loadBookings() {
//       if (!session?.user?.accessToken) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);
//         const data = await fetchReservations(session.user.accessToken);

//         const mappedBookings = data.map((booking: ApiReservation) => ({
//           id: booking.reservation_id,
//           bookingNumber: `BK-${booking.reservation_id}`,
//           user_name: booking.user_name || "N/A",
//           project_name: booking.project_name || "N/A",
//           country: booking.country || "N/A",
//           createdDate: booking.created_at
//             ? new Date(booking.created_at).toISOString().split("T")[0]
//             : "N/A",
//           expiry_date: booking.expiry_date
//             ? new Date(booking.expiry_date).toISOString().split("T")[0]
//             : "N/A",
//           types: booking.property?.property_type?.property_type_name || "N/A",
//           status: booking.last_status,
//         })) as Booking[];

//         setBookings(mappedBookings);
//       } catch (err) {
//         console.error("Error loading bookings:", err);
//         setError(
//           err instanceof Error ? err.message : "Failed to load bookings",
//         );
//         setBookings(fallbackBookings);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadBookings();
//   }, [session]);

//   const filteredBookings = bookings.filter((booking) => {
//     const matchesSearch =
//       booking.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       booking.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       booking.project_name.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCountry =
//       countryFilter === "all" || booking.country === countryFilter;
//     const matchesStatus =
//       statusFilter === "all" || booking.last_status === statusFilter;
//     const matchesType = typeFilter === "all" || booking.types === typeFilter;
//     const matchesExpiryDate =
//       expiryDateFilter === "all" ||
//       (expiryDateFilter === "expired" &&
//         booking.expiry_date !== "N/A" &&
//         new Date(booking.expiry_date) < new Date()) ||
//       (expiryDateFilter === "active" &&
//         booking.expiry_date !== "N/A" &&
//         new Date(booking.expiry_date) >= new Date()) ||
//       (expiryDateFilter === "no_expiry" && booking.expiry_date === "N/A");

//     return (
//       matchesSearch &&
//       matchesCountry &&
//       matchesStatus &&
//       matchesType &&
//       matchesExpiryDate
//     );
//   });

//   const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

//   const handleSelectAll = (checked: boolean) => {
//     if (checked) {
//       setSelectedBookings(paginatedBookings.map((b) => b.id));
//     } else {
//       setSelectedBookings([]);
//     }
//   };

//   const handleSelectBooking = (id: number, checked: boolean) => {
//     if (checked) {
//       setSelectedBookings([...selectedBookings, id]);
//     } else {
//       setSelectedBookings(selectedBookings.filter((bid) => bid !== id));
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
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
//           <Badge
//             variant="outline"
//             className="bg-purple-100 text-purple-700 border-purple-200 rounded-full px-2"
//           >
//             {bookings.length}
//           </Badge>
//         </div>
//       </div>

//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
//           <div className="relative w-full min-w-[200px] max-w-xs">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//             <Input
//               placeholder="Search for bookings"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 bg-white border-gray-200"
//             />
//           </div>

//           <Select value={countryFilter} onValueChange={setCountryFilter}>
//             <SelectTrigger className="w-[120px]">
//               <SelectValue placeholder="Country" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Countries</SelectItem>
//               <SelectItem value="UAE">UAE</SelectItem>
//               <SelectItem value="Egypt">Egypt</SelectItem>
//               <SelectItem value="Oman">Oman</SelectItem>
//             </SelectContent>
//           </Select>

//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-[120px]">
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Status</SelectItem>
//               <SelectItem value="Under Review">Under Review</SelectItem>
//               <SelectItem value="Sales Offer">Sales Offer</SelectItem>
//               <SelectItem value="Down Payment">Down Payment</SelectItem>
//               <SelectItem value="Sales Agreement">Sales Agreement</SelectItem>
//               <SelectItem value="Completed">Completed</SelectItem>
//               <SelectItem value="Rejected">Rejected</SelectItem>
//             </SelectContent>
//           </Select>

//           <Select value={typeFilter} onValueChange={setTypeFilter}>
//             <SelectTrigger className="w-[120px]">
//               <SelectValue placeholder="Type" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Types</SelectItem>
//               <SelectItem value="1 Bedroom Apartment">1 Bedroom</SelectItem>
//               <SelectItem value="2 Bedroom Apartment">2 Bedroom</SelectItem>
//               <SelectItem value="3 Bedroom Apartment">3 Bedroom</SelectItem>
//               <SelectItem value="Penthouse">Penthouse</SelectItem>
//             </SelectContent>
//           </Select>

//           <Select value={expiryDateFilter} onValueChange={setExpiryDateFilter}>
//             <SelectTrigger className="w-[140px]">
//               <SelectValue placeholder="Expiry Date" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Expiry Dates</SelectItem>
//               <SelectItem value="expired">Expired</SelectItem>
//               <SelectItem value="active">Active</SelectItem>
//               <SelectItem value="no_expiry">No Expiry Date</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

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

//       <div className="rounded-lg border border-gray-200 bg-white overflow-hidden overflow-x-auto">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-gray-50 hover:bg-gray-50">
//               <TableHead className="w-[35px] px-2">
//                 <Checkbox
//                   checked={
//                     paginatedBookings.length > 0 &&
//                     selectedBookings.length === paginatedBookings.length
//                   }
//                   onCheckedChange={handleSelectAll}
//                 />
//               </TableHead>
//               <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
//                 Booking Number
//               </TableHead>
//               <TableHead className="font-semibold text-gray-900 w-[110px] px-2 text-sm">
//                 Client Name
//               </TableHead>
//               <TableHead className="font-semibold text-gray-900 w-[110px] px-2 text-sm">
//                 Project
//               </TableHead>
//               <TableHead className="font-semibold text-gray-900 w-[70px] px-2 text-sm">
//                 Country
//               </TableHead>
//               <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
//                 Created Date
//               </TableHead>
//               <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
//                 Expiry Date
//               </TableHead>
//               <TableHead className="font-semibold text-gray-900 w-[130px] px-2 text-sm">
//                 Types
//               </TableHead>
//               <TableHead className="font-semibold text-gray-900 w-[120px] px-2 text-sm">
//                 Status
//               </TableHead>
//               <TableHead className="font-semibold text-gray-900 text-center w-[50px] px-2 text-sm">
//                 Actions
//               </TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {paginatedBookings.length === 0 ? (
//               <TableRow>
//                 <TableCell
//                   colSpan={10}
//                   className="h-24 text-center text-gray-500"
//                 >
//                   No bookings found.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               paginatedBookings.map((booking) => (
//                 <TableRow key={booking.id}>
//                   <TableCell className="px-2">
//                     <Checkbox
//                       checked={selectedBookings.includes(booking.id)}
//                       onCheckedChange={(checked) =>
//                         handleSelectBooking(booking.id, checked as boolean)
//                       }
//                     />
//                   </TableCell>
//                   <TableCell className="text-teal-600 font-medium px-2 text-sm">
//                     {booking.bookingNumber}
//                   </TableCell>
//                   <TableCell className="text-gray-900 px-2 text-sm truncate">
//                     {booking.user_name}
//                   </TableCell>
//                   <TableCell className="text-gray-900 px-2 text-sm truncate">
//                     {booking.project_name}
//                   </TableCell>
//                   <TableCell className="text-gray-900 px-2 text-sm">
//                     {booking.country}
//                   </TableCell>
//                   <TableCell className="text-gray-900 px-2 text-sm">
//                     {booking.createdDate}
//                   </TableCell>
//                   <TableCell className="text-gray-900 px-2 text-sm">
//                     {booking.expiry_date}
//                   </TableCell>
//                   <TableCell className="text-gray-900 px-2 text-sm truncate">
//                     {booking.types}
//                   </TableCell>
//                   <TableCell className="px-2">
//                     <Badge
//                       variant="outline"
//                       className={`bg-gray-100 text-gray-700 border-gray-200 text-[10px] px-2 py-0.5`}
//                     >
//                       {booking.last_status}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="text-center px-2">
//                     <TableActions
//                       onView={() =>
//                         router.push(`/developer/bookings/${booking.id}`)
//                       }
//                       onEdit={() =>
//                         router.push(`/developer/bookings/${booking.id}`)
//                       }
//                       onDelete={() => console.log("Delete", booking.id)}
//                     />
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       <div className="flex items-center justify-between">
//         <div className="text-sm text-gray-500">
//           Showing {startIndex + 1}-{Math.min(endIndex, filteredBookings.length)}{" "}
//           of {filteredBookings.length > 1000 ? "1000" : filteredBookings.length}
//         </div>
//         <div className="flex items-center gap-1">
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//             disabled={currentPage === 1}
//             className="h-8 w-8 border-gray-200"
//           >
//             <ChevronLeft className="h-4 w-4" />
//           </Button>
//           {getPageNumbers().map((page, index) => (
//             <Button
//               key={index}
//               variant={currentPage === page ? "default" : "outline"}
//               size="icon"
//               onClick={() => setCurrentPage(page)}
//               className={
//                 currentPage === page
//                   ? "h-8 w-8 bg-gray-900 hover:bg-gray-800 text-white"
//                   : "h-8 w-8 border-gray-200"
//               }
//             >
//               {page}
//             </Button>
//           ))}
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//             disabled={currentPage === totalPages}
//             className="h-8 w-8 border-gray-200"
//           >
//             <ChevronRight className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
import React from "react";

export default function page() {
  return <div>page</div>;
}
