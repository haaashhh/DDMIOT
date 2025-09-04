import { Repository, In } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Alert, AlertType, AlertCategory, AlertStatus } from '../entities/Alert';
import { Server } from '../entities/Server';
import { Rack } from '../entities/Rack';
import { MetricsService } from './MetricsService';

export interface AlertFilters {
  status?: AlertStatus;
  type?: AlertType;
  category?: AlertCategory;
  server_id?: string;
  rack_id?: string;
  limit?: number;
  offset?: number;
}

export class AlertService {
  private alertRepository: Repository<Alert>;
  private serverRepository: Repository<Server>;
  private rackRepository: Repository<Rack>;

  constructor() {
    this.alertRepository = AppDataSource.getRepository(Alert);
    this.serverRepository = AppDataSource.getRepository(Server);
    this.rackRepository = AppDataSource.getRepository(Rack);
  }

  async getAllAlerts(filters: AlertFilters = {}): Promise<{
    alerts: Alert[];
    total: number;
    summary: {
      active: number;
      acknowledged: number;
      resolved: number;
      critical: number;
      warning: number;
      info: number;
    };
  }> {
    const queryBuilder = this.alertRepository
      .createQueryBuilder('alert')
      .leftJoinAndSelect('alert.server', 'server')
      .leftJoinAndSelect('alert.rack', 'rack');

    if (filters.status) {
      queryBuilder.andWhere('alert.status = :status', { status: filters.status });
    }

    if (filters.type) {
      queryBuilder.andWhere('alert.alert_type = :type', { type: filters.type });
    }

    if (filters.category) {
      queryBuilder.andWhere('alert.category = :category', { category: filters.category });
    }

    if (filters.server_id) {
      queryBuilder.andWhere('alert.server_id = :server_id', { server_id: filters.server_id });
    }

    if (filters.rack_id) {
      queryBuilder.andWhere('alert.rack_id = :rack_id', { rack_id: filters.rack_id });
    }

    queryBuilder.orderBy('alert.created_at', 'DESC');

    if (filters.limit) {
      queryBuilder.limit(filters.limit);
    }

    if (filters.offset) {
      queryBuilder.offset(filters.offset);
    }

    const [alerts, total] = await queryBuilder.getManyAndCount();

    const summary = await this.getAlertSummary();

    return { alerts, total, summary };
  }

  async getAlertById(id: string): Promise<Alert | null> {
    return await this.alertRepository.findOne({
      where: { id },
      relations: ['server', 'rack'],
    });
  }

