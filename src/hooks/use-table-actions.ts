// // import { useState, useCallback } from "react";
// // import { useMutation, useQueryClient } from "@tanstack/react-query";
// // import { toast } from "sonner";
// // import { 
// //   AdminApiConfig, 
// //   UseTableActionsOptions, 
// //   TableActionHandlers,
// //   ApiError 
// // } from "@/types/admin-api.types";

// // export const useTableActions = <T>(
// //   options: UseTableActionsOptions<T>
// // ): TableActionHandlers<T> => {
// //   // const {
// //   //   config,
// //   //   onSuccess,
// //   //   onError
// //   // } = options;

// //   // const queryClient = useQueryClient();
  
// //   // // Default toast messages
// //   // const toastMessages = config.toastMessages || {
// //   //   createSuccess: "Item created successfully",
// //   //   updateSuccess: "Item updated successfully", 
// //   //   deleteSuccess: "Item deleted successfully",
// //   //   error: "Operation failed"
// //   // };

// //   // // Create mutation
// //   // const createMutation = useMutation({
// //   //   mutationFn: async (data: T) => {
// //   //     const token = require("@/lib/apiClient").apiClient.getAuthToken?.();
// //   //     if (!token) throw new Error("No access token available");
      
// //   //     const apiClient = require("@/lib/apiClient").apiClient;
// //   //     apiClient.setAuthToken(token, Math.floor(Date.now() / 1000) + 3600);
      
// //   //     const endpoint = config.createEndpoint();
// //   //     const mappedData = config.mapFromItem(data);
// //   //     const response = await apiClient.post<any>(endpoint, mappedData);
      
// //   //     // Handle different response formats
// //   //     if (response.data && response.data.data) {
// //   //       return config.mapToItem(response.data.data);
// //   //     } else if (response.data) {
// //   //       return config.mapToItem(response.data);
// //   //     }
      
// //   //     throw new Error("Invalid response format");
// //   //   },
// //   //   onSuccess: (data) => {
// //   //     queryClient.invalidateQueries({ queryKey: ["paginated-data", config.listEndpoint] });
// //   //     toast.success(toastMessages.createSuccess);
// //   //     onSuccess?.("create", data);
// //   //   },
// //   //   onError: (error) => {
// //   //     console.error("Error creating item:", error);
// //   //     const apiError = error as ApiError;
// //   //     toast.error(
// //   //       apiError.message || 
// //   //       toastMessages.error
// //   //     );
// //   //     onError?.("create", apiError);
// //   //   }
// //   // });

// //   // // Edit mutation
// //   // const editMutation = useMutation({
// //   //   mutationFn: async ({ id, data }: { id: number | string; data: T }) => {
// //   //     const token = require("@/lib/apiClient").apiClient.getAuthToken?.();
// //   //     if (!token) throw new Error("No access token available");
      
// //   //     const apiClient = require("@/lib/apiClient").apiClient;
// //   //     apiClient.setAuthToken(token, Math.floor(Date.now() / 1000) + 3600);
      
// //   //     const endpoint = config.updateEndpoint(id);
// //   //     const mappedData = config.mapFromItem(data);
// //   //     const response = await apiClient.put<any>(endpoint, mappedData);
      
// //   //     // Handle different response formats
// //   //     if (response.data && response.data.data) {
// //   //       return config.mapToItem(response.data.data);
// //   //     } else if (response.data) {
// //   //       return config.mapToItem(response.data);
// //   //     }
      
// //   //     throw new Error("Invalid response format");
// //   //   },
// //   //   onSuccess: (data, variables) => {
// //   //     queryClient.invalidateQueries({ queryKey: ["paginated-data", config.listEndpoint] });
// //   //     toast.success(toastMessages.updateSuccess);
// //   //     onSuccess?.("edit", data);
// //   //   },
// //   //   onError: (error, variables) => {
// //   //     console.error("Error editing item:", error);
// //   //     const apiError = error as ApiError;
// //   //     toast.error(
// //   //       apiError.message || 
// //   //       toastMessages.error
// //   //     );
// //   //     onError?.("edit", apiError);
// //   //   }
// //   // });

// //   // // Delete mutation
// //   // const deleteMutation = useMutation({
// //   //   mutationFn: async (id: number | string) => {
// //   //     const token = require("@/lib/apiClient").apiClient.getAuthToken?.();
// //   //     if (!token) throw new Error("No access token available");
      
// //   //     const apiClient = require("@/lib/apiClient").apiClient;
// //   //     apiClient.setAuthToken(token, Math.floor(Date.now() / 1000) + 3600);
      
// //   //     const endpoint = config.deleteEndpoint(id);
// //   //     await apiClient.delete<any>(endpoint);
      
