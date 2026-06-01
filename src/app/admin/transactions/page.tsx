// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import {
//   DollarSign,
//   TrendingUp,
//   Download,
//   Filter,
//   Loader2,
//   AlertCircle,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import useDashboardAdminTransactionsData from "@/hooks/use-dashboardAdminTransactions";

// interface Transaction {
//   id: number;
//   date: string;
//   property: string;
//   tenant: string | null;
//   amount: number;
//   type: string;
//   status: string;
//   description?: string;
// }

// interface ApiTransaction {
//   id: number;
//   created_at?: string;
//   date?: string;
//   property?: {
//     name: string;
//   };
//   property_name?: string;
//   tenant?: {
//     name: string;
//   };
//   tenant_name?: string;
//   amount: number | string;
//   type?: string;
//   status?: string;
//   description?: string;
// }

// export default function TransactionsPage() {
//   const { data: session } = useSession();
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function loadTransactions() {
//       if (!session?.user?.accessToken) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);
//         const data = await fetchTransactions(session.user.accessToken);

//         // Map API data if necessary. Assuming API returns matching structure or we map it:
//         const mappedTransactions: Transaction[] = (
//           Array.isArray(data) ? data : []
//         ).map((t: ApiTransaction) => ({
//           id: t.id,
//           date: t.created_at || t.date || new Date().toISOString(),
//           property: t.property?.name || t.property_name || "Unknown Property",
//           tenant: t.tenant?.name || t.tenant_name || null,
//           amount: Number(t.amount) || 0,
//           type: t.type || "transaction",
//           status: t.status || "completed", // Default to completed if not status
//           description: t.description,
//         }));

//         setTransactions(mappedTransactions);
//       } catch (err) {
//         console.error("Error loading transactions:", err);
//         setError(
//           err instanceof Error ? err.message : "Failed to load transactions"
//         );
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadTransactions();
//   }, [session]);

//   const totalIncome = transactions
//     .filter((t) => t.amount > 0 && t.status === "completed")
//     .reduce((sum, t) => sum + t.amount, 0);

//   const totalExpenses = transactions
//     .filter((t) => t.amount < 0)
//     .reduce((sum, t) => sum + Math.abs(t.amount), 0);

//   const netIncome = totalIncome - totalExpenses;

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
//           Error loading transactions
//         </p>
//         <p className="text-gray-500">{error}</p>
//         <Button variant="outline" onClick={() => window.location.reload()}>
//           Try Again
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
//           <p className="text-muted-foreground">
//             Track all your income and expenses
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline">
//             <Filter className="mr-2 h-4 w-4" />
//             Filter
//           </Button>
//           <Button>
//             <Download className="mr-2 h-4 w-4" />
//             Export
//           </Button>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid gap-4 md:grid-cols-3">
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-sm font-medium">Total Income</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-baseline gap-2">
//               <p className="text-3xl font-bold text-green-600 dark:text-green-400">
//                 ${totalIncome.toLocaleString()}
//               </p>
//               <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
//             </div>
//             <p className="text-xs text-muted-foreground mt-1">
//               From rent payments
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="text-sm font-medium">
//               Total Expenses
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-baseline gap-2">
//               <p className="text-3xl font-bold text-red-600 dark:text-red-400">
//                 ${totalExpenses.toLocaleString()}
//               </p>
//             </div>
//             <p className="text-xs text-muted-foreground mt-1">
//               Maintenance & repairs
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="text-sm font-medium">Net Income</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-baseline gap-2">
//               <p className="text-3xl font-bold text-primary">
//                 ${netIncome.toLocaleString()}
//               </p>
//             </div>
//             <p className="text-xs text-muted-foreground mt-1">This month</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Transactions List */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Recent Transactions</CardTitle>
//           <CardDescription>
//             Latest income and expense transactions
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {transactions.length === 0 ? (
//               <div className="text-center py-8 text-gray-500">
//                 No transactions found.
//               </div>
//             ) : (
//               transactions.map((transaction) => (
//                 <div
//                   key={transaction.id}
//                   className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div
//                       className={`p-2 rounded-lg ${
//                         transaction.amount > 0
//                           ? "bg-green-500/10"
//                           : "bg-red-500/10"
//                       }`}
//                     >
//                       <DollarSign
//                         className={`h-5 w-5 ${
//                           transaction.amount > 0
//                             ? "text-green-600 dark:text-green-400"
//                             : "text-red-600 dark:text-red-400"
//                         }`}
//                       />
//                     </div>
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <p className="font-medium">{transaction.property}</p>
//                         <Badge
//                           variant={
//                             transaction.status === "completed"
//                               ? "success"
//                               : "warning"
//                           }
//                         >
//                           {transaction.status}
//                         </Badge>
//                       </div>
//                       <p className="text-sm text-muted-foreground">
//                         {transaction.tenant ||
//                           transaction.description ||
//                           transaction.type}
//                       </p>
//                       <p className="text-xs text-muted-foreground">
//                         {new Date(transaction.date).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p
//                       className={`text-lg font-semibold ${
//                         transaction.amount > 0
//                           ? "text-green-600 dark:text-green-400"
//                           : "text-red-600 dark:text-red-400"
//                       }`}
//                     >
//                       {transaction.amount > 0 ? "+" : ""}$
//                       {Math.abs(transaction.amount).toLocaleString()}
//                     </p>
//                     <p className="text-xs text-muted-foreground capitalize">
//                       {transaction.type}
//                     </p>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
export default function Page() {
  return <div>page</div>;
}