"use client";

import React, { useState, useRef, useEffect } from "react";
import { Control, useController } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UpdateExpertValues } from "@/validators/dashboardExpert/updateExpertSchema";
import { Input } from "@/components/ui";

interface ImgPickerProps {
    control: Control<UpdateExpertValues>;
}

export default function ImgPicker({ control }: ImgPickerProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const {
        field,
        fieldState: { error },
    } = useController({
        name: "photo",
        control,
    });

    useEffect(() => {
        const value = field.value;
        if (!value) {
            setPreview(null);
            setFileName(null);
            return;
        }

        if (value instanceof File) {
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result as string);
            reader.readAsDataURL(value);
            setFileName(value.name);
        } else if ("url" in value && typeof value.url === "string") {
            setPreview(value.url);
        }
    }, [field.value]);

    const handleButtonClick = () => inputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        field.onChange(file);
        setFileName(file.name);
        e.target.value = "";
    };

    return (
        <>
            <div className="flex flex-col gap-2.5">

                <p className="text-[#15042B] text-[14px] font-[500] ">Upload profile picture</p>

                <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 rounded-[8px]">
                        <AvatarImage
                            src={preview ?? "/assets/avatar.png"}
                            alt="Profile photo"
                            className="object-cover"
                        />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col gap-2.5 w-full">
                        <Input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        <div
                            onClick={handleButtonClick}
                            className="flex items-center border border-gray-200 rounded-lg overflow-hidden cursor-pointer bg-[#F9FAFB]"
                        >
                            <div className="bg-[#F1F3F5] px-4 py-2 border-r border-gray-200 text-[#4A5565] text-sm font-medium">
                                Choose files
                            </div>

                            <div className="px-4 py-2 text-[#64748B] text-sm flex-1 truncate">
                                {fileName ?? "No file chosen"}
                            </div>
                        </div>

                        <p className="text-[12px] text-[#4A5565]">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs">{error.message ?? "Photo is required"}</p>
                    )}
                </div>

            </div>

        </>

    );
}
