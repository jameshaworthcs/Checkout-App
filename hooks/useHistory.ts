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
  const toast = useToast();

  const fetchHistory = useCallback(
    async (showToast = false) => {
      // Prevent duplicate requests within 2 seconds
      const now = Date.now();
      if (isRefreshing || now - lastFetchTime < 2000) return;

      setIsRefreshing(true);
      setLastFetchTime(now);

      try {
        const response = await checkoutApi<HistoryData>('/api/history/history?limit=9999');

        if (!response.success || !response.data) {
          throw new Error(response.error || 'Invalid history data received');
        }

        setHistoryData(response.data);

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
    [isRefreshing, lastFetchTime, toast]
  );

  const clearHistory = useCallback(() => {
    setHistoryData(null);
  }, []);

  return {
    historyData,
    isRefreshing,
    fetchHistory,
    clearHistory,
  };
}
