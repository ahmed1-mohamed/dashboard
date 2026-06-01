"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface BookingSkeletonProps {
  showActions?: boolean;
}

export function BookingSkeleton({ showActions = false }: BookingSkeletonProps) {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start gap-4 sm:gap-8">
            <div className="flex flex-col w-full gap-4">
              <div className="flex gap-4 items-center">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>

            {showActions && (
              <>
                <div className="hidden sm:block h-[110px] w-px bg-muted" />
                <div className="flex flex-col gap-2 w-full sm:w-full">
                  <Skeleton className="h-9 w-full rounded-lg" />
                  <Skeleton className="h-9 w-full rounded-lg" />
                  <Skeleton className="h-9 w-full rounded-lg" />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
