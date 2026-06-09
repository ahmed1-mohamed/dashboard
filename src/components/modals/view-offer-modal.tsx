"use client";

import { useQuery } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import {
  Loader2,
  Tag,
  Calendar,
  MousePointerClick,
  Eye,
  Building2,
  ToggleRight,
  Hash,
  Percent,
  Clock,
} from "lucide-react";
import { AdminOffersService } from "@/services/AdminOffersService";
import { Badge } from "@/components/ui/badge";

interface ViewOfferModalProps {
  open: boolean;
  onClose: () => void;
  offerId: number | string | null;
}


function isPresent(value: unknown): boolean {
  return value !== null && value !== undefined && value !== "";
}

function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function formatDiscountType(type: string): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}


function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon?: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </p>
      <div className="text-sm font-medium text-gray-900">{children}</div>
    </div>
  );
}


function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest border-b pb-1">
        {title}
      </h3>
      <div className="grid grid-cols-3 gap-x-6 gap-y-4">{children}</div>
    </div>
  );
}

export default function ViewOfferModal({
  open,
  onClose,
  offerId,
}: ViewOfferModalProps) {
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["offerDetails", offerId],
    queryFn: () => AdminOffersService.getOffer(offerId!.toString()),
    enabled: open && !!offerId,
  });

  const raw = (response as any)?.data;
  const offer = raw?.data ?? raw ?? null;
  const project = offer?.project ?? null;

  return (
    <Modal isOpen={open} onClose={onClose} title="Offer Details" size="xl">
      <div className="space-y-5 max-h-[78vh] overflow-y-auto px-1 pb-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-3" />
            <p className="text-sm">Loading offer details...</p>
          </div>
        ) : isError ? (
          <div className="py-10 text-center text-red-500 text-sm">
            Failed to load offer details.
          </div>
        ) : !offer ? (
          <div className="py-10 text-center text-gray-400 text-sm">
            No details available.
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3 border-b pb-4">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-gray-900 leading-tight">
                  {offer.name || offer.offer_details || "Unnamed Offer"}
                </h2>
                {isPresent(offer.description) && (
                  <p className="text-sm text-gray-500 mt-1">{offer.description}</p>
                )}
              </div>
              <Badge
                className={
                  offer.is_active
                    ? "bg-green-100 text-green-800 shrink-0"
                    : "bg-gray-100 text-gray-600 shrink-0"
                }
              >
                {offer.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>

            <Section title="Offer Information">
              {isPresent(offer.entity_type) && (
                <DetailRow icon={Building2} label="Entity Type">
                  <span className="capitalize">{offer.entity_type?.toLowerCase()}</span>
                </DetailRow>
              )}

              {isPresent(offer.discount_type) && (
                <DetailRow icon={Tag} label="Discount Type">
                  {formatDiscountType(offer.discount_type)}
                </DetailRow>
              )}

              {isPresent(offer.discount_pct) && (
                <DetailRow icon={Percent} label="Discount">
                  {offer.discount_pct}%
                </DetailRow>
              )}

              {isPresent(offer.is_active) && (
                <DetailRow icon={ToggleRight} label="Status">
                  <Badge
                    className={
                      offer.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }
                  >
                    {offer.is_active ? "Active" : "Inactive"}
                  </Badge>
                </DetailRow>
              )}

              {isPresent(offer.starts_at) && (
                <DetailRow icon={Calendar} label="Starts At">
                  {formatDate(offer.starts_at)}
                </DetailRow>
              )}

              {isPresent(offer.ends_at) && (
                <DetailRow icon={Calendar} label="Ends At">
                  {formatDate(offer.ends_at)}
                </DetailRow>
              )}

              {isPresent(offer.clicks) && (
                <DetailRow icon={MousePointerClick} label="Clicks">
                  {(offer.clicks as number).toLocaleString()}
                </DetailRow>
              )}

              {isPresent(offer.views) && (
                <DetailRow icon={Eye} label="Views">
                  {(offer.views as number).toLocaleString()}
                </DetailRow>
              )}

              {isPresent(offer.created_at) && (
                <DetailRow icon={Clock} label="Created At">
                  {formatDate(offer.created_at)}
                </DetailRow>
              )}

              {isPresent(offer.updated_at) && (
                <DetailRow icon={Clock} label="Updated At">
                  {formatDate(offer.updated_at)}
                </DetailRow>
              )}
            </Section>

            {project && (
              <Section title="Linked Project">
                {isPresent(project.project_name) && (
                  <DetailRow icon={Building2} label="Project Name">
                    {project.project_name}
                  </DetailRow>
                )}

                {isPresent(project.project_type) && (
                  <DetailRow label="Type">
                    <span className="capitalize">{project.project_type}</span>
                  </DetailRow>
                )}

                {isPresent(project.status) && (
                  <DetailRow label="Status">
                    <span className="capitalize">{project.status}</span>
                  </DetailRow>
                )}

                {isPresent(project.total_units) && (
                  <DetailRow icon={Hash} label="Total Units">
                    {project.total_units}
                  </DetailRow>
                )}

                {isPresent(project.available_units) && (
                  <DetailRow label="Available Units">
                    {project.available_units}
                  </DetailRow>
                )}

                {isPresent(project.price_range) && (
                  <DetailRow label="Price Range">
                    {project.currency ?? "AED"} {project.price_range}
                  </DetailRow>
                )}

                {isPresent(project.project_size) && (
                  <DetailRow label="Project Size">
                    {project.project_size}
                  </DetailRow>
                )}

                {isPresent(project.completion_date) && (
                  <DetailRow icon={Calendar} label="Completion Date">
                    {formatDate(project.completion_date)}
                  </DetailRow>
                )}

                {isPresent(project.launch_date) && (
                  <DetailRow icon={Calendar} label="Launch Date">
                    {formatDate(project.launch_date)}
                  </DetailRow>
                )}

                {isPresent(project.permit_no) && (
                  <DetailRow label="Permit No.">
                    {project.permit_no}
                  </DetailRow>
                )}
              </Section>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}