import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  totalItems?: number;
  actionButtonText?: string;
  onActionClick?: () => void;
  actionIcon?: React.ReactNode;
}

export function PageHeader({
  title,
  totalItems,
  actionButtonText,
  onActionClick,
  actionIcon = <Plus className="h-4 w-4" />,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {totalItems !== undefined && (
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-700 border-purple-200 rounded-full px-2"
          >
            {totalItems}
          </Badge>
        )}
      </div>
      {actionButtonText && onActionClick && (
        <div className="flex items-center gap-2">
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
            onClick={onActionClick}
          >
            {actionIcon}
            {actionButtonText}
          </Button>
        </div>
      )}
    </div>
  );
}
