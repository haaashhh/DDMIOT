import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { NetworkDevice, NetworkDeviceType } from '../entities/NetworkDevice';
import { Rack } from '../entities/Rack';

export class NetworkDeviceService {
  private networkDeviceRepository: Repository<NetworkDevice>;
  private rackRepository: Repository<Rack>;

  constructor() {
    this.networkDeviceRepository = AppDataSource.getRepository(NetworkDevice);
    this.rackRepository = AppDataSource.getRepository(Rack);
  }

  async getAllNetworkDevices(
    deviceType?: NetworkDeviceType,
    rackId?: string,
    limit?: number,
    offset?: number
  ): Promise<{ devices: NetworkDevice[]; total: number }> {
    const queryBuilder = this.networkDeviceRepository
      .createQueryBuilder('device')
      .leftJoinAndSelect('device.rack', 'rack');

    if (deviceType) {
      queryBuilder.where('device.device_type = :deviceType', { deviceType });
    }

    if (rackId) {
      queryBuilder.andWhere('device.rack_id = :rackId', { rackId });
    }

    if (limit) {
      queryBuilder.limit(limit);
    }

    if (offset) {
      queryBuilder.offset(offset);
    }

    queryBuilder.orderBy('device.name', 'ASC');

    const [devices, total] = await queryBuilder.getManyAndCount();

    return { devices, total };
  }

  async getNetworkDeviceById(id: string): Promise<NetworkDevice | null> {
    return await this.networkDeviceRepository
      .createQueryBuilder('device')
      .leftJoinAndSelect('device.rack', 'rack')
      .where('device.id = :id', { id })
      .getOne();
  }

  async createNetworkDevice(deviceData: Partial<NetworkDevice>): Promise<NetworkDevice> {
    const device = this.networkDeviceRepository.create(deviceData);
    return await this.networkDeviceRepository.save(device);
  }

  async updateNetworkDevice(id: string, deviceData: Partial<NetworkDevice>): Promise<NetworkDevice | null> {
    await this.networkDeviceRepository.update(id, deviceData);
    return await this.getNetworkDeviceById(id);
  }

  async deleteNetworkDevice(id: string): Promise<boolean> {
    const result = await this.networkDeviceRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async searchNetworkDevices(query: string, limit?: number): Promise<NetworkDevice[]> {
    const queryBuilder = this.networkDeviceRepository
      .createQueryBuilder('device')
      .leftJoinAndSelect('device.rack', 'rack')
      .where('LOWER(device.name) LIKE :query', { query: `%${query.toLowerCase()}%` })
      .orWhere('LOWER(device.brand) LIKE :query', { query: `%${query.toLowerCase()}%` })
      .orWhere('LOWER(device.model) LIKE :query', { query: `%${query.toLowerCase()}%` })
      .orWhere('device.management_ip::text LIKE :query', { query: `%${query}%` });

    if (limit) {
      queryBuilder.limit(limit);
    }

    return await queryBuilder.getMany();
  }

  async getNetworkDevicesByType(): Promise<Record<string, number>> {
    const result = await this.networkDeviceRepository
      .createQueryBuilder('device')
      .select('device.device_type', 'device_type')
      .addSelect('COUNT(device.id)', 'count')
      .groupBy('device.device_type')
      .getRawMany();

    const counts: Record<string, number> = {
      switch: 0,
      router: 0,
      firewall: 0,
    };

    result.forEach((row) => {
      counts[row.device_type] = parseInt(row.count);
    });

    return counts;
  }

  async getPortUtilizationStats(): Promise<{
    totalPorts: number;
    usedPorts: number;
    utilization: number;
  }> {
    const result = await this.networkDeviceRepository
      .createQueryBuilder('device')
      .select('SUM(device.ports_total)', 'totalPorts')
      .addSelect('SUM(device.ports_used)', 'usedPorts')
      .where('device.ports_total IS NOT NULL')
      .getRawOne();

    const totalPorts = parseInt(result.totalPorts || '0');
    const usedPorts = parseInt(result.usedPorts || '0');
    const utilization = totalPorts > 0 ? Math.round((usedPorts / totalPorts) * 100) : 0;

    return {
      totalPorts,
      usedPorts,
      utilization,
    };
  }
}