import { useState, useEffect } from 'react';
import { LoadingState } from '../types';

export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setData,
  };
}

export function useAsyncData<T>(
  apiCall: () => Promise<T>,
  initialData: T | null = null
): {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setData: (data: T | null) => void;
} {
  const [data, setData] = useState<T | null>(initialData);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    error: undefined,
  });

  const fetchData = async () => {
    try {
      setLoadingState({ isLoading: true, error: undefined });
      const result = await apiCall();
      setData(result);
      setLoadingState({ isLoading: false });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setLoadingState({ isLoading: false, error: errorMessage });
    }
  };

  return {
    data,
    loading: loadingState.isLoading,
    error: loadingState.error || null,
    refetch: fetchData,
    setData,
  };
}