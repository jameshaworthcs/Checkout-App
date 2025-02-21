import { Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedView } from './ThemedView';

export function TopBar() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  return (
    <ThemedView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          height: 60 + insets.top,
        },
      ]}>
      <Image
        source={
          colorScheme === 'dark'
            ? require('@/assets/images/CheckOutWide-Dark.png')
            : require('@/assets/images/CheckOutWide-Light.png')
        }
        style={styles.logo}
        resizeMode="contain"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  logo: {
    height: '60%',
  },
});