  async createAlert(alertData: Partial<Alert>): Promise<Alert> {
    if (alertData.server_id) {
      const server = await this.serverRepository.findOne({
        where: { id: alertData.server_id },
      });
      if (!server) {
        throw new Error(`Server with ID ${alertData.server_id} not found`);
      }
    }

    if (alertData.rack_id) {
      const rack = await this.rackRepository.findOne({
        where: { id: alertData.rack_id },
      });
      if (!rack) {
        throw new Error(`Rack with ID ${alertData.rack_id} not found`);
      }
    }

    const alert = this.alertRepository.create({
      ...alertData,
      status: AlertStatus.ACTIVE,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return await this.alertRepository.save(alert);
  }

  async acknowledgeAlert(id: string): Promise<Alert> {
    const alert = await this.getAlertById(id);
    
    if (!alert) {
      throw new Error(`Alert with ID ${id} not found`);
    }

    if (alert.status !== AlertStatus.ACTIVE) {
      throw new Error(`Alert ${id} is not in ACTIVE status and cannot be acknowledged`);
    }

    alert.status = AlertStatus.ACKNOWLEDGED;
    alert.updated_at = new Date();

    return await this.alertRepository.save(alert);
  }

  async resolveAlert(id: string, resolution_note?: string): Promise<Alert> {
    const alert = await this.getAlertById(id);
    
    if (!alert) {
      throw new Error(`Alert with ID ${id} not found`);
    }

    if (alert.status === AlertStatus.RESOLVED) {
      throw new Error(`Alert ${id} is already resolved`);
    }

    alert.status = AlertStatus.RESOLVED;
    alert.resolved_at = new Date();
    alert.updated_at = new Date();

    if (resolution_note) {
      alert.description = `${alert.description}\n\nResolution: ${resolution_note}`;
    }

    return await this.alertRepository.save(alert);
  }

  async deleteAlert(id: string): Promise<void> {
    const alert = await this.getAlertById(id);
    
    if (!alert) {
      throw new Error(`Alert with ID ${id} not found`);
    }

    await this.alertRepository.remove(alert);
  }

  async getActiveAlerts(): Promise<Alert[]> {
    return await this.alertRepository.find({
      where: { status: AlertStatus.ACTIVE },
      relations: ['server', 'rack'],
      order: { created_at: 'DESC' },
    });
  }

  async getCriticalAlerts(): Promise<Alert[]> {
    return await this.alertRepository.find({
      where: { 
        alert_type: AlertType.CRITICAL,
        status: In([AlertStatus.ACTIVE, AlertStatus.ACKNOWLEDGED])
      },
      relations: ['server', 'rack'],
      order: { created_at: 'DESC' },
    });
  }

  async getAlertSummary(): Promise<{
    active: number;
    acknowledged: number;
    resolved: number;
    critical: number;
    warning: number;
    info: number;
  }> {
    const [statusCounts, typeCounts] = await Promise.all([
      this.alertRepository
        .createQueryBuilder('alert')
        .select('alert.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .groupBy('alert.status')
        .getRawMany(),
      this.alertRepository
        .createQueryBuilder('alert')
        .select('alert.alert_type', 'type')
        .addSelect('COUNT(*)', 'count')
        .where('alert.status IN (:...statuses)', { 
          statuses: [AlertStatus.ACTIVE, AlertStatus.ACKNOWLEDGED] 
        })
        .groupBy('alert.alert_type')
        .getRawMany(),
    ]);

    const summary = {
      active: 0,
      acknowledged: 0,
      resolved: 0,
      critical: 0,
      warning: 0,
      info: 0,
    };

    statusCounts.forEach((item) => {
      const status = item.status.toLowerCase();
      if (status in summary) {
        (summary as any)[status] = parseInt(item.count);
      }
    });

    typeCounts.forEach((item) => {
      const type = item.type.toLowerCase();
      if (type in summary) {
        (summary as any)[type] = parseInt(item.count);
      }
    });

    return summary;
  }

  async getAlertsForServer(serverId: string): Promise<Alert[]> {
    return await this.alertRepository.find({
      where: { server_id: serverId },
      relations: ['server', 'rack'],
      order: { created_at: 'DESC' },
    });
  }

  async getAlertsForRack(rackId: string): Promise<Alert[]> {
    return await this.alertRepository.find({
      where: { rack_id: rackId },
      relations: ['server', 'rack'],
      order: { created_at: 'DESC' },
    });
  }

  async generateAlertFromMetrics(
    serverId: string,
    autoResolve: boolean = false
  ): Promise<Alert[]> {
    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });

    if (!server) {
      throw new Error(`Server with ID ${serverId} not found`);
    }

    const metrics = MetricsService.generateServerMetrics(
      serverId,
      server.cpu_baseline,
      server.memory_baseline,
      server.temp_idle,
      server.power_idle
    );

    const alertConditions = MetricsService.simulateAlertConditions(metrics);
    const createdAlerts: Alert[] = [];

    for (const condition of alertConditions) {
      if (autoResolve) {
        const existingAlert = await this.alertRepository.findOne({
          where: {
            server_id: serverId,
            category: condition.category as AlertCategory,
            title: condition.title,
            status: In([AlertStatus.ACTIVE, AlertStatus.ACKNOWLEDGED]),
          },
        });

        if (existingAlert) {
          continue;
        }
      }

      const alert = await this.createAlert({
        alert_type: condition.type as AlertType,
        category: condition.category as AlertCategory,
        title: condition.title,
        description: condition.description,
        server_id: serverId,
        rack_id: server.rack_id,
        threshold_value: condition.threshold_value,
        current_value: condition.current_value,
      });

      createdAlerts.push(alert);
    }

    return createdAlerts;
  }

  async bulkResolveAlerts(alertIds: string[]): Promise<Alert[]> {
    const alerts = await this.alertRepository.find({
      where: { id: In(alertIds) },
    });

    const resolvedAlerts: Alert[] = [];

    for (const alert of alerts) {
      if (alert.status !== AlertStatus.RESOLVED) {
        alert.status = AlertStatus.RESOLVED;
        alert.resolved_at = new Date();
        alert.updated_at = new Date();
        resolvedAlerts.push(await this.alertRepository.save(alert));
      }
    }

    return resolvedAlerts;
  }

  async getAlertTrends(days: number = 7): Promise<{
    daily_counts: Array<{
      date: string;
      critical: number;
      warning: number;
      info: number;
      total: number;
    }>;
    category_breakdown: Array<{
      category: string;
      count: number;
    }>;
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dailyAlerts = await this.alertRepository
      .createQueryBuilder('alert')
      .select("DATE(alert.created_at)", 'date')
      .addSelect('alert.alert_type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('alert.created_at >= :startDate', { startDate })
      .groupBy('DATE(alert.created_at)')
      .addGroupBy('alert.alert_type')
      .getRawMany();

    const categoryBreakdown = await this.alertRepository
      .createQueryBuilder('alert')
      .select('alert.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .where('alert.created_at >= :startDate', { startDate })
      .groupBy('alert.category')
      .getRawMany();

    const dailyCountsMap: Record<string, any> = {};

    dailyAlerts.forEach((item) => {
      const date = item.date;
      if (!dailyCountsMap[date]) {
        dailyCountsMap[date] = { date, critical: 0, warning: 0, info: 0, total: 0 };
      }
      const count = parseInt(item.count);
      dailyCountsMap[date][item.type.toLowerCase()] = count;
      dailyCountsMap[date].total += count;
    });

    const daily_counts = Object.values(dailyCountsMap);

    return {
      daily_counts,
      category_breakdown: categoryBreakdown.map(item => ({
        category: item.category,
        count: parseInt(item.count),
      })),
    };
  }
}