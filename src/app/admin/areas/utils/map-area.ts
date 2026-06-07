import { Area } from "../components/AreasTable";

export function unpackAreasResponse(data: unknown): { itemsArray: any[]; totalItems: number } {
  const rawData = data as { data?: any } | undefined;
  const itemsArray = rawData?.data?.data || [];
  const totalItems = rawData?.data?.total || itemsArray.length || 0;
  return { itemsArray, totalItems };
}

export function mapArea(area: any): Area {
  return {
    area_id: area.id || area.dld_area_id,
    area_name: area.dld_area_name || area.area_name || "N/A",
    latitude: area.latitude || "",
    longitude: area.longitude || "",
    description: area.description || "",
    created_at: area.created_at || "",
    updated_at: area.updated_at || "",
    deleted_at: area.deleted_at || null,
    dld_area_id: area.dld_area_id,
    locations_count: area.locations_count,
    projects_count: area.projects_count,
    status: !area.deleted_at,
  };
}
