"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react";

interface TableActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  customActions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: "default" | "destructive";
  }>;
}

export function TableActions({
  onView,
  onEdit,
  onDelete,
  customActions,
}: TableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {onView && (
          <DropdownMenuItem onClick={onView} className="gap-2">
            <Eye className="h-4 w-4" />
            View
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={onEdit} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        {customActions?.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={action.onClick}
            className={`gap-2 ${
              action.variant === "destructive" ? "text-red-600" : ""
            }`}
          >
            {action.icon}
            {action.label}
          </DropdownMenuItem>
        ))}
        {(onView || onEdit || customActions) && onDelete && (
          <DropdownMenuSeparator />
        )}
        {onDelete && (
          <DropdownMenuItem
            onClick={onDelete}
            className="gap-2 text-red-600 focus:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
