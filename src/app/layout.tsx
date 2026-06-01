import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ServerProviders from "@/components/server-providers";
import QueryProvider from "@/state/react-query/query-provider";
import { Toaster } from "sonner";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Property Adviser - Comprehensive Property Management Platform",
  description:
    "Professional property management system for managing properties, tenants, transactions, bookings, and analytics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ServerProviders>
          <Toaster position="top-right" richColors />
          {children}
        </ServerProviders>
      </body>
    </html>
  );
}
