// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react"; // Added session
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
//   Plus,
//   Download,
//   Settings2,
//   ChevronLeft,
//   ChevronRight,
//   MessageSquare,
//   CheckCircle,
//   Users,
//   Clock,
//   Play,
//   Cpu,
//   Zap,
//   Database,
//   Loader2, // Added Loader
// } from "lucide-react";
// import {
//   AddResponseTemplateModal,
//   ResponseTemplateFormData,
// } from "@/components/modals/add-response-template-modal";
// import { fetchAiConversations, addAiTemplate } from "@/data/api-client"; // Added imports

// interface Conversation {
//   id: number;
//   user: string;
//   query: string;
//   aiResponse: string;
//   matches: string;
//   time: string;
//   country: string;
//   status: "Pending" | "Successful";
// }

// interface ApiConversationItem {
//   id: number;
//   user_name?: string;
//   user?: string;
//   query?: string;
//   response?: string;
//   aiResponse?: string;
//   matches?: string;
//   created_at?: string;
//   time?: string;
//   country?: string;
//   status?: "Pending" | "Successful";
// }

// interface ChunkItem {
//   id: number;
//   startItem: number;
//   endItem: number;
//   status: "pending" | "processing" | "done";
//   processTime: string | null;
// }

// const stats = [
//   {
//     icon: MessageSquare,
//     label: "Total Conversations",
//     value: "1,247",
//     change: "↑ 10%",
//     period: "vs last 3 months",
//     trend: "up",
//   },
//   {
//     icon: CheckCircle,
//     label: "Successful Matches",
//     value: "892",
//     change: "↓ 24",
//     period: "vs last 3 months",
//     trend: "down",
//   },
//   {
//     icon: Users,
//     label: "Active Users",
//     value: "423",
//     change: "↑ 5.6%",
//     period: "vs last 3 months",
//     trend: "up",
//   },
//   {
//     icon: Clock,
//     label: "Avg Response Time",
//     value: "2.3s",
//     change: "↑ 8%",
//     period: "vs last 3 months",
//     trend: "up",
//   },
// ];

// export default function AIAssistantManagementPage() {
//   const { data: session } = useSession(); // Session hook
//   const [conversations, setConversations] = useState<Conversation[]>([]); // State for conversations
//   const [loading, setLoading] = useState(true); // Loading state
//   const [searchQuery, setSearchQuery] = useState("");
//   const [dateFilter, setDateFilter] = useState("all");
//   const [selectedConversations, setSelectedConversations] = useState<number[]>(
//     [],
//   );
//   const [currentPage, setCurrentPage] = useState(1);
//   const [activeTab, setActiveTab] = useState("conversations");
//   const [isAddTemplateModalOpen, setIsAddTemplateModalOpen] = useState(false);

//   // Chunk Processor State
//   const [total, setTotal] = useState("");
//   const [limit, setLimit] = useState("");
//   const [chunk, setChunk] = useState("");
//   const [totalChunks, setTotalChunks] = useState(0);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [currentChunk, setCurrentChunk] = useState(0);
//   const [chunks, setChunks] = useState<ChunkItem[]>([]);

//   const itemsPerPage = 10;

//   // New Effect to load data
//   useEffect(() => {
//     async function loadConversations() {
//       if (!session?.user?.accessToken) {
//         setLoading(false);
//         return;
//       }
//       try {
//         setLoading(true);
//         const data = await fetchAiConversations(session.user.accessToken);

//         // Map API data if needed, or use as is if structure matches
//         // Assuming API returns array of conversations similar to interface
//         // Fallback to empty array if data format is unexpected
//         const mappedData = Array.isArray(data)
//           ? data.map((item: ApiConversationItem) => ({
//               id: item.id,
//               user: item.user_name || item.user || "Unknown",
//               query: item.query || "",
//               aiResponse: item.response || item.aiResponse || "",
//               matches: item.matches || "0",
//               time: item.created_at || item.time || "",
//               country: item.country || "N/A",
//               status: item.status || "Pending",
//             }))
//           : [];

