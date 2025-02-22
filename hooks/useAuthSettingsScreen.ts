import { useState, useEffect, useRef } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useToast } from '@/hooks/useToast';
import { useAuth } from './useAuth';
import { checkoutApi } from '@/utils/api';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

interface AccountInfo {
  email: string;
  username: string;
  accountCreationTime: string;
}

const CACHE_LIFETIME = 5000; // 5 seconds

export function useAuthSettingsScreen() {
  const { token, isLoggedIn } = useAuth();
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const fetchInProgress = useRef(false);
  const toast = useToast();

  const isCacheStale = useCallback(() => {
    const now = Date.now();
    return now - lastFetchTime > CACHE_LIFETIME;
  }, [lastFetchTime]);

  const fetchAccountInfo = useCallback(
    async (forceRefresh = false) => {
      if (!token || !isLoggedIn) {
        console.log('Fetch aborted - no token or not logged in');
        return;
      }

      // If we have cached data and it's not stale, don't fetch
      if (!forceRefresh && !isCacheStale()) {
        console.log('Using cached data, cache is still fresh');
        return;
      }

      // Use ref to prevent concurrent fetches
      if (fetchInProgress.current) {
        console.log('Fetch skipped - already in progress');
        return;
      }

      try {
        console.log('Fetching fresh account info...');
        fetchInProgress.current = true;
        setLoading(true);

        const response = await checkoutApi('/api/settings/account');

        if (!response.data?.accountInfo) {
          throw new Error('Invalid account data received');
        }

        const newAccountInfo = response.data.accountInfo;

        // Only update cache and data if the fetch was successful
        setAccountInfo(newAccountInfo);
        await SecureStore.setItemAsync('account_info', JSON.stringify(newAccountInfo));
        setLastFetchTime(Date.now());

        if (forceRefresh) {
          toast.success('Success', {
            text2: 'Account information has been refreshed',
          });
        }
      } catch (error) {
        console.error('Error fetching account info:', error);
        // Only show error on manual refresh or if we have no cached data
        if (forceRefresh || !accountInfo) {
          toast.error('Error', {
            text2: error instanceof Error ? error.message : 'Failed to refresh account information',
          });
        }
      } finally {
        setLoading(false);
        fetchInProgress.current = false;
      }
    },
    [token, isLoggedIn, isCacheStale, accountInfo, toast]
  );

  // Load initial data from SecureStore
  useEffect(() => {
    const loadStoredAccountInfo = async () => {
      if (!isLoggedIn) return;

      try {
        console.log('Loading stored account info...');
        const storedInfo = await SecureStore.getItemAsync('account_info');

        if (storedInfo) {
          const parsedInfo = JSON.parse(storedInfo);
          console.log('Found stored account info, using as initial data');
          setAccountInfo(parsedInfo);

          // Trigger a background refresh if cache is stale
          if (isCacheStale()) {
            console.log('Stored data is stale, fetching fresh data in background');
            fetchAccountInfo(false);
          }
        } else {
          console.log('No stored account info found, fetching fresh data');
          fetchAccountInfo(true);
        }
      } catch (error) {
        console.error('Error loading stored account info:', error);
        fetchAccountInfo(true);
      }
    };

    loadStoredAccountInfo();
  }, [isLoggedIn, isCacheStale, fetchAccountInfo]);

  // Clear data on logout
  useEffect(() => {
    if (!isLoggedIn) {
      console.log('Clearing account info due to logout');
      setAccountInfo(null);
      setLastFetchTime(0);
      SecureStore.deleteItemAsync('account_info');
    }
  }, [isLoggedIn]);

  // Check for updates when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (token && isLoggedIn && isCacheStale()) {
        console.log('Screen focused and cache is stale, fetching fresh data');
        fetchAccountInfo(false);
      }
    }, [token, isLoggedIn, isCacheStale, fetchAccountInfo])
  );

  return {
    accountInfo,
    loading,
    fetchAccountInfo,
  };
}
