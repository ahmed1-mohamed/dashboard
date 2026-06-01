"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        className: "bg-white text-gray-900 border border-gray-200 shadow-lg",
        duration: 3000,
        unstyled: false,
      }}
      visibleToasts={5}
      richColors
      closeButton
    />
  );
}
