import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { NetworkDeviceService } from '../services/NetworkDeviceService';
import { NetworkDevice, NetworkDeviceType } from '../entities/NetworkDevice';

export class NetworkDeviceController {
  private networkDeviceService: NetworkDeviceService;

  constructor() {
    this.networkDeviceService = new NetworkDeviceService();
  }

  async getAllNetworkDevices(req: Request, res: Response): Promise<void> {
    try {
      const { device_type, rack_id, limit, offset } = req.query;
      
      const result = await this.networkDeviceService.getAllNetworkDevices(
        device_type as NetworkDeviceType,
        rack_id as string,
        limit ? parseInt(limit as string) : undefined,
        offset ? parseInt(offset as string) : undefined
      );

      res.json({
        success: true,
        data: result.devices,
        meta: {
          total: result.total,
          count: result.devices.length,
          limit: limit ? parseInt(limit as string) : null,
          offset: offset ? parseInt(offset as string) : null,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching network devices',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getNetworkDeviceById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const device = await this.networkDeviceService.getNetworkDeviceById(id);

      if (!device) {
        res.status(404).json({
          success: false,
          message: 'Network device not found',
        });
        return;
      }

      res.json({
        success: true,
        data: device,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching network device',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async createNetworkDevice(req: Request, res: Response): Promise<void> {
    try {
      const deviceData = req.body;

      // Create new device instance for validation
      const device = new NetworkDevice();
      Object.assign(device, deviceData);

      // Validate the device data
      const errors = await validate(device);
      if (errors.length > 0) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.map((error) => ({
            property: error.property,
            constraints: error.constraints,
          })),
        });
        return;
      }

      const createdDevice = await this.networkDeviceService.createNetworkDevice(deviceData);

      res.status(201).json({
        success: true,
        data: createdDevice,
        message: 'Network device created successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating network device',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async updateNetworkDevice(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deviceData = req.body;

      const updatedDevice = await this.networkDeviceService.updateNetworkDevice(id, deviceData);

      if (!updatedDevice) {
        res.status(404).json({
          success: false,
          message: 'Network device not found',
        });
        return;
      }

      res.json({
        success: true,
        data: updatedDevice,
        message: 'Network device updated successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating network device',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async deleteNetworkDevice(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deleted = await this.networkDeviceService.deleteNetworkDevice(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Network device not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Network device deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting network device',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async searchNetworkDevices(req: Request, res: Response): Promise<void> {
    try {
      const { q, limit } = req.query;

      if (!q || typeof q !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Query parameter "q" is required',
        });
        return;
      }

      const devices = await this.networkDeviceService.searchNetworkDevices(
        q,
        limit ? parseInt(limit as string) : undefined
      );

      res.json({
        success: true,
        data: devices,
        meta: {
          count: devices.length,
          query: q,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error searching network devices',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getNetworkDevicesByType(req: Request, res: Response): Promise<void> {
    try {
      const counts = await this.networkDeviceService.getNetworkDevicesByType();

      res.json({
        success: true,
        data: counts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching network device counts by type',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getPortUtilizationStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.networkDeviceService.getPortUtilizationStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching port utilization statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}