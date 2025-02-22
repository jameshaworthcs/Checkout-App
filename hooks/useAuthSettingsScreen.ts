import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { useAuth } from './useAuth';
import { checkoutApi } from '@/utils/api';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

interface AccountInfo {
  email: string;
  username: string;
  accountCreationTime: string;
}

export function useAuthSettingsScreen() {
  const { token, isLoggedIn } = useAuth();
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const shouldFetchData = useCallback(() => {
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTime;
    return timeSinceLastFetch > 5000 || lastFetchTime === 0;
  }, [lastFetchTime]);

  const fetchAccountInfo = useCallback(
    async (forceRefresh = false) => {
      if (!token) return;

      const shouldFetch = shouldFetchData();
      if (!forceRefresh && !shouldFetch) {
        return;
      }

      try {
        // Only show loading state if we don't have cached data
        if (!accountInfo) {
          setLoading(true);
        }

        const response = await checkoutApi('/api/settings/account');
        const data = await response.json();

        if (!data.account) {
          await SecureStore.setItemAsync('is_logged_in', 'false');
          setAccountInfo(null);
          return;
        }

        setAccountInfo(data.accountInfo);
        setLastFetchTime(Date.now());

        if (forceRefresh) {
          Alert.alert('Success', 'Account information has been refreshed');
        }
      } catch (error) {
        console.error('Error fetching account info:', error);
        if (forceRefresh) {
          Alert.alert('Error', 'Failed to refresh account information');
        }
      } finally {
        setLoading(false);
      }
    },
    [token, accountInfo, shouldFetchData]
  );

  // Add focus effect to check data when tab is focused
  useFocusEffect(
    useCallback(() => {
      if (token && isLoggedIn) {
        const shouldFetch = shouldFetchData();
        if (shouldFetch) {
          fetchAccountInfo();
        }
      }
    }, [token, isLoggedIn, shouldFetchData, fetchAccountInfo])
  );

  // Keep the existing useEffect for initial load
  useEffect(() => {
    if (token && isLoggedIn) {
      const shouldFetch = shouldFetchData();
      if (shouldFetch) {
        fetchAccountInfo();
      }
    }
  }, [token, isLoggedIn, shouldFetchData, fetchAccountInfo]);

  return {
    accountInfo,
    loading,
    fetchAccountInfo,
  };
}
