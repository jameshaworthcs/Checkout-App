import * as SecureStore from 'expo-secure-store';
import { CHECKOUT_API_URL } from '@/constants/api';

const API_TOKEN_KEY = 'api_token';

type RequestOptions = {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
};

export async function checkoutApi(path: string, options: RequestOptions = {}) {
  const token = await SecureStore.getItemAsync(API_TOKEN_KEY);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
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

  return response;
}
