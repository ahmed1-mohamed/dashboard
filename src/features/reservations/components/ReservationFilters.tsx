import React, { memo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReservationFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  countryFilter: string;
  onCountryChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
  expiryDateFilter: string;
  onExpiryDateChange: (value: string) => void;
  children?: React.ReactNode;
}

export const ReservationFilters = memo(function ReservationFilters({
  searchQuery,
  onSearchChange,
  countryFilter,
  onCountryChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  expiryDateFilter,
  onExpiryDateChange,
  children,
}: ReservationFiltersProps) {
  return (
    <div className="flex items-center justify-between gap-4 w-full flex-wrap">
      <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
        {/* Search */}
        <div className="relative w-full min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search for reservations"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white border-gray-200"
          />
        </div>

        {/* Country Filter */}
        <Select value={countryFilter} onValueChange={onCountryChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            <SelectItem value="UAE">UAE</SelectItem>
            <SelectItem value="Egypt">Egypt</SelectItem>
            <SelectItem value="Oman">Oman</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Under Review">Under Review</SelectItem>
            <SelectItem value="Sales Offer">Sales Offer</SelectItem>
            <SelectItem value="Down Payment">Down Payment</SelectItem>
            <SelectItem value="Sales Agreement">Sales Agreement</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        {/* Type Filter */}
        <Select value={typeFilter} onValueChange={onTypeChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="1 Bedroom Apartment">1 Bedroom</SelectItem>
            <SelectItem value="2 Bedroom Apartment">2 Bedroom</SelectItem>
            <SelectItem value="3 Bedroom Apartment">3 Bedroom</SelectItem>
            <SelectItem value="Penthouse">Penthouse</SelectItem>
          </SelectContent>
        </Select>

        {/* Expiry Date Filter */}
        <Select value={expiryDateFilter} onValueChange={onExpiryDateChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Expiry Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Expiry Dates</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="no_expiry">No Expiry Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {children && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {children}
        </div>
      )}
    </div>
  );
});
