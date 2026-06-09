"use client";

import { TableSettings } from "@/components/table/table-settings";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface OffersPageHeaderProps {
  tableSettings: any;
  onExportExcel: () => void;
  onExportPdf: () => void;
  onCreateClick: () => void;
}

export function OffersPageHeader({
  tableSettings,
  onExportExcel,
  onExportPdf,
  onCreateClick,
}: OffersPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Offers</h1>
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
        <TableSettings
          settings={tableSettings}
          onExportExcel={onExportExcel}
          onExportPdf={onExportPdf}
        />
        <Button
          className="bg-teal-600 hover:bg-teal-700 text-white gap-2 text-sm flex-1 sm:flex-none"
          onClick={onCreateClick}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden xs:inline">Create Offer</span>
          <span className="xs:hidden">Create</span>
        </Button>
      </div>
    </div>
  );
}
