import { StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';

type ColorTheme = typeof Colors.light;

export const createHistoryStyles = (theme: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    centerContent: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
    },
    helpLink: {
      color: theme.primary,
      marginBottom: 8,
    },
    statsText: {
      color: theme.secondary,
      fontSize: 12,
    },
    codeList: {
      flex: 1,
    },
    codeItem: {
      backgroundColor: theme.contentBackground,
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
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
    codeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    codeNumber: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
    },
    codeDate: {
      color: theme.secondary,
      fontSize: 14,
    },
    codeId: {
      color: theme.text,
      fontSize: 14,
      marginBottom: 8,
    },
    codeFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sourceText: {
      color: theme.secondary,
      fontSize: 12,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    actionButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    copyButton: {
      backgroundColor: theme.goodButton.background,
    },
    copyButtonText: {
      color: theme.goodButton.text,
      fontSize: 14,
      fontWeight: '600',
    },
    redoButton: {
      backgroundColor: theme.goodButton.background,
    },
    undoButton: {
      backgroundColor: theme.badButton.background,
    },
    redoButtonText: {
      color: theme.goodButton.text,
      fontSize: 14,
      fontWeight: '600',
    },
    undoButtonText: {
      color: theme.badButton.text,
      fontSize: 14,
      fontWeight: '600',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 32,
    },
    emptyStateText: {
      color: theme.secondary,
      fontSize: 16,
      textAlign: 'center',
    },
    loadingMore: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 16,
      gap: 8,
    },
    loadingText: {
      color: theme.secondary,
      fontSize: 14,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    warningContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
      gap: 4,
    },
    warningText: {
      color: theme.error,
      fontSize: 12,
    },
    loadingButton: {
      backgroundColor: theme.contentBackground,
      minWidth: 70,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export const createHelpStyles = (theme: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.pageBackground,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      color: theme.text,
    },
    infoBox: {
      backgroundColor: theme.contentBackground,
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
    },
    infoTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      color: theme.text,
    },
    infoText: {
      fontSize: 16,
      marginBottom: 8,
      color: theme.text,
    },
    bulletPoints: {
      marginLeft: 8,
    },
    bulletPoint: {
      fontSize: 16,
      marginBottom: 4,
      color: theme.text,
    },
  });
