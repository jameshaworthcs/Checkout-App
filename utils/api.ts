import { CHECKOUT_API_URL } from '@/constants/api';
import { storage } from '@/utils/storage';
import { Platform } from 'react-native';

const API_TOKEN_KEY = 'api_token';

type RequestOptions = {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
};

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

export async function checkoutApi<T = any>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const token = await storage.getItem(API_TOKEN_KEY);

    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...options.headers,
    };

    // Only add Content-Type for non-GET requests or when there's a body
    if (options.method !== 'GET' || options.body) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['x-checkout-key'] = token;
    }

    // Add User-Agent only for mobile platforms
    if (Platform.OS !== 'web') {
      headers['User-Agent'] = 'CheckOut-App/1.0';
    }

    const url = `${CHECKOUT_API_URL}${path}`;

    const fetchOptions: RequestInit = {
      method: options.method || 'GET',
      headers,
      credentials: 'include', // Include cookies if any
      mode: 'cors', // Enable CORS
    };

    if (options.body) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, fetchOptions);

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
