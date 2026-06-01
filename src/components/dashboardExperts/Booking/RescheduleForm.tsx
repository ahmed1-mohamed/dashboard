"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardExpertService } from "@/services/DashboardExpertService";
import { toDatetimeLocal } from "@/utlis/format";

interface RescheduleFormProps {
  bookingId: number;
  currentStartTime: string;
  currentMinutes: number;
  setOpen: (open: boolean) => void;
}

export function RescheduleForm({
  bookingId,
  currentStartTime,
  currentMinutes,
  setOpen,
}: RescheduleFormProps) {
  const queryClient = useQueryClient();
  const [startTime, setStartTime] = useState(toDatetimeLocal(currentStartTime));
  const [minutes, setMinutes] = useState(currentMinutes);

  const rescheduleMutation = useMutation({
    mutationFn: (data: { start_time: string; minutes: number }) =>
      DashboardExpertService.rescheduleBookings(bookingId, data),

    onSuccess: () => {
      toast.success("Session rescheduled successfully");
      queryClient.invalidateQueries({ queryKey: ["BookingsData"] });
      setOpen(false);
    },

    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to reschedule");
    },
  });

  const handleSubmit = () => {
    if (!startTime || !minutes) {
      toast.error("Please fill in all fields");
      return;
    }

    rescheduleMutation.mutate({
      start_time: startTime.replace("T", " ") + ":00",
      minutes: Number(minutes),
    });
  };

  return (
    <div className="flex flex-col gap-5 pt-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="reschedule-start-time">New Date & Time</Label>
        <Input
          id="reschedule-start-time"
          type="datetime-local"
          value={startTime}
          min={new Date().toISOString().slice(0, 16)}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="reschedule-minutes">Duration (minutes)</Label>
        <Input
          id="reschedule-minutes"
          type="number"
          min={15}
          step={15}
          value={minutes}
          placeholder="e.g. 60"
          onChange={(e) => setMinutes(Number(e.target.value))}
        />
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <Button
          variant="outline"
          disabled={rescheduleMutation.isPending}
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
        <Button
          disabled={rescheduleMutation.isPending}
          className="bg-[#7826EA] text-white hover:bg-[#6a1fd4]"
          onClick={handleSubmit}
        >
          {rescheduleMutation.isPending ? "Saving..." : "Confirm Reschedule"}
        </Button>
      </div>
    </div>
  );
}
