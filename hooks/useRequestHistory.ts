import { useState, useCallback } from "react";
import { type HistoryItem } from "@/app/types/models";
import { type HTTPMethod } from "@/app/types/http";

export function useRequestHistory(initialHistory: HistoryItem[] = []) {
  const [history, setHistory] = useState<HistoryItem[]>(initialHistory);

  const addToHistory = useCallback((item: HistoryItem) => {
    setHistory((prev) => [item, ...prev]);
  }, []);

  const addFromResponse = useCallback((params: HistoryItem) => {
    const item: HistoryItem = {
      method: params.method as HTTPMethod,
      url: params.url,
      time: `${params.time}ms`,
      status: params.status,
      statusText: params.statusText,
    };
    setHistory((prev) => [item, ...prev]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const removeFromHistory = useCallback((index: number) => {
    setHistory((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return {
    history,
    addToHistory,
    addFromResponse,
    clearHistory,
    removeFromHistory,
  };
}
