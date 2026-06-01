// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import toast from "react-hot-toast";
// import { format, parseISO, isToday, isYesterday } from "date-fns";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   ArrowLeft,
//   Home as HomeIcon,
//   ChevronRight,
//   Clock,
//   MoreHorizontal,
//   Search,
// } from "lucide-react";
// import Link from "next/link";
// import { fetchNotifications as fetchNotificationsApi } from "@/data/api-client";
// import useDashboardAdminNotificationsData from "@/hooks/use-dashboardAdminNotifications";

// interface ApiNotification {
//   notification_id: number;
//   user_id: number;
//   type: string;
//   title: string;
//   message: string;
//   is_read: number;
//   read_at: string | null;
//   status: string;
//   priority: string;
//   reference_id: number;
//   reference_type: string;
//   created_at: string;
//   updated_at: string;
// }

// interface ApiResponse {
//   status: string;
//   message: string;
//   data: ApiNotification[];
//   next_cursor: string | null;
//   previous_cursor: string | null;
// }

// interface Notification {
//   id: number;
//   title: string;
//   description: string;
//   time: string;
//   rawTime: string;
//   link?: {
//     text: string;
//     href: string;
//   };
//   referenceType: string;
//   referenceId: number;
// }

//   const getLinkHref = (item: ApiNotification): string => {
//     switch (item.reference_type) {
//       case "project":
//         return `/admin/projects/${item.reference_id}`;
//       case "reservation":
//         return `/admin/bookings/${item.reference_id}`;
//       case "meeting":
//       case "meeting_request":
//         return `/admin/meetings`;
//       default:
//         return "#";
//     }
//   };

//   const formatTime = (dateString: string) => {
//     try {
//       const date = parseISO(dateString);
//       const now = new Date();
//       const diffInMinutes = Math.floor(
//         (now.getTime() - date.getTime()) / (1000 * 60)
//       );

//       if (diffInMinutes < 1) return "a few moments ago";
//       if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
//       if (diffInMinutes < 120) return "1 hour ago";
//       if (diffInMinutes < 1440)
//         return `${Math.floor(diffInMinutes / 60)} hours ago`;

//       return format(date, "MMM dd, yyyy · HH:mm");
//     } catch {
//       return dateString;
//     }
//   };

//   const loadNotifications = useCallback(async (cursor: string | null = "") => {
//     if (!token) return;

//     setIsLoading(cursor === "");
//     setIsLoadingMore(cursor !== "");

//     try {
//       let res;

//       if (searchQuery.trim()) {
//         res = await searchNotificationsData.mutateAsync({
//           keyword: searchQuery,
//           per_page: perPage,
//           cursor: cursor || undefined,
//         });
//       } else {
//         const params = cursor ? `cursor=${cursor}` : "";
//         res = await fetchNotificationsApi(token, params);
//       }

//       const resJson = (res.data || res) as ApiResponse;
//       const transformed = transformApiNotifications(resJson.data || []);

//       if (cursor === "") {
//         setNotifications(transformed);
//       } else {
//         setNotifications((prev) => [...prev, ...transformed]);
//       }

//       setNextCursor(resJson.next_cursor);
//       setHasMore(!!resJson.next_cursor);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load notifications");
//     } finally {
//       setIsLoading(false);
//       setIsLoadingMore(false);
//     }
//   }, [token, searchQuery, searchNotificationsData, perPage]);

//   useEffect(() => {
//     loadNotifications();
//   }, [loadNotifications]);

//   const handleNotificationClick = (notification: Notification) => {
//     if (notification.link?.href && notification.link.href !== "#") {
//       router.push(notification.link.href);
//     }
//   };

//   const handleClearSearch = () => {
//     setSearchInput("");
//     setSearchQuery("");
//   };

