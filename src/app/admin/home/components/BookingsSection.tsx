"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, ChevronRight } from "lucide-react";
import { type Booking } from "../types";

interface BookingsSectionProps {
  bookings: Booking[];
}

export function BookingsSection({ bookings }: BookingsSectionProps) {
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("last7days");

  // Filter bookings based on stage
  const filteredBookings = bookings.filter((booking) => {
    if (stageFilter === "all") return true;
    // Map dropdown values to status strings if needed. Assuming status is case-insensitive match
    return booking.status.toLowerCase() === stageFilter.toLowerCase();
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            In Progress Bookings
          </h3>
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Stage Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Stage Filter (All)</SelectItem>
            <SelectItem value="Sales Offer">Sales Offer</SelectItem>
            <SelectItem value="Down payment">Down payment</SelectItem>
            <SelectItem value="Sales Purchase">Sales Purchase</SelectItem>
            <SelectItem value="Identification">Identification</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-medium">
                    {booking.avatar}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">
                    {booking.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {booking.property} - {booking.unit}
                  </div>
                  <div className="text-xs text-gray-500">
                    {booking.lastUpdated}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {booking.amount}
                  </div>
                  <div className="text-sm text-orange-600">
                    {booking.status}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            No bookings found for the selected stage.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last7days">Last 7 days</SelectItem>
            <SelectItem value="last30days">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" className="gap-2 text-gray-600">
          View Bookings
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
