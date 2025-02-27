/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    background: '#FFFFFF',
    text: '#000000',
    primary: '#2196F3',
    secondary: '#666666',
    error: '#d32f2f',
    errorBg: '#ffebee',
    contentBackground: '#FFFFFF',
    pageBackground: '#FFFFFF',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    background: '#000000',
    text: '#FFFFFF',
    primary: '#64B5F6',
    secondary: '#999999',
    error: '#ef5350',
    errorBg: '#311111',
    contentBackground: '#080a0e99',
    pageBackground: '#10151D',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
} as const;
