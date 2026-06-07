import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, AlertTriangle, Loader2, MoreHorizontal, Edit, Eye } from "lucide-react";

export function PackageCard({
  pkg,
  isBestValue,
  onView,
  onEdit,
  onDelete,
  isDeleting,
}: {
  pkg: any;
  isBestValue: boolean;
  onView: (pkg: any) => void;
  onEdit: (pkg: any) => void;
  onDelete: (packageId: number) => void;
  isDeleting: boolean;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    onDelete(pkg.id);
    setDialogOpen(false);
  };

  const parsedPrice = typeof pkg.price === 'string' 
    ? Number(pkg.price.replace(/,/g, '')) 
    : (pkg.price !== undefined ? pkg.price : (pkg.price_cents ? pkg.price_cents / 100 : 0));
  
  const isActive = pkg.status !== undefined ? pkg.status : pkg.is_active;
  const subscribers = pkg.subscribers || 0;

  return (
    <>
      <Card className="border border-gray-200 shadow-sm hover:shadow-xl rounded-xl bg-white overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 group">
        <CardContent className="p-5 flex-1 flex flex-col">
          {/* Header Row */}
          <div className="flex justify-between items-start">
            <div>
              <button 
                onClick={() => onView(pkg)}
                className="text-xl text-gray-800 font-medium group-hover:text-teal-600 transition-colors no-underline text-left outline-none focus:text-teal-600"
              >
                {pkg.name}
              </button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-gray-500 hover:text-gray-900 rounded-full">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-lg border-gray-100">
                <DropdownMenuItem className="gap-2 cursor-pointer rounded-lg m-1" onSelect={(e) => { e.preventDefault(); onView(pkg); }}>
                  <Eye className="w-4 h-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer rounded-lg m-1" onSelect={(e) => { e.preventDefault(); onEdit(pkg); }}>
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

          {/* Price & Credits Row */}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[#A855F7] font-semibold text-lg">
              {pkg.currency || "AED"} {parsedPrice.toLocaleString()}
            </span>
            <span className="text-gray-500 text-sm">
              {pkg.credits?.toLocaleString() || 0} Credits
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-4" />

          {/* Subscribers */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-500">Subscribers</span>
            <span className="text-sm text-gray-800">{subscribers}</span>
          </div>

          {/* Status */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Status</span>
            <Badge
              className={
                isActive
                  ? "bg-green-100 text-green-700 hover:bg-green-100 rounded-md px-2 py-0.5 text-xs font-medium border-0 shadow-none"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-100 rounded-md px-2 py-0.5 text-xs font-medium border-0 shadow-none"
              }
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Package
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this package? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <p className="font-medium text-gray-900">{pkg.name}</p>
              <p className="text-sm text-gray-500">
                {pkg.code} • {pkg.currency || "AED"} {pkg.price} • {pkg.credits?.toLocaleString() || 0}{" "}
                Credits
              </p>
              {subscribers > 0 && (
                <p className="text-sm text-amber-600">
                  Warning: This package has {subscribers} subscriber(s)
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Package
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
