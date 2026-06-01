
'use client';

import { MoveUp, MoveDown } from "lucide-react";

export default function MetricCard({
    icon: Icon,
    label,
    value,
    trend,
    growth,
    subLabel,
    prefix = "",
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    trend: string;
    growth: number | string;
    subLabel: string;
    prefix?: string;
}) {
    const isUp = trend === "up";
    return (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-[0px_1px_0.5px_0.05px_rgba(29, 41, 61, 0.02)] p-6 flex flex-col gap-3 min-w-0">
            <div className="flex items-center gap-2 text-[#4A5565] text-sm font-medium">
                <Icon className="w-5 h-5 text-[#4A5565]" strokeWidth={1.8} />
                <span className="font-normal text-[16px]">{label}</span>
            </div>
            <div className="text-3xl font-bold text-[#15042B] tracking-tight">
                {prefix}{value}
            </div>
            <div className="flex items-center gap-1.5 text-sm">
                <span
                    className={`font-semibold flex items-center gap-0.5 ${isUp ? "text-[#007A55]" : "text-red-400"}`}
                >
                    {isUp ? (
                        <MoveUp className="w-3 h-3"/>
                    ) : (
                        <MoveDown />
                    )}
                    {growth}
                </span>
                <span className="text-[#4A5565] font-normal">{subLabel}</span>
            </div>
        </div>
    );
}

