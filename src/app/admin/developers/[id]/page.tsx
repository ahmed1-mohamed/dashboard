"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useDeveloperDetails } from "@/hooks/use-developer-details";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DeveloperHeader } from "@/features/developers/components/developer-details/DeveloperHeader";
import { DeveloperStats } from "@/features/developers/components/developer-details/DeveloperStats";
import { DeveloperAbout } from "@/features/developers/components/developer-details/DeveloperAbout";
import { DeveloperTabs } from "@/features/developers/components/developer-details/DeveloperTabs";

interface Unit {
  id: number;
  unitNumber: string;
  project: string;
  type: string;
  area: string;
}

export default function DeveloperDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: developerId } = use(params);
  const router = useRouter();

  const { developer, isLoading, isError, error, toggleTop, isTogglingTop } =
    useDeveloperDetails(Number(developerId));

  const handleToggleTopDeveloper = (checked: boolean) => {
    toggleTop(checked);
  };

  const projects = developer?.project || [];
  const units: any[] = []; // Currently mocked in original code

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-gray-600">
            Loading developer details...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="mx-auto h-12 w-12 text-red-600">⚠️</div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Error Loading Developer
          </h2>
          <p className="mt-2 text-gray-600">
            {error instanceof Error
              ? error.message
              : "Failed to load developer"}
          </p>
          <Button
            onClick={() => router.push("/admin/developers")}
            className="mt-6 bg-teal-600 hover:bg-teal-700"
          >
            Back to Developers
          </Button>
        </div>
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-500">No developer data available</p>
          <Button
            onClick={() => router.push("/admin/developers")}
            className="mt-6 bg-teal-600 hover:bg-teal-700"
          >
            Back to Developers
          </Button>
        </div>
      </div>
    );
  }

  const totalUnits = projects.reduce(
    (sum: any, p: any) => sum + (p.total_units || 0),
    0,
  );
  const availableUnits = projects.reduce(
    (sum: any, p: any) => sum + (p.available_units || 0),
    0,
  );
  const bookedUnits = totalUnits - availableUnits;

  return (
    <div className="p-4 px-3 space-y-4 max-w-full overflow-hidden">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Home</span>
        <ChevronRight className="h-4 w-4" />
        <span>Developers</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">{developer.name}</span>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin/developers")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Developer Details</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <DeveloperHeader developer={developer} />
        <DeveloperStats
          developer={developer}
          totalProjects={projects.length}
          totalUnits={totalUnits}
          availableUnits={availableUnits}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DeveloperAbout
          developer={developer}
          handleToggleTopDeveloper={handleToggleTopDeveloper}
          isTogglingTop={isTogglingTop}
        />
        <div className="lg:col-span-2">
          <DeveloperTabs developer={developer} projects={projects} units={units} />
        </div>
      </div>

      {/* Edit Developer Modal */}
      {/* <EditDeveloperModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
        }}
        developerId={Number(developerId)}
        data={developer}
        onSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: ["developerDetails", developerId],
          });
          setIsEditModalOpen(false);
        }}
      /> */}
    </div>
  );
}