//   // Group notifications by date
//   const todayNotifications = notifications.filter((n) =>
//     isToday(parseISO(n.rawTime))
//   );
//   const yesterdayNotifications = notifications.filter((n) =>
//     isYesterday(parseISO(n.rawTime))
//   );
//   const earlierNotifications = notifications.filter(
//     (n) => !isToday(parseISO(n.rawTime)) && !isYesterday(parseISO(n.rawTime))
//   );

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="max-w-5xl mx-auto p-6">
//           <p className="text-gray-600">Loading notifications...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-5xl mx-auto p-6 space-y-6">
//         {/* Breadcrumb */}
//         <div className="flex items-center gap-2 text-sm text-gray-500">
//           <HomeIcon className="h-4 w-4" />
//           <Link href="/dashboard" className="hover:text-gray-700">
//             Home
//           </Link>
//           <ChevronRight className="h-4 w-4" />
//           <span className="text-gray-900">Notifications</span>
//         </div>

//         {/* Header */}
//         <div className="flex items-center gap-3">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="h-8 w-8"
//             onClick={() => window.history.back()}
//           >
//             <ArrowLeft className="h-5 w-5" />
//           </Button>
//           <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
//         </div>

//         {/* Search Section */}
//         <div className="flex gap-2">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//             <Input
//               type="text"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   setSearchQuery(searchInput);
//                 }
//               }}
//               placeholder="Search notifications..."
//               className="pl-9 bg-white border-gray-200"
//             />
//           </div>
//           <Button
//             onClick={() => setSearchQuery(searchInput)}
//             className="bg-blue-600 hover:bg-blue-700 text-white"
//           >
//             Search
//           </Button>
//           <Button
//             onClick={handleClearSearch}
//             variant="outline"
//             className="border-gray-200"
//           >
//             Clear
//           </Button>
//         </div>

//         {/* No notifications message */}
//         {notifications.length === 0 && (
//           <div className="py-12 text-center bg-white rounded-lg border border-gray-200">
//             <p className="text-lg text-gray-500">No notifications found</p>
//           </div>
//         )}

//         {/* Today Section */}
//         {todayNotifications.length > 0 && (
//           <div className="space-y-4">
//             <h2 className="text-sm font-medium text-gray-500">Today</h2>
//             <div className="space-y-3">
//               {todayNotifications.map((notification) => (
//                 <div
//                   key={notification.id}
//                   className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow cursor-pointer"
//                   onClick={() => handleNotificationClick(notification)}
//                 >
//                   <div className="flex items-start justify-between gap-4">
//                     <div className="flex-1 min-w-0">
//                       <h3 className="font-semibold text-gray-900 mb-1">
//                         {notification.title}
//                       </h3>
//                       <p className="text-sm text-gray-600">
//                         {notification.description}{" "}
//                         {notification.link && (
//                           <span className="text-teal-600 hover:text-teal-700 font-medium">
//                             {notification.link.text}
//                           </span>
//                         )}
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-3 flex-shrink-0">
//                       <div className="flex items-center gap-1 text-xs text-gray-500">
//                         <Clock className="h-3.5 w-3.5" />
//                         {notification.time}
//                       </div>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-8 w-8"
//                       >
//                         <MoreHorizontal className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Yesterday Section */}
//         {yesterdayNotifications.length > 0 && (
//           <div className="space-y-4">
//             <h2 className="text-sm font-medium text-gray-500">Yesterday</h2>
//             <div className="space-y-3">
//               {yesterdayNotifications.map((notification) => (
//                 <div
//                   key={notification.id}
//                   className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow cursor-pointer"
//                   onClick={() => handleNotificationClick(notification)}
//                 >
//                   <div className="flex items-start justify-between gap-4">
//                     <div className="flex-1 min-w-0">
//                       <h3 className="font-semibold text-gray-900 mb-1">
//                         {notification.title}
//                       </h3>
//                       <p className="text-sm text-gray-600">
//                         {notification.description}{" "}
//                         {notification.link && (
//                           <span className="text-teal-600 hover:text-teal-700 font-medium">
//                             {notification.link.text}
//                           </span>
//                         )}
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-3 flex-shrink-0">
//                       <div className="flex items-center gap-1 text-xs text-gray-500">
//                         <Clock className="h-3.5 w-3.5" />
//                         {notification.time}
//                       </div>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-8 w-8"
//                       >
//                         <MoreHorizontal className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Earlier Section */}
//         {earlierNotifications.length > 0 && (
//           <div className="space-y-4">
//             <h2 className="text-sm font-medium text-gray-500">Earlier</h2>
//             <div className="space-y-3">
//               {earlierNotifications.map((notification) => (
//                 <div
//                   key={notification.id}
//                   className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow cursor-pointer"
//                   onClick={() => handleNotificationClick(notification)}
//                 >
//                   <div className="flex items-start justify-between gap-4">
//                     <div className="flex-1 min-w-0">
//                       <h3 className="font-semibold text-gray-900 mb-1">
//                         {notification.title}
//                       </h3>
//                       <p className="text-sm text-gray-600">
//                         {notification.description}{" "}
//                         {notification.link && (
//                           <span className="text-teal-600 hover:text-teal-700 font-medium">
//                             {notification.link.text}
//                           </span>
//                         )}
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-3 flex-shrink-0">
//                       <div className="flex items-center gap-1 text-xs text-gray-500">
//                         <Clock className="h-3.5 w-3.5" />
//                         {notification.time}
//                       </div>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-8 w-8"
//                       >
//                         <MoreHorizontal className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Load More Button */}
//         {hasMore && (
//           <div className="pt-6 text-center">
//             <Button
//               onClick={() => loadNotifications(nextCursor)}
//               disabled={isLoadingMore}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
//             >
//               {isLoadingMore ? "Loading..." : "Load More"}
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// interface ApiResponse {
//   status: string;
//   message: string;
//   data: ApiNotification[];
//   next_cursor: string | null;
//   previous_cursor: string | null;
// }

