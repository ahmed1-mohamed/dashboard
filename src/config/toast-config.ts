import { toast } from "sonner";

// Toast configuration and helper functions
export const toastConfig = {
  duration: {
    short: 2000,
    medium: 3000,
    long: 5000,
  },
  position: "top-right" as const,
};

// Success toast helper
export const showSuccess = (title: string, description?: string) => {
  toast.success(title, {
    description,
    duration: toastConfig.duration.medium,
    position: toastConfig.position,
    richColors: true,
    closeButton: true,
  });
};

// Error toast helper
export const showError = (title: string, description?: string) => {
  toast.error(title, {
    description,
    duration: toastConfig.duration.long,
    position: toastConfig.position,
    richColors: true,
    closeButton: true,
  });
};

// Warning toast helper
export const showWarning = (title: string, description?: string) => {
  toast.warning(title, {
    description,
    duration: toastConfig.duration.medium,
    position: toastConfig.position,
    richColors: true,
    closeButton: true,
  });
};

// Info toast helper
export const showInfo = (title: string, description?: string) => {
  toast.info(title, {
    description,
    duration: toastConfig.duration.medium,
    position: toastConfig.position,
    richColors: true,
    closeButton: true,
  });
};

// Promise toast helper (for async operations)
export const showPromise = <T>(
  promise: Promise<T>,
  {
    loading,
    success,
    error,
  }: {
    loading: string;
    success: (data: T) => string;
    error: (error: unknown) => string;
  }
) => {
  return toast.promise(promise, {
    loading,
    success: (data) => success(data),
    error: (error) => error(error),
  });
};

// Toast messages for common actions
export const toastMessages = {
  // Auth
  auth: {
    loginSuccess: "Welcome back! Login successful.",
    loginError: "Invalid credentials. Please try again.",
    logoutSuccess: "You have been logged out successfully.",
    sessionExpired: "Your session has expired. Please log in again.",
    unauthorized: "You are not authorized to perform this action.",
  },
  // Ads
  ads: {
    createSuccess: "Advertisement created successfully!",
    createError: "Failed to create advertisement. Please try again.",
    updateSuccess: "Advertisement updated successfully!",
    updateError: "Failed to update advertisement. Please try again.",
    deleteSuccess: "Advertisement deleted successfully!",
    deleteError: "Failed to delete advertisement. Please try again.",
    statusToggle: (status: string) => `Ad ${status} successfully!`,
  },
  // General
  general: {
    saved: "Changes saved successfully!",
    savedError: "Failed to save changes. Please try again.",
    deleted: "Item deleted successfully!",
    deletedError: "Failed to delete item. Please try again.",
    loaded: "Data loaded successfully!",
    loadedError: "Failed to load data. Please try again.",
    networkError: "Network error. Please check your connection.",
    serverError: "Server error. Please try again later.",
  },
};