//         setConversations(mappedData);
//       } catch (error) {
//         console.error("Error loading AI conversations:", error);
//         // Fallback to empty or show error? For now empty to avoid breaking UI
//         setConversations([]);
//       } finally {
//         setLoading(false);
//       }
//     }
//     loadConversations();
//   }, [session]);

//   const handleAddTemplate = async (data: ResponseTemplateFormData) => {
//     // console.log("Adding response template:", data);
//     if (!session?.user?.accessToken) return;
//     try {
//       // Transform the form data to match the API expected format
//       const templateData = {
//         name: data.category,
//         content: data.responseTemplate,
//         description: data.triggerKeywords,
//       };
//       await addAiTemplate(templateData, session.user.accessToken);
//       // Optionally reload templates or show success
//     } catch (err) {
//       console.error("Failed to add template", err);
//     }
//   };

//   // Calculate total chunks when inputs change
//   useEffect(() => {
//     if (total && chunk) {
//       const calculated = Math.ceil(Number(total) / Number(chunk));
//       setTotalChunks(calculated);
//     } else {
//       setTotalChunks(0);
//     }
//   }, [total, chunk]);

//   // Initialize chunks array when totalChunks changes
//   useEffect(() => {
//     if (totalChunks > 0) {
//       const initialChunks = Array.from({ length: totalChunks }, (_, index) => ({
//         id: index + 1,
//         startItem: index * Number(chunk) + 1,
//         endItem: Math.min((index + 1) * Number(chunk), Number(total)),
//         status: "pending" as const,
//         processTime: null,
//       }));
//       setChunks(initialChunks);
//     }
//   }, [totalChunks, chunk, total]);

//   const startProcessing = () => {
//     if (totalChunks === 0) return;

//     setIsProcessing(true);
//     setCurrentChunk(0);

//     const resetChunks = chunks.map((chunk) => ({
//       ...chunk,
//       status: "pending" as const,
//       processTime: null,
//     }));
//     setChunks(resetChunks);

//     processNextChunk(0, resetChunks);
//   };

//   const processNextChunk = (chunkIndex: number, currentChunks: ChunkItem[]) => {
//     if (chunkIndex >= totalChunks) {
//       setIsProcessing(false);
//       return;
//     }

//     setCurrentChunk(chunkIndex + 1);

//     const updatedChunks = [...currentChunks];
//     updatedChunks[chunkIndex].status = "processing";
//     setChunks(updatedChunks);

//     // Generate random processing time (1-3 seconds)
//     // Using a function to avoid calling Math.random() during render
//     const getProcessingTime = () => Math.random() * 2000 + 1000;
//     const processingTime = getProcessingTime();

//     setTimeout(() => {
//       const finalChunks = [...updatedChunks];
//       finalChunks[chunkIndex].status = "done";
//       finalChunks[chunkIndex].processTime = (processingTime / 1000).toFixed(2);
//       setChunks(finalChunks);

//       setTimeout(() => {
//         processNextChunk(chunkIndex + 1, finalChunks);
//       }, 200);
//     }, processingTime);
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "pending":
//         return "bg-gray-100 text-gray-600";
//       case "processing":
//         return "bg-blue-100 text-blue-600 animate-pulse";
//       case "done":
//         return "bg-green-100 text-green-600";
//       default:
//         return "bg-gray-100 text-gray-600";
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "pending":
//         return "⏳";
//       case "processing":
//         return "🔄";
//       case "done":
//         return "✅";
//       default:
//         return "⏳";
//     }
//   };

//   // Filter conversations
//   const filteredConversations = conversations.filter((conv) => {
//     const matchesSearch =
//       conv.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       conv.query.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesSearch;
//   });

//   // Pagination
//   const totalPages = Math.ceil(filteredConversations.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const paginatedConversations = filteredConversations.slice(
//     startIndex,
//     endIndex,
//   );

//   const handleSelectAll = (checked: boolean) => {
//     if (checked) {
//       setSelectedConversations(paginatedConversations.map((c) => c.id));
//     } else {
//       setSelectedConversations([]);
//     }
//   };