// interface Notification {
//   id: number;
//   title: string;
//   description: string;
//   time: string;
//   rawTime: string;
//   link?: {
//     text: string;
//     href: string;
//   };
//   referenceType: string;
//   referenceId: number;
// }

// export default function NotificationsPage() {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const [nextCursor, setNextCursor] = useState<string | null>("");
//   const [hasMore, setHasMore] = useState(true);
//   const [searchInput, setSearchInput] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [perPage] = useState(10);
//   const { data: session } = useSession();
//   const token = session?.user?.accessToken;
//   const router = useRouter();

//   const transformApiNotifications = (
//     apiData: ApiNotification[]
//   ): Notification[] =>
//     apiData.map((item) => ({
//       id: item.notification_id,
//       title: item.title,
//       description: item.message,
//       time: formatTime(item.created_at),
//       rawTime: item.created_at,
//       referenceType: item.reference_type,
//       referenceId: item.reference_id,
//       link: {
//         text: getLinkText(item),
//         href: getLinkHref(item),
//       },
//     }));

//   const getLinkText = (item: ApiNotification): string => {
//     // Customize based on notification type
//     switch (item.reference_type) {
//       case "project":
//         return `Project #${item.reference_id}`;
//       case "reservation":
//         return `Booking #${item.reference_id}`;
//       case "meeting":
//       case "meeting_request":
//         return `Meeting #${item.reference_id}`;
//       default:
//         return `Reference #${item.reference_id}`;
//     }
//   };

//   const getLinkHref = (item: ApiNotification): string => {
//     switch (item.reference_type) {
//       case "project":
//         return `/admin/projects/${item.reference_id}`;
//       case "reservation":
//         return `/admin/bookings/${item.reference_id}`;
//       case "meeting":
//       case "meeting_request":
//         return `/admin/meetings`;
//       default:
//         return "#";
//     }
//   };

//   const formatTime = (dateString: string) => {
//     try {
//       const date = parseISO(dateString);
//       const now = new Date();
//       const diffInMinutes = Math.floor(
//         (now.getTime() - date.getTime()) / (1000 * 60)
//       );

