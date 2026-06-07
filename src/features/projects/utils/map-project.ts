import { Project } from "../types";

export function unpackProjectsResponse(rawData: unknown): { itemsArray: any[]; totalItems: number } {
  let itemsArray: any[] = [];

  if (Array.isArray(rawData)) {
    itemsArray = rawData;
  } else {
    const nested = (rawData as { data?: unknown } | undefined)?.data;
    if (Array.isArray(nested)) {
      itemsArray = nested;
    } else {
      const doublyNested = (nested as { data?: unknown } | undefined)?.data;
      if (Array.isArray(doublyNested)) {
        itemsArray = doublyNested;
      }
    }
  }

  let totalItems = itemsArray.length;
  if (Array.isArray(rawData)) {
    totalItems = rawData.length;
  } else if (rawData && (rawData as { total: number }).total !== undefined) {
    totalItems = (rawData as { total: number }).total;
  } else if (rawData && (rawData as { data: { total: number } }).data?.total !== undefined) {
    totalItems = (rawData as { data: { total: number } }).data.total;
  }

  return { itemsArray, totalItems };
}


export function mapProject(p: any): Project {
  return {
    id: p.project_id as number,
    name: (p.project_name as string) || "N/A",
    developer_name: (p.developer_name as string) || "N/A",
    total_units: Number(p.total_units) || 0,
    available_units: Number(p.available_units) || 0,
    launch_date: (p.launch_date as string) || "N/A",
    completion_date: (p.completion_date as string) || "N/A",
    country_dimension_unit: (p.country_dimension_unit as string) || "N/A",
    price_range: (p.price_range as string) || "N/A",
    slug: (p.slug as string) || "",
    project_size: (p.project_size as string) || "N/A",
    area_name: (p.area_name as string) || "N/A",
    city_name: (p.city_name as string) || "N/A",
    country_name: (p.country_name as string) || "N/A",
    whatsapp: (p.whatsapp_no as string) || "N/A",
    currency: (p.currency as string) || "AED",
    latitude: Number(p.latitude) || 0,
    longitude: Number(p.longitude) || 0,
    media_urls: (p.media_urls as string) || "",
    rating: Number(p.rating) || 0,
    rating_count: Number(p.rating_count) || 0,
    badge: (p.badge as { color: string; name: string }) || null,
    offer: p.offer ?? null,
    is_favourite: Boolean(p.is_favourite),
    price_after_discount: (p.price_after_discount as string) || "N/A",
    status: (p.status as string) || "Upcoming",
    projectType: (p.project_type as string) || "N/A",
    is_active: Boolean(p.is_active),
  };
}
