// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import {
//   Users,
//   Search,
//   Plus,
//   Mail,
//   Phone,
//   MapPin,
//   Loader2,
//   AlertCircle,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { useSession } from "next-auth/react";
// import useDashboardAdminTenantsData from "@/hooks/use-dashboardAdminTenants";
// import { TenantDataType } from "@/types";

// export default function TenantsPage() {
//   const { data: session } = useSession();
//   const [searchQuery, setSearchQuery] = useState("");

//   // Fetch tenants with custom hook
//   const { tenantsData } = useDashboardAdminTenantsData();
//   const { data: tenants = [], isLoading, isError, error, refetch } = tenantsData;

//   const filteredTenants = tenants.filter((tenant) => {
//     const fullName = `${tenant.first_name} ${tenant.last_name}`.toLowerCase();
//     const email = tenant.email.toLowerCase();
//     const query = searchQuery.toLowerCase();

//     return fullName.includes(query) || email.includes(query);
//   });

//   const activeTenantsCount = tenants.filter(
//     (t) => t.status === "active",
//   ).length;
//   const expiringSoonCount = tenants.filter(
//     (t) => t.status === "expiring-soon",
//   ).length;

//   if (isLoading) {
//     return (
//       <div className="flex min-h-[400px] items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex min-h-[400px] items-center justify-center flex-col gap-4">
//         <AlertCircle className="h-12 w-12 text-red-500" />
//         <p className="text-lg font-medium text-gray-900">
//           Error loading tenants
//         </p>
//         <p className="text-gray-500">{error?.message}</p>
//         <Button variant="outline" onClick={() => refetch()}>
//           Try Again
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 p-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-gray-900">
//             Tenants
//           </h1>
//           <p className="text-gray-500">Manage your tenant relationships</p>
//         </div>
//         <Button asChild className="bg-teal-600 hover:bg-teal-700">
//           <Link href="/admin/tenants/create">
//             <Plus className="mr-2 h-4 w-4" />
//             Add Tenant
//           </Link>
//         </Button>
//       </div>

//       {/* Search */}
//       <div className="flex gap-4">
//         <div className="relative flex-1 max-w-md">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <Input
//             placeholder="Search tenants..."
//             className="pl-10"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid gap-4 md:grid-cols-3">
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center gap-4">
//               <div className="p-2 bg-teal-50 rounded-lg">
//                 <Users className="h-6 w-6 text-teal-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Total Tenants</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {tenants.length}
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center gap-4">
//               <div className="p-2 bg-green-50 rounded-lg">
//                 <Users className="h-6 w-6 text-green-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Active Leases</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {activeTenantsCount}
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center gap-4">
//               <div className="p-2 bg-yellow-50 rounded-lg">
//                 <Users className="h-6 w-6 text-yellow-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Expiring Soon</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {expiringSoonCount}
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Tenants List */}
//       <div className="space-y-4">
//         {filteredTenants.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
//             <Users className="mx-auto h-12 w-12 text-gray-400" />
//             <h3 className="mt-4 text-lg font-medium text-gray-900">
//               No tenants found
//             </h3>
//             <p className="mt-2 text-gray-500">
//               Get started by adding a new tenant.
//             </p>
//           </div>
//         ) : (
//           filteredTenants.map((tenant) => (
//             <Card
//               key={tenant.tenant_id}
//               className="hover:shadow-md transition-shadow"
//             >
//               <CardContent className="p-6">
//                 <div className="flex flex-col md:flex-row md:items-center gap-4">
//                   <div className="flex-1 space-y-3">
//                     <div className="flex items-center gap-3">
//                       <div className="h-12 w-12 rounded-full bg-teal-50 flex items-center justify-center">
//                         <Users className="h-6 w-6 text-teal-600" />
//                       </div>
//                       <div>
//                         <div className="flex items-center gap-2">
//                           <h3 className="font-semibold text-lg text-gray-900">
//                             {tenant.first_name} {tenant.last_name}
//                           </h3>
//                           <Badge
//                             className={
//                               tenant.status === "active"
//                                 ? "bg-green-100 text-green-700 hover:bg-green-100"
//                                 : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
//                             }
//                           >
//                             {tenant.status === "active"
//                               ? "Active"
//                               : "Expiring Soon"}
//                           </Badge>
//                         </div>
//                         <p className="text-sm text-gray-500">
//                           {tenant.property_name}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="grid md:grid-cols-3 gap-3 text-sm">
//                       <div className="flex items-center gap-2 text-gray-500">
//                         <Mail className="h-4 w-4" />
//                         <span>{tenant.email}</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-gray-500">
//                         <Phone className="h-4 w-4" />
//                         <span>{tenant.phone_number}</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-gray-500">
//                         <MapPin className="h-4 w-4" />
//                         <span>{tenant.property_address}</span>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-4 text-sm">
//                       <span className="text-gray-500">
//                         Lease ends:{" "}
//                         <span className="font-medium text-gray-900">
//                           {new Date(tenant.lease_end_date).toLocaleDateString()}
//                         </span>
//                       </span>
//                       <span className="text-gray-500">
//                         Rent:{" "}
//                         <span className="font-semibold text-teal-600">
//                           ${Number(tenant.rent_amount).toLocaleString()}/mo
//                         </span>
//                       </span>
//                     </div>
//                   </div>

//                   <div className="flex flex-col gap-2">
//                     <Button variant="outline" size="sm" asChild>
//                       <Link href={`/admin/tenants/${tenant.tenant_id}`}>
//                         View Details
//                       </Link>
//                     </Button>
//                     <Button variant="ghost" size="sm">
//                       Send Message
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }
export default function Page() {
  return <div>page</div>;
}
