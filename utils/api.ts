
import Constants from 'expo-constants';
import { authClient } from '@/lib/auth';

// Get backend URL from app.json configuration
export const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl || 'http://localhost:3000';

console.log('API: Backend URL configured as:', BACKEND_URL);

/**
 * Helper function to make authenticated API calls
 * Automatically includes auth token if user is signed in
 */
export async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    // Get session to include auth token
    const session = await authClient.getSession();
    const token = session?.data?.session?.token;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${BACKEND_URL}${endpoint}`;
    console.log(`API: ${options.method || 'GET'} ${url}`);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`API: Response from ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`API: Failed to call ${endpoint}:`, error);
    throw error;
  }
}
