import { User } from "../types";
import { GetUserDataType } from "@/types";

/**
 * Extracts the array of items and the total count from a potentially deeply nested API response.
 */
export function unpackUsersResponse(data: unknown): { itemsArray: GetUserDataType[]; totalItems: number } {
  const rawData = (data as { data?: unknown })?.data;
  let itemsArray: GetUserDataType[] = [];
  
  if (Array.isArray(rawData)) {
    itemsArray = rawData as GetUserDataType[];
  } else {
    const nested = (rawData as { data?: unknown } | undefined)?.data;
    if (Array.isArray(nested)) itemsArray = nested as GetUserDataType[];
  }

  let totalItems = itemsArray.length;
  if (rawData && typeof rawData === "object" && "total" in rawData) {
    totalItems = (rawData as { total: number }).total;
  }

  return { itemsArray, totalItems };
}

/**
 * Maps raw backend API user records into the frontend `User` interface.
 */
export function mapUser(user: GetUserDataType): User {
  const firstName = user.first_name ?? "";
  const lastName = user.last_name ?? "";
  const fullName = `${firstName} ${lastName}`.trim() || "N/A";
  
  return {
    user_id: user.user_id,
    name: fullName,
    profile_picture: user.profile_picture || "U",
    role_name: user.role?.role_name || user.role_name || "User",
    email: user.email || "N/A",
    lastLogin: "Recently",
    status:
      user.status === "active"
        ? "Active"
        : user.status === "inactive"
          ? "Inactive"
          : "Suspended",
  };
}
