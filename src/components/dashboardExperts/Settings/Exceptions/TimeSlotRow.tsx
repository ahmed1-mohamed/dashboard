"use client";

import { Input } from "@/components/ui/input";
import { TimeSlot } from "@/types/expertDashboard/availability";
import { Clock, Trash2 } from "lucide-react";

export function TimeSlotRow({
  slot,
  onChange,
  onRemove,
  canRemove,
  isEditing = false,
}: {
  slot: TimeSlot;
  onChange: (updated: TimeSlot) => void;
  onRemove: () => void;
  canRemove: boolean;
  isEditing?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Input
          type="time"
          value={slot.from}
          onChange={(e) => onChange({ ...slot, from: e.target.value })}
          className="border border-[#E5E7EB] rounded-md px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#AD46FF] focus:border-transparent"
        />
      </div>
      <span className="text-[13px] text-[#6B7280]">to</span>
      <div className="relative flex-1">
        <Input
          type="time"
          value={slot.to}
          onChange={(e) => onChange({ ...slot, to: e.target.value })}
          className="border border-[#E5E7EB] rounded-md px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#AD46FF] focus:border-transparent"
        />
      </div>
      {isEditing && (
        <button
          onClick={onRemove}
          disabled={!canRemove}
          aria-label="Remove time slot"
          className="flex items-center justify-center w-8 h-8 rounded-[6px] bg-[#EF4444] hover:bg-[#DC2626] text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
