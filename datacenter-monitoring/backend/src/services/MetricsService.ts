export interface ServerMetrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_in: number;
  network_out: number;
  temperature: number;
  power_consumption: number;
  uptime: number;
  timestamp: Date;
}

interface DatacenterMetrics {
  total_servers: number;
  active_servers: number;
  offline_servers: number;
  maintenance_servers: number;
  error_servers: number;
  total_power_consumption: number;
  average_temperature: number;
  total_alerts: number;
  critical_alerts: number;
  warning_alerts: number;
  rack_utilization: number;
}

export class MetricsService {
  private static getRandomValue(min: number, max: number, decimals: number = 2): number {
    const value = Math.random() * (max - min) + min;
    return Number(value.toFixed(decimals));
  }

  private static getRealisticCPUUsage(baseline: number = 25): number {
    const variation = Math.random() * 40;
    const spike = Math.random() < 0.1 ? Math.random() * 30 : 0;
    return Math.min(100, baseline + variation + spike);
  }

  private static getRealisticMemoryUsage(baseline: number = 65): number {
    const variation = Math.random() * 20 - 10;
    return Math.max(10, Math.min(95, baseline + variation));
  }

  private static getRealisticTemperature(idleTemp: number = 35): number {
    const load = Math.random();
    const tempIncrease = load * 25;
    return idleTemp + tempIncrease;
  }

  private static getRealisticPowerConsumption(idlePower: number = 180): number {
    const load = Math.random();
    const powerIncrease = load * 120;
    return idlePower + powerIncrease;
  }

  static generateServerMetrics(
    serverId: string,
    cpuBaseline?: number,
    memoryBaseline?: number,
    tempIdle?: number,
    powerIdle?: number
  ): ServerMetrics {
    const cpu = this.getRealisticCPUUsage(cpuBaseline);
    const memory = this.getRealisticMemoryUsage(memoryBaseline);
    
    return {
      cpu_usage: this.getRandomValue(cpu * 0.8, cpu * 1.2),
      memory_usage: this.getRandomValue(memory * 0.9, memory * 1.1),
      disk_usage: this.getRandomValue(20, 80),
      network_in: this.getRandomValue(1, 1000, 0),
      network_out: this.getRandomValue(1, 1000, 0),
      temperature: this.getRealisticTemperature(tempIdle),
      power_consumption: this.getRealisticPowerConsumption(powerIdle),
      uptime: this.getRandomValue(3600, 8640000, 0),
      timestamp: new Date(),
    };
  }

  static generateHistoricalMetrics(
    serverId: string,
    hours: number = 24,
    cpuBaseline?: number,
    memoryBaseline?: number,
    tempIdle?: number,
    powerIdle?: number
  ): ServerMetrics[] {
    const metrics: ServerMetrics[] = [];
    const now = new Date();
    
    for (let i = hours; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourMetrics = this.generateServerMetrics(
        serverId,
        cpuBaseline,
        memoryBaseline,
        tempIdle,
        powerIdle
      );
      hourMetrics.timestamp = timestamp;
      metrics.push(hourMetrics);
    }
    
    return metrics;
  }

  static generateDatacenterOverview(
    totalServers: number,
    activeServers: number,
    offlineServers: number = 0,
    maintenanceServers: number = 0,
    errorServers: number = 0
  ): DatacenterMetrics {
    const totalAlerts = this.getRandomValue(5, 50, 0);
    const criticalAlerts = Math.floor(totalAlerts * 0.15);
    const warningAlerts = Math.floor(totalAlerts * 0.35);
    
    return {
      total_servers: totalServers,
      active_servers: activeServers,
      offline_servers: offlineServers,
      maintenance_servers: maintenanceServers,
      error_servers: errorServers,
      total_power_consumption: this.getRandomValue(15000, 45000, 0),
      average_temperature: this.getRandomValue(20, 26),
      total_alerts: totalAlerts,
      critical_alerts: criticalAlerts,
      warning_alerts: warningAlerts,
      rack_utilization: this.getRandomValue(60, 85),
    };
  }

  static generateRackMetrics(rackId: string, serverCount: number) {
    const avgTemp = this.getRandomValue(20, 28);
    const powerUsage = this.getRandomValue(serverCount * 150, serverCount * 300, 0);
    
    return {
      rack_id: rackId,
      server_count: serverCount,
      average_temperature: avgTemp,
      power_consumption: powerUsage,
      utilization_percentage: this.getRandomValue(40, 90),
      timestamp: new Date(),
    };
  }

  static simulateAlertConditions(metrics: ServerMetrics): Array<{
    type: 'CRITICAL' | 'WARNING' | 'INFO';
    category: 'HARDWARE' | 'NETWORK' | 'SECURITY' | 'ENVIRONMENT';
    title: string;
    description: string;
    threshold_value: number;
    current_value: number;
  }> {
    const alerts = [];

    if (metrics.cpu_usage > 85) {
      alerts.push({
        type: metrics.cpu_usage > 95 ? 'CRITICAL' as const : 'WARNING' as const,
        category: 'HARDWARE' as const,
        title: 'High CPU Usage Detected',
        description: `CPU usage is at ${metrics.cpu_usage.toFixed(1)}%, exceeding safe operating levels`,
        threshold_value: 85,
        current_value: metrics.cpu_usage,
      });
    }

    if (metrics.memory_usage > 90) {
      alerts.push({
        type: metrics.memory_usage > 95 ? 'CRITICAL' as const : 'WARNING' as const,
        category: 'HARDWARE' as const,
        title: 'High Memory Usage',
        description: `Memory usage is at ${metrics.memory_usage.toFixed(1)}%, system may become unstable`,
        threshold_value: 90,
        current_value: metrics.memory_usage,
      });
    }

    if (metrics.temperature > 65) {
      alerts.push({
        type: metrics.temperature > 75 ? 'CRITICAL' as const : 'WARNING' as const,
        category: 'ENVIRONMENT' as const,
        title: 'High Temperature Warning',
        description: `Server temperature is ${metrics.temperature.toFixed(1)}°C, cooling may be required`,
        threshold_value: 65,
        current_value: metrics.temperature,
      });
    }

    if (metrics.disk_usage > 85) {
      alerts.push({
        type: metrics.disk_usage > 95 ? 'CRITICAL' as const : 'WARNING' as const,
        category: 'HARDWARE' as const,
        title: 'Low Disk Space',
        description: `Disk usage is at ${metrics.disk_usage.toFixed(1)}%, consider cleanup or expansion`,
        threshold_value: 85,
        current_value: metrics.disk_usage,
      });
    }

    return alerts;
  }
}