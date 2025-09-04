import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Server, ServerStatus } from '../entities/Server';
import { Rack } from '../entities/Rack';
import { Alert, AlertStatus, AlertType } from '../entities/Alert';
import { NetworkDevice } from '../entities/NetworkDevice';
import { MetricsService } from './MetricsService';

export interface DashboardOverview {
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
    average_rack_utilization: number;
    total_power_capacity: number;
    estimated_power_usage: number;
    power_utilization: number;
  };
  performance_summary: {
    average_cpu_usage: number;
    average_memory_usage: number;
    average_temperature: number;
    servers_over_threshold: number;
  };
  recent_activity: Array<{
    type: 'server_added' | 'alert_created' | 'alert_resolved' | 'maintenance_started';
    message: string;
    timestamp: Date;
    severity?: 'low' | 'medium' | 'high';
  }>;
}

export interface CapacityMetrics {
  rack_utilization: Array<{
    rack_id: string;
    zone: string;
    position: number;
    utilization_percentage: number;
    server_count: number;
    max_servers: number;
    power_usage: number;
    power_capacity: number;
  }>;
  zone_summary: Array<{
    zone: string;
    total_racks: number;
    total_servers: number;
    average_utilization: number;
    total_power_capacity: number;
    total_power_usage: number;
  }>;
  trends: {
    utilization_trend: Array<{
      date: string;
      average_utilization: number;
      server_count: number;
    }>;
  };
}

export class DashboardService {
  private serverRepository: Repository<Server>;
  private rackRepository: Repository<Rack>;
  private alertRepository: Repository<Alert>;
  private networkDeviceRepository: Repository<NetworkDevice>;

  constructor() {
    this.serverRepository = AppDataSource.getRepository(Server);
    this.rackRepository = AppDataSource.getRepository(Rack);
    this.alertRepository = AppDataSource.getRepository(Alert);
    this.networkDeviceRepository = AppDataSource.getRepository(NetworkDevice);
  }

  async getDashboardOverview(): Promise<DashboardOverview> {
    const [
      totalRacks,
      totalServers,
      serverStatusCounts,
      totalNetworkDevices,
      alertSummary,
      capacitySummary,
      performanceSummary,
      recentActivity,
    ] = await Promise.all([
      this.rackRepository.count(),
      this.serverRepository.count(),
      this.getServerStatusCounts(),
      this.networkDeviceRepository.count(),
      this.getAlertSummary(),
      this.getCapacitySummary(),
      this.getPerformanceSummary(),
      this.getRecentActivity(),
    ]);

    return {
      datacenter_summary: {
        total_racks: totalRacks,
        total_servers: totalServers,
        active_servers: serverStatusCounts.active,
        offline_servers: serverStatusCounts.offline,
        maintenance_servers: serverStatusCounts.maintenance,
        error_servers: serverStatusCounts.error,
        total_network_devices: totalNetworkDevices,
      },
      alerts_summary: alertSummary,
      capacity_summary: capacitySummary,
      performance_summary: performanceSummary,
      recent_activity: recentActivity,
    };
  }

  async getCapacityMetrics(): Promise<CapacityMetrics> {
    const racks = await this.rackRepository.find({
      relations: ['servers'],
      order: { zone: 'ASC', position: 'ASC' },
    });

    const rackUtilization = racks.map((rack) => {
      const serverCount = rack.servers?.length || 0;
      const maxServers = Math.floor((parseInt(rack.height?.replace('U', '') || '42')) / 2);
      const utilizationPercentage = (serverCount / maxServers) * 100;
      const powerUsage = rack.servers?.reduce((sum, server) => 
        sum + (server.power_idle || 180), 0) || 0;

      return {
        rack_id: rack.id,
        zone: rack.zone,
        position: rack.position,
        utilization_percentage: Math.round(utilizationPercentage * 100) / 100,
        server_count: serverCount,
        max_servers: maxServers,
        power_usage: powerUsage,
        power_capacity: rack.power_capacity || 12000,
      };
    });

    const zoneGroups = rackUtilization.reduce((groups, rack) => {
      if (!groups[rack.zone]) {
        groups[rack.zone] = [];
      }
      groups[rack.zone].push(rack);
      return groups;
    }, {} as Record<string, typeof rackUtilization>);

    const zoneSummary = Object.entries(zoneGroups).map(([zone, racks]) => ({
      zone,
      total_racks: racks.length,
      total_servers: racks.reduce((sum, r) => sum + r.server_count, 0),
      average_utilization: racks.reduce((sum, r) => sum + r.utilization_percentage, 0) / racks.length,
      total_power_capacity: racks.reduce((sum, r) => sum + r.power_capacity, 0),
      total_power_usage: racks.reduce((sum, r) => sum + r.power_usage, 0),
    }));

    const utilizationTrend = this.generateUtilizationTrend(rackUtilization);

    return {
      rack_utilization: rackUtilization,
      zone_summary: zoneSummary,
      trends: {
        utilization_trend: utilizationTrend,
      },
    };
  }

