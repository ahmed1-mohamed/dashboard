"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface OffersPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  getPageNumbers: () => (number | string)[];
}

export function OffersPagination({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  itemsPerPage,
  onPageChange,
  getPageNumbers,
}: OffersPaginationProps) {
  const from = totalItems > 0 ? Math.max(startIndex + 1, 1) : 0;
  const to = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
        Showing{" "}
        <span className="font-medium text-gray-900">{from}–{to}</span>
        {" "}of{" "}
        <span className="font-medium text-gray-900">{totalItems}</span>
      </p>

      <div className="flex items-center gap-1 order-1 sm:order-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((pageNum, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              onClick={() => typeof pageNum === "number" && onPageChange(pageNum)}
              disabled={pageNum === "..." || pageNum === currentPage}
              className={`h-8 min-w-[2rem] px-2 text-xs ${pageNum === currentPage
                ? "border-teal-600 text-teal-600 font-bold bg-teal-50 hover:bg-teal-50"
                : "text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
            >
              {pageNum}
            </Button>
          ))}
        </div>

        <span className="sm:hidden text-xs text-gray-600 px-2">
          {currentPage} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}