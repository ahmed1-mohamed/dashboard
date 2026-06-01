# API Integration - Complete Setup

This document provides an overview of how to use the API client and meeting requests functions throughout your project.

## 📋 What's Available

Your project has comprehensive API integration with functions for:

- ✅ **Projects** - CRUD operations + features, media, payments
- ✅ **Properties** - CRUD operations + features, media, filtering
- ✅ **Users** - CRUD operations + roles & permissions
- ✅ **Developers** - CRUD operations + features (with image upload)
- ✅ **Locations & Areas** - Geographic data management
- ✅ **Features** - Property/Project/Developer features
- ✅ **Buildings & Addresses** - Property location details
- ✅ **Milestones & Property Types** - Project planning
- ✅ **Reservations & Referrals** - Business operations
- ✅ **Meeting Requests** - Confirm/Cancel meetings
- ✅ **Authentication** - Sign up, forgot password, reset password

## 🚀 Quick Start (3 Steps)

### Step 1: Import the hook you need

```tsx
import { useProjects, useCreateProject } from "@/hooks/useApi";
```

### Step 2: Use it in your component

```tsx
function MyComponent() {
  const { data, isLoading } = useProjects();
  const createProject = useCreateProject();

  return <div>{/* Your UI */}</div>;
}
```

### Step 3: Call the mutation when needed

```tsx
<button onClick={() => createProject.mutate(projectData)}>Create</button>
```

That's it! ✨

## 📁 Files Created

I've created the following files to help you:

### Documentation

- **`docs/API_INTEGRATION_GUIDE.md`** - Complete reference of all API functions
- **`docs/API_QUICK_REFERENCE.md`** - Quick lookup guide with common patterns

### Reusable Hooks

- **`src/hooks/useApi.ts`** - React Query hooks for all API endpoints
  - Makes API calls super easy with `useProjects()`, `useUsers()`, etc.
  - Handles loading states, caching, and refetching automatically

### Examples

- **`examples/simple-projects-page.tsx`** - Basic page example (START HERE!)
- **`examples/projects-management.tsx`** - Full CRUD example with modals
- **`examples/meeting-requests-handler.tsx`** - Meeting requests example

## 💡 Common Use Cases

### 1. Display a list of items

```tsx
import { useProjects } from "@/hooks/useApi";

function ProjectsList() {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {projects?.data?.map((project) => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  );
}
```

### 2. Create a new item

```tsx
import { useCreateProject } from "@/hooks/useApi";

function CreateProjectButton() {
  const createProject = useCreateProject();

  const handleCreate = () => {
    createProject.mutate(
      { name: "New Project", description: "Description" },
      {
        onSuccess: () => alert("Created!"),
        onError: () => alert("Error!"),
      }
    );
  };

  return <button onClick={handleCreate}>Create</button>;
}
```

### 3. Update an item

```tsx
import { useUpdateProject } from "@/hooks/useApi";

function EditProjectButton({ projectId }) {
  const updateProject = useUpdateProject();

  const handleUpdate = () => {
    updateProject.mutate({
      id: projectId,
      data: { name: "Updated Name" },
    });
  };

  return <button onClick={handleUpdate}>Update</button>;
}
```

### 4. Delete an item

```tsx
import { useDeleteProject } from "@/hooks/useApi";

function DeleteProjectButton({ projectId }) {
  const deleteProject = useDeleteProject();

  const handleDelete = () => {
    if (confirm("Are you sure?")) {
      deleteProject.mutate(projectId);
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```

### 5. Meeting Requests

```tsx
import {
  useConfirmMeetingRequest,
  useCancelMeetingRequest,
} from "@/hooks/useApi";

function MeetingActions({ meetingId }) {
  const confirmMeeting = useConfirmMeetingRequest();
  const cancelMeeting = useCancelMeetingRequest();

  return (
    <div>
      <button onClick={() => confirmMeeting.mutate(meetingId)}>Confirm</button>
      <button onClick={() => cancelMeeting.mutate(meetingId)}>Cancel</button>
    </div>
  );
}
```

## 🎯 Available Hooks

Here are all the hooks you can use:

### Data Fetching (Query Hooks)

- `useProjects()` - Get all projects
- `useProperties()` - Get all properties
- `useUsers()` - Get all users
- `useDevelopers()` - Get all developers
- `useFeatures()` - Get all features
- `useAreas()` - Get all areas
- `useLocations()` - Get all locations
- _...and more!_

### Single Item Details

- `useProjectDetails(id)` - Get project by ID
- `usePropertyDetails(id)` - Get property by ID
- `useUserDetails(id)` - Get user by ID
- _...and more!_

### Mutations (Create/Update/Delete)

- `useCreateProject()`, `useUpdateProject()`, `useDeleteProject()`
- `useCreateProperty()`, `useUpdateProperty()`, `useDeleteProperty()`
- `useCreateUser()`, `useUpdateUser()`, `useDeleteUser()`
- _...and more!_

### Meeting Requests

- `useConfirmMeetingRequest()` - Confirm a meeting
- `useCancelMeetingRequest()` - Cancel a meeting

## 📚 Learn More

1. **Start with the simple example**: `examples/simple-projects-page.tsx`
2. **Check the quick reference**: `docs/API_QUICK_REFERENCE.md`
3. **Read the full guide**: `docs/API_INTEGRATION_GUIDE.md`
4. **See advanced examples**: `examples/projects-management.tsx`

## ⚙️ Setup Requirements

Make sure you have these in your project:

### 1. Environment Variables (`.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/dashboard
NEXT_PUBLIC_API_URL_WITHOUT_DASHBOARD=http://localhost:8000
```

### 2. React Query Provider (layout.tsx or app provider)

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

### 3. NextAuth Session Provider (if using authentication)

```tsx
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

## 🔍 Troubleshooting

### "Module not found" errors

Make sure you have these dependencies installed:

```bash
npm install @tanstack/react-query axios next-auth
```

### No data returned

- Check that your API URL in `.env` is correct
- Verify the authentication token is being passed
- Check the browser console for API errors

### TypeScript errors

- Ensure you have the correct type definitions in `src/types/index.ts`
- Update the type imports in the hooks if needed

## 💬 Need Help?

- Check the examples in `examples/` directory
- Read the documentation in `docs/` directory
- Review the type definitions in `src/types/index.ts`
- Look at the validators in `src/validators/` for data structure

## 🎉 You're All Set!

You now have everything you need to handle APIs in your project. Start with the simple example and build from there!
