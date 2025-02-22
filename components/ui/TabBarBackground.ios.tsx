import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BlurView } from 'expo-blur';

export default function TabBarBackground() {
  const colorScheme = useColorScheme();

  if (colorScheme === 'dark') {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: '#1F2939',
          },
        ]}
      />
    );
  }

  return <BlurView tint="systemChromeMaterial" intensity={100} style={StyleSheet.absoluteFill} />;
}

export function useBottomTabOverflow() {
  const tabHeight = useBottomTabBarHeight();
  const { bottom } = useSafeAreaInsets();
  return tabHeight - bottom;
}
