import { useState, useEffect } from 'react';
import { historyApi } from '../api/historyApi';
import type { HistoryItem, HistoryResponse } from '../api/historyApi';

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [cachedItems, setCachedItems] = useState<Map<number, HistoryItem>>(
    new Map(),
  );

  const fetchHistory = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const offset = (page - 1) * limit;
      const response: HistoryResponse = await historyApi.getHistory(
        limit,
        offset,
      );

      setHistory(response.data);
      setTotal(response.total);
      setCurrentPage(page);

      // Cache all items from the list
      response.data.forEach((item) => {
        setCachedItems((prev) => new Map(prev).set(item.id, item));
      });
    } catch (err) {
      setError('Failed to load history');
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoryById = async (id: number): Promise<HistoryItem | null> => {
    // Check cache first
    if (cachedItems.has(id)) {
      return cachedItems.get(id) || null;
    }

    try {
      const item = await historyApi.getHistoryById(id);
      if (item) {
        // Cache the item
        setCachedItems((prev) => new Map(prev).set(id, item));
      }
      return item;
    } catch (err) {
      setError('Failed to load history item');
      console.error('Error fetching history item:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    history,
    loading,
    error,
    total,
    currentPage,
    limit,
    fetchHistory,
    fetchHistoryById,
  };
};
