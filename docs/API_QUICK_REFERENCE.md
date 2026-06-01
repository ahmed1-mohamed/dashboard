# API Quick Reference Guide

Quick reference for using the API functions in your project.

## 📁 File Structure

```
src/
├── data/
│   ├── api-client.ts          # Main API client with all CRUD operations
│   └── meeting-requests.ts    # Meeting request specific functions
├── hooks/
│   └── useApi.ts              # React Query hooks for all APIs
├── validators/
│   └── *.schema.ts            # Zod schemas for data validation
└── types/
    └── index.ts               # TypeScript type definitions
```

## 🚀 Quick Start

### 1. Using Custom Hooks (Recommended)

```tsx
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "@/hooks/useApi";

function MyComponent() {
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  return (
    <button onClick={() => createProject.mutate(data)}>Create Project</button>
  );
}
```

### 2. Using API Client Directly

```tsx
import { fetchProjects, addProject } from "@/data/api-client";
import { useSession } from "next-auth/react";

function MyComponent() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const handleFetch = async () => {
    const projects = await fetchProjects(token);
  };

  return <button onClick={handleFetch}>Fetch</button>;
}
```

## 📋 Common Patterns

### Fetch All Items

```tsx
const { data, isLoading, error } = useProjects();
const { data, isLoading, error } = useProperties();
const { data, isLoading, error } = useUsers();
const { data, isLoading, error } = useDevelopers();
```

### Fetch Single Item

```tsx
const { data: project } = useProjectDetails(projectId);
const { data: property } = usePropertyDetails(propertyId);
const { data: user } = useUserDetails(userId);
```

### Create Item

```tsx
const createProject = useCreateProject();

createProject.mutate(projectData, {
  onSuccess: () => alert("Created!"),
  onError: (error) => alert("Error!"),
});
```

### Update Item

```tsx
const updateProject = useUpdateProject();

updateProject.mutate(
  { id: projectId, data: updatedData },
  {
    onSuccess: () => alert("Updated!"),
  }
);
```

### Delete Item

```tsx
const deleteProject = useDeleteProject();

deleteProject.mutate(projectId, {
  onSuccess: () => alert("Deleted!"),
});
```

## 🔑 Entity Reference

| Entity         | Fetch All         | Fetch One                 | Create                 | Update                 | Delete                 |
| -------------- | ----------------- | ------------------------- | ---------------------- | ---------------------- | ---------------------- |
| **Projects**   | `useProjects()`   | `useProjectDetails(id)`   | `useCreateProject()`   | `useUpdateProject()`   | `useDeleteProject()`   |
| **Properties** | `useProperties()` | `usePropertyDetails(id)`  | `useCreateProperty()`  | `useUpdateProperty()`  | `useDeleteProperty()`  |
| **Users**      | `useUsers()`      | `useUserDetails(id)`      | `useCreateUser()`      | `useUpdateUser()`      | `useDeleteUser()`      |
| **Developers** | `useDevelopers()` | `useDeveloperDetails(id)` | `useCreateDeveloper()` | `useUpdateDeveloper()` | `useDeleteDeveloper()` |
| **Features**   | `useFeatures()`   | `useFeatureDetails(id)`   | `useCreateFeature()`   | `useUpdateFeature()`   | `useDeleteFeature()`   |
| **Areas**      | `useAreas()`      | `useAreaDetails(id)`      | `useCreateArea()`      | `useUpdateArea()`      | `useDeleteArea()`      |
| **Locations**  | `useLocations()`  | `useLocationDetails(id)`  | `useCreateLocation()`  | `useUpdateLocation()`  | `useDeleteLocation()`  |

## 🎯 Special Operations

### Meeting Requests

```tsx
import {
  useConfirmMeetingRequest,
  useCancelMeetingRequest,
} from "@/hooks/useApi";

const confirmMeeting = useConfirmMeetingRequest();
const cancelMeeting = useCancelMeetingRequest();

// Confirm
confirmMeeting.mutate(meetingId);

// Cancel
cancelMeeting.mutate(meetingId);
```

### Properties with Filters

```tsx
const { data: properties } = useProperties(
  "price", // sortBy
  "desc", // sortOrder
  [1, 2], // selectedCountries
  [5], // selectedDevelopers
  [10, 20] // selectedProjects
);
```

### File Uploads (Developers, Media)

```tsx
const createDeveloper = useCreateDeveloper();
const formData = new FormData();
formData.append("name", "Developer Name");
formData.append("logo", file);

createDeveloper.mutate(formData);
```

### Project Features

```tsx
import {
  addProjectFeature,
  editProjectFeature,
  deleteProjectFeature,
} from "@/data/api-client";

// Add feature to project
await addProjectFeature({ project_id: 1, feature_id: 5, value: "Yes" }, token);

// Edit project feature
await editProjectFeature(
  1,
  5,
  { value: "Updated", description: "New desc" },
  token
);

// Delete project feature
await deleteProjectFeature(1, 5, token);
```

### Property Features

```tsx
import {
  addPropertyFeature,
  editPropertyFeature,
  deletePropertyFeature,
} from "@/data/api-client";

// Add feature to property
await addPropertyFeature(
  { property_id: 1, feature_id: 5, value: "Yes" },
  token
);

// Edit property feature
await editPropertyFeature(1, 5, { value: "Updated" }, token);

// Delete property feature
await deletePropertyFeature(1, 5, token);
```

## 🔐 Authentication

### Sign Up

```tsx
import { signUpAdmin } from "@/data/api-client";

await signUpAdmin({
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
  phone_number: "+1234567890",
  password: "password123",
  password_confirmation: "password123",
  role_id: "1",
});
```

### Forgot Password Flow

```tsx
import { forgetPassword, verifyToken, resetPassword } from "@/data/api-client";

// Step 1: Request password reset
await forgetPassword({ email: "john@example.com" });

// Step 2: Verify OTP token
await verifyToken({ token: "123456" });

// Step 3: Reset password
await resetPassword({
  token: "123456",
  password: "newPassword123",
  password_confirmation: "newPassword123",
});
```

## 💡 Tips

1. **Always handle errors**:

   ```tsx
   const mutation = useCreateProject();

   mutation.mutate(data, {
     onError: (error) => {
       console.error(error);
       toast.error("Failed to create project");
     },
   });
   ```

2. **Use loading states**:

   ```tsx
   const { isLoading } = useProjects();

   if (isLoading) return <LoadingSpinner />;
   ```

3. **Invalidate queries after mutations**:

   ```tsx
   // This is already handled in the hooks!
   // But if you need manual control:
   const queryClient = useQueryClient();
   queryClient.invalidateQueries({ queryKey: ["projects"] });
   ```

4. **Optimistic updates**:

   ```tsx
   const updateProject = useUpdateProject();

   updateProject.mutate(
     { id, data },
     {
       onMutate: async (newData) => {
         // Cancel outgoing refetches
         await queryClient.cancelQueries({ queryKey: ["projects"] });

         // Snapshot previous value
         const previous = queryClient.getQueryData(["projects"]);

         // Optimistically update
         queryClient.setQueryData(["projects"], (old) => [...old, newData]);

         return { previous };
       },
       onError: (err, newData, context) => {
         // Rollback on error
         queryClient.setQueryData(["projects"], context.previous);
       },
     }
   );
   ```

## 📚 Additional Resources

- Full API Documentation: `/docs/API_INTEGRATION_GUIDE.md`
- Example Implementations: `/examples/`
- Type Definitions: `/src/types/index.ts`
- Validators: `/src/validators/`
