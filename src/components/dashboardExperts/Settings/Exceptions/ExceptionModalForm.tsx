"use client";

import {
  DaySlots,
  ExceptionFormState,
  ExceptionModalFormProps,
  TabMode,
  TimeSlot,
} from "@/types/expertDashboard/availability";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  defaultSlot,
  formatDateLabel,
  getDatesInRange,
  toApiDateTime,
} from "./Format";
import { DashboardExpertService } from "@/services/DashboardExpertService";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TimeSlotRow } from "./TimeSlotRow";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ExceptionModalForm({
  open,
  onClose,
  expertId,
  isEditing,
  initialState,
  editGroup,
}: ExceptionModalFormProps) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<ExceptionFormState>(initialState);

  const syncCustomDays = (
    fromDate: string,
    toDate: string,
    current: DaySlots[],
  ): DaySlots[] => {
    const dates = getDatesInRange(fromDate, toDate);
    return dates.map((d) => {
      const existing = current.find((cd) => cd.date === d);
      return (
        existing ?? {
          date: d,
          label: formatDateLabel(d),
          slots: [defaultSlot()],
        }
      );
    });
  };

  const setFromDate = (v: string) => {
    setForm((f) => {
      const newCustomDays =
        f.tabMode === "custom"
          ? syncCustomDays(v, f.toDate, f.customDays)
          : f.customDays;
      return { ...f, fromDate: v, customDays: newCustomDays };
    });
  };

  const setToDate = (v: string) => {
    setForm((f) => {
      const newCustomDays =
        f.tabMode === "custom"
          ? syncCustomDays(f.fromDate, v, f.customDays)
          : f.customDays;
      return { ...f, toDate: v, customDays: newCustomDays };
    });
  };

  const setTabMode = (mode: TabMode) => {
    setForm((f) => {
      const customDays =
        mode === "custom"
          ? syncCustomDays(f.fromDate, f.toDate, f.customDays)
          : f.customDays;
      return { ...f, tabMode: mode, customDays };
    });
  };

  // ── Same-mode slot helpers ──
  const updateSameSlot = (i: number, updated: TimeSlot) => {
    setForm((f) => {
      const s = [...f.sameSlots];
      s[i] = updated;
      return { ...f, sameSlots: s };
    });
  };

  const addSameSlot = () => {
    setForm((f) => ({ ...f, sameSlots: [...f.sameSlots, defaultSlot()] }));
  };

  const removeSameSlot = (i: number) => {
    setForm((f) => ({
      ...f,
      sameSlots: f.sameSlots.filter((_, idx) => idx !== i),
    }));
  };

  // ── Custom-mode slot helpers ──
  const updateCustomSlot = (
    dayIdx: number,
    slotIdx: number,
    updated: TimeSlot,
  ) => {
    setForm((f) => {
      const days = f.customDays.map((d, di) =>
        di !== dayIdx
          ? d
          : {
            ...d,
            slots: d.slots.map((s, si) => (si !== slotIdx ? s : updated)),
          },
      );
      return { ...f, customDays: days };
    });
  };

  const addCustomSlot = (dayIdx: number) => {
    setForm((f) => {
      const days = f.customDays.map((d, di) =>
        di !== dayIdx ? d : { ...d, slots: [...d.slots, defaultSlot()] },
      );
      return { ...f, customDays: days };
    });
  };

  const removeCustomSlot = (dayIdx: number, slotIdx: number) => {
    setForm((f) => {
      const days = f.customDays.map((d, di) =>
        di !== dayIdx
          ? d
          : { ...d, slots: d.slots.filter((_, si) => si !== slotIdx) },
      );
      return { ...f, customDays: days };
    });
  };

  const createMutation = useMutation({
    mutationFn: (payload: {
      start_date: string;
      end_date: string;
      available: boolean;
    }) => DashboardExpertService.setAvailabilityException(expertId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["exceptions", expertId] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      exceptionId,
      payload,
    }: {
      exceptionId: number;
      payload: { start_date: string; end_date: string; available: boolean };
    }) =>
      DashboardExpertService.updateAvailabilityException(
        expertId,
        exceptionId,
        payload,
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["exceptions", expertId] }),
  });

  const deleteSlotMutation = useMutation({
    mutationFn: (exceptionId: number) =>
      DashboardExpertService.deleteAvailabilityException(expertId, exceptionId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["exceptions", expertId] }),
  });

  const handleRemoveSameSlot = async (i: number) => {
    const slot = form.sameSlots[i];
    if (slot.exceptionId) {
      await deleteSlotMutation.mutateAsync(slot.exceptionId);
    }
    removeSameSlot(i);
  };

  const handleRemoveCustomSlot = async (dayIdx: number, slotIdx: number) => {
    const slot = form.customDays[dayIdx]?.slots[slotIdx];
    if (slot?.exceptionId) {
      await deleteSlotMutation.mutateAsync(slot.exceptionId);
    }
    removeCustomSlot(dayIdx, slotIdx);
  };

  const buildPayloads = (): {
    start_date: string;
    end_date: string;
    available: boolean;
  }[] => {
    if (form.tabMode === "same") {
      return form.sameSlots.map((slot) => ({
        start_date: toApiDateTime(form.fromDate, slot.from),
        end_date: toApiDateTime(form.toDate || form.fromDate, slot.to),
        available: true,
      }));
    }
    return form.customDays.flatMap((day) =>
      day.slots.map((slot) => ({
        start_date: toApiDateTime(day.date, slot.from),
        end_date: toApiDateTime(day.date, slot.to),
        available: true,
      })),
    );
  };

  const handleSubmit = async () => {
    if (!form.fromDate) return;

    if (isEditing && editGroup) {
      const slots = form.tabMode === "same"
        ? form.sameSlots
        : form.customDays.flatMap((d) => d.slots);

      const payloads = buildPayloads();

      await Promise.all(
        payloads.map((p, i) => {
          const slotExceptionId = slots[i]?.exceptionId;

          if (slotExceptionId) {
            // Slot has an existing ID → update it
            return updateMutation.mutateAsync({
              exceptionId: slotExceptionId,
              payload: p,
            });
          } else {
            // No ID → it's a new slot → create it
            return createMutation.mutateAsync(p);
          }
        }),
      );
    } else {
      const payloads = buildPayloads();
      await Promise.all(payloads.map((p) => createMutation.mutateAsync(p)));
    }

    onClose();
  };

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteSlotMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[490px] p-0 gap-0 rounded-[12px] overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#F3F4F6]">
          <DialogTitle className="text-[18px] font-semibold text-[#15042B]">
            {isEditing ? "Edit Time Off" : "Add Time Off"}
          </DialogTitle>
        </DialogHeader>

        {/* ✅ Tab toggle + dates OUTSIDE scroll area → always fixed */}
        <div className="px-6 pt-5 flex flex-col gap-5">
          {/* Tab toggle */}
          <div className="flex rounded-[8px] overflow-hidden border border-[#E5E7EB] w-full">
            <button
              onClick={() => setTabMode("custom")}
              className={`flex-1 py-2 text-[13px] font-[500] transition-colors ${form.tabMode === "custom"
                ? "bg-[#008081] text-white"
                : "bg-white text-[#374151] hover:bg-[#F9FAFB]"
                }`}
            >
              Custom times per day
            </button>
            <button
              onClick={() => setTabMode("same")}
              className={`flex-1 py-2 text-[13px] font-[500] transition-colors ${form.tabMode === "same"
                ? "bg-[#008081] text-white"
                : "bg-white text-[#374151] hover:bg-[#F9FAFB]"
                }`}
            >
              Same Time All Days
            </button>
          </div>

          {/* Date range */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label className="text-[13px] font-[500] text-[#374151] mb-1.5 block">
                From Date <span className="text-[#EF4444]">*</span>
              </Label>
              <Input
                type="date"
                value={form.fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="pl-9 text-[13px] border-[#E5E7EB] h-10"
              />
            </div>
            <div className="flex-1">
              <Label className="text-[13px] font-[500] text-[#374151] mb-1.5 block">
                To Date
              </Label>
              <Input
                type="date"
                value={form.toDate}
                min={form.fromDate}
                onChange={(e) => setToDate(e.target.value)}
                className="pl-9 text-[13px] border-[#E5E7EB] h-10"
              />
            </div>
          </div>
        </div>

        {/* ✅ Only slots area scrolls */}
        <div className="px-6 py-5 flex flex-col gap-5 overflow-y-auto max-h-[50vh]">
          {/* Same Time All Days */}
          {form.tabMode === "same" && (
            <div className="flex flex-col gap-3">
              {form.sameSlots.map((slot, i) => (
                <TimeSlotRow
                  key={slot.exceptionId ?? `new-${i}`}
                  slot={slot}
                  onChange={(updated) => updateSameSlot(i, updated)}
                  onRemove={() => handleRemoveSameSlot(i)}
                  canRemove={form.sameSlots.length > 1}
                  isEditing={isEditing}
                />
              ))}
              <button
                onClick={addSameSlot}
                className="w-full border border-dashed border-[#D1D5DB] rounded-[8px] py-2 text-[13px] text-[#6B7280] hover:bg-[#F9FAFB] transition-colors"
              >
                + Add Slot
              </button>
            </div>
          )}

          {/* Custom Times Per Day */}
          {form.tabMode === "custom" && (
            <div className="flex flex-col gap-5">
              {form.customDays.length === 0 && (
                <p className="text-[13px] text-[#9CA3AF] text-center py-4">
                  Select a date range above to configure per-day slots.
                </p>
              )}
              {form.customDays.map((day, di) => (
                <div key={day.date} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#AD46FF]" />
                    <span className="text-[13px] font-[500] text-[#374151]">
                      {day.label}
                    </span>
                  </div>
                  {day.slots.map((slot, si) => (
                    <TimeSlotRow
                      key={slot.exceptionId ?? `new-${di}-${si}`}
                      slot={slot}
                      onChange={(updated) => updateCustomSlot(di, si, updated)}
                      onRemove={() => handleRemoveCustomSlot(di, si)}
                      canRemove={day.slots.length > 1}
                      isEditing={isEditing}
                    />
                  ))}
                  <button
                    onClick={() => addCustomSlot(di)}
                    className="w-full border border-dashed border-[#D1D5DB] rounded-[8px] py-2 text-[13px] text-[#6B7280] hover:bg-[#F9FAFB] transition-colors"
                  >
                    + Add Slot
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#F3F4F6] flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-[13px] font-[500] border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB] px-5 h-9"
          >
            Close
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!form.fromDate || isPending}
            className="text-[13px] font-[500] bg-[#008081] hover:bg-[#006667] text-white px-5 h-9"
          >
            {isPending ? "Saving…" : isEditing ? "Save" : "Add"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