//       if (diffInMinutes < 1) return "a few moments ago";
//       if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
//       if (diffInMinutes < 120) return "1 hour ago";
//       if (diffInMinutes < 1440)
//         return `${Math.floor(diffInMinutes / 60)} hours ago`;

//       return format(date, "MMM dd, yyyy · HH:mm");
//     } catch {
//       return dateString;
//     }
//   };

//   const fetchNotifications = useCallback(
//     async (cursor: string | null = "") => {
//       if (!token) return;

//       setIsLoading(cursor === "");
//       setIsLoadingMore(cursor !== "");

//       try {
//         let res;

//         if (searchQuery.trim()) {
//           // Search with cursor support if API supports it, otherwise simplified
//           res = await searchNotifications(
//             {
//               keyword: searchQuery,
//               per_page: perPage,
//               cursor: cursor || undefined,
//             },
//             token
//           );
//         } else {
//           const params = cursor ? `cursor=${cursor}` : "";
//           res = await fetchNotificationsApi(token, params);
//         }

//         // Handle response mapping
//         // Assuming fetchData returns the raw response or data property
//         // We need to be careful about the structure matching ApiResponse
//         const resJson = (res.data || res) as ApiResponse;
//         // If API client returns directly data, we might need to adjust.
//         // Based on other pages, fetchData returns res.json().

//         const transformed = transformApiNotifications(resJson.data || []);

//         if (cursor === "") {
//           setNotifications(transformed);
//         } else {
//           setNotifications((prev) => [...prev, ...transformed]);
//         }

//         setNextCursor(resJson.next_cursor);
//         setHasMore(!!resJson.next_cursor);
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to load notifications");
//       } finally {
//         setIsLoading(false);
//         setIsLoadingMore(false);
//       }
//     },
//     [token, searchQuery, perPage]
//   );

//   useEffect(() => {
//     fetchNotifications();
//   }, [fetchNotifications]);

//   const handleNotificationClick = (notification: Notification) => {
//     if (notification.link?.href && notification.link.href !== "#") {
//       router.push(notification.link.href);
//     }
//   };

//   const handleClearSearch = () => {
//     setSearchInput("");
//     setSearchQuery("");
//   };

//   // Group notifications by date
//   const todayNotifications = notifications.filter((n) =>
//     isToday(parseISO(n.rawTime))
//   );
//   const yesterdayNotifications = notifications.filter((n) =>
//     isYesterday(parseISO(n.rawTime))
//   );
//   const earlierNotifications = notifications.filter(
//     (n) => !isToday(parseISO(n.rawTime)) && !isYesterday(parseISO(n.rawTime))
//   );

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="max-w-5xl mx-auto p-6">
//           <p className="text-gray-600">Loading notifications...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-5xl mx-auto p-6 space-y-6">
//         {/* Breadcrumb */}
//         <div className="flex items-center gap-2 text-sm text-gray-500">
//           <HomeIcon className="h-4 w-4" />
//           <Link href="/dashboard" className="hover:text-gray-700">
//             Home
//           </Link>
//           <ChevronRight className="h-4 w-4" />
//           <span className="text-gray-900">Notifications</span>
//         </div>

//         {/* Header */}
//         <div className="flex items-center gap-3">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="h-8 w-8"
//             onClick={() => window.history.back()}
//           >
//             <ArrowLeft className="h-5 w-5" />
//           </Button>
//           <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
//         </div>

//         {/* Search Section */}
//         <div className="flex gap-2">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//             <Input
//               type="text"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   setSearchQuery(searchInput);
//                 }
//               }}
//               placeholder="Search notifications..."
//               className="pl-9 bg-white border-gray-200"
//             />
//           </div>
//           <Button
//             onClick={() => setSearchQuery(searchInput)}
//             className="bg-blue-600 hover:bg-blue-700 text-white"
//           >
//             Search
//           </Button>
//           <Button
//             onClick={handleClearSearch}
//             variant="outline"
//             className="border-gray-200"
//           >
//             Clear
//           </Button>
//         </div>

