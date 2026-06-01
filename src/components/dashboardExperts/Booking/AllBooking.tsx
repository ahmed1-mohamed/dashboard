"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DashboardExpertService } from "@/services/DashboardExpertService";
import { Booking, BookingStats } from "@/types/expertDashboard/bookings";
import EmptyPage from "../EmptyPage";
import { BookingSkeleton } from "./BookingSkeleton";
import { BookingCard } from "./BookingCard";
import { RescheduleForm } from "./RescheduleForm";
import { useBookings } from "@/hooks/dashboardExpert/useBookings";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PER_PAGE = 10;

export default function AllBooking() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BookingStats | "all">("all");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isError, isFetching } = useBookings({
    page,
    per_page: PER_PAGE,
    status: status === "all" ? undefined : status,
    search: debouncedSearch || undefined,
  });

  const bookingData: Booking[] = data?.data?.data ?? [];
  const isInitialLoading = isLoading && !data;

  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] =
    useState<Booking | null>(null);

  const [loadingId, setLoadingId] = useState<number | null>(null);

  const confirmMutation = useMutation({
    mutationFn: (bookingId: number) =>
      DashboardExpertService.confirmBooking(bookingId),
    onSuccess: () => {
      toast.success("Booking confirmed successfully");
      queryClient.invalidateQueries({ queryKey: ["BookingsData"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to confirm booking");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (bookingId: number) =>
      DashboardExpertService.declineBooking(bookingId),
    onSuccess: () => {
      toast.success("Booking cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["BookingsData"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Something went wrong");
    },
  });

  const handleJoin = (session: Booking) => {
    if (!session.meeting_join_expert) {
      toast.error("Meeting is not ready yet");
      return;
    }
    router.push(`/expert/meeting/${session.meeting_join_expert}`);
  };

  const handleOpenReschedule = (session: Booking) => {
    setSelectedSession(session);
    setRescheduleDialogOpen(true);
  };

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
        Bookings
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
            setStatus(val as BookingStats | "all")
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {isInitialLoading ? (
          <BookingSkeleton showActions />
        ) : bookingData.length ? (
          bookingData.map((session) => (
            <div
              key={session.booking_id}
            >
              <BookingCard
                session={session}
                actions={
                  <div className="flex flex-col gap-2">
                    {/* JOIN */}
                    <Button
                      size="sm"
                      onClick={() => handleJoin(session)}
                      // disabled={session.status !== "ongoing"}
                      className="col-span-2 bg-[#7826EA] text-white"
                    >
                      Join Session
                    </Button>

                    {/* CONFIRM */}
                    <Button
                      size="sm"
                      onClick={() => {
                        setLoadingId(session.booking_id);
                        confirmMutation.mutate(session.booking_id, {
                          onSettled: () => setLoadingId(null),
                        });
                      }}
                      disabled={
                        loadingId === session.booking_id ||
                        session.status !== "pending"
                      }
                      className="bg-[#008081] text-white"
                    >
                      {loadingId === session.booking_id
                        ? "Confirming..."
                        : "Confirm"}
                    </Button>

                    {/* RESCHEDULE */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenReschedule(session)}
                      disabled={
                        !["confirmed", "pending", "ongoing"].includes(
                          session.status
                        )
                      }
                    >
                      Reschedule
                    </Button>

                    {/* DECLINE */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setLoadingId(session.booking_id);
                        cancelMutation.mutate(session.booking_id, {
                          onSettled: () => setLoadingId(null),
                        });
                      }}
                      disabled={
                        loadingId === session.booking_id ||
                        !["pending", "confirmed"].includes(
                          session.status
                        )
                      }
                      className="col-span-2 text-[#D03801]"
                    >
                      {loadingId === session.booking_id
                        ? "Cancelling..."
                        : "Decline"}
                    </Button>
                  </div>
                }
              />
            </div>
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

      <Dialog
        open={rescheduleDialogOpen}
        onOpenChange={setRescheduleDialogOpen}
      >
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Reschedule Meeting</DialogTitle>
          </DialogHeader>

          {selectedSession && (
            <RescheduleForm
              bookingId={selectedSession.booking_id}
              currentStartTime={selectedSession.start_time}
              currentMinutes={selectedSession.minutes}
              setOpen={setRescheduleDialogOpen}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
