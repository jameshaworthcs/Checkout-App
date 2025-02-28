import {
  View,
  ScrollView,
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
import { useEffect, useCallback } from 'react';
import { useHistory } from '@/hooks/useHistory';
import { useFocusEffect } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Colors } from '@/constants/Colors';

export default function HistoryScreen() {
  const { historyData, isRefreshing, fetchHistory, loadMore, refresh } = useHistory();
  const { theme } = useAppTheme();
  const styles = createHistoryStyles(theme as typeof Colors.light);
  const tabBarHeight = useBottomTabBarHeight();

  // Fetch data on initial mount
  useEffect(() => {
    fetchHistory(false, true);
  }, [fetchHistory]);

  // Refresh data when tab is focused, but don't show toast
  useFocusEffect(() => {
    fetchHistory(false, true);
  });

  const getStatsText = () => {
    if (!historyData?.stats) return 'Loading stats...';
    const { stats } = historyData;
    return `${stats.totalCount} codes found, from ${Object.keys(stats.ipCounts).length} different IPs, ${Object.keys(stats.deviceIDCounts).length} different devices, and ${Object.keys(stats.usernameCounts).length} different accounts.`;
  };

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

      if (isCloseToBottom && !isRefreshing && historyData?.pagination.hasMore) {
        loadMore();
      }
    },
    [loadMore, isRefreshing, historyData?.pagination.hasMore]
  );

  if (!historyData && isRefreshing) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Code History</ThemedText>
        <Link href="/history/help" asChild>
          <Pressable>
            <ThemedText style={styles.helpLink}>How to use History</ThemedText>
          </Pressable>
        </Link>
        <ThemedText style={styles.statsText}>{getStatsText()}</ThemedText>
      </View>

      <ScrollView
        style={styles.codeList}
        contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }}
        onScroll={handleScroll}
        scrollEventThrottle={400}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }>
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
                  <ThemedText style={styles.sourceText}>Source: {code.source}</ThemedText>
                  <View style={styles.actionButtons}>
                    <ThemedText style={styles.actionButton}>Copy</ThemedText>
                    <ThemedText style={[styles.actionButton, styles.undoButton]}>Undo</ThemedText>
                  </View>
                </View>
              </View>
            ))}
            {isRefreshing && historyData.pastCodes.length > 0 && (
              <View style={styles.loadingMore}>
                <ActivityIndicator size="small" color={theme.primary} />
                <ThemedText style={styles.loadingText}>Loading more...</ThemedText>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}