//         {/* No notifications message */}
//         {notifications.length === 0 ? (
//           <div className="py-12 text-center bg-white rounded-lg border border-gray-200">
//             <p className="text-lg text-gray-500">No notifications found</p>
//           </div>
//         ) : (
//           <>
//             {/* Today Section */}
//             {todayNotifications.length > 0 && (
//               <div className="space-y-4">
//                 <h2 className="text-sm font-medium text-gray-500">Today</h2>
//                 <div className="space-y-3">
//                   {todayNotifications.map((notification) => (
//                     <div
//                       key={notification.id}
//                       className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow cursor-pointer"
//                       onClick={() => handleNotificationClick(notification)}
//                     >
//                       <div className="flex items-start justify-between gap-4">
//                         <div className="flex-1 min-w-0">
//                           <h3 className="font-semibold text-gray-900 mb-1">
//                             {notification.title}
//                           </h3>
//                           <p className="text-sm text-gray-600">
//                             {notification.description}{" "}
//                             {notification.link && (
//                               <span className="text-teal-600 hover:text-teal-700 font-medium">
//                                 {notification.link.text}
//                               </span>
//                             )}
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-3 flex-shrink-0">
//                           <div className="flex items-center gap-1 text-xs text-gray-500">
//                             <Clock className="h-3.5 w-3.5" />
//                             {notification.time}
//                           </div>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8"
//                           >
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Yesterday Section */}
//             {yesterdayNotifications.length > 0 && (
//               <div className="space-y-4">
//                 <h2 className="text-sm font-medium text-gray-500">Yesterday</h2>
//                 <div className="space-y-3">
//                   {yesterdayNotifications.map((notification) => (
//                     <div
//                       key={notification.id}
//                       className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow cursor-pointer"
//                       onClick={() => handleNotificationClick(notification)}
//                     >
//                       <div className="flex items-start justify-between gap-4">
//                         <div className="flex-1 min-w-0">
//                           <h3 className="font-semibold text-gray-900 mb-1">
//                             {notification.title}
//                           </h3>
//                           <p className="text-sm text-gray-600">
//                             {notification.description}{" "}
//                             {notification.link && (
//                               <span className="text-teal-600 hover:text-teal-700 font-medium">
//                                 {notification.link.text}
//                               </span>
//                             )}
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-3 flex-shrink-0">
//                           <div className="flex items-center gap-1 text-xs text-gray-500">
//                             <Clock className="h-3.5 w-3.5" />
//                             {notification.time}
//                           </div>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8"
//                           >
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Earlier Section */}
//             {earlierNotifications.length > 0 && (
//               <div className="space-y-4">
//                 <h2 className="text-sm font-medium text-gray-500">Earlier</h2>
//                 <div className="space-y-3">
//                   {earlierNotifications.map((notification) => (
//                     <div
//                       key={notification.id}
//                       className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow cursor-pointer"
//                       onClick={() => handleNotificationClick(notification)}
//                     >
//                       <div className="flex items-start justify-between gap-4">
//                         <div className="flex-1 min-w-0">
//                           <h3 className="font-semibold text-gray-900 mb-1">
//                             {notification.title}
//                           </h3>
//                           <p className="text-sm text-gray-600">
//                             {notification.description}{" "}
//                             {notification.link && (
//                               <span className="text-teal-600 hover:text-teal-700 font-medium">
//                                 {notification.link.text}
//                               </span>
//                             )}
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-3 flex-shrink-0">
//                           <div className="flex items-center gap-1 text-xs text-gray-500">
//                             <Clock className="h-3.5 w-3.5" />
//                             {notification.time}
//                           </div>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8"
//                           >
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Load More Button */}
//             {hasMore && (
//               <div className="pt-6 text-center">
//                 <Button
//                   onClick={() => fetchNotifications(nextCursor)}
//                   disabled={isLoadingMore}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
//                 >
//                   {isLoadingMore ? "Loading..." : "Load More"}
//                 </Button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

import React from "react";

function page() {
  return <div>page</div>;
}

export default page;
