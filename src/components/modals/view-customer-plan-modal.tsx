"use client";

import { useEffect } from "react";

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
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["subscriptions", "customerPlan", planId],
    queryFn: () => {
      if (planId == null) return null;
      return AdminSubscriptionsService.getCustomerPlanById(planId);
    },
    enabled: planId != null && open,
  });

  useEffect(() => {
    if (open && planId != null) {
      refetch();
    }
  }, [open, planId, refetch]);

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
      size="lg"
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
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="flex gap-2 mt-2 items-center flex-wrap">
                    <code className="text-xs text-gray-500 bg-white px-2 py-1 rounded border shadow-sm">
                      Code: {plan.code}
                    </code>
                    {plan.sort_order !== undefined && (
                      <code className="text-xs text-gray-500 bg-white px-2 py-1 rounded border shadow-sm">
                        Sort Order: {plan.sort_order}
                      </code>
                    )}
                    {plan.plan_id !== undefined && (
                      <code className="text-xs text-gray-500 bg-white px-2 py-1 rounded border shadow-sm">
                        ID: {plan.plan_id}
                      </code>
                    )}
                  </div>
                </div>
                <Badge
                  className={
                    plan.is_active
                      ? "bg-green-100 text-green-700 shadow-sm border-0"
                      : "bg-gray-200 text-gray-700 shadow-sm border-0"
                  }
                >
                  {plan.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                  {plan.price} {plan.currency}
                </span>
                <span className="text-sm font-medium text-gray-500 ml-1">
                  /{plan.interval}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 mt-4 border-t border-gray-200 pt-4">
                <strong className="text-gray-900 block mb-1">Description</strong>
                {plan.description || "No description provided."}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                Included Features
              </h4>
              <ul className="space-y-4 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                {Array.isArray(plan?.features) && plan.features.length > 0 ? (
                  plan.features.map((feature: any, idx: number) => (
                    <li key={idx} className="flex flex-col gap-1.5 border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full border ${feature.enabled ? 'border-teal-200 bg-teal-50 text-teal-600' : 'border-gray-200 bg-gray-50 text-gray-400'}`}>
                          <Check className="w-4 h-4" />
                        </div>
                        <span className={`font-semibold text-base ${feature.enabled ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
                          {feature.name || feature.code}
                        </span>
                        {!feature.enabled && (
                          <Badge variant="outline" className="text-[10px] uppercase px-1.5 py-0">Disabled</Badge>
                        )}
                      </div>
                      
                      {feature.description && (
                        <p className={`text-sm ml-9 ${feature.enabled ? 'text-gray-500' : 'text-gray-400'}`}>
                          {feature.description}
                        </p>
                      )}
                      
                      {(feature.limit !== null || feature.unit !== null) && feature.enabled && (
                        <div className="flex gap-3 text-xs text-gray-500 ml-9 mt-1 bg-gray-50 w-fit px-2 py-1 rounded-md border border-gray-100">
                          {feature.limit !== null && feature.limit !== undefined && (
                            <span>Limit: <strong className="text-gray-900">{feature.limit}</strong></span>
                          )}
                          {feature.unit !== null && feature.unit !== undefined && (
                            <span>Unit: <strong className="text-gray-900">{feature.unit}</strong></span>
                          )}
                        </div>
                      )}
                    </li>
                  ))
                ) : featuresList.length > 0 ? (
                  featuresList.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full border border-teal-200 bg-teal-50">
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                      </div>
                      {feature}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-400 italic text-center py-2">No features available.</li>
                )}
              </ul>
            </div>

            <div className="flex justify-between text-xs text-gray-400 border-t pt-4 px-1">
              {plan.created_at && <span>Created: {new Date(plan.created_at).toLocaleDateString()}</span>}
              {plan.updated_at && <span>Updated: {new Date(plan.updated_at).toLocaleDateString()}</span>}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
