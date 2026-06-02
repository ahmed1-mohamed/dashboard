import React from "react";
import { DeveloperData } from "@/hooks/use-developer-details";

interface DeveloperStatsProps {
  developer: DeveloperData;
  totalProjects: number;
  totalUnits: number;
  availableUnits: number;
}

export function DeveloperStats({ developer, totalProjects, totalUnits, availableUnits }: DeveloperStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div>
        <p className="text-sm text-gray-600 mb-1">Total Projects</p>
        <p className="text-2xl font-bold text-gray-900">
          {totalProjects}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">Active Projects</p>
        <p className="text-2xl font-bold text-gray-900">
          {developer.active_projects_count || 0}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">Completed Projects</p>
        <p className="text-2xl font-bold text-gray-900">
          {developer.completed_projects_count || 0}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">Total Units</p>
        <p className="text-2xl font-bold text-gray-900">
          {developer.total_units_count ?? totalUnits ?? "-"}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">Av Units</p>
        <p className="text-2xl font-bold text-gray-900">
          {developer.available_units_count ?? availableUnits ?? "-"}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">Sold Units</p>
        <p className="text-2xl font-bold text-gray-900">
          {developer.booked_units_count || 0}
        </p>
      </div>
    </div>
  );
}
