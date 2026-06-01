// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import {
//   BarChart3,
//   TrendingUp,
//   DollarSign,
//   Building2,
//   Users,
//   Loader2,
//   AlertCircle,
// } from "lucide-react";
// import { StatsCard } from "@/components/dashboard/stats-card";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { fetchDashboardStats } from "@/data/api-client";

// // Define interface for dashboard stats
// interface DashboardStats {
//   portfolio_value: number;
//   occupancy_rate: number;
//   avg_rent_per_unit: number;
//   annual_roi: number;
//   total_revenue: number; // For chart or other display
//   // Add other fields as expected from API
//   top_properties?: {
//     name: string;
//     revenue: number;
//     roi: number;
//   }[];
// }

// export default function AnalyticsPage() {
//   const { data: session } = useSession();
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function loadStats() {
//       if (!session?.user?.accessToken) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);
//         const data = await fetchDashboardStats(session.user.accessToken);
//         setStats(data);
//       } catch (err) {
//         console.error("Error loading dashboard stats:", err);
//         setError(err instanceof Error ? err.message : "Failed to load stats");
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadStats();
//   }, [session]);

//   if (loading) {
//     return (
//       <div className="flex min-h-[400px] items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex min-h-[400px] items-center justify-center flex-col gap-4">
//         <AlertCircle className="h-12 w-12 text-red-500" />
//         <p className="text-lg font-medium text-gray-900">
//           Error loading analytics
//         </p>
//         <p className="text-gray-500">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
//         <p className="text-muted-foreground">
//           Detailed insights into your property portfolio performance
//         </p>
//       </div>

//       {/* Key Metrics */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <StatsCard
//           title="Portfolio Value"
//           value={
//             stats?.portfolio_value
//               ? `$${stats.portfolio_value.toLocaleString()}`
//               : "$0"
//           }
//           icon={Building2}
//           trend={{ value: 12.5, label: "from last year", isPositive: true }}
//         />
//         <StatsCard
//           title="Occupancy Rate"
//           value={stats?.occupancy_rate ? `${stats.occupancy_rate}%` : "0%"}
//           icon={Users}
//           trend={{ value: 5, label: "from last quarter", isPositive: true }}
//         />
//         <StatsCard
//           title="Avg. Rent/Unit"
//           value={
//             stats?.avg_rent_per_unit
//               ? `$${stats.avg_rent_per_unit.toLocaleString()}`
//               : "$0"
//           }
//           icon={DollarSign}
//           trend={{ value: 8, label: "from last month", isPositive: true }}
//         />
//         <StatsCard
//           title="Annual ROI"
//           value={stats?.annual_roi ? `${stats.annual_roi}%` : "0%"}
//           icon={TrendingUp}
//           description="Return on investment"
//         />
//       </div>

//       {/* Charts Section */}
//       <div className="grid gap-6 md:grid-cols-2">
//         <Card>
//           <CardHeader>
//             <CardTitle>Revenue Trend</CardTitle>
//             <CardDescription>
//               Monthly revenue over the past year
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="h-80 flex items-center justify-center bg-muted/30 rounded-lg">
//               <div className="text-center text-muted-foreground">
//                 <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
//                 <p className="text-sm">Chart placeholder</p>
//                 <p className="text-xs">
//                   Integration with chart library recommended
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Occupancy Rate</CardTitle>
//             <CardDescription>Occupancy trends over time</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="h-80 flex items-center justify-center bg-muted/30 rounded-lg">
//               <div className="text-center text-muted-foreground">
//                 <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
//                 <p className="text-sm">Chart placeholder</p>
//                 <p className="text-xs">
//                   Integration with chart library recommended
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Property Performance */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Top Performing Properties</CardTitle>
//           <CardDescription>Properties ranked by profitability</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {(
//               stats?.top_properties || [
//                 // Fallback mock data if API doesn't provide this yet
//                 { name: "Luxury Penthouse", revenue: 69600, roi: 18.5 },
//                 {
//                   name: "Modern Downtown Apartment",
//                   revenue: 30000,
//                   roi: 15.2,
//                 },
//                 { name: "Suburban Family Home", revenue: 38400, roi: 12.8 },
//               ]
//             ).map((property, index) => (
//               <div
//                 key={property.name}
//                 className="flex items-center justify-between p-4 border rounded-lg"
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
//                     {index + 1}
//                   </div>
//                   <div>
//                     <p className="font-medium">{property.name}</p>
//                     <p className="text-sm text-muted-foreground">
//                       Annual Revenue: ${property.revenue.toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-semibold text-green-600 dark:text-green-400">
//                     {property.roi}% ROI
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
import React from "react";

export default function page() {
  return <div>page</div>;
}
