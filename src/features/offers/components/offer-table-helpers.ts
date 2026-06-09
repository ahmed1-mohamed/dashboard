import type { Offer } from "@/features/offers/types";

export function offerName(offer: Offer): string {
  return offer.offer_details || offer.name || "Unnamed Offer";
}

export function offerDiscount(offer: Offer): string {
  if (offer.discount) return offer.discount;
  if (offer.discount_pct != null) return `${offer.discount_pct}%`;
  return "—";
}

export function offerDiscountType(offer: Offer): string {
  if (!offer.discount_type) return "—";
  return offer.discount_type
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
