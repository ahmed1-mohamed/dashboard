"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdsFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  platformFilter: string;
  onPlatformChange: (val: string) => void;
  typeFilter: string;
  onTypeChange: (val: string) => void;
}

export function AdsFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  platformFilter,
  onPlatformChange,
  typeFilter,
  onTypeChange,
}: AdsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 flex-1">
      <div className="relative flex-1 min-w-[300px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by Ad Name or Location..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 border-gray-200 focus-visible:ring-teal-500 w-full bg-white shadow-sm"
        />
      </div>

      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[140px] border-gray-200 bg-white shadow-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="ended">Ended</SelectItem>
          </SelectContent>
        </Select>

        <Select value={platformFilter} onValueChange={onPlatformChange}>
          <SelectTrigger className="w-[160px] border-gray-200 bg-white shadow-sm">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="mobile">Mobile App Only</SelectItem>
            <SelectItem value="web">Web</SelectItem>
            <SelectItem value="android">Android</SelectItem>
            <SelectItem value="ios">IOS</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={onTypeChange}>
          <SelectTrigger className="w-[140px] border-gray-200 bg-white shadow-sm">
            <SelectValue placeholder="Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Formats</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="banner">Banner</SelectItem>
            <SelectItem value="native">Native</SelectItem>
            <SelectItem value="pop_up">Pop-up</SelectItem>
            <SelectItem value="slider">Slider</SelectItem>
            <SelectItem value="half_page">Half Page</SelectItem>
            <SelectItem value="full_page">Full Page</SelectItem>
            <SelectItem value="badge">Badge</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
