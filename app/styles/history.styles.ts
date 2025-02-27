import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { sharedStyles } from './shared.styles';

type Theme = typeof Colors.light | typeof Colors.dark;

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

export const createHistoryStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      ...sharedStyles.pageContainer,
      backgroundColor: theme.pageBackground,
    },
    centerContent: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
      color: theme.text,
    },
    helpLink: {
      marginBottom: 16,
      color: theme.primary,
      fontSize: 16,
    },
    statsText: {
      fontSize: 16,
      marginBottom: 16,
      color: theme.text,
    },
    codeList: {
      flex: 1,
    },
    codeItem: {
      backgroundColor: theme.contentBackground,
      padding: 16,
      borderRadius: 8,
      marginBottom: 12,
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
      fontSize: 16,
      color: theme.text,
    },
    codeId: {
      fontSize: 16,
      marginBottom: 8,
      color: theme.text,
    },
    codeFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sourceText: {
      fontSize: 14,
      color: theme.secondary,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      fontSize: 14,
      padding: 6,
      paddingHorizontal: 12,
      backgroundColor: theme.contentBackground,
      borderRadius: 4,
      color: theme.text,
    },
    undoButton: {
      backgroundColor: theme.errorBg,
      color: theme.error,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 40,
    },
    emptyStateText: {
      fontSize: 16,
      color: theme.secondary,
    },
  });

export const createHelpStyles = (theme: ThemeColors) =>
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
