'use client'

import { CircleQuestionMark } from "lucide-react";
import { Label } from "@/components/ui/label";

export function FieldLabel({
    label,
    required,
    tooltip,
    error,
}: {
    label: string;
    required?: boolean;
    tooltip?: string;
    error?: string;
}) {
    return (
        <div className="mb-1">
            <div className="flex items-center gap-1">
                <Label className="text-[14px] font-medium text-[#15042B] flex items-center gap-1">
                    {label}
                    {required && <span className="text-[#C70036]">*</span>}
                </Label>
                {tooltip && <CircleQuestionMark className="w-3 h-3 text-[#6A7282] cursor-help" />}
            </div>
            {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
        </div>
    );
}
