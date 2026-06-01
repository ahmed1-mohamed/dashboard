"use client";

import { Switch } from "@/components/ui";
import { useToken } from "@/contexts/SessionProviderWrapper";
import { useAvailability } from "@/hooks/dashboardExpert/useAvailability";
import { DashboardExpertService } from "@/services/DashboardExpertService";
import { SlotDialogState } from "@/types/expertDashboard/availability";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import SlotDialog from "./AvailabilitySlotDailog/SlotDailog";
import Exceptions from "./Exceptions/Exceptions";

export default function Availability() {
    const { expertId } = useToken();
    const { data, isLoading, isError } = useAvailability(expertId);
    const queryClient = useQueryClient();

    const [slotDialog, setSlotDialog] = useState<SlotDialogState>({
        open: false,
        mode: "add",
        day: "",
        slots: [],
    });

    const toggleMutation = useMutation({
        mutationFn: ({ day, enabled }: { day: string; enabled: boolean }) => {
            if (!expertId) return Promise.reject("No expert ID");
            return DashboardExpertService.toggleAvailabilityDay(expertId, { day, enabled });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["weekly-availability", expertId] });
            toast.success("Day updated successfully");
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to update day");
        },
    });

    const scheduleData = data?.data?.data;

    const openAddDialog = (day: string) =>
        setSlotDialog({ open: true, mode: "add", day, slots: [] });

    const openEditDialog = (day: string) =>
        setSlotDialog({
            open: true,
            mode: "edit",
            day,
            slots:
                scheduleData?.[day as keyof typeof scheduleData]?.slots?.map(
                    (s: any) => ({
                        id: s.rule_id,
                        from: s.from ?? s[0],
                        to: s.to ?? s[1],
                        data: s,
                    })
                ) ?? [],
        });

    const closeSlotDialog = () =>
        setSlotDialog((prev) => ({ ...prev, open: false }));

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Failed to load availability.</div>;

    const availabilityEntries = Object.entries(data?.data?.data || {});

    return (
        <>

            <div className="flex flex-col gap-3 max-w-[723px] m-auto">
                {availabilityEntries.map(([day, dayData]: any) => {
                    const hasSlots = dayData?.enabled && dayData?.slots?.length > 0;

                    return (
                        <div
                            key={day}
                            className="rounded-[10px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] px-4 py-3 flex flex-col gap-2"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Switch
                                        checked={dayData?.enabled}
                                        // disabled={toggleMutation.isPending}
                                        className="data-[state=checked]:bg-[#AD46FF] w-[36px] h-[20px] shrink-0"
                                        onCheckedChange={(checked) =>
                                            toggleMutation.mutate({ day, enabled: checked })
                                        }
                                    />
                                    <span className="capitalize text-[15px] font-[500] text-[#15042B] leading-5">
                                        {day}
                                    </span>
                                </div>

                                {hasSlots ? (
                                    <button
                                        onClick={() => openEditDialog(day)}
                                        className="flex items-center gap-1 text-[13px] font-[500] text-[#374151] border border-[#E5E7EB] rounded-md px-3 py-1.5 bg-white hover:bg-[#F9FAFB] transition-colors shadow-[0_1px_1px_rgba(0,0,0,0.04)]"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                        Edit
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => openAddDialog(day)}
                                        className="flex items-center gap-1 text-[13px] font-[500] text-[#374151] border border-[#E5E7EB] rounded-md px-3 py-1.5 bg-white hover:bg-[#F9FAFB] transition-colors shadow-[0_1px_1px_rgba(0,0,0,0.04)]"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Add
                                    </button>
                                )}
                            </div>

                            {hasSlots && (
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {dayData.slots.map((slot: any, index: number) => (
                                        <span
                                            key={index}
                                            className="text-[13px] font-[500] text-[#0D9488] bg-[#F0FDFA] border border-[#CCFBF1] rounded-full px-3 py-0.5"
                                        >
                                            {slot.from ?? slot[0]} – {slot.to ?? slot[1]}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <Exceptions />

            {slotDialog.open && expertId && (
                <SlotDialog
                    state={slotDialog}
                    expertId={expertId}
                    onClose={closeSlotDialog}
                />
            )}
        </>
    );
}
