import { StyleSheet, Platform } from 'react-native';

type ThemeColors = {
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
};

export const createSharedStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: theme.pageBackground,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme.text,
    },
    text: {
      fontSize: 16,
      textAlign: 'center',
      color: theme.text,
    },
  });

export const NAVBAR_BOTTOM_PADDING = Platform.OS === 'ios' ? 90 : 70;

export const sharedStyles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    padding: 16,
    paddingBottom: NAVBAR_BOTTOM_PADDING,
  },
});
