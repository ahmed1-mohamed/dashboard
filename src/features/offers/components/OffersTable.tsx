"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";

export function OffersTable({
  offers,
  selectedOffers,
  handleSelectAll,
  handleSelectOne,
  isColVisible,
  updatingOfferId,
  handleStatusToggle,
  onDeleteClick,
  onViewClick,
}: any) {
  const router = useRouter();

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">      <Table className="table-fixed w-full">
      <TableHeader>
        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
          <TableHead className="w-12 px-4">
            <Checkbox
              checked={offers.length > 0 && selectedOffers.length === offers.length}
              onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
            />
          </TableHead>
          <TableHead className="min-w-[150px]">Offer Details</TableHead>
          {isColVisible("linked_to") && <TableHead>Linked To</TableHead>}
          {isColVisible("type") && <TableHead>Type</TableHead>}
          {isColVisible("discount") && <TableHead>Discount</TableHead>}
          {isColVisible("validity") && <TableHead>Validity Period</TableHead>}
          {isColVisible("clicks") && <TableHead>Clicks</TableHead>}
          {isColVisible("views") && <TableHead>Views</TableHead>}
          {isColVisible("priority") && <TableHead>Priority</TableHead>}
          {isColVisible("status") && <TableHead>Status</TableHead>}
          <TableHead className="w-20">actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {offers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={11} className="text-center py-8 text-gray-500">
              No offers found.
            </TableCell>
          </TableRow>
        ) : (
          offers.map((offer: any, index: number) => (
            <TableRow key={offer.offer_id || index} className="hover:bg-gray-50">
              <TableCell className="px-4">
                <Checkbox
                  checked={selectedOffers.includes(offer.offer_id)}
                  onCheckedChange={(checked) => handleSelectOne(offer.offer_id, checked as boolean)}
                />
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1" title={offer.description}>
                  <span
                    className="font-medium text-gray-900 text-sm hover:text-teal-600 cursor-pointer line-clamp-1"
                    onClick={() => onViewClick(offer)}
                  >
                    {offer.offer_details || "Unnamed Offer"}
                  </span>
                  {offer.description && (
                    <span className="text-xs text-gray-500 line-clamp-1">{offer.description}</span>
                  )}
                </div>
              </TableCell>
              {isColVisible("linked_to") && (
                <TableCell className="text-gray-600">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 capitalize">{offer.linked_type || "Project"}</span>
                    <span className="text-sm line-clamp-1">{offer.linked_name || "Marina Pearl"}</span>
                  </div>
                </TableCell>
              )}
              {isColVisible("type") && <TableCell className="text-gray-600">{offer.discount_type || "Percentage"}</TableCell>}
              {isColVisible("discount") && <TableCell className="text-gray-600">{offer.discount || "20% OFF"}</TableCell>}
              {isColVisible("validity") && (
                <TableCell className="text-gray-600 text-xs">
                  <div className="flex flex-col">
                    <span>From: {offer.valid_from ? new Date(offer.valid_from).toLocaleDateString() : '6/1/2024'}</span>
                    <span>To: {offer.valid_to ? new Date(offer.valid_to).toLocaleDateString() : '6/30/2024'}</span>
                  </div>
                </TableCell>
              )}
              {isColVisible("clicks") && (
                <TableCell className="hidden lg:table-cell">
                  {offer.clicks || 0}
                </TableCell>
              )}

              {isColVisible("views") && (
                <TableCell className="hidden lg:table-cell">
                  {offer.views || 0}
                </TableCell>
              )}

              {isColVisible("priority") && (
                <TableCell className="hidden xl:table-cell">
                  #{offer.priority || index + 1}
                </TableCell>
              )}                {isColVisible("status") && (
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={offer.is_active === true}
                      onCheckedChange={(checked) => handleStatusToggle(offer, checked)}
                      disabled={updatingOfferId === offer.offer_id}
                      className="data-[state=checked]:bg-[#9d4edd] data-[state=unchecked]:bg-gray-300"
                    />
                  </div>
                </TableCell>
              )}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewClick(offer)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/admin/offers/${offer.offer_id}/edit`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeleteClick(offer)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
    </div>
  );
}