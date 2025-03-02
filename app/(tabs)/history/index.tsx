import * as Clipboard from 'expo-clipboard';
import {
  View,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';
import { createHistoryStyles } from '@/app/styles/history.styles';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useCallback, useState, useRef } from 'react';
import { useHistory } from '@/hooks/useHistory';
import { useFocusEffect } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Colors } from '@/constants/Colors';
import { TabScreenScrollView } from '@/components/TabScreenScrollView';
import { useToast } from '@/hooks/useToast';
import { checkoutApi } from '@/utils/api';

export default function HistoryScreen() {
  const {
    historyData,
    isRefreshing,
    isLoadingMore,
    fetchHistory,
    loadMore,
    refresh,
    setHistoryData,
  } = useHistory();
  const { theme } = useAppTheme();
  const styles = createHistoryStyles(theme as typeof Colors.light);
  const tabBarHeight = useBottomTabBarHeight();
  const lastFocusRefreshRef = useRef(Date.now());
  const toast = useToast();
  const [loadingVisibility, setLoadingVisibility] = useState<string | null>(null); // Track which code is being processed

  const handleCopy = async (checkinCode: number) => {
    await Clipboard.setStringAsync(checkinCode.toString());
    toast.success('Code Copied', {
      text2: `Code ${checkinCode} copied to clipboard`,
    });
  };

  const handleVisibilityChange = async (code: any, isUndo: boolean) => {
    setLoadingVisibility(code.tk);
    try {
      const state = isUndo ? '0' : '1';
      const response = await checkoutApi(`/api/app/visibility/${state}`, {
        method: 'POST',
        body: { tk: code.tk },
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to update visibility');
      }

      // Update the local state without refetching
      setHistoryData(prevData => {
        if (!prevData) return prevData;
        return {
          ...prevData,
          pastCodes: prevData.pastCodes.map(c =>
            c.tk === code.tk ? { ...c, visState: state } : c
          ),
        };
      });

      toast.success(isUndo ? 'Code Hidden' : 'Code Restored', {
        text2: `Code ${code.checkinCode} has been ${isUndo ? 'hidden' : 'restored'}`,
      });
    } catch (error) {
      toast.error('Action Failed', {
        text2: error instanceof Error ? error.message : 'Failed to update code visibility',
      });
    } finally {
      setLoadingVisibility(null);
    }
  };

  // Handle pull-up to load more
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    // Calculate if we're at the bottom
    const paddingToBottom = 20;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

    // Check if we're pulling up
    if (isCloseToBottom && !isLoadingMore && historyData?.pagination.hasMore) {
      loadMore();
    }
  };

  // Memoize fetchHistory with useCallback to prevent infinite loop
  const handleFetchHistory = useCallback(() => {
    const now = Date.now();
    if (!historyData || now - lastFocusRefreshRef.current > 2 * 1000) {
      fetchHistory(false, true);
      lastFocusRefreshRef.current = now;
    }
  }, [fetchHistory, historyData]); // Minimal dependencies

  // Use useCallback for focus effect to prevent recreation
  const focusEffect = useCallback(() => {
    handleFetchHistory();
  }, [handleFetchHistory]);

  useFocusEffect(focusEffect);

  const getStatsText = () => {
    if (!historyData?.stats) return 'Loading stats...';
    const { stats } = historyData;
    return `${stats.totalCount} codes found.`; //, from ${Object.keys(stats.ipCounts).length} different IPs, ${Object.keys(stats.deviceIDCounts).length} different devices, and ${Object.keys(stats.usernameCounts).length} different accounts.`;
  };

  if (!historyData && isRefreshing) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <TabScreenScrollView
        style={styles.codeList}
        contentContainerStyle={{
          paddingTop: 16,
          paddingHorizontal: 16,
          paddingBottom: tabBarHeight + 20, // Add padding at bottom for loading indicator
        }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={theme.primary} />
        }
        onScroll={handleScroll}
        scrollEventThrottle={16} // More responsive scroll handling
      >
        <View style={styles.header}>
          <ThemedText style={styles.title}>Code History</ThemedText>
          <Link href="/history/help" asChild>
            <Pressable>
              <ThemedText style={styles.helpLink}>How to use History</ThemedText>
            </Pressable>
          </Link>
          <ThemedText style={styles.statsText}>{getStatsText()}</ThemedText>
        </View>

        {!historyData?.pastCodes?.length ? (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>
              Submit your first code to manage your history
            </ThemedText>
          </View>
        ) : (
          <>
            {historyData.pastCodes.map(code => (
              <View key={code.codeID} style={styles.codeItem}>
                <View style={styles.codeHeader}>
                  <ThemedText style={styles.codeNumber}>{code.checkinCode}</ThemedText>
                  <ThemedText style={styles.codeDate}>{code.codeDay}</ThemedText>
                </View>
                <ThemedText style={styles.codeId}>
                  {`${code.inst}-${code.crs}-${code.yr}-${code.groupCode}-${code.codeID}`}
                </ThemedText>
                <View style={styles.codeFooter}>
                  <View>
                    <ThemedText style={styles.sourceText}>Source: {code.source}</ThemedText>
                    {code.codeDesc && code.codeDesc !== '' && (
                      <View style={styles.warningContainer}>
                        <ThemedText>{code.codeState === '0' ? '⚠️' : 'ℹ️'}</ThemedText>
                        <ThemedText
                          style={[
                            styles.warningText,
                            code.codeState === '0' ? undefined : { color: theme.secondary },
                          ]}>
                          {code.codeState === '0' ? `Blocked: ${code.codeDesc}` : code.codeDesc}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                  <View style={styles.actionButtons}>
                    <Pressable
                      style={[styles.actionButton, styles.copyButton]}
                      onPress={() => handleCopy(code.checkinCode)}>
                      <ThemedText style={styles.copyButtonText}>Copy</ThemedText>
                    </Pressable>
                    {loadingVisibility === code.tk ? (
                      <View style={[styles.actionButton, styles.loadingButton]}>
                        <ActivityIndicator size="small" color={theme.primary} />
                      </View>
                    ) : (
                      <Pressable
                        style={[
                          styles.actionButton,
                          code.visState === '0' ? styles.redoButton : styles.undoButton,
                        ]}
                        onPress={() =>
                          handleVisibilityChange(
                            code,
                            code.visState === '1' // if visState is 1, we're undoing
                          )
                        }>
                        <ThemedText
                          style={
                            code.visState === '0' ? styles.redoButtonText : styles.undoButtonText
                          }>
                          {code.visState === '0' ? 'Redo' : 'Undo'}
                        </ThemedText>
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            ))}

            {/* Loading indicator at bottom */}
            {historyData.pagination.hasMore && (
              <View style={[styles.loadingMore, { height: 50 }]}>
                {isLoadingMore ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={theme.primary} />
                    <ThemedText style={styles.loadingText}>Loading more...</ThemedText>
                  </View>
                ) : (
                  <ThemedText style={styles.loadingText}>Pull up to load more</ThemedText>
                )}
              </View>
            )}
          </>
        )}
      </TabScreenScrollView>
    </ThemedView>
  );
}
