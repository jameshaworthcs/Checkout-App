import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { checkoutApi } from '@/utils/api';
import { CHECKOUT_API_URL } from '@/constants/api';
import { useEffect } from 'react';

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
        SecureStore.getItemAsync(API_TOKEN_KEY),
        SecureStore.getItemAsync(IS_LOGGED_IN_KEY),
      ]);

      if (storedToken && storedLoggedIn === 'true') {
        setToken(storedToken);
        setIsLoggedIn(true);
      }
    };

    initAuth();
  }, []);
  const signIn = async () => {
    try {
      setModalVisible(true);
      setLoading(true);
      setError(null);

      const redirectUrl = makeRedirectUri();
      const authUrl = `/applogin?appredirect=${encodeURIComponent(redirectUrl)}`;

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

          if (!verifyResponse.success) {
            setError(verifyResponse.error || 'Verification failed');
            setLoading(false);
            await SecureStore.setItemAsync(IS_LOGGED_IN_KEY, 'false');
            return null;
          }

          const data = verifyResponse.data;
          setUsername(data.username);
          setAccountInfo(data.accountInfo);
          setLoading(false);

          // Store the API token, login status, and account info securely
          await Promise.all([
            SecureStore.setItemAsync(API_TOKEN_KEY, String(data.api_token)),
            SecureStore.setItemAsync(IS_LOGGED_IN_KEY, 'true'),
            SecureStore.setItemAsync(ACCOUNT_INFO_KEY, JSON.stringify(data.accountInfo || {})),
          ]);
          setToken(data.api_token);
          setIsLoggedIn(true);

          // Close modal after a brief delay to show success state
          setTimeout(() => {
            setModalVisible(false);
          }, 2000);

          return data.api_token;
        }
      }
      setModalVisible(false);
      return null;
    } catch (error) {
      console.error('Authentication error:', error);
      setError('An error occurred during authentication.');
      setLoading(false);
      return null;
    }
  };

  const getStoredToken = async () => {
    try {
      const [storedToken, storedLoggedIn] = await Promise.all([
        SecureStore.getItemAsync(API_TOKEN_KEY),
        SecureStore.getItemAsync(IS_LOGGED_IN_KEY),
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
      SecureStore.deleteItemAsync(API_TOKEN_KEY),
      SecureStore.deleteItemAsync(ACCOUNT_INFO_KEY),
      SecureStore.setItemAsync(IS_LOGGED_IN_KEY, 'false'),
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
