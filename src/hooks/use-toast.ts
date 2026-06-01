"use client";

import { toast } from "sonner";

export interface Toast {
  id?: string;
  title: string | undefined;
  description?: string;
  variant?: "default" | "destructive";
}

export function useToast() {
  const showToast = ({ title, description, variant = "default" }: Toast) => {
    if (variant === "destructive") {
      toast.error(title, {
        description,
        duration: 4000,
        position: "top-right",
      });
    } else {
      toast.success(title, {
        description,
        duration: 3000,
        position: "top-right",
      });
    }
  };

  return { toast: showToast, toasts: [] };
}
