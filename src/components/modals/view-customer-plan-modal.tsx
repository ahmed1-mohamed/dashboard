"use client";

import { useQuery } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check } from "lucide-react";
import { AdminSubscriptionsService } from "@/services/AdminSubscriptionsService";

interface ViewCustomerPlanModalProps {
  open: boolean;
  onClose: () => void;
  planId: number | string | null;
}

export default function ViewCustomerPlanModal({
  open,
  onClose,
  planId,
}: ViewCustomerPlanModalProps) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["subscriptions", "customerPlan", planId],
    queryFn: () => {
      if (planId == null) return null;
      return AdminSubscriptionsService.getCustomerPlanById(planId);
    },
    enabled: planId != null && open,
  });

  const responsePayload = (data as any)?.data || data;
  const plan = responsePayload?.data || responsePayload || null;

  const featuresList: string[] = [];
  if (Array.isArray(plan?.features)) {
    plan.features.forEach((feature: any) => {
      if (feature.enabled) {
        let label = feature.name || feature.code;
        if (feature.limit) {
          label += ` (Limit: ${feature.limit})`;
        }
        featuresList.push(label);
      }
    });
  } else if (plan?.features) {
    Object.entries(plan.features).forEach(([key, value]) => {
      let formattedKey = key
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      if (key === 'map_filters') formattedKey = 'Map & Filters';
      if (key === 'chat_support') formattedKey = 'Chat & Support';

      let label = formattedKey;
      if (typeof value === 'boolean') {
        if (!value) return;
      } else if (value !== null && value !== '') {
        label = `${formattedKey} (${value})`;
      }
      featuresList.push(label);
    });
  }

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Plan Details"
      size="md"
    >
      <div className="py-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-4" />
            <p className="text-gray-500">Loading plan details...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500 mb-2">Failed to load plan details.</p>
            <p className="text-sm text-gray-500 text-center">
              {error instanceof Error ? error.message : "Unknown error occurred"}
            </p>
          </div>
        ) : !plan ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500">No data available.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <code className="text-sm text-gray-500">{plan.code}</code>
                </div>
                <Badge
                  className={
                    plan.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }
                >
                  {plan.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-3xl font-extrabold text-gray-900">
                  {plan.price} {plan.currency}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  /{plan.interval}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mt-3 border-t pt-3">
                {plan.description || "No description provided."}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                Included Features
              </h4>
              <ul className="space-y-3 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                {featuresList.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full border border-teal-500 bg-teal-50">
                      <Check className="w-3.5 h-3.5 text-teal-600" />
                    </div>
                    {feature}
                  </li>
                ))}
                {featuresList.length === 0 && (
                  <li className="text-sm text-gray-400 italic">No features available.</li>
                )}
              </ul>
            </div>

            <div className="flex justify-between text-xs text-gray-400 border-t pt-4">
              <span>Created: {new Date(plan.created_at).toLocaleDateString()}</span>
              <span>Updated: {new Date(plan.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
