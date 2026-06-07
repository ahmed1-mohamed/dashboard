"use client";

import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface ViewDeveloperPackageModalProps {
  open: boolean;
  onClose: () => void;
  packageData: any | null;
}

export default function ViewDeveloperPackageModal({
  open,
  onClose,
  packageData: pkg,
}: ViewDeveloperPackageModalProps) {
  if (!pkg) return null;

  const parsedPrice = typeof pkg.price === 'string' 
    ? Number(pkg.price.replace(/,/g, '')) 
    : (pkg.price !== undefined ? pkg.price : (pkg.price_cents ? pkg.price_cents / 100 : 0));
  
  const isActive = pkg.status !== undefined ? pkg.status : pkg.is_active;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Developer Package Details"
      size="md"
    >
      <div className="py-4">
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{pkg.name}</h3>
                <div className="flex gap-2 mt-2 items-center flex-wrap">
                  <code className="text-xs text-gray-500 bg-white px-2 py-1 rounded border shadow-sm">
                    Code: {pkg.code}
                  </code>
                  {pkg.sort_order !== undefined && (
                    <code className="text-xs text-gray-500 bg-white px-2 py-1 rounded border shadow-sm">
                      Sort Order: {pkg.sort_order}
                    </code>
                  )}
                  {pkg.id !== undefined && (
                    <code className="text-xs text-gray-500 bg-white px-2 py-1 rounded border shadow-sm">
                      ID: {pkg.id}
                    </code>
                  )}
                </div>
              </div>
              <Badge
                className={
                  isActive
                    ? "bg-green-100 text-green-700 shadow-sm border-0"
                    : "bg-gray-200 text-gray-700 shadow-sm border-0"
                }
              >
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="flex items-baseline gap-1 mt-4">
              <span className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#A855F7] to-purple-400">
                {pkg.currency || "AED"} {parsedPrice.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
              <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full border border-teal-200 bg-teal-50 text-teal-600">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-gray-700 font-medium text-lg">
                {pkg.credits?.toLocaleString() || 0} Credits
              </span>
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-400 border-t pt-4 px-1">
            {pkg.created_at && <span>Created: {new Date(pkg.created_at).toLocaleDateString()}</span>}
            {pkg.updated_at && <span>Updated: {new Date(pkg.updated_at).toLocaleDateString()}</span>}
          </div>
        </div>
      </div>
    </Modal>
  );
}
