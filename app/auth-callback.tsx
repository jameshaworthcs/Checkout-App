import { useEffect } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';

export default function AuthCallback() {
  const params = useLocalSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const apptoken = params.apptoken;

      if (apptoken && window.opener) {
        // Send the token to the main window
        window.opener.postMessage(
          { type: 'AUTH_SUCCESS', token: apptoken },
          window.location.origin
        );
        // Close the popup
        window.close();
      }
    }
  }, [params]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText>Completing authentication...</ThemedText>
    </View>
  );
}
