import { useState, useCallback } from 'react';
import { checkoutApi } from '@/utils/api';
import { useToast } from '@/hooks/useToast';

export interface HistoryStats {
  totalCount: number;
  usernameCounts: Record<string, number>;
  ipCounts: Record<string, number>;
  deviceIDCounts: Record<string, number>;
}

export interface PastCode {
  codeID: number;
  inst: string;
  crs: string;
  yr: string;
  md: string;
  codeDay: string;
  groupCode: string;
  checkinCode: number;
  timestamp?: string;
  ip?: string;
  useragent?: string;
  tk?: string;
  deviceID?: string;
  username?: string;
  codeState?: string;
  codeDesc?: string;
  codeReps?: string;
  visState?: string;
  source: string;
  verifiedInfo?: Record<string, any>;
}

export interface HistoryData {
  stats: HistoryStats;
  pagination: {
    offset: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  pastCodes: PastCode[];
}

export function useHistory() {
  const [historyData, setHistoryData] = useState<HistoryData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const toast = useToast();

  const fetchHistory = useCallback(
    async (showToast = false, reset = false) => {
      // Prevent duplicate requests within 2 seconds
      const now = Date.now();
      if (isRefreshing || now - lastFetchTime < 2000) return;

      setIsRefreshing(true);
      setLastFetchTime(now);

      try {
        const currentOffset = reset ? 0 : offset;
        const response = await checkoutApi<HistoryData>(
          `/api/history/history?limit=${limit}&offset=${currentOffset}`
        );

        if (!response.success || !response.data) {
          throw new Error(response.error || 'Invalid history data received');
        }

        const newData = response.data;
        setHistoryData(prevData => {
          if (!prevData || reset) return newData;
          return {
            stats: newData.stats,
            pagination: newData.pagination,
            pastCodes: [...prevData.pastCodes, ...newData.pastCodes],
          };
        });

        if (reset) {
          setOffset(0);
        } else {
          setOffset(currentOffset + limit);
        }

        if (showToast) {
          toast.success('Success', {
            text2: 'History has been refreshed',
          });
        }
      } catch (error) {
        if (showToast) {
          toast.error('Error', {
            text2: error instanceof Error ? error.message : 'Failed to refresh history',
          });
        }
      } finally {
        setIsRefreshing(false);
      }
    },
    [isRefreshing, lastFetchTime, toast, offset]
  );

  const clearHistory = useCallback(() => {
    setHistoryData(null);
    setOffset(0);
  }, []);

  const loadMore = useCallback(() => {
    if (historyData?.pagination.hasMore && !isRefreshing) {
      fetchHistory(false);
    }
  }, [fetchHistory, historyData?.pagination.hasMore, isRefreshing]);

  const refresh = useCallback(() => {
    fetchHistory(true, true);
  }, [fetchHistory]);

  return {
    historyData,
    isRefreshing,
    fetchHistory,
    clearHistory,
    loadMore,
    refresh,
  };
}
