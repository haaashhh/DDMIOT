import { useState, useEffect } from 'react';
import { ServerMetrics } from '../types';
import { apiService } from '../services/api';

export const useRealTimeMetrics = (serverId?: string, intervalMs: number = 5000) => {
  const [metrics, setMetrics] = useState<ServerMetrics[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<ServerMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!serverId) {
      setLoading(false);
      return;
    }

    const fetchMetrics = async () => {
      try {
        const newMetrics = await apiService.getServerMetrics(serverId, 1);
        const metricsData = Array.isArray(newMetrics) ? newMetrics[0] : newMetrics;
        
        setCurrentMetrics(metricsData);
        setMetrics(prev => [...prev.slice(-50), metricsData]); // Keep last 50 points
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchMetrics();

    // Set up interval
    const interval = setInterval(fetchMetrics, intervalMs);

    return () => clearInterval(interval);
  }, [serverId, intervalMs]);

  return { 
    metrics, 
    currentMetrics, 
    loading, 
    error,
    hasData: metrics.length > 0 
  };
};