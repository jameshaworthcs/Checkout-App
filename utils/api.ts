import * as SecureStore from 'expo-secure-store';
import { CHECKOUT_API_URL } from '@/constants/api';

const API_TOKEN_KEY = 'api_token';

type RequestOptions = {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
};

type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function checkoutApi<T = any>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const token = await SecureStore.getItemAsync(API_TOKEN_KEY);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'CheckOut-App/1.0',
      ...options.headers,
    };

    if (token) {
      headers['x-checkout-key'] = token;
    }

    const response = await fetch(`${CHECKOUT_API_URL}${path}`, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      let errorMessage = 'An error occurred while processing your request';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {}

      return { success: false, error: errorMessage };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
    return { success: false, error: errorMessage };
  }
}
