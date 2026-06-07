"use client";

import React from "react";
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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";

export function AdsTable({
  ads,
  selectedAds,
  handleSelectAll,
  handleSelectOne,
  isColVisible,
  updatingAdId,
  handleStatusToggle,
  onDeleteClick,
}: any) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
            <TableHead className="w-12 px-4">
              <Checkbox
                checked={ads.length > 0 && selectedAds.length === ads.length}
                onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
              />
            </TableHead>
            <TableHead className="min-w-[250px]">Ad</TableHead>
            {isColVisible("type") && <TableHead>Type</TableHead>}
            {isColVisible("platform") && <TableHead>Platform</TableHead>}
            {isColVisible("country") && <TableHead>Country</TableHead>}
            {isColVisible("location") && <TableHead>Locations</TableHead>}
            {isColVisible("views") && <TableHead>Views</TableHead>}
            {isColVisible("clicks") && <TableHead>Clicks</TableHead>}
            {isColVisible("ctr") && <TableHead>CTR</TableHead>}
            {isColVisible("status") && <TableHead>Status</TableHead>}
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                No ads found.
              </TableCell>
            </TableRow>
          ) : (
            ads.map((ad: any) => (
              <TableRow key={ad.creative_id} className="hover:bg-gray-50">
                <TableCell className="px-4">
                  <Checkbox
                    checked={selectedAds.includes(ad.creative_id)}
                    onCheckedChange={(checked) => handleSelectOne(ad.creative_id, checked as boolean)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span 
                      className="font-medium text-gray-900 text-sm hover:text-teal-600 cursor-pointer hover:underline"
                      onClick={() => router.push(`/admin/ads/${ad.creative_id}`)}
                    >
                      {ad.creative_title}
                    </span>
                  </div>
                </TableCell>
                {isColVisible("type") && <TableCell className="text-gray-600">{ad.type}</TableCell>}
                {isColVisible("platform") && <TableCell className="text-gray-600">{ad.platform}</TableCell>}
                {isColVisible("country") && <TableCell className="text-gray-600">{ad.country}</TableCell>}
                {isColVisible("location") && <TableCell className="text-gray-600">{ad.location}</TableCell>}
                {isColVisible("views") && <TableCell className="text-gray-600">{ad.views?.toLocaleString() || 0}</TableCell>}
                {isColVisible("clicks") && <TableCell className="text-gray-600">{ad.clicks?.toLocaleString() || 0}</TableCell>}
                {isColVisible("ctr") && <TableCell className="text-gray-600">{ad.ctr || "0%"}</TableCell>}
                {isColVisible("status") && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={ad.status === "active" ? "success" : "secondary"}
                        className={
                          ad.status === "active"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }
                      >
                        {ad.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          ad.status === "active" ? "bg-green-500" : "bg-gray-400"
                        } ${updatingAdId === ad.creative_id ? "animate-pulse" : ""}`}
                      />
                      <Switch
                        checked={ad.status === "active"}
                        onCheckedChange={(checked) => handleStatusToggle(ad.creative_id, checked)}
                        disabled={updatingAdId === ad.creative_id}
                        className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
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
                      <DropdownMenuItem onClick={() => router.push(`/admin/ads/${ad.creative_id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/admin/ads/${ad.creative_id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteClick(ad)} className="text-red-600">
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
