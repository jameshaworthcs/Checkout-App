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
  status?: number;
};

export async function checkoutApi<T = any>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const token = await SecureStore.getItemAsync(API_TOKEN_KEY);
    console.log('API Token present:', !!token);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'CheckOut-App/1.0',
      ...options.headers,
    };

    if (token) {
      headers['x-checkout-key'] = token;
    }

    const url = `${CHECKOUT_API_URL}${path}`;

    const response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorMessage = 'An error occurred while processing your request';
      let errorData;

      try {
        errorData = await response.json();
        console.log('Error response data:', errorData);
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status,
        data: errorData,
      };
    }

    const data = await response.json();

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error) {
    console.error('API request failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
    return {
      success: false,
      error: errorMessage,
      status: 0, // 0 indicates network error
    };
  }
}
