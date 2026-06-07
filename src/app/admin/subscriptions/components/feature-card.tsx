import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

export function FeatureCard({
  feature,
  isSelected,
  onSelect,
  onDelete,
  isDeleting,
}: {
  feature: any;
  isSelected: boolean;
  onSelect: (featureId: number) => void;
  onDelete: (featureId: number) => void;
  isDeleting: boolean;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    onDelete(feature.badge_id);
    setDialogOpen(false);
  };

  return (
    <Card
      className={`relative border transition-all duration-200 ${
        isSelected
          ? "border-teal-500 ring-2 ring-teal-500/20"
          : "hover:border-teal-500"
      }`}
    >
      {isSelected && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <Badge className="bg-teal-600 text-white">Selected</Badge>
        </div>
      )}

      <div className="absolute top-3 right-3 z-10 flex gap-1">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Delete Feature
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this feature? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <p className="font-medium text-gray-900">{feature.name}</p>
                <p className="text-sm text-gray-500">
                  {feature.code} • {feature.applies_to}
                </p>
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
                    Delete Feature
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div
        className="p-6 pt-12 cursor-pointer"
        onClick={() => onSelect(feature.badge_id)}
      >
        <h3 className="font-bold text-lg text-gray-900">{feature.name}</h3>
        <code className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded mt-2 inline-block">
          {feature.code}
        </code>
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-sm text-gray-500">Applies to:</span>
          <Badge variant="secondary" className="bg-teal-50 text-teal-700">
            {feature.applies_to}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
