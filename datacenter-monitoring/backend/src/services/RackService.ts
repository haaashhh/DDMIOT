import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Rack } from '../entities/Rack';
import { Server } from '../entities/Server';
import { MetricsService } from './MetricsService';

export class RackService {
  private rackRepository: Repository<Rack>;
  private serverRepository: Repository<Server>;

  constructor() {
    this.rackRepository = AppDataSource.getRepository(Rack);
    this.serverRepository = AppDataSource.getRepository(Server);
  }

  async getAllRacks(zone?: string): Promise<Rack[]> {
    const queryBuilder = this.rackRepository
      .createQueryBuilder('rack')
      .leftJoinAndSelect('rack.servers', 'servers')
      .leftJoinAndSelect('rack.network_devices', 'network_devices');

    if (zone) {
      queryBuilder.where('rack.zone = :zone', { zone });
    }

    return await queryBuilder
      .orderBy('rack.zone', 'ASC')
      .addOrderBy('rack.position', 'ASC')
      .getMany();
  }

  async getRackById(id: string): Promise<Rack | null> {
    return await this.rackRepository.findOne({
      where: { id },
      relations: ['servers', 'network_devices', 'alerts'],
    });
  }

  async getRackWithServers(id: string): Promise<Rack | null> {
    const rack = await this.rackRepository.findOne({
      where: { id },
      relations: ['servers', 'network_devices'],
    });

    if (rack) {
      rack.servers.sort((a, b) => {
        const posA = this.parsePosition(a.position || '');
        const posB = this.parsePosition(b.position || '');
        return posA - posB;
      });
    }

    return rack;
  }

  async createRack(rackData: Partial<Rack>): Promise<Rack> {
    const existingRack = await this.rackRepository.findOne({
      where: [
        { id: rackData.id! },
        { zone: rackData.zone!, position: rackData.position! }
      ]
    });

    if (existingRack) {
      throw new Error(`Rack already exists at zone ${rackData.zone} position ${rackData.position} or with ID ${rackData.id}`);
    }

    const rack = this.rackRepository.create(rackData);
    return await this.rackRepository.save(rack);
  }

  async updateRack(id: string, updateData: Partial<Rack>): Promise<Rack> {
    const rack = await this.getRackById(id);
    
    if (!rack) {
      throw new Error(`Rack with ID ${id} not found`);
    }

    if (updateData.zone || updateData.position) {
      const existingRack = await this.rackRepository.findOne({
        where: { 
          zone: updateData.zone || rack.zone, 
          position: updateData.position || rack.position 
        }
      });

      if (existingRack && existingRack.id !== id) {
        throw new Error(`Another rack already exists at zone ${updateData.zone || rack.zone} position ${updateData.position || rack.position}`);
      }
    }

    Object.assign(rack, updateData);
    rack.updated_at = new Date();

    return await this.rackRepository.save(rack);
  }

  async deleteRack(id: string): Promise<void> {
    const rack = await this.getRackById(id);
    
    if (!rack) {
      throw new Error(`Rack with ID ${id} not found`);
    }

    const serverCount = await this.serverRepository.count({
      where: { rack_id: id }
    });

    if (serverCount > 0) {
      throw new Error(`Cannot delete rack ${id}: contains ${serverCount} servers. Please move or delete servers first.`);
    }

    await this.rackRepository.remove(rack);
  }

  async getRackMetrics(id: string) {
    const rack = await this.getRackWithServers(id);
    
    if (!rack) {
      throw new Error(`Rack with ID ${id} not found`);
    }

    const serverCount = rack.servers?.length || 0;
    const rackMetrics = MetricsService.generateRackMetrics(id, serverCount);

    const serverMetrics = rack.servers?.map(server => ({
      server_id: server.id,
      server_name: server.name,
      position: server.position,
      metrics: MetricsService.generateServerMetrics(
        server.id,
        server.cpu_baseline,
        server.memory_baseline,
        server.temp_idle,
        server.power_idle
      )
    })) || [];

    return {
      rack_info: {
        id: rack.id,
        zone: rack.zone,
        position: rack.position,
        height: rack.height,
        power_capacity: rack.power_capacity,
      },
      rack_metrics: rackMetrics,
      servers: serverMetrics,
      summary: {
        total_servers: serverCount,
        active_servers: rack.servers?.filter(s => s.status === 'active').length || 0,
        average_cpu: serverMetrics.reduce((acc, s) => acc + s.metrics.cpu_usage, 0) / Math.max(1, serverMetrics.length),
        average_temperature: serverMetrics.reduce((acc, s) => acc + s.metrics.temperature, 0) / Math.max(1, serverMetrics.length),
        total_power: serverMetrics.reduce((acc, s) => acc + s.metrics.power_consumption, 0),
      }
    };
  }

