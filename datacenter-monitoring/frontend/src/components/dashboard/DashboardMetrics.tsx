import React from 'react';
import { 
  Server, 
  AlertTriangle, 
  Cpu, 
  Thermometer,
  Zap,
  Archive
} from 'lucide-react';
import MetricCard from '../ui/MetricCard';

export interface DashboardMetricsType {
  datacenter_summary: {
    total_racks: number;
    total_servers: number;
    active_servers: number;
    offline_servers: number;
    maintenance_servers: number;
    error_servers: number;
    total_network_devices: number;
  };
  alerts_summary: {
    total_alerts: number;
    active_alerts: number;
    critical_alerts: number;
    warning_alerts: number;
    info_alerts: number;
    resolved_today: number;
  };
  capacity_summary: {
    total_rack_capacity: number;
    used_rack_capacity: number;
    average_rack_utilization: number | null;
    total_power_capacity: number;
    estimated_power_usage: number;
    power_utilization: number | null;
  };
  performance_summary: {
    average_cpu_usage: number | null;
    average_memory_usage: number | null;
    average_temperature: number | null;
    servers_over_threshold: number;
  };
  recent_activity: Array<{
    type: string;
    message: string;
    timestamp: string;
    severity?: 'low' | 'medium' | 'high';
  }>;
}

interface DashboardMetricsProps {
  metrics: DashboardMetricsType;
  loading?: boolean;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ metrics, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const serverUptime = metrics.datacenter_summary.total_servers > 0 
    ? (metrics.datacenter_summary.active_servers / metrics.datacenter_summary.total_servers) * 100 
    : 0;

  const criticalAlertsRatio = metrics.alerts_summary.total_alerts > 0
    ? (metrics.alerts_summary.critical_alerts / metrics.alerts_summary.total_alerts) * 100
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
      {/* Servers Overview */}
      <div className="transform transition-all duration-300 hover:scale-105">
        <MetricCard
          title="Serveurs Actifs"
          value={`${metrics.datacenter_summary.active_servers}/${metrics.datacenter_summary.total_servers}`}
          trend={serverUptime > 90 ? 'stable' : serverUptime > 75 ? 'down' : 'down'}
          icon={<Server />}
          color={serverUptime > 90 ? 'success' : serverUptime > 75 ? 'warning' : 'danger'}
        />
      </div>

      {/* Critical Alerts */}
      <div className="transform transition-all duration-300 hover:scale-105">
        <MetricCard
          title="Alertes Critiques"
          value={metrics.alerts_summary.critical_alerts}
          unit={`/ ${metrics.alerts_summary.total_alerts}`}
          trend={metrics.alerts_summary.critical_alerts > 5 ? 'up' : metrics.alerts_summary.critical_alerts > 2 ? 'stable' : 'down'}
          icon={<AlertTriangle />}
          color={metrics.alerts_summary.critical_alerts > 5 ? 'danger' : metrics.alerts_summary.critical_alerts > 2 ? 'warning' : 'success'}
        />
      </div>

      {/* CPU Usage */}
      <div className="transform transition-all duration-300 hover:scale-105">
        <MetricCard
          title="CPU Moyen"
          value={metrics.performance_summary.average_cpu_usage?.toFixed(1) || '0'}
          unit="%"
          trend={
            (metrics.performance_summary.average_cpu_usage || 0) > 80 ? 'up' : 
            (metrics.performance_summary.average_cpu_usage || 0) > 50 ? 'stable' : 'down'
          }
          icon={<Cpu />}
          color={
            (metrics.performance_summary.average_cpu_usage || 0) > 80 ? 'danger' : 
            (metrics.performance_summary.average_cpu_usage || 0) > 50 ? 'warning' : 'success'
          }
        />
      </div>

      {/* Temperature */}
      <div className="transform transition-all duration-300 hover:scale-105">
        <MetricCard
          title="Température Moyenne"
          value={metrics.performance_summary.average_temperature?.toFixed(1) || '0'}
          unit="°C"
          trend={
            (metrics.performance_summary.average_temperature || 0) > 45 ? 'up' : 
            (metrics.performance_summary.average_temperature || 0) > 35 ? 'stable' : 'down'
          }
          icon={<Thermometer />}
          color={
            (metrics.performance_summary.average_temperature || 0) > 45 ? 'danger' : 
            (metrics.performance_summary.average_temperature || 0) > 35 ? 'warning' : 'success'
          }
        />
      </div>

      {/* Power Utilization */}
      <div className="transform transition-all duration-300 hover:scale-105">
        <MetricCard
          title="Consommation Électrique"
          value={metrics.capacity_summary.power_utilization?.toFixed(1) || '0'}
          unit="%"
          trend={
            (metrics.capacity_summary.power_utilization || 0) > 80 ? 'up' : 
            (metrics.capacity_summary.power_utilization || 0) > 60 ? 'stable' : 'down'
          }
          icon={<Zap />}
          color={
            (metrics.capacity_summary.power_utilization || 0) > 80 ? 'danger' : 
            (metrics.capacity_summary.power_utilization || 0) > 60 ? 'warning' : 'success'
          }
        />
      </div>

      {/* Rack Utilization */}
      <div className="transform transition-all duration-300 hover:scale-105">
        <MetricCard
          title="Utilisation Racks"
          value={metrics.capacity_summary.average_rack_utilization?.toFixed(1) || '0'}
          unit="%"
          trend={
            (metrics.capacity_summary.average_rack_utilization || 0) > 80 ? 'up' : 
            (metrics.capacity_summary.average_rack_utilization || 0) > 60 ? 'stable' : 'down'
          }
          icon={<Archive />}
          color={
            (metrics.capacity_summary.average_rack_utilization || 0) > 80 ? 'warning' : 
            (metrics.capacity_summary.average_rack_utilization || 0) > 60 ? 'info' : 'success'
          }
        />
      </div>

      {/* Network Devices */}
      <div className="transform transition-all duration-300 hover:scale-105">
        <MetricCard
          title="Équipements Réseau"
          value={metrics.datacenter_summary.total_network_devices}
          icon={<Archive />}
          color="info"
        />
      </div>

      {/* Resolved Alerts Today */}
      <div className="transform transition-all duration-300 hover:scale-105">
        <MetricCard
          title="Alertes Résolues (24h)"
          value={metrics.alerts_summary.resolved_today}
          trend={metrics.alerts_summary.resolved_today > 10 ? 'up' : metrics.alerts_summary.resolved_today > 5 ? 'stable' : 'down'}
          icon={<AlertTriangle />}
          color="success"
        />
      </div>
    </div>
  );
};

export default DashboardMetrics;