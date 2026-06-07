import { Developer, DeveloperApiResponse } from "../types";

/**
 * Extracts the array of items and the total count from a potentially deeply nested API response.
 */
export function unpackDevelopersResponse(devData: unknown): { itemsArray: DeveloperApiResponse[]; totalItems: number } {
  const rawData = (devData as { data?: unknown })?.data;
  let itemsArray: DeveloperApiResponse[] = [];
  
  if (Array.isArray(rawData)) {
    itemsArray = rawData as DeveloperApiResponse[];
  } else {
    const nested = (rawData as { developers?: unknown } | undefined)?.developers;
    if (Array.isArray(nested)) itemsArray = nested as DeveloperApiResponse[];
  }

  let totalItems = itemsArray.length;
  if (typeof (devData as { total?: number })?.total === "number") {
    totalItems = (devData as { total: number }).total;
  } else if (rawData && typeof rawData === "object" && "total" in rawData) {
    totalItems = (rawData as { total: number }).total;
  }

  return { itemsArray, totalItems };
}

/**
 * Maps raw backend API developer records into the frontend `Developer` interface.
 */
export function mapDeveloper(dev: DeveloperApiResponse): Developer {
  return {
    id: dev.developer_id,
    name: dev.developer_name || "N/A",
    countries: dev.countries || "N/A",
    cities: dev.cities || "N/A",
    projects: dev.projects_count || 0,
    website: dev.website || "N/A",
    email: dev.email || "N/A",
    contact: dev.phone_number || "N/A",
    status: dev.status === "active" || Boolean(dev.is_active),
    logo: dev.logo,
  };
}
