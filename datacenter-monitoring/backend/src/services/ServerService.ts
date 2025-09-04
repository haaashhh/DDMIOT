import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Server, ServerStatus } from '../entities/Server';
import { Rack } from '../entities/Rack';
import { MetricsService, ServerMetrics } from './MetricsService';

export class ServerService {
  private serverRepository: Repository<Server>;
  private rackRepository: Repository<Rack>;

  constructor() {
    this.serverRepository = AppDataSource.getRepository(Server);
    this.rackRepository = AppDataSource.getRepository(Rack);
  }

  async getAllServers(
    status?: ServerStatus,
    rackId?: string,
    limit?: number,
    offset?: number
  ): Promise<{ servers: Server[]; total: number }> {
    const queryBuilder = this.serverRepository
      .createQueryBuilder('server')
      .leftJoinAndSelect('server.rack', 'rack');

    if (status) {
      queryBuilder.where('server.status = :status', { status });
    }

    if (rackId) {
      queryBuilder.andWhere('server.rack_id = :rackId', { rackId });
    }

    if (limit) {
      queryBuilder.limit(limit);
    }

    if (offset) {
      queryBuilder.offset(offset);
    }

    queryBuilder.orderBy('server.created_at', 'DESC');

    const [servers, total] = await queryBuilder.getManyAndCount();

    return { servers, total };
  }

  async getServerById(id: string): Promise<Server | null> {
    return await this.serverRepository.findOne({
      where: { id },
      relations: ['rack', 'alerts'],
    });
  }

  async createServer(serverData: Partial<Server>): Promise<Server> {
    const rack = await this.rackRepository.findOne({
      where: { id: serverData.rack_id! },
    });

    if (!rack) {
      throw new Error(`Rack with ID ${serverData.rack_id} not found`);
    }

    const server = this.serverRepository.create(serverData);
    const savedServer = await this.serverRepository.save(server);

    await this.updateRackServerCount(rack.id);

    return savedServer;
  }

  async updateServer(id: string, updateData: Partial<Server>): Promise<Server> {
    const server = await this.getServerById(id);
    
    if (!server) {
      throw new Error(`Server with ID ${id} not found`);
    }

    const oldRackId = server.rack_id;

    if (updateData.rack_id && updateData.rack_id !== oldRackId) {
      const newRack = await this.rackRepository.findOne({
        where: { id: updateData.rack_id },
      });

      if (!newRack) {
        throw new Error(`Rack with ID ${updateData.rack_id} not found`);
      }
    }

    Object.assign(server, updateData);
    server.updated_at = new Date();

    const updatedServer = await this.serverRepository.save(server);

    if (updateData.rack_id && updateData.rack_id !== oldRackId) {
      await this.updateRackServerCount(oldRackId);
      await this.updateRackServerCount(updateData.rack_id);
    }

    return updatedServer;
  }

  async deleteServer(id: string): Promise<void> {
    const server = await this.getServerById(id);
    
    if (!server) {
      throw new Error(`Server with ID ${id} not found`);
    }

    const rackId = server.rack_id;
    await this.serverRepository.remove(server);
    await this.updateRackServerCount(rackId);
  }

  async getServerMetrics(id: string, hours: number = 24): Promise<ServerMetrics | ServerMetrics[]> {
    const server = await this.getServerById(id);
    
    if (!server) {
      throw new Error(`Server with ID ${id} not found`);
    }

    if (hours === 1) {
      return MetricsService.generateServerMetrics(
        id,
        server.cpu_baseline,
        server.memory_baseline,
        server.temp_idle,
        server.power_idle
      );
    }

    return MetricsService.generateHistoricalMetrics(
      id,
      hours,
      server.cpu_baseline,
      server.memory_baseline,
      server.temp_idle,
      server.power_idle
    );
  }

  async getServersByStatus(): Promise<Record<string, number>> {
    const statusCounts = await this.serverRepository
      .createQueryBuilder('server')
      .select('server.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('server.status')
      .getRawMany();

    const result: Record<string, number> = {
      active: 0,
      maintenance: 0,
      error: 0,
      offline: 0,
    };

    statusCounts.forEach((item) => {
      result[item.status] = parseInt(item.count);
    });

    return result;
  }

  async getServersByRack(rackId: string): Promise<Server[]> {
    return await this.serverRepository.find({
      where: { rack_id: rackId },
      relations: ['rack'],
      order: { position: 'ASC' },
    });
  }

  async searchServers(
    searchTerm: string,
    limit: number = 10
  ): Promise<Server[]> {
    return await this.serverRepository
      .createQueryBuilder('server')
      .leftJoinAndSelect('server.rack', 'rack')
      .where('server.name ILIKE :search', { search: `%${searchTerm}%` })
      .orWhere('server.id ILIKE :search', { search: `%${searchTerm}%` })
      .orWhere('server.ip_address::text ILIKE :search', { search: `%${searchTerm}%` })
      .orWhere('server.brand ILIKE :search', { search: `%${searchTerm}%` })
      .orWhere('server.model ILIKE :search', { search: `%${searchTerm}%` })
      .limit(limit)
      .getMany();
  }

  private async updateRackServerCount(rackId: string): Promise<void> {
    const serverCount = await this.serverRepository.count({
      where: { rack_id: rackId },
    });

    await this.rackRepository.update(rackId, {
      servers_count: serverCount,
      updated_at: new Date(),
    });
  }

  async updateServerStatus(id: string, status: ServerStatus): Promise<Server> {
    const server = await this.getServerById(id);
    
    if (!server) {
      throw new Error(`Server with ID ${id} not found`);
    }

    server.status = status;
    server.updated_at = new Date();

    return await this.serverRepository.save(server);
  }

  async getServerHealth(id: string): Promise<{
    server: Server;
    metrics: any;
    alerts: any[];
    health_score: number;
  }> {
    const server = await this.getServerById(id);
    
    if (!server) {
      throw new Error(`Server with ID ${id} not found`);
    }

    const metricsData = await this.getServerMetrics(id, 1);
    const metrics = Array.isArray(metricsData) ? metricsData[0] : metricsData;
    const alertConditions = MetricsService.simulateAlertConditions(metrics);
    
    let healthScore = 100;
    alertConditions.forEach((alert) => {
      if (alert.type === 'CRITICAL') healthScore -= 30;
      else if (alert.type === 'WARNING') healthScore -= 15;
      else healthScore -= 5;
    });

    healthScore = Math.max(0, healthScore);

    return {
      server,
      metrics,
      alerts: alertConditions,
      health_score: healthScore,
    };
  }
}