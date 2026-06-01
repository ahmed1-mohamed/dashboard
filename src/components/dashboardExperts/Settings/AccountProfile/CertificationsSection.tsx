
"use client";

import { useState } from "react";
import { useFieldArray, Control } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UpdateExpertValues } from "@/validators/dashboardExpert/updateExpertSchema";
import { FieldLabel } from "./FieldLabel";


interface CertificationsSectionProps {
    control: Control<UpdateExpertValues>;
}

export function CertificationsSection({ control }: CertificationsSectionProps) {
    const [inputValue, setInputValue] = useState("");

    const { fields, append, remove } = useFieldArray({
        control,
        name: "certifications",
    });

    const handleAdd = () => {
        const trimmed = inputValue.trim();
        if (!trimmed) return;
        if (fields.some((f) => f.cert_name.toLowerCase() === trimmed.toLowerCase())) return;
        append({ cert_name: trimmed });
        setInputValue("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div className="flex flex-col gap-2.5">
            <FieldLabel label="Certifications" tooltip="Your professional certifications" required />

            <div className="flex gap-2 mt-1">
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. RERA Certified"
                    className="flex-1"
                />
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAdd}
                    disabled={!inputValue.trim()}
                    className="shrink-0 flex items-center gap-1 px-3 bg-[#008081] text-white"
                >
                    Add
                </Button>
            </div>

            {fields.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-3">
                    {fields.map((field, index) => (
                        <span
                            key={field.id}
                            className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-full pl-3 pr-2 py-0.5 text-sm"
                        >
                            {field.cert_name}
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-teal-200 transition-colors"
                                aria-label={`Remove ${field.cert_name}`}
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-400 mt-2">
                    No certifications added yet. Type one above and press Enter or Add.
                </p>
            )}
        </div>
    );
}
