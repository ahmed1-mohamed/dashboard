"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Tag } from "lucide-react";
import { OfferTableRow } from "@/features/offers/components/OfferTableRow";
import type { Offer } from "@/features/offers/types";

export interface OffersTableProps {
  offers: Offer[];
  selectedOffers: string[];
  updatingOfferId: string | null;
  isColVisible: (col: string) => boolean;
  handleSelectAll: (checked: boolean) => void;
  handleSelectOne: (id: string, checked: boolean) => void;
  handleStatusToggle: (offer: Offer, checked: boolean) => void;
  onDeleteClick: (offer: Offer) => void;
  onViewClick: (offer: Offer) => void;
  onEditClick: (offer: Offer) => void;
}

export function OffersTable({
  offers,
  selectedOffers,
  updatingOfferId,
  isColVisible,
  handleSelectAll,
  handleSelectOne,
  handleStatusToggle,
  onDeleteClick,
  onViewClick,
  onEditClick,
}: OffersTableProps) {
  const allSelected = offers.length > 0 && selectedOffers.length === offers.length;

  if (offers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <Tag className="h-10 w-10 mb-3 opacity-30" />
        <p className="text-sm font-medium">No offers found</p>
        <p className="text-xs mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table className="w-full table-fixed">
        <colgroup>
          <col className="w-10" />
          <col className="w-[22%] min-w-[150px]" />
          {isColVisible("linked_to") && <col className="w-[18%] min-w-[130px]" />}
          {isColVisible("type") && <col className="w-[12%] min-w-[100px]" />}
          {isColVisible("discount") && <col className="w-[10%] min-w-[80px]" />}
          {isColVisible("validity") && <col className="w-[14%] min-w-[110px]" />}
          {isColVisible("clicks") && <col className="w-[7%] min-w-[60px]" />}
          {isColVisible("views") && <col className="w-[7%] min-w-[60px]" />}
          {isColVisible("status") && <col className="w-[8%] min-w-[70px]" />}
          <col className="w-12" />
        </colgroup>

        <TableHeader>
          <TableRow className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200">
            <TableHead className="px-3">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(v) => handleSelectAll(v as boolean)}
              />
            </TableHead>
            <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wide truncate">
              Offer Details
            </TableHead>
            {isColVisible("linked_to") && (
              <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wide truncate">
                Linked To
              </TableHead>
            )}
            {isColVisible("type") && (
              <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wide truncate">
                Type
              </TableHead>
            )}
            {isColVisible("discount") && (
              <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wide truncate">
                Discount
              </TableHead>
            )}
            {isColVisible("validity") && (
              <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wide truncate">
                Validity
              </TableHead>
            )}
            {isColVisible("clicks") && (
              <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wide text-right truncate">
                Clicks
              </TableHead>
            )}
            {isColVisible("views") && (
              <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wide text-right truncate">
                Views
              </TableHead>
            )}
            {isColVisible("status") && (
              <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wide truncate">
                Status
              </TableHead>
            )}
            <TableHead className="sticky right-0 bg-gray-50/70 border-l border-gray-100" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {offers.map((offer, index) => (
            <OfferTableRow
              key={offer.offer_id ?? index}
              offer={offer}
              index={index}
              isSelected={selectedOffers.includes(String(offer.offer_id ?? offer.id))}
              isUpdating={updatingOfferId === String(offer.offer_id)}
              isColVisible={isColVisible}
              onSelect={handleSelectOne}
              onStatusToggle={handleStatusToggle}
              onView={onViewClick}
              onEdit={onEditClick}
              onDelete={onDeleteClick}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}