// //   //     return id;
// //   //   },
// //   //   onSuccess: (data) => {
// //   //     queryClient.invalidateQueries({ queryKey: ["paginated-data", config.listEndpoint] });
// //   //     toast.success(toastMessages.deleteSuccess);
// //   //     onSuccess?.("delete", {} as T); // Pass empty object as we don't have the deleted data
// //   //   },
// //   //   onError: (error, id) => {
// //   //     console.error("Error deleting item:", error);
// //   //     const apiError = error as ApiError;
// //   //     toast.error(
// //   //       apiError.message || 
// //   //       toastMessages.error
// //   //     );
// //   //     onError?.("delete", apiError);
// //   //   }
// //   // });

// //   // // Toggle mutation (for status/enabled fields)
// //   // const toggleMutation = useMutation({
// //   //   mutationFn: async ({ id, enabled }: { id: number | string; enabled: boolean }) => {
// //   //     const token = require("@/lib/apiClient").apiClient.getAuthToken?.();
// //   //     if (!token) throw new Error("No access token available");
      
// //   //     const apiClient = require("@/lib/apiClient").apiClient;
// //   //     apiClient.setAuthToken(token, Math.floor(Date.now() / 1000) + 3600);
      
// //   //     // Assuming toggle endpoint follows pattern: {baseEndpoint}/{id}/toggle-status
// //   //     const baseEndpoint = config.deleteEndpoint(0).replace("/0", ""); // Remove ID to get base
// //   //     const endpoint = `${baseEndpoint}/${id}/toggle-status`;
      
// //   //     const response = await apiClient.patch<any>(endpoint, { enabled: enabled ? 1 : 0 });
      
// //   //     // Handle different response formats
// //   //     if (response.data && response.data.data) {
// //   //       return config.mapToItem(response.data.data);
// //   //     } else if (response.data) {
// //   //       return config.mapToItem(response.data);
// //   //     }
      
// //   //     return { id, enabled } as unknown as T; // Fallback
// //   //   },
// //   //   onSuccess: (data, variables) => {
// //   //     queryClient.invalidateQueries({ queryKey: ["paginated-data", config.listEndpoint] });
// //   //     const statusText = variables.enabled ? "enabled" : "disabled";
// //   //     toast.success(`Item ${statusText} successfully`);
// //   //     onSuccess?.("toggle", data);
// //   //   },
// //   //   onError: (error, variables) => {
// //   //     console.error("Error toggling item:", error);
// //   //     const apiError = error as ApiError;
// //   //     toast.error(
// //   //       apiError.message || 
// //   //       toastMessages.error
// //   //     );
// //   //     onError?.("toggle", apiError);
// //   //   }
// //   // });

// //   // // Action handlers
// //   // const onAdd = useCallback(async (data: T) => {
// //   //   await createMutation.mutateAsync(data);
// //   // }, [createMutation]);

// //   // const onEdit = useCallback(async (id: number | string, data: T) => {
// //   //   await editMutation.mutateAsync({ id, data });
// //   // }, [editMutation]);

// //   // const onDelete = useCallback(async (id: number | string) => {
// //   //   await deleteMutation.mutateAsync(id);
// //   // }, [deleteMutation]);

// //   // const onToggle = useCallback(async (id: number | string, enabled: boolean) => {
// //   //   await toggleMutation.mutateAsync({ id, enabled });
// //   // }, [toggleMutation]);

// //   // const onView = useCallback((id: number | string) => {
// //   //   // View action typically just navigates to detail page
// //   //   // Implementation depends on routing, so we leave it to the consumer
// //   //   // But we can provide a default implementation if needed
// //   //   console.log(`View item with ID: ${id}`);
// //   // }, []);

// //   // return {
// //   //   onAdd,
// //   //   onEdit,
// //   //   onDelete,
// //   //   onToggle,
// //   //   onView
// //   // };
// // };
// "use client";

// import { useCallback } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { apiClient } from "@/lib/apiClient";
// import {
//   AdminApiConfig,
//   UseTableActionsOptions,
//   TableActionHandlers,
//   ApiError,
// } from "@/types/admin-api.types";

// export const useTableActions = <T, CreateInput = T, UpdateInput = T>(
//   options: UseTableActionsOptions<T>,
// ): TableActionHandlers<T> => {
//   const { config, onSuccess, onError } = options;
//   const queryClient = useQueryClient();

//   const toastMessages = config.toastMessages || {
//     createSuccess: "Item created successfully",
//     updateSuccess: "Item updated successfully",
//     deleteSuccess: "Item deleted successfully",
//     error: "Operation failed",
//   };

//   // 🔵 CREATE
//   const createMutation = useMutation<T, Error, CreateInput>({
//     mutationFn: async (data) => {
//       const token = apiClient.getAuthToken?.();
//       if (!token) throw new Error("No access token available");

//       apiClient.setAuthToken(token, Math.floor(Date.now() / 1000) + 3600);

//       const endpoint = config.createEndpoint();
//       const mappedData = config.mapFromItem(data as unknown as T);

//       const response = await apiClient.post<any>(endpoint, mappedData);

//       const result = response?.data?.data ?? response?.data;

