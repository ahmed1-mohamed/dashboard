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
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={platformFilter} onValueChange={onPlatformChange}>
          <SelectTrigger className="w-[160px] border-gray-200 bg-white shadow-sm">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="google">Google</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
            <SelectItem value="snapchat">Snapchat</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="twitter">Twitter</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={onTypeChange}>
          <SelectTrigger className="w-[140px] border-gray-200 bg-white shadow-sm">
            <SelectValue placeholder="Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Formats</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="carousel">Carousel</SelectItem>
            <SelectItem value="story">Story</SelectItem>
            <SelectItem value="reels">Reels</SelectItem>
            <SelectItem value="text">Text</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
