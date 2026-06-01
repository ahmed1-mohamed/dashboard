"use client";

import { Booking } from "@/types/expertDashboard/bookings";
import { BookingSkeleton } from "../Booking/BookingSkeleton";
import { BookingCard } from "../Booking/BookingCard";
import { useHistory } from "@/hooks/dashboardExpert/useHistory";
import { useEffect, useState } from "react";
import { HistoryStats } from "@/types/expertDashboard/history";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import EmptyPage from "../EmptyPage";

export default function HistoryData() {

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<HistoryStats | "all">("all");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isError } = useHistory({
    page,
    status: status === "all" ? undefined : status,
    search: debouncedSearch || undefined,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  if (isError) {
    return (
      <div className="container mx-auto p-6 max-w-4xl text-center">
        <p className="text-red-500">
          Failed to load sessions. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-[#15042B]">
        History
      </h2>

      <div className="flex flex-wrap items-center gap-3">

        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <Input
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/40 focus-visible:ring-1 focus-visible:ring-[#7826EA]"
          />
        </div>

        <Select
          value={status}
          onValueChange={(val) =>
            setStatus(val as HistoryStats | "all")
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <BookingSkeleton showActions />
        ) : data?.data?.data.length ? (
          data?.data?.data.map((session: Booking) => (
            <BookingCard
              key={session.booking_id}
              session={session}
            />
          ))
        ) : search ? (
          <EmptyPage
            title="No results found"
            description="Try a different keyword."
          />
        ) : (
          <div className="flex items-center justify-center py-16 ">
            <EmptyPage
              title="No reservations yet"
              description="Once you start booking sessions, they will appear here."
            />
          </div>
        )}
      </div>

    </div>
  );
}
