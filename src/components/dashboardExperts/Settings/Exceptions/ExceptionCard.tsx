'use client';

import { Switch } from "@/components/ui/switch";
import { DashboardExpertService } from "@/services/DashboardExpertService";
import { GroupedEntry } from "@/types/expertDashboard/availability";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";

export default function ExceptionCard({
  group,
  expertId,
  onEdit,
}: {
  group: GroupedEntry;
  expertId: number;
  onEdit: () => void;
}) {
  const queryClient = useQueryClient();

  // Derive checked state from the first exception's `available` field
  const isEnabled = group.exceptions[0]?.available ?? true;

  const toggleMutation = useMutation({
    mutationFn: (newAvailable: boolean) =>
      Promise.all(
        group.exceptions.map((ex) =>
          DashboardExpertService.updateAvailabilityException(expertId, ex.exception_id, {
            start_date: ex.start_date,
            end_date: ex.end_date,
            available: newAvailable,
          })
        )
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["exceptions", expertId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: () =>
      Promise.all(
        group.exceptions.map((ex) =>
          DashboardExpertService.deleteAvailabilityException(expertId, ex.exception_id)
        )
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["exceptions", expertId] }),
  });

  return (
    <div className="rounded-[10px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] px-4 py-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        {/* Left: toggle + date label */}
        <div className="flex items-center gap-3">
          <Switch
            checked={isEnabled}
            disabled={toggleMutation.isPending}
            className="data-[state=checked]:bg-[#AD46FF] w-[36px] h-[20px] shrink-0"
            onCheckedChange={(checked) => toggleMutation.mutate(checked)}
          />
          <span className="text-[15px] font-[500] text-[#15042B] leading-5">{group.label}</span>
        </div>

        {/* Right: Edit + Delete */}
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-[13px] font-[500] text-[#374151] border border-[#E5E7EB] rounded-md px-3 py-1.5 bg-white hover:bg-[#F9FAFB] transition-colors shadow-[0_1px_1px_rgba(0,0,0,0.04)]"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            aria-label="Delete this date"
            className="flex items-center justify-center w-8 h-8 rounded-[6px] bg-[#EF4444] hover:bg-[#DC2626] text-white transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {group.isAllDay ? (
        <p className="text-[13px] font-[500] text-[#0D9488]">All Day</p>
      ) : group.slots.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-1">
          {group.slots.map((slot, i) => (
            <span
              key={i}
              className="text-[13px] font-[500] text-[#0D9488] bg-[#F0FDFA] border border-[#CCFBF1] rounded-full px-3 py-0.5"
            >
              {slot.from} – {slot.to}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}



