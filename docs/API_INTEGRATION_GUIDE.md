# API Integration Guide

This guide explains how to use the API client functions throughout your project to handle API calls.

## Overview

Your project has two main API-related files:

- **`src/data/api-client.ts`** - Comprehensive API client with all CRUD operations
- **`src/data/meeting-requests.ts`** - Specialized functions for meeting request operations

## Available API Functions

### 1. **Fetch Functions** (GET Requests)

#### Basic Fetch

```typescript
import { fetchProjects, fetchUsers, fetchProperties } from "@/data/api-client";

// Fetch all projects
const projects = await fetchProjects(token);

// Fetch all users
const users = await fetchUsers(token);

// Fetch properties with filters
const properties = await fetchProperties(
  "price", // sortBy
  "desc", // sortOrder
  [1, 2], // selectedCountries
  [5], // selectedDevelopers
  [10, 20] // selectedProjects
);
```

#### Fetch Details by ID

```typescript
import {
  fetchProjectsDetails,
  fetchUsersDetails,
  fetchPropertyDetails,
} from "@/data/api-client";

// Get specific project
const project = await fetchProjectsDetails(projectId, token);

// Get specific user
const user = await fetchUsersDetails(userId, token);

// Get specific property
const property = await fetchPropertyDetails(propertyId, token);
```

### 2. **Create Functions** (POST Requests)

```typescript
import {
  addProject,
  addUser,
  addProperty,
  addDeveloper,
} from "@/data/api-client";

// Create a new project
const newProject = await addProject(projectData, token);

// Create a new user
const newUser = await addUser(userData, token);

// Create a new property
const newProperty = await addProperty(propertyData, token);

// Create developer (with image upload)
const newDeveloper = await addDeveloper(formData, token);
```

### 3. **Update Functions** (PUT Requests)

```typescript
import { editProject, editUser, editProperty } from "@/data/api-client";

// Update project
const updated = await editProject(projectId, projectData, token);

// Update user
const updatedUser = await editUser(userId, userData, token);

// Update property
const updatedProperty = await editProperty(propertyId, propertyData, token);
```

### 4. **Delete Functions** (DELETE Requests)

```typescript
import { deleteProject, deleteUser, deleteProperty } from "@/data/api-client";

// Delete project
await deleteProject(projectId, token);

// Delete user
await deleteUser(userId, token);

// Delete property
await deleteProperty(propertyId, token);
```

### 5. **Meeting Requests**

```typescript
import {
  confirmMeetingRequest,
  cancelMeetingRequest,
} from "@/data/meeting-requests";

// Confirm a meeting request
await confirmMeetingRequest(meetingId, token);

// Cancel a meeting request
await cancelMeetingRequest(meetingId, token);
```

### 6. **Authentication Functions**

```typescript
import {
  signUpAdmin,
  forgetPassword,
  verifyToken,
  resetPassword,
} from "@/data/api-client";

// Register new admin
await signUpAdmin({
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
  phone_number: "+1234567890",
  password: "password123",
  password_confirmation: "password123",
  role_id: "1",
});

// Forgot password
await forgetPassword({ email: "john@example.com" });

// Verify OTP token
await verifyToken({ token: "123456" });

// Reset password
await resetPassword({
  token: "123456",
  password: "newPassword",
  password_confirmation: "newPassword",
});
```

## Complete Entity Operations

### Projects

```typescript
import {
  fetchProjects, // Get all projects
  fetchProjectsDetails, // Get single project
  addProject, // Create project
  editProject, // Update project
  deleteProject, // Delete project
  addProjectFeature, // Add feature to project
  editProjectFeature, // Edit project feature
  deleteProjectFeature, // Delete project feature
  addProjectMedia, // Add media to project
  editProjectMedia, // Edit project media
  deleteProjectMedia, // Delete project media
  addProjectPayment, // Add payment plan
  editProjectPayment, // Edit payment plan
  deleteProjectPayment, // Delete payment plan
} from "@/data/api-client";
```

### Properties

```typescript
import {
  fetchProperties, // Get all properties
  fetchPropertyDetails, // Get single property
  addProperty, // Create property
  editProperty, // Update property
  deleteProperty, // Delete property
  addPropertyFeature, // Add feature to property
  editPropertyFeature, // Edit property feature
  deletePropertyFeature, // Delete property feature
  addPropertyMedia, // Add media to property
  editPropertyMedia, // Edit property media
  deletePropertyMedia, // Delete property media
} from "@/data/api-client";
```

### Developers

```typescript
import {
  fetchDevelopers, // Get all developers
  fetchDeveloperDetails, // Get single developer
  addDeveloper, // Create developer (with image)
  editDeveloper, // Update developer (with image)
  deleteDeveloper, // Delete developer
  addDeveloperFeature, // Add feature to developer
  editDeveloperFeature, // Edit developer feature
  deleteDeveloperFeature, // Delete developer feature
} from "@/data/api-client";
```

### Users & Permissions

```typescript
import {
  fetchUsers, // Get all users
  fetchUsersDetails, // Get single user
  addUser, // Create user
  editUser, // Update user
  deleteUser, // Delete user
  fetchRoles, // Get all roles
  fetchRolesDetails, // Get single role
  addRoles, // Create role
  editRoles, // Update role
  deleteRoles, // Delete role
  fetchPermissions, // Get all permissions
  addPermission, // Create permission
  editPermission, // Update permission
  deletePermission, // Delete permission
  addRolesPermission, // Assign permission to role
  deleteRolesPermissions, // Remove permission from role
} from "@/data/api-client";
```

