"use client";

import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface ViewBadgeModalProps {
  open: boolean;
  onClose: () => void;
  badgeData: any | null;
}

export default function ViewBadgeModal({
  open,
  onClose,
  badgeData: badge,
}: ViewBadgeModalProps) {
  if (!badge) return null;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Feature / Badge Details"
      size="md"
    >
      <div className="py-4">
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{badge.name}</h3>
                <div className="flex gap-2 mt-2 items-center flex-wrap">
                  <code className="text-xs text-gray-500 bg-white px-2 py-1 rounded border shadow-sm">
                    Code: {badge.code}
                  </code>
                  <code className="text-xs text-gray-500 bg-white px-2 py-1 rounded border shadow-sm">
                    Applies to: {badge.applies_to}
                  </code>
                  {badge.id !== undefined && (
                    <code className="text-xs text-gray-500 bg-white px-2 py-1 rounded border shadow-sm">
                      ID: {badge.id}
                    </code>
                  )}
                </div>
              </div>
              <Badge
                className={
                  badge.is_active
                    ? "bg-green-100 text-green-700 shadow-sm border-0"
                    : "bg-gray-200 text-gray-700 shadow-sm border-0"
                }
              >
                {badge.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="flex items-baseline gap-1 mt-4">
              <span className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#A855F7] to-purple-400">
                {(badge.monthly_price_credits || badge.price_credits || 0).toLocaleString()} Credits
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full border border-teal-200 bg-teal-50 text-teal-600">
                  <Check className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Max Entities</span>
                  <span className="text-gray-700 font-medium text-sm">
                    {badge.max_entities || "Unlimited"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full border border-amber-200 bg-amber-50 text-amber-600">
                  <Check className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Priority Boost</span>
                  <span className="text-gray-700 font-medium text-sm">
                    {badge.priority_boost || "None"}
                  </span>
                </div>
              </div>
            </div>

            {badge.placement && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">UI Placement Configuration</h4>
                <div className="grid grid-cols-3 gap-2 text-sm bg-white p-3 rounded-lg border border-gray-100">
                  <div>
                    <span className="block text-xs text-gray-500">Platform</span>
                    <span className="font-medium text-gray-800 capitalize">{badge.placement.platform}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500">Format</span>
                    <span className="font-medium text-gray-800 capitalize">{badge.placement.format}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500">Location</span>
                    <span className="font-medium text-gray-800">{badge.placement.location}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between text-xs text-gray-400 border-t pt-4 px-1">
            {badge.created_at && <span>Created: {new Date(badge.created_at).toLocaleDateString()}</span>}
            {badge.updated_at && <span>Updated: {new Date(badge.updated_at).toLocaleDateString()}</span>}
          </div>
        </div>
      </div>
    </Modal>
  );
}
