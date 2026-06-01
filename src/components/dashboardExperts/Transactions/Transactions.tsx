"use client";

import { useState } from "react";
import { MoreHorizontal, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTransactions } from "@/hooks/dashboardExpert/useTransactions";
import { Transaction, TransactionsResponse, TransactionStatus } from "@/types/expertDashboard/transctions";
import { useDebounce } from "@/hooks/useDebounce";


function formatDate(iso: string) {
    const d = new Date(iso);
    return {
        date: d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" }),
        time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    };
}

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function SkeletonRow() {
    return (
        <TableRow>
            {[80, 160, 80, 100, 60, 140, 40].map((w, i) => (
                <TableCell key={i}>
                    <Skeleton className="h-4 rounded" style={{ width: w }} />
                </TableCell>
            ))}
        </TableRow>
    );
}

const PER_PAGE = 10;

export default function Transactions() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<TransactionStatus>("all");
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading, isError } = useTransactions({
        page,
        per_page: PER_PAGE,
        status: status === "all" ? undefined : status,
        search: debouncedSearch || undefined,
    });

    const transactions: Transaction[] = (data?.data as TransactionsResponse)?.data ?? [];

    return (
        <div className="space-y-6">
            <h2 className="text-[#15042B] text-xl font-semibold mb-5">
                Transactions {(data?.data as TransactionsResponse)?.total > 0 && <span className="text-sm bg-purple-500 py-0.5 px-1.5 rounded-full text-white">{data?.data?.total}</span>}
            </h2>
            <div className="flex flex-wrap items-center gap-3">

                <div className="relative flex-1 min-w-[200px] max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search Transactions..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="pl-9 bg-muted/40"
                    />
                </div>

                <Select
                    value={status}
                    onValueChange={(val) => {
                        setStatus(val as TransactionStatus | "all");
                        setPage(1);
                    }}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="canceled">Canceled</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Session Type</TableHead>
                            {/* <TableHead className="w-[80px]">Actions</TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading &&
                            Array.from({ length: PER_PAGE }).map((_, i) => <SkeletonRow key={i} />)}

                        {isError && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                    Failed to load transactions. Please try again.
                                </TableCell>
                            </TableRow>
                        )}

                        {!isLoading && !isError && transactions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                    No transactions found.
                                </TableCell>
                            </TableRow>
                        )}

                        {!isLoading &&
                            transactions.map((txn: Transaction) => {
                                const { date, time } = formatDate(txn.start_time);
                                const clientName = txn.client_name ?? "—";

                                return (
                                    <TableRow key={txn.tx_id}>

                                        <TableCell className="font-mono text-xs text-[#4A5565]">
                                            {txn.tx_id}
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-1.5">
                                                <Avatar className="w-6 h-6">
                                                    <AvatarFallback className="text-xs">
                                                        {getInitials(clientName)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium text-sm text-[#15042B]">{clientName}</span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-sm text-[#4A5565]">
                                            {txn.amount_cents ?? "—"}
                                        </TableCell>

                                        <TableCell>
                                            <div className="text-sm leading-tight text-[#4A5565]">
                                                <p>{date}</p>
                                                <p className="text-xs">{time}</p>
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-sm text-[#4A5565]">
                                            {txn.minutes ? `${txn.minutes} min` : "—"}
                                        </TableCell>

                                        <TableCell className="text-sm text-[#4A5565] max-w-[180px] truncate">
                                            {txn.action ?? "—"}
                                        </TableCell>

                                        {/* <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="w-4 h-4 text-[#4A5565]" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>View details</DropdownMenuItem>
                                                <DropdownMenuItem>Download receipt</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell> */}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