  async getAlertsDashboard(): Promise<{
    active_alerts: Alert[];
    alert_trends: Array<{
      date: string;
      critical: number;
      warning: number;
      info: number;
    }>;
    top_affected_servers: Array<{
      server_id: string;
      server_name: string;
      alert_count: number;
    }>;
    category_breakdown: Array<{
      category: string;
      count: number;
      percentage: number;
    }>;
  }> {
    const [activeAlerts, alertTrends, topAffectedServers, categoryBreakdown] =
      await Promise.all([
        this.getActiveAlerts(),
        this.getAlertTrends(),
        this.getTopAffectedServers(),
        this.getAlertCategoryBreakdown(),
      ]);

    return {
      active_alerts: activeAlerts,
      alert_trends: alertTrends,
      top_affected_servers: topAffectedServers,
      category_breakdown: categoryBreakdown,
    };
  }

  private async getServerStatusCounts(): Promise<Record<ServerStatus, number>> {
    const statusCounts = await this.serverRepository
      .createQueryBuilder('server')
      .select('server.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('server.status')
      .getRawMany();

    const result: Record<ServerStatus, number> = {
      [ServerStatus.ACTIVE]: 0,
      [ServerStatus.MAINTENANCE]: 0,
      [ServerStatus.ERROR]: 0,
      [ServerStatus.OFFLINE]: 0,
    };

    statusCounts.forEach((item) => {
      result[item.status as ServerStatus] = parseInt(item.count);
    });

    return result;
  }

  private async getAlertSummary(): Promise<DashboardOverview['alerts_summary']> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalAlerts, activeAlerts, alertTypeCounts, resolvedToday] =
      await Promise.all([
        this.alertRepository.count(),
        this.alertRepository.count({ where: { status: AlertStatus.ACTIVE } }),
        this.alertRepository
          .createQueryBuilder('alert')
          .select('alert.alert_type', 'type')
          .addSelect('COUNT(*)', 'count')
          .where('alert.status = :status', { status: AlertStatus.ACTIVE })
          .groupBy('alert.alert_type')
          .getRawMany(),
        this.alertRepository
          .createQueryBuilder('alert')
          .where('alert.status = :status', { status: AlertStatus.RESOLVED })
          .andWhere('alert.resolved_at >= :today', { today })
          .getCount(),
      ]);

    const typeCounts = {
      critical: 0,
      warning: 0,
      info: 0,
    };

    alertTypeCounts.forEach((item) => {
      const type = item.type.toLowerCase();
      if (type in typeCounts) {
        (typeCounts as any)[type] = parseInt(item.count);
      }
    });

