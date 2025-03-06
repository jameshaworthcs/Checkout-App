import { StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';

type ColorTheme = typeof Colors.light;

export const createSettingsStyles = (theme: ColorTheme) =>
  StyleSheet.create({
    header: {
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
    },
    scrollContainer: {
      // Remove the paddingBottom: 80 line as it's now handled by TabScreenScrollView
    },
    section: {
      marginBottom: 24,
      padding: 16,
      borderRadius: 8,
      backgroundColor: theme.contentBackground,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: theme === Colors.light ? 0.1 : 0.3,
          shadowRadius: 8,
        },
        android: {
          elevation: theme === Colors.light ? 2 : 4,
        },
      }),
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
      backgroundColor: theme.ctaBackground,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 8,
    },
    buttonText: {
      color: theme.ctaText,
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
