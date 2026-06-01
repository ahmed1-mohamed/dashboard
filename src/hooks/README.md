# Admin Page Custom Hooks - Implementation Summary

## Overview
This document summarizes all custom hooks created for handling API logic in admin pages, following the established patterns in the codebase.

## Existing Hooks (Already Present)

### 1. `use-dashboardAdminBookings.ts`
- **Purpose**: Handles bookings data with confirm/decline mutations
- **Services**: AdminBookingsService
- **Key Methods**: getBookings, confirmBooking, declineBooking

### 2. `use-dashboardAdminUsers.ts`
- **Purpose**: Handles paginated users query
- **Services**: AdminUsersService
- **Key Methods**: getUsers

### 3. `use-dashboardAdmin.ts`
- **Purpose**: Handles projects (all + paginated)
- **Services**: AdminProjectsService
- **Key Methods**: getProjects, getProjectsPaginated

### 4. `use-dashboardAdminPropertiesData.ts`
- **Purpose**: Handles properties with filters
- **Services**: AdminPropertiesService
- **Key Methods**: getProperties with params

### 5. `use-dashboardAdminDevelopers.ts`
- **Purpose**: Handles developers data
- **Services**: DashboardAdminService
- **Key Methods**: getDevelopersPaginated

### 6. `use-dashboardAdminLocations.ts`
- **Purpose**: Handles locations with pagination
- **Services**: AdminLocationsService

### 7. `use-dashboardAdminCities.ts`
- **Purpose**: Handles cities data
- **Services**: AdminCitiesService

### 8. `use-dashboardAdminAreas.ts`
- **Purpose**: Handles areas data
- **Services**: AdminAreasService

### 9. `use-dashboardAdminAds.ts`
- **Purpose**: Handles ads with pagination and totals
- **Services**: AdminAdsService

### 10. `use-dashboardAdminSubscriptions.ts`
- **Purpose**: Handles subscriptions and badge features
- **Services**: AdminSubscriptionsService

### 11. `use-dashboardAdminFeatures.ts`
- **Purpose**: Handles features data
- **Services**: AdminFeaturesService

### 12. `use-dashboardAdminPropertiesCreateData.ts`
- **Purpose**: Handles property creation data
- **Services**: AdminPropertiesService

### 13. `use-dashboardAdminProjectsCreateData.ts`
- **Purpose**: Handles project creation data with developers
- **Services**: AdminProjectsService

### 14. `use-dashboardAdminMeetingsData.ts`
- **Purpose**: Handles meetings data
- **Services**: DashboardAdminService

### 15. `use-dashboardAdminFeaturesData.ts`
- **Purpose**: Handles features data

### 16. `use-dashboardAdminUsers.ts`
- **Purpose**: Legacy hook (superseded by use-dashboardAdminUsersData)

### 17. `use-dashboardExpert.ts`
- **Purpose**: Handles expert bookings data
- **Services**: DashboardExpertService

### 18. `useDeveloperDetails.ts`
- **Purpose**: Handles developer details

### 19. `useProjectDetails.ts`
- **Purpose**: Handles project details

### 20. `usePropertyDetails.ts`
- **Purpose**: Handles property details

### 21. `useBookingDetails.ts`
- **Purpose**: Handles booking details

### 22. `use-booking-details.ts`
- **Purpose**: Handles booking details with mutations

### 23. `use-table-actions.ts`
- **Purpose**: Handles table actions with pagination

### 24. `use-paginated-data.ts`
- **Purpose**: Generic paginated data hook

### 25. `useAuthToken.ts`
- **Purpose**: Handles auth token

### 26. `use-toast.ts`
- **Purpose**: Toast notifications hook

### 27. `use-firebase-messaging.ts`
- **Purpose**: Firebase messaging hook

## New Hooks Created

### 1. `use-dashboardAdminDevelopers.ts` ✨
- **Location**: `src/hooks/use-dashboardAdminDevelopers.ts`
- **Purpose**: Handles developers data with pagination (replaces inline API calls)
- **API Functions**: fetchDevelopersPaginated
- **Parameters**: 
  - `page` (number, default: 1)
  - `perPage` (number, default: 10)
  - `search` (string, optional)
  - `status` (string, optional)
- **Returns**: `{ developersData }`
- **Used By**: Developers page (`src/app/admin/developers/page.tsx`)

### 2. `use-dashboardAdminUsersData.ts` ✨
- **Location**: `src/hooks/use-dashboardAdminUsersData.ts`
- **Purpose**: Handles users data with pagination and deletion mutation
- **API Functions**: fetchUsers, deleteUser
- **Parameters**: 
  - `page` (number, default: 1)
  - `perPage` (number, default: 15)
