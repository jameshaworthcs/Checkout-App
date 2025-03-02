/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export type ThemeColors = {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  error: string;
  errorBg: string;
  contentBackground: string;
  pageBackground: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  ctaBackground: string;
  ctaText: string;
  goodButton: {
    background: string;
    text: string;
  };
  badButton: {
    background: string;
    text: string;
  };
};

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
    ctaBackground: '#2196F3',
    ctaText: '#FFFFFF',
    goodButton: {
      background: '#27AE601A',
      text: '#27AE60',
    },
    badButton: {
      background: '#EB57571A',
      text: '#E64800',
    },
  },
  dark: {
    background: '#10151D',
    text: '#FFFFFF',
    primary: '#b895fd',
    secondary: '#999999',
    error: '#ef5350',
    errorBg: '#311111',
    contentBackground: '#080a0e99',
    pageBackground: '#10151D',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    ctaBackground: '#b895fd',
    ctaText: '#000000',
    goodButton: {
      background: '#27AE6033',
      text: '#27AE60',
    },
    badButton: {
      background: '#EB575733',
      text: '#E64800',
    },
  },
} as const satisfies Record<'light' | 'dark', ThemeColors>;
