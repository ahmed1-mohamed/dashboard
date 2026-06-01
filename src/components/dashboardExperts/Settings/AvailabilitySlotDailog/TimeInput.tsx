import { Input, Label } from "@/components/ui";


export default function TimeInput({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-[#374151]">{label}</Label>
            <Input
                type="time"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="border border-[#E5E7EB] rounded-md px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#AD46FF] focus:border-transparent"
            />
        </div>
    );
}