- **Returns**: `{ usersData, deleteUserMutation }`
- **Used By**: Users page (refactored to use this hook)

### 3. `use-dashboardAdminRoles.ts` ✨
- **Location**: `src/hooks/use-dashboardAdminRoles.ts`
- **Purpose**: Handles roles data with deletion mutation
- **API Functions**: fetchRoles, deleteRoles
- **Returns**: `{ rolesData, deleteRolesMutation }`
- **Used By**: Roles page

### 4. `use-dashboardAdminTenants.ts` ✨
- **Location**: `src/hooks/use-dashboardAdminTenants.ts`
- **Purpose**: Handles tenants data
- **API Functions**: fetchTenants
- **Returns**: `{ tenantsData }`
- **Used By**: Tenants page

### 5. `use-dashboardAdminTransactions.ts` ✨
- **Location**: `src/hooks/use-dashboardAdminTransactions.ts`
- **Purpose**: Handles transactions data
- **API Functions**: fetchTransactions
- **Returns**: `{ transactionsData }`
- **Used By**: Transactions page

### 6. `use-dashboardAdminNotifications.ts` ✨
- **Location**: `src/hooks/use-dashboardAdminNotifications.ts`
- **Purpose**: Handles notifications data with search
- **API Functions**: fetchNotifications, searchNotifications
- **Returns**: `{ notificationsData, searchNotificationsData }`
- **Used By**: Notifications page (refactored to use this hook)

### 7. `use-dashboardAdminSettings.ts` ✨
- **Location**: `src/hooks/use-dashboardAdminSettings.ts`
- **Purpose**: Handles user profile and settings
- **API Functions**: fetchUserProfile, updateUserProfile, changePassword
- **Returns**: `{ userProfileData, updateUserProfileMutation, changePasswordMutation }`
- **Used By**: Settings page

### 8. `use-dashboardAdminActivity.ts` ✨
- **Location**: `src/hooks/use-dashboardAdminActivity.ts`
- **Purpose**: Handles activity logs with search
- **API Functions**: fetchActivityLogs, searchActivityLogs
- **Returns**: `{ activityLogsData, searchActivityLogsData }`
- **Used By**: Activity page

### 9. `use-dashboardAdminAnalytics.ts` ✨
- **Location**: `src/hooks/use-dashboardAdminAnalytics.ts`
- **Purpose**: Handles dashboard statistics
- **API Functions**: fetchDashboardStats
- **Returns**: `{ dashboardStatsData }`
- **Used By**: Analytics page

### 10. `use-dashboardAdminChat.ts` ✨
- **Location**: `src/hooks/use-dashboardAdminChat.ts`
- **Purpose**: Handles AI conversations
- **API Functions**: fetchAiConversations
- **Returns**: `{ aiConversationsData }`
- **Used By**: AI Assistant page

## Hook Pattern

All hooks follow a consistent pattern:

```typescript
"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiFunctions } from "@/data/api-client";

export default function useDashboardAdminXData(params) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const data = useQuery({
    queryKey: ["key", ...params],
    queryFn: () => apiFunctions(token!, params),
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  });

  return {
    data,
    // mutations if needed
  };
}
```

## Key Features

1. **Type Safety**: All hooks use TypeScript with proper typing
2. **Query Invalidation**: Mutations properly invalidate queries
3. **Error Handling**: Consistent error handling patterns
4. **Pagination Support**: Built-in pagination with `keepPreviousData`
5. **Token Management**: Automatic token handling from session
6. **Loading States**: Proper loading state management
7. **Stale Time**: 5-minute cache for performance

## Benefits

- **Code Reusability**: Hooks can be reused across multiple components
- **Separation of Concerns**: API logic separated from UI components
- **Testability**: Hooks are easier to test in isolation
- **Maintainability**: Changes to API logic only need to be made in one place
- **Consistency**: All admin pages follow the same pattern

## Migration Guide

For pages still using direct API calls, migration involves:

1. Import the appropriate hook
2. Replace `useState` + `useEffect` with hook call
3. Remove manual API calls and error handling
4. Update data destructuring to use hook return values
5. Replace manual mutations with hook mutations

Example (Users page refactor):

**Before:**
```typescript
const [users, setUsers] = useState<User[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadUsers() {
    const data = await fetchUsers(token!, page, perPage);
    setUsers(data);
    setLoading(false);
  }
  loadUsers();
}, [session, page, perPage]);
```

**After:**
```typescript
const { usersData } = useDashboardAdminUsersData(page, perPage);
const { data, isLoading } = usersData;
const users = data?.data || [];
```