//   const handleSelectConversation = (id: number, checked: boolean) => {
//     if (checked) {
//       setSelectedConversations([...selectedConversations, id]);
//     } else {
//       setSelectedConversations(
//         selectedConversations.filter((cid) => cid !== id),
//       );
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
//         <div>
//           <p className="text-sm text-gray-500 mb-1">Home &gt; AI Assistant</p>
//           <h1 className="text-2xl font-bold text-gray-900">
//             AI Assistant Management
//           </h1>
//         </div>
//         <Button
//           className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
//           onClick={() => setIsAddTemplateModalOpen(true)}
//         >
//           <Plus className="h-4 w-4" />
//           Add Response Template
//         </Button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((stat, index) => (
//           <div
//             key={index}
//             className="bg-white rounded-lg border border-gray-200 p-4"
//           >
//             <div className="flex items-center gap-2 mb-2">
//               <stat.icon className="h-4 w-4 text-gray-500" />
//               <span className="text-sm text-gray-600">{stat.label}</span>
//             </div>
//             <div className="flex items-end justify-between">
//               <div>
//                 <div className="text-2xl font-bold text-gray-900">
//                   {stat.value}
//                 </div>
//                 <div className="flex items-center gap-1 mt-1">
//                   <span
//                     className={`text-xs font-medium ${
//                       stat.trend === "up"
//                         ? "text-green-600"
//                         : stat.trend === "down"
//                           ? "text-red-600"
//                           : "text-gray-600"
//                     }`}
//                   >
//                     {stat.change}
//                   </span>
//                   <span className="text-xs text-gray-500">{stat.period}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Tabs */}
//       <div className="border-b border-gray-200">
//         <div className="flex gap-6">
//           {[
//             { id: "conversations", label: "Conversations" },
//             { id: "chunk-processor", label: "Chunk Processor" },
//             { id: "templates", label: "Response Templates" },
//             { id: "insights", label: "Insights" },
//             { id: "configuration", label: "Configuration" },
//           ].map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
//                 activeTab === tab.id
//                   ? "border-teal-600 text-teal-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Chunk Processor Tab Content */}
//       {activeTab === "chunk-processor" && (
//         <div className="space-y-6">
//           {/* Control Panel */}
//           <div className="rounded-lg border border-gray-200 bg-white p-6">
//             <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
//               {/* Total Input */}
//               <div className="space-y-2">
//                 <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                   <Database className="h-4 w-4" />
//                   Total Items
//                 </label>
//                 <Input
//                   type="number"
//                   value={total}
//                   onChange={(e) => setTotal(e.target.value)}
//                   disabled={isProcessing}
//                   placeholder="e.g., 1000"
//                 />
//               </div>

//               {/* Limit Input */}
//               <div className="space-y-2">
//                 <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                   <Zap className="h-4 w-4" />
//                   Limit
//                 </label>
//                 <Input
//                   type="number"
//                   value={limit}
//                   onChange={(e) => setLimit(e.target.value)}
//                   disabled={isProcessing}
//                   placeholder="e.g., 100"
//                 />
//               </div>

//               {/* Chunk Input */}
//               <div className="space-y-2">
//                 <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                   <Cpu className="h-4 w-4" />
//                   Chunk Size
//                 </label>
//                 <Input
//                   type="number"
//                   value={chunk}
//                   onChange={(e) => setChunk(e.target.value)}
//                   disabled={isProcessing}
//                   placeholder="e.g., 50"
//                 />
//               </div>

//               {/* Total Chunks Display */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   Total Chunks
//                 </label>
//                 <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 h-10 flex items-center">
//                   <span className="text-2xl font-bold text-teal-600">
//                     {totalChunks}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Control Buttons */}
//             <div className="flex justify-center">
//               <Button
//                 onClick={startProcessing}
//                 disabled={isProcessing || totalChunks === 0 || !total || !chunk}
//                 className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
//               >
//                 <Play className="h-4 w-4" />
//                 {isProcessing ? "Processing..." : "Start Processing"}
//               </Button>
//             </div>

