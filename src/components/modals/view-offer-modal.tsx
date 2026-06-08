"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/modal";
import { Loader2 } from "lucide-react";
import { AdminOffersService } from "@/services/AdminOffersService";
import { Badge } from "@/components/ui/badge";

interface ViewOfferModalProps {
  open: boolean;
  onClose: () => void;
  offerId: number | string | null;
}

export default function ViewOfferModal({
  open,
  onClose,
  offerId,
}: ViewOfferModalProps) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["offerDetails", offerId],
    queryFn: () => AdminOffersService.getOffer(offerId!.toString(), token as string),
    enabled: open && !!offerId && !!token,
  });

  const offer = (response as any)?.data?.data || (response as any)?.data || null;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="View Offer Details"
      size="md"
    >
      <div className="space-y-4 max-h-[75vh] overflow-y-auto px-1 pb-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-4" />
            <p>Loading offer details...</p>
          </div>
        ) : isError ? (
          <div className="py-10 text-center text-red-500">
            Failed to load offer details.
          </div>
        ) : !offer ? (
          <div className="py-10 text-center text-gray-500">
            No details available.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Title Section */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-900">{offer.offer_details || "Unnamed Offer"}</h2>
              {offer.description && (
                <p className="text-sm text-gray-500 mt-1">{offer.description}</p>
              )}
            </div>

            {/* Grid details */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                <Badge
                  variant={offer.is_active ? "success" : "secondary"}
                  className={
                    offer.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {offer.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Linked To</p>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 capitalize">{offer.linked_type || "-"}</span>
                  <span className="font-medium text-gray-900">{offer.linked_name || "-"}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Discount Type</p>
                <p className="font-medium text-gray-900 capitalize">{offer.discount_type?.replace(/_/g, " ") || "-"}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Discount Details</p>
                <p className="font-medium text-gray-900">{offer.discount || offer.discount_pct ? `${offer.discount_pct}%` : "-"}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Valid From</p>
                <p className="font-medium text-gray-900">
                  {offer.valid_from ? new Date(offer.valid_from).toLocaleDateString() : "-"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Valid Until</p>
                <p className="font-medium text-gray-900">
                  {offer.valid_to ? new Date(offer.valid_to).toLocaleDateString() : "-"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Clicks</p>
                <p className="font-medium text-gray-900">{offer.clicks?.toLocaleString() || 0}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Views</p>
                <p className="font-medium text-gray-900">{offer.views?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
