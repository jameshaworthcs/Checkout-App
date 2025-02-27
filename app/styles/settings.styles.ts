import { StyleSheet } from 'react-native';

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

export const createSettingsStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    scrollContainer: {
      paddingBottom: 80, // Adds padding at the bottom to account for the navbar
    },
    section: {
      marginBottom: 24,
      padding: 16,
      borderRadius: 8,
      backgroundColor: theme.contentBackground,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      color: theme.text,
    },
    infoRow: {
      flexDirection: 'row',
      marginBottom: 8,
      alignItems: 'center',
    },
    label: {
      fontWeight: '600',
      width: 120,
      color: theme.text,
    },
    value: {
      flex: 1,
      color: theme.text,
    },
    button: {
      backgroundColor: theme.primary,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 8,
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    helperText: {
      fontSize: 14,
      opacity: 0.7,
      color: theme.text,
      marginTop: 8,
    },
    link: {
      color: theme.primary,
      marginTop: 8,
    },
    footer: {
      marginTop: 32,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: theme.contentBackground,
      alignItems: 'center',
    },
    footerLinksRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 0,
    },
    footerLink: {
      color: theme.primary,
      marginBottom: 15,
    },
    logoutText: {
      color: theme.error,
      marginTop: 0,
      marginBottom: 8,
    },
    refreshButton: {
      marginVertical: 8,
      opacity: 0.8,
    },
    textFaded: {
      opacity: 0.6,
    },
    copyrightContainer: {
      marginTop: 16,
      alignItems: 'center',
    },
    copyrightText: {
      fontSize: 12,
      color: theme.secondary,
      marginBottom: 4,
    },
  });