//             {/* Progress Indicator */}
//             {isProcessing && (
//               <div className="mt-6">
//                 <p className="mb-2 text-sm text-gray-600 text-center">
//                   Processing chunk {currentChunk} of {totalChunks}
//                 </p>
//                 <div className="h-2 w-full rounded-full bg-gray-200">
//                   <div
//                     className="h-2 rounded-full bg-teal-600 transition-all duration-300"
//                     style={{ width: `${(currentChunk / totalChunks) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Processing Status Table */}
//           {chunks.length > 0 && (
//             <div className="rounded-lg border border-gray-200 bg-white overflow-hidden overflow-x-auto">
//               <div className="p-4 border-b border-gray-200">
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   Processing Status
//                 </h2>
//               </div>
//               <div className="max-h-96 overflow-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow className="bg-gray-50">
//                       <TableHead className="font-semibold text-gray-900">
//                         Chunk ID
//                       </TableHead>
//                       <TableHead className="font-semibold text-gray-900">
//                         Range
//                       </TableHead>
//                       <TableHead className="font-semibold text-gray-900">
//                         Status
//                       </TableHead>
//                       <TableHead className="font-semibold text-gray-900">
//                         Process Time
//                       </TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {chunks.map((chunkItem) => (
//                       <TableRow key={chunkItem.id}>
//                         <TableCell className="font-medium">
//                           #{chunkItem.id}
//                         </TableCell>
//                         <TableCell>
//                           {chunkItem.startItem} - {chunkItem.endItem}
//                         </TableCell>
//                         <TableCell>
//                           <Badge className={getStatusColor(chunkItem.status)}>
//                             <span className="mr-1">
//                               {getStatusIcon(chunkItem.status)}
//                             </span>
//                             {chunkItem.status.charAt(0).toUpperCase() +
//                               chunkItem.status.slice(1)}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>
//                           {chunkItem.processTime
//                             ? `${chunkItem.processTime}s`
//                             : "-"}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Conversations Tab Content (existing UI) */}
//       {activeTab === "conversations" && (
//         <>
//           {/* Filters and Actions */}
//           <div className="flex flex-wrap items-center justify-between gap-4">
//             <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
//               {/* Search */}
//               <div className="relative w-full min-w-[200px] max-w-xs">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <Input
//                   placeholder="Search in log"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10 bg-white border-gray-200"
//                 />
//               </div>