  async getRacksByZone(): Promise<Record<string, Rack[]>> {
    const racks = await this.getAllRacks();
    
    return racks.reduce((grouped, rack) => {
      if (!grouped[rack.zone]) {
        grouped[rack.zone] = [];
      }
      grouped[rack.zone].push(rack);
      return grouped;
    }, {} as Record<string, Rack[]>);
  }

  async getRackCapacityInfo(id: string): Promise<{
    rack: Rack;
    capacity_info: {
      total_units: number;
      used_units: number;
      free_units: number;
      utilization_percentage: number;
      power_used: number;
      power_available: number;
      power_utilization_percentage: number;
    };
  }> {
    const rack = await this.getRackWithServers(id);
    
    if (!rack) {
      throw new Error(`Rack with ID ${id} not found`);
    }

    const totalUnits = parseInt(rack.height?.replace('U', '') || '42');
    const usedUnits = rack.servers?.reduce((total, server) => {
      const units = this.calculateServerUnits(server.position || '');
      return total + units;
    }, 0) || 0;

    const freeUnits = totalUnits - usedUnits;
    const utilizationPercentage = (usedUnits / totalUnits) * 100;

    const powerUsed = rack.servers?.reduce((total, server) => {
      return total + (server.power_idle || 180);
    }, 0) || 0;

    const powerAvailable = rack.power_capacity || 12000;
    const powerUtilizationPercentage = (powerUsed / powerAvailable) * 100;

    return {
      rack,
      capacity_info: {
        total_units: totalUnits,
        used_units: usedUnits,
        free_units: freeUnits,
        utilization_percentage: Math.round(utilizationPercentage * 100) / 100,
        power_used: powerUsed,
        power_available: powerAvailable,
        power_utilization_percentage: Math.round(powerUtilizationPercentage * 100) / 100,
      }
    };
  }

  async getAvailablePositions(rackId: string, requiredUnits: number = 1): Promise<string[]> {
    const rack = await this.getRackWithServers(rackId);
    
    if (!rack) {
      throw new Error(`Rack with ID ${rackId} not found`);
    }

    const totalUnits = parseInt(rack.height?.replace('U', '') || '42');
    const usedPositions = new Set<number>();

    rack.servers?.forEach(server => {
      const position = server.position || '';
      const [start, end] = this.parsePositionRange(position);
      for (let i = start; i <= end; i++) {
        usedPositions.add(i);
      }
    });

    const availablePositions: string[] = [];

    for (let start = 1; start <= totalUnits - requiredUnits + 1; start++) {
      let canFit = true;
      
      for (let i = start; i < start + requiredUnits; i++) {
        if (usedPositions.has(i)) {
          canFit = false;
          break;
        }
      }

      if (canFit) {
        const end = start + requiredUnits - 1;
        const positionStr = requiredUnits === 1 ? `U${start}` : `U${start}-U${end}`;
        availablePositions.push(positionStr);
      }
    }

    return availablePositions;
  }

  private parsePosition(position: string): number {
    if (!position) return 0;
    const match = position.match(/U(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  private parsePositionRange(position: string): [number, number] {
    if (!position) return [0, 0];
    
    if (position.includes('-')) {
      const parts = position.split('-');
      const start = this.parsePosition(parts[0]);
      const end = this.parsePosition(parts[1]);
      return [start, end];
    } else {
      const pos = this.parsePosition(position);
      return [pos, pos];
    }
  }

  private calculateServerUnits(position: string): number {
    if (!position) return 1;
    
    const [start, end] = this.parsePositionRange(position);
    return end - start + 1;
  }
}