import { useState, useCallback } from 'react';
import { checkoutApi } from '@/utils/api';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';

interface AccountInfo {
  email: string;
  username: string;
  accountCreationTime: string;
}

export function useSettingsAccount() {
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const toast = useToast();
  const { accountInfo: authAccountInfo } = useAuth();

  const initializeAccountInfo = useCallback((info: AccountInfo) => {
    setAccountInfo(info);
  }, []);

  // Initialize with auth account info if available
  if (!accountInfo && authAccountInfo) {
    initializeAccountInfo(authAccountInfo);
  }

  const fetchAccountInfo = useCallback(
    async (showToast = false) => {
      // Don't fetch if logging out or recently logged out
      if (isLoggingOut) return;

      // Prevent duplicate requests within 2 seconds
      const now = Date.now();
      if (isRefreshing || now - lastFetchTime < 2000) return;

      setIsRefreshing(true);
      setLastFetchTime(now);

      try {
        const response = await checkoutApi('/api/settings/account');

        if (!response.success || !response.data?.accountInfo) {
          throw new Error(response.error || 'Invalid account data received');
        }

        setAccountInfo(response.data.accountInfo);

        if (showToast) {
          toast.success('Success', {
            text2: 'Account information has been refreshed',
          });
        }
      } catch (error) {
        if (showToast) {
          toast.error('Error', {
            text2: error instanceof Error ? error.message : 'Failed to refresh account information',
          });
        }
      } finally {
        setIsRefreshing(false);
      }
    },
    [isRefreshing, lastFetchTime, toast, isLoggingOut]
  );

  const clearAccountInfo = useCallback(() => {
    setIsLoggingOut(true);
    setAccountInfo(null);
    // Reset the logging out state after a short delay to allow for cleanup
    setTimeout(() => {
      setIsLoggingOut(false);
    }, 1000);
  }, []);

  const updateAccountInfo = useCallback((info: AccountInfo) => {
    setAccountInfo(info);
  }, []);

  return {
    accountInfo,
    isRefreshing,
    fetchAccountInfo,
    clearAccountInfo,
    updateAccountInfo,
  };
}
