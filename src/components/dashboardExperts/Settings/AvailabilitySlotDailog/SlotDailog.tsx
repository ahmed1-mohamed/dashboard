"use client";

import { DashboardExpertService } from "@/services/DashboardExpertService";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { SlotDialogState } from "@/types/expertDashboard/availability";
import { Button } from "@/components/ui";
import { Plus, Trash2 } from "lucide-react";

type SlotRow = {
    id?: number;
    from: string;
    to: string;
    originalFrom?: string;
    originalTo?: string;
    markedForDelete?: boolean;
};

export default function SlotDialog({
    state,
    expertId,
    onClose,
}: {
    state: SlotDialogState;
    expertId: number;
    onClose: () => void;
}) {
    const queryClient = useQueryClient();

    const buildInitialRows = (): SlotRow[] => {
        if (state.slots && state.slots.length > 0) {
            return state.slots.map((s) => ({
                id: s.id ? Number(s.id) : undefined,
                from: s.from,
                to: s.to,
                originalFrom: s.from,  
                originalTo: s.to,     
            }));
        }
        return [{ from: "09:00", to: "17:00" }];
    };

    const [rows, setRows] = useState<SlotRow[]>(buildInitialRows);
    const [isPending, setIsPending] = useState(false);

    const updateRow = (index: number, field: "from" | "to", value: string) => {
        setRows((prev) =>
            prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
        );
    };

    const addNewRow = () => {
        setRows((prev) => [...prev, { from: "09:00", to: "17:00" }]);
    };

    const removeRow = (index: number) => {
        const row = rows[index];
        if (row.id) {
            setRows((prev) =>
                prev.map((r, i) => (i === index ? { ...r, markedForDelete: true } : r))
            );
        } else {
            setRows((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleSave = async () => {
        const activeRows = rows.filter((r) => !r.markedForDelete);

        for (const row of activeRows) {
            if (!row.from || !row.to) {
                toast.error("Please fill in all time fields");
                return;
            }
            if (row.from >= row.to) {
                toast.error("Start time must be before end time");
                return;
            }
        }

        setIsPending(true);
        try {
            await Promise.all(
                rows.map((row) => {
                    if (row.markedForDelete && row.id) {
                        return DashboardExpertService.deleteAvailabilitySlot(expertId, row.id);
                    }

                    if (row.id) {
                        const isModified = row.from !== row.originalFrom || row.to !== row.originalTo;
                        if (!isModified) return Promise.resolve(); 
                        return DashboardExpertService.updateAvailabilitySlot(expertId, row.id, {
                            from: row.from,
                            to: row.to,
                        });
                    }

                    return DashboardExpertService.addAvailabilitySlot(expertId, {
                        day: state.day,
                        from: row.from,
                        to: row.to,
                    });
                })
            );

            queryClient.invalidateQueries({ queryKey: ["weekly-availability", expertId] });
            toast.success("Availability saved successfully");
            onClose();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to save availability");
        } finally {
            setIsPending(false);
        }
    };

    const visibleRows = rows.filter((r) => !r.markedForDelete);

    return (
        <Dialog open={state.open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[560px] p-0 gap-0 rounded-2xl overflow-hidden">

                <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#F3F4F6]">
                    <DialogTitle className="capitalize text-[18px] font-[600] text-[#15042B]">
                        {state.mode === "edit" ? "Edit" : "Add"} {state.day} Availability
                    </DialogTitle>
                </DialogHeader>

                <div className="px-6 py-5 flex flex-col gap-3">
                    {visibleRows.map((row, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="flex-1">
                                <input
                                    type="time"
                                    value={row.from}
                                    onChange={(e) => {
                                        const realIndex = rows.indexOf(row);
                                        updateRow(realIndex, "from", e.target.value);
                                    }}
                                    className="w-full border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-[14px] text-[#374151] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 focus:border-[#0D9488] transition-colors"
                                />
                            </div>

                            <span className="text-[14px] text-[#6B7280] shrink-0">to</span>

                            <div className="flex-1">
                                <input
                                    type="time"
                                    value={row.to}
                                    onChange={(e) => {
                                        const realIndex = rows.indexOf(row);
                                        updateRow(realIndex, "to", e.target.value);
                                    }}
                                    className="w-full border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-[14px] text-[#374151] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 focus:border-[#0D9488] transition-colors"
                                />
                            </div>

                            {(visibleRows.length > 1 || row.id) && (
                                <button
                                    onClick={() => removeRow(rows.indexOf(row))}
                                    className="p-1.5 rounded-md hover:bg-red-50 text-red-400 transition-colors shrink-0"
                                    title="Remove slot"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        onClick={addNewRow}
                        className="w-full mt-1 border border-dashed border-[#D1D5DB] rounded-lg py-2.5 text-[14px] text-[#6B7280] bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Slot
                    </button>
                </div>

                <div className="h-px bg-[#F3F4F6]" />

                <DialogFooter className="px-6 py-4 flex flex-row justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isPending}
                        className="border-[#E5E7EB] text-[#4A5565] rounded-lg px-5"
                    >
                        Close
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isPending}
                        className="bg-[#0D9488] hover:bg-[#0B7C77] text-white rounded-lg px-6 font-[500]"
                    >
                        {isPending ? "Saving…" : state.mode === "edit" ? "Save Changes" : "Add"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
