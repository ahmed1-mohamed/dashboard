"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

export interface MultiSelectOption {
  value: number;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: number[];
  onChange: (values: number[]) => void;
  placeholder?: string;
  className?: string;
  hasError?: boolean;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select…",
  className,
  hasError,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const toggle = (value: number) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const remove = (value: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((v) => v !== value));
  };

  const selectedLabels = selected.map(
    (v) => options.find((o) => o.value === v)?.label ?? String(v)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-auto min-h-9 py-1.5 px-3 font-normal",
            hasError && "border-red-400",
            className
          )}
        >
          <div className="flex flex-wrap gap-1">
            {selectedLabels.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              selectedLabels.map((label, idx) => (
                <Badge
                  key={selected[idx]}
                  variant="secondary"
                  className="flex items-center gap-1 text-xs"
                >
                  {label}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                    onClick={(e) => remove(selected[idx], e)}
                  />
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={String(opt.value)}
                  onSelect={() => toggle(opt.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(opt.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
