import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import DashboardMetrics from '../components/dashboard/DashboardMetrics';
import MetricChart from '../components/ui/MetricChart';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { DashboardMetrics as DashboardMetricsType, MetricPoint } from '../types';
import { useApi } from '../hooks/useApi';
import { apiService } from '../services/api';

const Dashboard: React.FC = () => {
  const { 
    data: dashboardData, 
    loading, 
    error, 
    refetch 
  } = useApi<DashboardMetricsType>(() => apiService.getDashboardOverview());

  const [cpuMetrics, setCpuMetrics] = useState<MetricPoint[]>([]);
  const [temperatureMetrics, setTemperatureMetrics] = useState<MetricPoint[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Generate mock time series data for charts
  useEffect(() => {
    const generateMetrics = () => {
      const now = new Date();
      const cpuData: MetricPoint[] = [];
      const tempData: MetricPoint[] = [];

      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        
        cpuData.push({
          timestamp: timestamp.toISOString(),
          value: Math.random() * 30 + 40 + Math.sin(i * 0.5) * 15, // 40-85% range with variation
        });

        tempData.push({
          timestamp: timestamp.toISOString(),
          value: Math.random() * 10 + 30 + Math.sin(i * 0.3) * 5, // 25-45°C range
        });
      }

      setCpuMetrics(cpuData);
      setTemperatureMetrics(tempData);
      setLastUpdate(new Date());
    };

    generateMetrics();
    const interval = setInterval(generateMetrics, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    refetch();
    setLastUpdate(new Date());
  };

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Chargement du tableau de bord..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de Bord
          </h1>
          <p className="text-gray-600">
            Vue d'ensemble de votre infrastructure datacenter
          </p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Metrics Cards */}
      {dashboardData && (
        <DashboardMetrics metrics={dashboardData} loading={loading} />
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricChart
          data={cpuMetrics}
          title="Utilisation CPU - 24h"
          color="#3b82f6"
          unit="%"
          type="area"
        />
        
        <MetricChart
          data={temperatureMetrics}
          title="Température Moyenne - 24h"
          color="#ef4444"
          unit="°C"
          type="line"
        />
      </div>

      {/* Recent Activity */}
      {dashboardData?.recent_activity && dashboardData.recent_activity.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Activité Récente
          </h3>
          <div className="space-y-3">
            {dashboardData.recent_activity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 mt-2 rounded-full ${
                  activity.severity === 'high' ? 'bg-red-500' :
                  activity.severity === 'medium' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last Update Info */}
      <div className="text-center text-sm text-gray-500">
        Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
      </div>
    </div>
  );
};

export default Dashboard;