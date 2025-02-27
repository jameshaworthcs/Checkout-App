import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

class WebStorage {
  async getItem(key: string): Promise<string | null> {
    return localStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
  }

  async deleteItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  }
}

class NativeStorage {
  async getItem(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  }

  async deleteItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  }
}

// Export the appropriate storage implementation based on platform
export const storage = Platform.select({
  web: new WebStorage(),
  default: new NativeStorage(),
})!;
