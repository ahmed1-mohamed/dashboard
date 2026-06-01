"use client";

import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { API_CONFIG } from "@/data/config";
import { apiLogger } from "./logger";
import { signOut } from "next-auth/react";

interface RefreshResponse {
  accessToken: string;
  expires_at: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private expiresAt: number | null = null;
  private isRefreshing = false;
  private refreshQueue: ((token: string) => void)[] = [];
  private sessionUpdateCallback:
    | ((data: { accessToken: string; expiresAt: number }) => Promise<void>)
    | null = null;
  private isInitialized = false;
  private resolveInit: (() => void) | null = null;
  private initPromise: Promise<void>;

  constructor() {
    this.initPromise = new Promise((resolve) => {
      this.resolveInit = resolve;
    });

    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      headers: API_CONFIG.DEFAULT_HEADERS,
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  // Interceptors
  private async waitForInit() {
    if (!this.isInitialized) {
      await this.initPromise;
    }
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(async (config) => {
      await this.waitForInit();

      // Handle authentication
      if (this.accessToken && this.expiresAt) {
        const now = Math.floor(Date.now() / 1000);
        const isExpiringSoon = this.expiresAt <= now + 60;

        if (isExpiringSoon) {
          apiLogger.auth("⏰ Token expiring soon → refreshing");
          await this.refreshToken();
        }
      }

      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      } else {
        delete config.headers.Authorization;
      }

      apiLogger.request(config);
      return config;
    });

    this.client.interceptors.response.use(
      (response) => {
        apiLogger.response(response);
        return response;
      },
      async (error: AxiosError) => {
        apiLogger.error(error);

        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          apiLogger.auth("⚠️ 401 → attempting refresh");

          try {
            await this.refreshToken();

            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${this.accessToken}`,
            };

            return this.client(originalRequest);
          } catch {
            apiLogger.auth("❌ Refresh failed → redirecting to login");
            this.clearAuthToken();
            await signOut({ redirect: false });
            window.location.href = "/";
            return;
          }
        }

        return Promise.reject(error);
      },
    );
  }

  setSessionUpdateCallback(
    callback: (data: {
      accessToken: string;
      expiresAt: number;
    }) => Promise<void>,
  ) {
    this.sessionUpdateCallback = callback;
  }

  private async refreshToken() {
    if (this.isRefreshing) {
      return new Promise<void>((resolve) => {
        this.refreshQueue.push(() => resolve());
      });
    }

    this.isRefreshing = true;

    try {
      apiLogger.auth("🔄 Calling /api/auth/refresh");

      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        this.clearAuthToken();
        await signOut({ redirect: false });
        window.location.href = "/";
        return;
      }

      const data: RefreshResponse = await res.json();

      this.accessToken = data.accessToken;
      this.expiresAt = data.expires_at;

      if (this.sessionUpdateCallback) {
        await this.sessionUpdateCallback({
          accessToken: data.accessToken,
          expiresAt: data.expires_at,
        });
      }

      this.processQueue();
    } finally {
      this.isRefreshing = false;
    }
  }

  private processQueue() {
    this.refreshQueue.forEach((cb) => cb(this.accessToken!));
    this.refreshQueue = [];
  }

  // HTTP Methods - Country is automatically added via interceptor
  private buildHeaders(data?: unknown, config?: any) {
    const isFormData = data instanceof FormData;
    return {
      ...config?.headers,
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
    };
  }

  async get<T>(endpoint: string, config?: any): Promise<AxiosResponse<T>> {
    return await this.client.get<T>(endpoint, {
      ...config,
      headers: this.buildHeaders(undefined, config),
    });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: any,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post(endpoint, data, {
      ...config,
      headers: this.buildHeaders(data, config),
    });
    return { data: response.data, status: response.status };
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: any,
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.client.put(endpoint, data, {
      ...config,
      headers: this.buildHeaders(data, config),
    });
    return { data: response.data, status: response.status };
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: any,
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.client.patch(endpoint, data, {
      ...config,
      headers: this.buildHeaders(data, config),
    });
    return { data: response.data, status: response.status };
  }

  async delete<T>(endpoint: string, config?: any): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.client.delete(endpoint, {
      ...config,
      headers: this.buildHeaders(undefined, config),
    });
    return { data: response.data, status: response.status };
  }

  // Token Control
  setAuthToken(token?: string | null, expiresAt?: number | null) {
    this.accessToken = token ?? null;
    this.expiresAt = expiresAt ?? null;

    if (token) {
      this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common["Authorization"];
    }

    this.isInitialized = true;
    if (this.resolveInit) {
      this.resolveInit();
      this.resolveInit = null;
    }

    apiLogger.auth("🔑 Token initialized", {
      hasToken: !!token,
      expiresAt,
    });
  }

  clearAuthToken() {
    this.accessToken = null;
    this.expiresAt = null;
    this.isInitialized = true;
    delete this.client.defaults.headers.common["Authorization"];
    if (this.resolveInit) {
      this.resolveInit();
    }
  }
}

export const apiClient = new ApiClient();