    return {
      total_alerts: totalAlerts,
      active_alerts: activeAlerts,
      critical_alerts: typeCounts.critical,
      warning_alerts: typeCounts.warning,
      info_alerts: typeCounts.info,
      resolved_today: resolvedToday,
    };
  }

  private async getCapacitySummary(): Promise<DashboardOverview['capacity_summary']> {
    const racks = await this.rackRepository.find({ relations: ['servers'] });

    const totalRackCapacity = racks.length * 42;
    const usedRackCapacity = racks.reduce((sum, rack) => {
      const serverUnits = rack.servers?.reduce((serverSum, server) => {
        const units = this.calculateServerUnits(server.position || '');
        return serverSum + units;
      }, 0) || 0;
      return sum + serverUnits;
    }, 0);

    const averageRackUtilization = (usedRackCapacity / totalRackCapacity) * 100;

    const totalPowerCapacity = racks.reduce((sum, rack) => 
      sum + (rack.power_capacity || 12000), 0);
    
    const estimatedPowerUsage = racks.reduce((sum, rack) => {
      const rackPowerUsage = rack.servers?.reduce((serverSum, server) => 
        serverSum + (server.power_idle || 180), 0) || 0;
      return sum + rackPowerUsage;
    }, 0);

    const powerUtilization = (estimatedPowerUsage / totalPowerCapacity) * 100;

    return {
      total_rack_capacity: totalRackCapacity,
      used_rack_capacity: usedRackCapacity,
      average_rack_utilization: Math.round(averageRackUtilization * 100) / 100,
      total_power_capacity: totalPowerCapacity,
      estimated_power_usage: estimatedPowerUsage,
      power_utilization: Math.round(powerUtilization * 100) / 100,
    };
  }

  private async getPerformanceSummary(): Promise<DashboardOverview['performance_summary']> {
    const servers = await this.serverRepository.find({
      where: { status: ServerStatus.ACTIVE },
    });

    const metrics = servers.map((server) =>
      MetricsService.generateServerMetrics(
        server.id,
        server.cpu_baseline,
        server.memory_baseline,
        server.temp_idle,
        server.power_idle
      )
    );

    const averageCpuUsage = metrics.reduce((sum, m) => sum + m.cpu_usage, 0) / metrics.length;
    const averageMemoryUsage = metrics.reduce((sum, m) => sum + m.memory_usage, 0) / metrics.length;
    const averageTemperature = metrics.reduce((sum, m) => sum + m.temperature, 0) / metrics.length;
    
    const serversOverThreshold = metrics.filter(
      (m) => m.cpu_usage > 80 || m.memory_usage > 85 || m.temperature > 70
    ).length;

    return {
      average_cpu_usage: Math.round(averageCpuUsage * 100) / 100,
      average_memory_usage: Math.round(averageMemoryUsage * 100) / 100,
      average_temperature: Math.round(averageTemperature * 100) / 100,
      servers_over_threshold: serversOverThreshold,
    };
  }

  private async getRecentActivity(): Promise<DashboardOverview['recent_activity']> {
    const [recentServers, recentAlerts] = await Promise.all([
      this.serverRepository.find({
        order: { created_at: 'DESC' },
        take: 5,
      }),
      this.alertRepository.find({
        where: { status: AlertStatus.ACTIVE },
        order: { created_at: 'DESC' },
        take: 5,
        relations: ['server'],
      }),
    ]);

    const activity: DashboardOverview['recent_activity'] = [];

    recentServers.forEach((server) => {
      activity.push({
        type: 'server_added',
        message: `Server ${server.name} was added to the datacenter`,
        timestamp: server.created_at,
        severity: 'low',
      });
    });

    recentAlerts.forEach((alert) => {
      const severity = alert.alert_type === AlertType.CRITICAL ? 'high' : 
                     alert.alert_type === AlertType.WARNING ? 'medium' : 'low';
      
      activity.push({
        type: 'alert_created',
        message: `${alert.alert_type} alert: ${alert.title}`,
        timestamp: alert.created_at,
        severity,
      });
    });

    return activity
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);
  }

  private async getActiveAlerts(): Promise<Alert[]> {
    return await this.alertRepository.find({
      where: { status: AlertStatus.ACTIVE },
      relations: ['server', 'rack'],
      order: { created_at: 'DESC' },
      take: 20,
    });
  }

  private async getAlertTrends(): Promise<Array<{
    date: string;
    critical: number;
    warning: number;
    info: number;
  }>> {
    const days = 7;
    const trends = [];

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const alertCounts = await this.alertRepository
        .createQueryBuilder('alert')
        .select('alert.alert_type', 'type')
        .addSelect('COUNT(*)', 'count')
        .where('alert.created_at BETWEEN :start AND :end', { 
          start: dayStart, 
          end: dayEnd 
        })
        .groupBy('alert.alert_type')
        .getRawMany();

      const counts = { critical: 0, warning: 0, info: 0 };
      
      alertCounts.forEach((item) => {
        const type = item.type.toLowerCase();
        if (type in counts) {
          (counts as any)[type] = parseInt(item.count);
        }
      });

      trends.push({
        date: dateStr,
        ...counts,
      });
    }

    return trends;
  }

  private async getTopAffectedServers(): Promise<Array<{
    server_id: string;
    server_name: string;
    alert_count: number;
  }>> {
    return await this.alertRepository
      .createQueryBuilder('alert')
      .select('alert.server_id', 'server_id')
      .addSelect('server.name', 'server_name')
      .addSelect('COUNT(*)', 'alert_count')
      .leftJoin('alert.server', 'server')
      .where('alert.status = :status', { status: AlertStatus.ACTIVE })
      .andWhere('alert.server_id IS NOT NULL')
      .groupBy('alert.server_id')
      .addGroupBy('server.name')
      .orderBy('COUNT(*)', 'DESC')
      .limit(10)
      .getRawMany();
  }

  private async getAlertCategoryBreakdown(): Promise<Array<{
    category: string;
    count: number;
    percentage: number;
  }>> {
    const categoryData = await this.alertRepository
      .createQueryBuilder('alert')
      .select('alert.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .where('alert.status = :status', { status: AlertStatus.ACTIVE })
      .groupBy('alert.category')
      .getRawMany();

    const totalAlerts = categoryData.reduce((sum, item) => sum + parseInt(item.count), 0);

    return categoryData.map((item) => ({
      category: item.category,
      count: parseInt(item.count),
      percentage: Math.round((parseInt(item.count) / totalAlerts) * 100 * 100) / 100,
    }));
  }

  private calculateServerUnits(position: string): number {
    if (!position) return 1;
    
    if (position.includes('-')) {
      const parts = position.split('-');
      const start = this.parsePosition(parts[0]);
      const end = this.parsePosition(parts[1]);
      return end - start + 1;
    } else {
      return 1;
    }
  }

  private parsePosition(position: string): number {
    if (!position) return 0;
    const match = position.match(/U(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  private generateUtilizationTrend(rackUtilization: any[]): Array<{
    date: string;
    average_utilization: number;
    server_count: number;
  }> {
    const days = 7;
    const trends = [];

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const averageUtilization = rackUtilization.reduce(
        (sum, rack) => sum + rack.utilization_percentage, 0
      ) / rackUtilization.length;

      const serverCount = rackUtilization.reduce(
        (sum, rack) => sum + rack.server_count, 0
      );

      const variation = (Math.random() - 0.5) * 10;
      
      trends.push({
        date: dateStr,
        average_utilization: Math.max(0, Math.min(100, averageUtilization + variation)),
        server_count: Math.max(0, serverCount + Math.floor(variation / 2)),
      });
    }

    return trends;
  }
}