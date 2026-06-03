import { ProjectData } from "../types";

interface ProjectStatsProps {
  data: ProjectData;
}

export function ProjectStats({ data }: ProjectStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 my-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
        <p className="text-2xl font-bold text-gray-900">
          {data?.total_units || 0}
        </p>
        <p className="text-sm text-gray-600 mt-1">Total Units</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
        <p className="text-2xl font-bold text-gray-900">
          {data?.available_properties_count || data?.available_units || 0}
        </p>
        <p className="text-sm text-gray-600 mt-1">Available Units</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
        <p className="text-2xl font-bold text-gray-900">
          {data?.active_properties_count || 0}
        </p>
        <p className="text-sm text-gray-600 mt-1">Active Units</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
        <p className="text-2xl font-bold text-gray-900">
          {data?.booked_properties_count || 0}
        </p>
        <p className="text-sm text-gray-600 mt-1">Booked Units</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
        <p className="text-2xl font-bold text-gray-900">
          {data?.sold_properties_count || 0}
        </p>
        <p className="text-sm text-gray-600 mt-1">Sold Units</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
        <p className="text-2xl font-bold text-gray-900 capitalize">
          {data?.status || "N/A"}
        </p>
        <p className="text-sm text-gray-600 mt-1">Status</p>
      </div>
    </div>
  );
}
