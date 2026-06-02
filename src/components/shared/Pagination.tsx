import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  perPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: string) => void;
  perPageOptions?: string[];
  isLoading?: boolean;
  currentItemsCount?: number;
}

export function Pagination({
  page,
  totalPages,
  perPage,
  totalItems,
  onPageChange,
  onPerPageChange,
  perPageOptions = ["10", "15", "20", "50", "100"],
  isLoading = false,
  currentItemsCount,
}: PaginationProps) {
  // If the current page didn't fetch a full page of items, there is no next page!
  const effectiveTotalPages =
    currentItemsCount !== undefined && currentItemsCount < perPage
      ? page
      : totalPages;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 10;

    if (effectiveTotalPages <= maxVisible) {
      for (let i = 1; i <= effectiveTotalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (page > 3) {
        pages.push("...");
      }
      let start = Math.max(2, page - 2);
      let end = Math.min(effectiveTotalPages - 1, page + 2);
      if (page <= 3) {
        start = 2;
        end = Math.min(maxVisible - 2, effectiveTotalPages - 1);
      }
      if (page >= effectiveTotalPages - 2) {
        start = Math.max(2, effectiveTotalPages - maxVisible + 2);
        end = effectiveTotalPages - 1;
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (page < effectiveTotalPages - 2) {
        pages.push("...");
      }
      pages.push(effectiveTotalPages);
    }
    return pages;
  };

  const startIndex = (page - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, totalItems);

  if (effectiveTotalPages <= 1 && totalItems === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Show</span>
        <Select
          value={perPage.toString()}
          onValueChange={onPerPageChange}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[70px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {perPageOptions.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500">
          Showing {totalItems > 0 ? startIndex + 1 : 0}-{endIndex} of {totalItems} results
        </span>
      </div>

      {effectiveTotalPages > 1 && (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1 || isLoading}
            className="h-8 w-8 border-gray-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {getPageNumbers().map((pageNum, index) =>
            typeof pageNum === "number" ? (
              <Button
                key={index}
                variant={page === pageNum ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(pageNum)}
                disabled={isLoading}
                className={
                  page === pageNum
                    ? "h-8 w-8 bg-gray-900 hover:bg-gray-800 text-white"
                    : "h-8 w-8 border-gray-200"
                }
              >
                {pageNum}
              </Button>
            ) : (
              <span key={index} className="px-1 text-gray-400">
                {pageNum}
              </span>
            ),
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(Math.min(effectiveTotalPages, page + 1))}
            disabled={page === effectiveTotalPages || effectiveTotalPages === 0 || isLoading}
            className="h-8 w-8 border-gray-200"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
