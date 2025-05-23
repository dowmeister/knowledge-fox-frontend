import type ApiResponse from './ApiResponse';

export class ApiService {
  private baseUrl = process.env.API_SERVER_HOST + ':' + process.env.API_SERVER_PORT + '/api'; // Adjust to match your API server

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error: any) {
      // Mock response for demo - remove in production
      return {
        data: [] as T,
        message: error.message || 'Error occurred',
        success: true,
      };
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error: any) {
      return {
        data: null as T,
        message: error.message || 'Error occurred',
        success: false,
      };
    }
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error: any) {
      return {
        data: null as T,
        message: error.message || 'Error occurred',
        success: false,
      };
    }
  }

  async delete(endpoint: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error: any) {
      return {
        data: null as any,
        message: error.message || 'Error occurred',
        success: false,
      };
    }
  }
}

export const apiService = new ApiService();