//       if (!result) throw new Error("Invalid response format");

//       return config.mapToItem(result);
//     },

//     onSuccess: (data) => {
//       queryClient.invalidateQueries({
//         queryKey: ["paginated-data", config.listEndpoint],
//       });

//       toast.success(toastMessages.createSuccess);
//       onSuccess?.("create", data);
//     },

//     onError: (error: Error) => {
//       const apiError = error as ApiError;

//       toast.error(apiError.message || toastMessages.error);
//       onError?.("create", apiError);
//     },
//   });

//   // 🟡 EDIT
//   const editMutation = useMutation<
//     T,
//     Error,
//     { id: number | string; data: UpdateInput }
//   >({
//     mutationFn: async ({ id, data }) => {
//       const token = apiClient.getAuthToken?.();
//       if (!token) throw new Error("No access token available");

//       apiClient.setAuthToken(token, Math.floor(Date.now() / 1000) + 3600);

//       const endpoint = config.updateEndpoint(id);
//       const mappedData = config.mapFromItem(data as unknown as T);

//       const response = await apiClient.put<any>(endpoint, mappedData);

//       const result = response?.data?.data ?? response?.data;

//       if (!result) throw new Error("Invalid response format");

//       return config.mapToItem(result);
//     },

//     onSuccess: (data) => {
//       queryClient.invalidateQueries({
//         queryKey: ["paginated-data", config.listEndpoint],
//       });

//       toast.success(toastMessages.updateSuccess);
//       onSuccess?.("edit", data);
//     },

//     onError: (error: Error) => {
//       const apiError = error as ApiError;

//       toast.error(apiError.message || toastMessages.error);
//       onError?.("edit", apiError);
//     },
//   });

//   // 🔴 DELETE
//   const deleteMutation = useMutation<T, Error, number | string>({
//     mutationFn: async (id) => {
//       const token = apiClient.getAuthToken?.();
//       if (!token) throw new Error("No access token available");

//       apiClient.setAuthToken(token, Math.floor(Date.now() / 1000) + 3600);

//       const endpoint = config.deleteEndpoint(id);
//       await apiClient.delete(endpoint);

//       return id as unknown as T;
//     },

//     onSuccess: (data) => {
//       queryClient.invalidateQueries({
//         queryKey: ["paginated-data", config.listEndpoint],
//       });

//       toast.success(toastMessages.deleteSuccess);
//       onSuccess?.("delete", data);
//     },

//     onError: (error: Error) => {
//       const apiError = error as ApiError;

//       toast.error(apiError.message || toastMessages.error);
//       onError?.("delete", apiError);
//     },
//   });

//   // 🟣 TOGGLE
//   const toggleMutation = useMutation<
//     T,
//     Error,
//     { id: number | string; enabled: boolean }
//   >({
//     mutationFn: async ({ id, enabled }) => {
//       const token = apiClient.getAuthToken?.();
//       if (!token) throw new Error("No access token available");

//       apiClient.setAuthToken(token, Math.floor(Date.now() / 1000) + 3600);

//       const baseEndpoint = config.listEndpoint;
//       const endpoint = `${baseEndpoint}/${id}/toggle-status`;

//       const response = await apiClient.patch<any>(endpoint, {
//         enabled: enabled ? 1 : 0,
//       });

//       const result = response?.data?.data ?? response?.data;

//       if (!result) return { id, enabled } as unknown as T;

//       return config.mapToItem(result);
//     },

//     onSuccess: (data, variables) => {
//       queryClient.invalidateQueries({
//         queryKey: ["paginated-data", config.listEndpoint],
//       });

//       toast.success(
//         `Item ${variables.enabled ? "enabled" : "disabled"} successfully`,
//       );

//       onSuccess?.("toggle", data);
//     },

//     onError: (error: Error) => {
//       const apiError = error as ApiError;

//       toast.error(apiError.message || toastMessages.error);
//       onError?.("toggle", apiError);
//     },
//   });

//   // 🎯 HANDLERS
//   const onAdd = useCallback(
//     async (data: CreateInput) => {
//       await createMutation.mutateAsync(data);
//     },
//     [createMutation],
//   );

//   const onEdit = useCallback(
//     async (id: number | string, data: UpdateInput) => {
//       await editMutation.mutateAsync({ id, data });
//     },
//     [editMutation],
//   );

//   const onDelete = useCallback(
//     async (id: number | string) => {
//       await deleteMutation.mutateAsync(id);
//     },
//     [deleteMutation],
//   );

//   const onToggle = useCallback(
//     async (id: number | string, enabled: boolean) => {
//       await toggleMutation.mutateAsync({ id, enabled });
//     },
//     [toggleMutation],
//   );

//   const onView = useCallback((id: number | string) => {
//     console.log("View item:", id);
//   }, []);

//   return {
//     onAdd,
//     onEdit,
//     onDelete,
//     onToggle,
//     onView,
//   };
// };