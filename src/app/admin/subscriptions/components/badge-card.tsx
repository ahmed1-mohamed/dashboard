import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2, Edit, Eye, MoreHorizontal, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function BadgeCard({
  badge,
  onView,
  onEdit,
  onDelete,
  isDeleting,
}: {
  badge: any;
  onView: (badge: any) => void;
  onEdit: (badge: any) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    onDelete(badge.id || badge.badge_id);
    setDialogOpen(false);
  };
  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-lg rounded-xl bg-white overflow-hidden flex flex-col transition-all duration-300">
      <CardContent className="p-5 flex-1 flex flex-col">
        {/* Header Row */}
        <div className="flex justify-between items-start mb-2">
          <button
            onClick={() => onView(badge)}
            className="text-xl text-gray-900 font-medium tracking-tight hover:text-teal-600 transition-colors no-underline text-left outline-none focus:text-teal-600 group-hover:text-teal-600"
          >
            {badge.name}
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-gray-500 hover:text-gray-900 rounded-full">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-lg border-gray-100">
              <DropdownMenuItem className="gap-2 cursor-pointer rounded-lg m-1" onSelect={(e) => { e.preventDefault(); onView(badge); }}>
                <Eye className="w-4 h-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer rounded-lg m-1" onSelect={(e) => { e.preventDefault(); onEdit(badge); }}>
                <Edit className="w-4 h-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 rounded-lg m-1" onSelect={(e) => { e.preventDefault(); setDialogOpen(true); }}>
                <Trash2 className="w-4 h-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Credits */}
        <div className="mb-4">
          <span className="text-[#A855F7] font-semibold text-lg">
            {(badge.monthly_price_credits || badge.price_credits || 0).toLocaleString()} Credits
          </span>
        </div>

        {/* Description / Location */}
        <div className="text-sm text-gray-500 mb-6">
          {badge.placement ? (
            <span>
              {badge.placement.location} {badge.placement.format ? `(${badge.placement.format})` : ""}
            </span>
          ) : (
            <span>Global Placement</span>
          )}
        </div>

        <div className="mt-auto">
          {/* Divider */}
          <div className="border-t border-gray-100 mb-4" />

          {/* Status Row */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Status</span>
            <Badge
              className={
                badge.is_active
                  ? "bg-green-100 text-green-700 hover:bg-green-100 rounded-md px-2 py-0.5 text-xs font-medium border-0 shadow-none"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-100 rounded-md px-2 py-0.5 text-xs font-medium border-0 shadow-none"
              }
            >
              {badge.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Delete Feature
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete <strong>{badge.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Feature"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