### Locations & Areas

```typescript
import {
  fetchAreas, // Get all areas
  fetchAreaDetails, // Get single area
  addArea, // Create area
  editArea, // Update area
  deleteArea, // Delete area
  fetchDldAreas, // Get all DLD areas
  fetchDldAreaDetails, // Get single DLD area
  addDldArea, // Create DLD area
  editDldarea, // Update DLD area
  deleteDldArea, // Delete DLD area
  fetchLocations, // Get all locations
  fetchLocationsDetails, // Get single location
  addLocation, // Create location
  editLocation, // Update location
  deleteLocation, // Delete location
  fetchCities, // Get all cities
  deleteCity, // Delete city
} from "@/data/api-client";
```

### Features & Property Types

```typescript
import {
  fetchFeatures, // Get all features
  fetchFeaturesDetails, // Get single feature
  addFeature, // Create feature
  editFeature, // Update feature
  deleteFeature, // Delete feature
  fetchPropertyTypes, // Get all property types
  fetchPropertyTypesDetails, // Get single property type
  addPropertyType, // Create property type
  editPropertyType, // Update property type
  deletePropertyType, // Delete property type
  fetchPropertySubtype, // Get all property subtypes
  fetchPropertySubtypesDetails, // Get single property subtype
  addPropertySubtype, // Create property subtype
  editPropertySubtype, // Update property subtype
  deletePropertySubtype, // Delete property subtype
} from "@/data/api-client";
```

### Other Entities

```typescript
import {
  fetchBuildings, // Get all buildings
  fetchBuildingsDetails, // Get single building
  addBuilding, // Create building
  editBuilding, // Update building
  deleteBuilding, // Delete building
  fetchAddresses, // Get all addresses
  fetchAddressDetails, // Get single address
  addAddress, // Create address
  editAddress, // Update address
  deleteAddress, // Delete address
  fetchMileStones, // Get all milestones
  fetchMilestonesDetails, // Get single milestone
  addMilestone, // Create milestone
  editMilestone, // Update milestone
  deleteMilestone, // Delete milestone
  fetchReservations, // Get all reservations
  fetchReservationDetails, // Get single reservation
  fetchRereferralDetails, // Get referral details
  addReferral, // Create referral
  editReferral, // Update referral
  deleteReferral, // Delete referral
} from "@/data/api-client";
```

## Getting the Authentication Token

Most API functions require a token for authentication. Here's how to get it:

### Using NextAuth (Recommended)

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// In Server Components
const session = await getServerSession(authOptions);
const token = session?.user?.accessToken;

// In Client Components
import { useSession } from "next-auth/react";

const { data: session } = useSession();
const token = session?.user?.accessToken;
```

### Using Cookies (Alternative)

```typescript
import { cookies } from "next/headers";

const token = cookies().get("auth_token")?.value;
```

## Error Handling

All API functions throw errors that should be caught:

```typescript
try {
  const projects = await fetchProjects(token);
  // Handle success
} catch (error) {
  console.error("Failed to fetch projects:", error);
  // Handle error - show toast, redirect, etc.
}
```

## Best Practices

### 1. **Use React Query for Data Fetching**

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProjects,
  addProject,
  editProject,
  deleteProject,
} from "@/data/api-client";

// Fetch data
const { data: projects, isLoading } = useQuery({
  queryKey: ["projects"],
  queryFn: () => fetchProjects(token),
});

// Create mutation
const queryClient = useQueryClient();
const createMutation = useMutation({
  mutationFn: (data) => addProject(data, token),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["projects"] });
  },
});

// Update mutation
const updateMutation = useMutation({
  mutationFn: ({ id, data }) => editProject(id, data, token),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["projects"] });
  },
});

// Delete mutation
const deleteMutation = useMutation({
  mutationFn: (id) => deleteProject(id, token),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["projects"] });
  },
});
```

### 2. **Server Actions (Next.js 14+)**

```typescript
"use server";

import { fetchProjects, addProject } from "@/data/api-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getProjects() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.accessToken) {
    throw new Error("Unauthorized");
  }

  return await fetchProjects(session.user.accessToken);
}

export async function createProject(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.accessToken) {
    throw new Error("Unauthorized");
  }

  const projectData = {
    // Extract data from formData
  };

  return await addProject(projectData, session.user.accessToken);
}
```

### 3. **Custom Hooks**

```typescript
// hooks/useProjects.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProjects,
  addProject,
  editProject,
  deleteProject,
} from "@/data/api-client";
import { useSession } from "next-auth/react";

export function useProjects() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  return useQuery({
    queryKey: ["projects"],
    queryFn: () => fetchProjects(token!),
    enabled: !!token,
  });
}

export function useCreateProject() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => addProject(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProject() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => editProject(id, data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteProject() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteProject(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
```

## Environment Variables

Ensure these are set in your `.env` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/dashboard
NEXT_PUBLIC_API_URL_WITHOUT_DASHBOARD=http://localhost:8000
```

## Example Implementation

See the `examples/` directory for complete implementation examples:

- `examples/projects-page.tsx` - Full CRUD example
- `examples/users-management.tsx` - User management example
- `examples/meeting-requests.tsx` - Meeting requests handling
