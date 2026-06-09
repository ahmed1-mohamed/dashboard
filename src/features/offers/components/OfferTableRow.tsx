"use client";

import { memo } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { OfferRowActions } from "@/features/offers/components/OfferRowActions";
import {
  offerName,
  offerDiscount,
  offerDiscountType,
  formatDate,
} from "@/features/offers/components/offer-table-helpers";
import type { Offer } from "@/features/offers/types";

export interface OfferTableRowProps {
  offer: Offer;
  index: number;
  isSelected: boolean;
  isUpdating: boolean;
  isColVisible: (col: string) => boolean;
  onSelect: (id: string, checked: boolean) => void;
  onStatusToggle: (o: Offer, checked: boolean) => void;
  onView: (o: Offer) => void;
  onEdit: (o: Offer) => void;
  onDelete: (o: Offer) => void;
}

export const OfferTableRow = memo(function OfferTableRow({
  offer,
  isSelected,
  isUpdating,
  isColVisible,
  onSelect,
  onStatusToggle,
  onView,
  onEdit,
  onDelete,
}: OfferTableRowProps) {
  const id = String(offer.offer_id ?? offer.id);
  const name = offerName(offer);
  const linkedName = offer.linked_name || "—";
  const validFrom = formatDate(offer.valid_from || offer.starts_at);
  const validTo = formatDate(offer.valid_to || offer.ends_at);

  return (
    <TableRow className="hover:bg-gray-50/70 transition-colors">
      <TableCell className="px-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(v) => onSelect(id, v as boolean)}
        />
      </TableCell>

      <TableCell className="max-w-0">
        <div className="flex flex-col gap-0.5 overflow-hidden">
          <button
            onClick={() => onView(offer)}
            className="font-semibold text-gray-900 text-sm hover:text-teal-600 text-left truncate w-full cursor-pointer transition-colors"
            title={name}
          >
            {name}
          </button>
          {offer.description && (
            <span
              className="text-xs text-gray-400 truncate"
              title={offer.description}
            >
              {offer.description}
            </span>
          )}
        </div>
      </TableCell>

      {isColVisible("linked_to") && (
        <TableCell className="max-w-0">
          <div className="flex flex-col gap-0.5 overflow-hidden">
            <span className="text-xs text-gray-400 capitalize truncate">
              {offer.linked_type || "—"}
            </span>
            <span
              className="text-sm text-gray-700 font-medium truncate"
              title={linkedName}
            >
              {linkedName}
            </span>
          </div>
        </TableCell>
      )}

      {isColVisible("type") && (
        <TableCell
          className="text-sm text-gray-600 truncate max-w-0"
          title={offerDiscountType(offer)}
        >
          {offerDiscountType(offer)}
        </TableCell>
      )}

      {isColVisible("discount") && (
        <TableCell
          className="text-sm font-semibold text-gray-900 truncate max-w-0"
          title={offerDiscount(offer)}
        >
          {offerDiscount(offer)}
        </TableCell>
      )}

      {isColVisible("validity") && (
        <TableCell className="max-w-0">
          <div className="flex flex-col gap-0.5 text-xs text-gray-600">
            <span className="truncate" title={validFrom}>{validFrom}</span>
            {(offer.valid_to || offer.ends_at) && (
              <span className="text-gray-400 truncate" title={`→ ${validTo}`}>
                {"→ "}{validTo}
              </span>
            )}
          </div>
        </TableCell>
      )}

      {isColVisible("clicks") && (
        <TableCell className="text-sm text-gray-600 text-right">
          {(offer.clicks ?? 0).toLocaleString()}
        </TableCell>
      )}

      {isColVisible("views") && (
        <TableCell className="text-sm text-gray-600 text-right">
          {(offer.views ?? 0).toLocaleString()}
        </TableCell>
      )}

      {isColVisible("status") && (
        <TableCell>
          <Switch
            checked={offer.is_active === true}
            onCheckedChange={(v) => onStatusToggle(offer, v)}
            disabled={isUpdating}
            className="data-[state=checked]:bg-teal-600 data-[state=unchecked]:bg-gray-300"
          />
        </TableCell>
      )}

      <TableCell className="sticky right-0 bg-white border-l border-gray-100">
        <OfferRowActions
          offer={offer}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
});