import type { AxiosResponse, AxiosError, AxiosInstance } from 'axios';
import axios from 'axios';
import type ApiResponse from './ApiResponse';

export class ApiService {
  private readonly axiosInstance: AxiosInstance;
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = `${process.env.API_SERVER_HOST ?? 'http://localhost'}:${process.env.API_SERVER_PORT ?? '3001'}/api`;

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    // Add response interceptor for consistent error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => Promise.reject(error),
    );
  }

  private handleError<T>(error: unknown, defaultData: T): ApiResponse<T> {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse<T>>;

      // If the server returned an ApiResponse structure, use it
      if (
        axiosError.response?.data &&
        typeof axiosError.response.data === 'object' &&
        'success' in axiosError.response.data
      ) {
        return axiosError.response.data;
      }

      return {
        data: defaultData,
        message: axiosError.message || 'Network error occurred',
        success: false,
      } as ApiResponse<T>;
    }

    if (error instanceof Error) {
      return {
        data: defaultData,
        message: error.message || 'Unknown error occurred',
        success: false,
      } as ApiResponse<T>;
    }

    return {
      data: defaultData,
      message: 'An unexpected error occurred',
      success: false,
    } as ApiResponse<T>;
  }

  async get<T>(endpoint: string, params?: unknown): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.axiosInstance.get<ApiResponse<T>>(
        endpoint,
        {
          params: params,
        },
      );
      return response.data;
    } catch (error: unknown) {
      // For GET requests, return empty array as default for array types, null for objects
      return this.handleError<T>(error, [] as unknown as T);
    }
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.axiosInstance.post<ApiResponse<T>>(
        endpoint,
        data,
      );
      return response.data;
    } catch (error: unknown) {
      return this.handleError<T>(error, null as unknown as T);
    }
  }

  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.axiosInstance.put<ApiResponse<T>>(
        endpoint,
        data,
      );
      return response.data;
    } catch (error: unknown) {
      return this.handleError<T>(error, null as unknown as T);
    }
  }

  async delete<T = unknown>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> =
        await this.axiosInstance.delete<ApiResponse<T>>(endpoint);
      return response.data;
    } catch (error: unknown) {
      return this.handleError<T>(error, null as unknown as T);
    }
  }

  // Additional utility methods for better type safety
  async patch<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.axiosInstance.patch<
        ApiResponse<T>
      >(endpoint, data);
      return response.data;
    } catch (error: unknown) {
      return this.handleError<T>(error, null as unknown as T);
    }
  }

  // Method to set authorization header
  setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Method to remove authorization header
  removeAuthToken(): void {
    delete this.axiosInstance.defaults.headers.common['Authorization'];
  }

  // Method to update base URL if needed
  updateBaseUrl(newBaseUrl: string): void {
    this.axiosInstance.defaults.baseURL = newBaseUrl;
  }
}

export const apiService = new ApiService();
