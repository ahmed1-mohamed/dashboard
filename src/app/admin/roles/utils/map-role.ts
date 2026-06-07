import { Role } from "../page";

export function unpackRolesResponse(data: unknown): any[] {
  const rawData = data as unknown;
  let rolesArray: any[] = [];
  if (Array.isArray(rawData)) {
    rolesArray = rawData;
  } else if (
    rawData &&
    typeof rawData === "object" &&
    "data" in rawData &&
    Array.isArray((rawData as { data?: unknown }).data)
  ) {
    rolesArray = (rawData as { data?: unknown }).data as any[];
  }
  return rolesArray;
}

export function mapRole(role: any): Role {
  let parsedPerms = role.permissions;
  if (typeof parsedPerms === "string") {
    try {
      parsedPerms = JSON.parse(parsedPerms);
    } catch (e) {
      parsedPerms = null;
    }
  }

  if (parsedPerms && typeof parsedPerms === "object" && !Array.isArray(parsedPerms)) {
    Object.keys(parsedPerms).forEach((section) => {
      if (typeof parsedPerms[section] === "object") {
        Object.keys(parsedPerms[section]).forEach((action) => {
          const val = parsedPerms[section][action];
          parsedPerms[section][action] = val === true || val === "1" || val === 1 || val === "true";
        });
      }
    });
  } else {
    parsedPerms = null;
  }

  return {
    role_id: role.role_id,
    role_name: role.role_name,
    role_type: role.role_type,
    description: role.description
      ? Array.isArray(role.description)
        ? role.description
        : [role.description]
      : ["No specific permissions"],
    users_count: role.users_count || 0,
    is_active: role.is_active || false,
    permissions: parsedPerms,
  };
}
