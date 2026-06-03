"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { AdminActivityService } from "../services/AdminActivityService";
import { Loader2 } from "lucide-react";

interface ActivityDetailsModalProps {
  activityId: number | null;
  onClose: () => void;
}

export function ActivityDetailsModal({
  activityId,
  onClose,
}: ActivityDetailsModalProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["activity", activityId],
    queryFn: () =>
      activityId
        ? AdminActivityService.getActivityLog(activityId)
        : Promise.reject("No ID"),
    enabled: !!activityId,
  });

  return (
    <Dialog open={!!activityId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-white max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Activity Details
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
            </div>
          ) : isError ? (
            <p className="text-red-600 text-sm py-4">
              Failed to load activity details.
            </p>
          ) : data ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">User</h4>
                  <p className="text-sm font-semibold text-gray-900">
                    {data.user_name}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Date & Time
                  </h4>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(data.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Action</h4>
                  <p className="text-sm font-semibold text-gray-900">
                    {data.action}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Entity</h4>
                  <p className="text-sm font-semibold text-gray-900">
                    {data.entity_type} {data.entity_id ? `(ID: ${data.entity_id})` : ""}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">IP Address</h4>
                  <p className="text-sm font-semibold text-gray-900">
                    {data.ip_address || "N/A"}
                  </p>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-gray-500">User Agent</h4>
                  <p className="text-sm font-semibold text-gray-900 break-words">
                    {data.user_agent || "N/A"}
                  </p>
                </div>
              </div>

              {data.old_values && Object.keys(data.old_values).length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Old Values
                  </h4>
                  <pre className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(data.old_values, null, 2)}
                  </pre>
                </div>
              )}

              {data.new_values && Object.keys(data.new_values).length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    New Values
                  </h4>
                  <pre className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(data.new_values, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}