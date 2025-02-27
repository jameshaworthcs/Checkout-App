import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { checkoutApi } from '@/utils/api';
import { CHECKOUT_API_URL } from '@/constants/api';
import { useEffect } from 'react';
import { storage } from '@/utils/storage';
import { Platform } from 'react-native';

const API_TOKEN_KEY = 'api_token';
const IS_LOGGED_IN_KEY = 'is_logged_in';
const ACCOUNT_INFO_KEY = 'account_info';

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [accountInfo, setAccountInfo] = useState<any>(null);

  useEffect(() => {
    const initAuth = async () => {
      const [storedToken, storedLoggedIn] = await Promise.all([
        storage.getItem(API_TOKEN_KEY),
        storage.getItem(IS_LOGGED_IN_KEY),
      ]);

      if (storedToken && storedLoggedIn === 'true') {
        setToken(storedToken);
        setIsLoggedIn(true);
      }
    };

    initAuth();
  }, []);

  // Handle messages from popup window
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleMessage = async (event: MessageEvent) => {
        // Verify origin for security
        if (event.origin !== window.location.origin) return;

        if (event.data?.type === 'AUTH_SUCCESS' && event.data?.token) {
          const verifyResponse = await checkoutApi('/api/auth/verifyapptoken', {
            method: 'POST',
            body: { apptoken: event.data.token },
          });
          handleAuthResponse(verifyResponse);
        }
      };

      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, []);

  const signIn = async () => {
    try {
      setModalVisible(true);
      setLoading(true);
      setError(null);

      // Different redirect handling for web vs native
      const redirectUrl = makeRedirectUri({
        scheme: Platform.OS === 'web' ? window.location.origin : 'checkoutattendance',
        path: Platform.OS === 'web' ? '/auth-callback' : undefined,
      });

      const authUrl = `/applogin?appredirect=${encodeURIComponent(redirectUrl)}`;

      // Different auth flow for web vs native
      if (Platform.OS === 'web') {
        // For web, we'll use a popup window
        const popup = window.open(
          `${CHECKOUT_API_URL}${authUrl}`,
          'CheckOut Login',
          'width=600,height=600'
        );

        if (!popup) {
          throw new Error('Popup blocked. Please allow popups for this site.');
        }

        // Monitor popup closure without token
        const checkPopupClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkPopupClosed);
            setError('Authentication was cancelled');
            setLoading(false);
            setModalVisible(false);
          }
        }, 500);
      } else {
        // Native platforms use WebBrowser
        const authResponse = await WebBrowser.openAuthSessionAsync(
          `${CHECKOUT_API_URL}${authUrl}`,
          redirectUrl
        );

        if (authResponse.type === 'success') {
          const params = new URL(authResponse.url).searchParams;
          const appToken = params.get('apptoken');

          if (appToken) {
            const verifyResponse = await checkoutApi('/api/auth/verifyapptoken', {
              method: 'POST',
              body: { apptoken: appToken },
            });

            handleAuthResponse(verifyResponse);
          }
        } else {
          setModalVisible(false);
          setLoading(false);
        }
      }

      return null;
    } catch (error) {
      console.error('Authentication error:', error);
      setError('An error occurred during authentication.');
      setLoading(false);
      return null;
    }
  };

  const handleAuthResponse = async (verifyResponse: any) => {
    if (!verifyResponse.success) {
      setError(verifyResponse.error || 'Verification failed');
      setLoading(false);
      await storage.setItem(IS_LOGGED_IN_KEY, 'false');
      return;
    }

    const data = verifyResponse.data;
    setUsername(data.username);
    setAccountInfo(data.accountInfo);
    setLoading(false);

    // Store the API token, login status, and account info securely
    await Promise.all([
      storage.setItem(API_TOKEN_KEY, String(data.api_token)),
      storage.setItem(IS_LOGGED_IN_KEY, 'true'),
      storage.setItem(ACCOUNT_INFO_KEY, JSON.stringify(data.accountInfo || {})),
    ]);
    setToken(data.api_token);
    setIsLoggedIn(true);

    // Fetch fresh account information without showing toast
    try {
      const accountResponse = await checkoutApi('/api/settings/account');
      if (accountResponse.success && accountResponse.data?.accountInfo) {
        const freshAccountInfo = accountResponse.data.accountInfo;
        setAccountInfo(freshAccountInfo);
        await storage.setItem(ACCOUNT_INFO_KEY, JSON.stringify(freshAccountInfo));
      }
    } catch (error) {
      console.error('Error fetching fresh account info:', error);
    }

    // Close modal after a brief delay to show success state
    setTimeout(() => {
      setModalVisible(false);
    }, 2000);
  };

  const getStoredToken = async () => {
    try {
      const [storedToken, storedLoggedIn] = await Promise.all([
        storage.getItem(API_TOKEN_KEY),
        storage.getItem(IS_LOGGED_IN_KEY),
      ]);

      if (storedToken) {
        setToken(storedToken);
        setIsLoggedIn(storedLoggedIn === 'true');
      }
      return storedToken;
    } catch (error) {
      console.error('Error retrieving stored token:', error);
      return null;
    }
  };

  const logout = async () => {
    await Promise.all([
      storage.deleteItem(API_TOKEN_KEY),
      storage.deleteItem(ACCOUNT_INFO_KEY),
      storage.setItem(IS_LOGGED_IN_KEY, 'false'),
    ]);
    setToken(null);
    setIsLoggedIn(false);
    setUsername(null);
    setAccountInfo(null);
  };

  return {
    token,
    signIn,
    setToken,
    logout,
    getStoredToken,
    isLoggedIn,
    accountInfo,
    modalState: {
      visible: modalVisible,
      loading,
      success: !loading && !error && username !== null,
      error,
      username,
    },
    modalActions: {
      onRetry: signIn,
      onClose: () => {
        setModalVisible(false);
        setError(null);
        setUsername(null);
      },
      setVisible: setModalVisible,
    },
  };
}