//               {/* Date Filter */}
//               <Select value={dateFilter} onValueChange={setDateFilter}>
//                 <SelectTrigger className="w-[100px]">
//                   <SelectValue placeholder="Date" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Dates</SelectItem>
//                   <SelectItem value="today">Today</SelectItem>
//                   <SelectItem value="week">This Week</SelectItem>
//                   <SelectItem value="month">This Month</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex items-center gap-2">
//               <Button variant="outline" className="gap-2 border-gray-200">
//                 <Download className="h-4 w-4" />
//                 Export
//               </Button>
//               <Button variant="outline" className="gap-2 border-gray-200">
//                 <Settings2 className="h-4 w-4" />
//                 Table settings
//               </Button>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="rounded-lg border border-gray-200 bg-white overflow-hidden overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-gray-50 hover:bg-gray-50">
//                   <TableHead className="w-[35px] px-2">
//                     <Checkbox
//                       checked={
//                         paginatedConversations.length > 0 &&
//                         selectedConversations.length ===
//                           paginatedConversations.length
//                       }
//                       onCheckedChange={handleSelectAll}
//                     />
//                   </TableHead>
//                   <TableHead className="font-semibold text-gray-900 w-[110px] px-2 text-xs">
//                     User
//                   </TableHead>
//                   <TableHead className="font-semibold text-gray-900 w-[180px] px-2 text-xs">
//                     Query
//                   </TableHead>
//                   <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-xs">
//                     AI Response
//                   </TableHead>
//                   <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-xs">
//                     Matches
//                   </TableHead>
//                   <TableHead className="font-semibold text-gray-900 w-[90px] px-2 text-xs">
//                     Time
//                   </TableHead>
//                   <TableHead className="font-semibold text-gray-900 w-[80px] px-2 text-xs">
//                     Country
//                   </TableHead>
//                   <TableHead className="font-semibold text-gray-900 w-[90px] px-2 text-xs">
//                     Status
//                   </TableHead>
//                   <TableHead className="font-semibold text-gray-900 text-center w-[80px] px-2 text-xs">
//                     Actions
//                   </TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {loading ? ( // Loading state
//                   <TableRow>
//                     <TableCell colSpan={9} className="h-24 text-center">
//                       <Loader2 className="h-6 w-6 animate-spin mx-auto text-teal-600" />
//                     </TableCell>
//                   </TableRow>
//                 ) : paginatedConversations.length === 0 ? (
//                   <TableRow>
//                     <TableCell
//                       colSpan={9}
//                       className="h-24 text-center text-gray-500"
//                     >
//                       No conversations found.
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   paginatedConversations.map((conv) => (
//                     <TableRow key={conv.id}>
//                       <TableCell className="px-2">
//                         <Checkbox
//                           checked={selectedConversations.includes(conv.id)}
//                           onCheckedChange={(checked) =>
//                             handleSelectConversation(
//                               conv.id,
//                               checked as boolean,
//                             )
//                           }
//                         />
//                       </TableCell>
//                       <TableCell className="text-gray-900 px-2 text-xs truncate">
//                         {conv.user}
//                       </TableCell>
//                       <TableCell className="text-gray-900 px-2 text-xs truncate">
//                         {conv.query}
//                       </TableCell>
//                       <TableCell className="text-gray-900 px-2 text-xs truncate">
//                         {conv.aiResponse}
//                       </TableCell>
//                       <TableCell className="text-gray-900 px-2 text-xs truncate">
//                         {conv.matches}
//                       </TableCell>
//                       <TableCell className="text-gray-900 px-2 text-xs">
//                         {conv.time}
//                       </TableCell>
//                       <TableCell className="text-gray-900 px-2 text-xs">
//                         {conv.country}
//                       </TableCell>
//                       <TableCell className="px-2">
//                         <Badge
//                           variant="outline"
//                           className={
//                             conv.status === "Successful"
//                               ? "bg-green-50 text-green-700 border-green-200 text-[10px] px-2"
//                               : "bg-orange-50 text-orange-700 border-orange-200 text-[10px] px-2"
//                           }
//                         >
//                           {conv.status}
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="text-center px-2">
//                         <TableActions
//                           onView={() => console.log("View", conv.id)}
//                           onEdit={() => console.log("Edit", conv.id)}
//                           onDelete={() => console.log("Delete", conv.id)}
//                         />
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>

//           {/* Pagination */}
//           <div className="flex items-center justify-between">
//             <div className="text-sm text-gray-500">
//               Showing {startIndex + 1}-
//               {Math.min(endIndex, filteredConversations.length)} of{" "}
//               {filteredConversations.length > 1000
//                 ? "1000"
//                 : filteredConversations.length}
//             </div>
//             <div className="flex items-center gap-1">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                 disabled={currentPage === 1}
//                 className="h-8 w-8 border-gray-200"
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </Button>
//               {getPageNumbers().map((page, index) => (
//                 <Button
//                   key={index}
//                   variant={currentPage === page ? "default" : "outline"}
//                   size="icon"
//                   onClick={() => setCurrentPage(page)}
//                   className={
//                     currentPage === page
//                       ? "h-8 w-8 bg-gray-900 hover:bg-gray-800 text-white"
//                       : "h-8 w-8 border-gray-200"
//                   }
//                 >
//                   {page}
//                 </Button>
//               ))}
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={() =>
//                   setCurrentPage((p) => Math.min(totalPages, p + 1))
//                 }
//                 disabled={currentPage === totalPages}
//                 className="h-8 w-8 border-gray-200"
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Other Tabs Placeholder */}
//       {/* ... keeping other tabs as placeholder for now ... */}

//       <AddResponseTemplateModal
//         isOpen={isAddTemplateModalOpen}
//         onClose={() => setIsAddTemplateModalOpen(false)}
//         onSubmit={handleAddTemplate}
//       />
//     </div>
//   );
// }
export default function Page() {
  return <div>page</div>;
}
