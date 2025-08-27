import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { RackService } from '../services/RackService';
import { ServerService } from '../services/ServerService';
import { Rack } from '../entities/Rack';

export class RackController {
  private rackService: RackService;
  private serverService: ServerService;

  constructor() {
    this.rackService = new RackService();
    this.serverService = new ServerService();
  }

  async getAllRacks(req: Request, res: Response): Promise<void> {
    try {
      const { zone } = req.query;
      
      const racks = await this.rackService.getAllRacks(zone as string);

      res.json({
        success: true,
        data: racks,
        meta: {
          count: racks.length,
          zone: zone || 'all',
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching racks',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getRackById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const rack = await this.rackService.getRackById(id);

      if (!rack) {
        res.status(404).json({
          success: false,
          message: `Rack with ID ${id} not found`,
        });
        return;
      }

      res.json({
        success: true,
        data: rack,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching rack',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getRackWithServers(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const rack = await this.rackService.getRackWithServers(id);

      if (!rack) {
        res.status(404).json({
          success: false,
          message: `Rack with ID ${id} not found`,
        });
        return;
      }

      res.json({
        success: true,
        data: rack,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching rack with servers',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getRackServers(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const servers = await this.serverService.getServersByRack(id);

      res.json({
        success: true,
        data: servers,
        meta: {
          rack_id: id,
          count: servers.length,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching rack servers',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async createRack(req: Request, res: Response): Promise<void> {
    try {
      const rackData = req.body;

      const rack = new Rack();
      Object.assign(rack, rackData);

      const errors = await validate(rack);
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

      const createdRack = await this.rackService.createRack(rackData);

      res.status(201).json({
        success: true,
        message: 'Rack created successfully',
        data: createdRack,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating rack',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async updateRack(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const rack = new Rack();
      Object.assign(rack, updateData);

      const errors = await validate(rack, { skipMissingProperties: true });
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

      const updatedRack = await this.rackService.updateRack(id, updateData);

      res.json({
        success: true,
        message: 'Rack updated successfully',
        data: updatedRack,
      });
    } catch (error) {
      const status = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: 'Error updating rack',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async deleteRack(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.rackService.deleteRack(id);

      res.json({
        success: true,
        message: 'Rack deleted successfully',
      });
    } catch (error) {
      const status = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: 'Error deleting rack',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getRackMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const metrics = await this.rackService.getRackMetrics(id);

      res.json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      const status = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: 'Error fetching rack metrics',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getRacksByZone(req: Request, res: Response): Promise<void> {
    try {
      const racksByZone = await this.rackService.getRacksByZone();

      res.json({
        success: true,
        data: racksByZone,
        meta: {
          zones: Object.keys(racksByZone),
          total_zones: Object.keys(racksByZone).length,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching racks by zone',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getRackCapacity(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const capacityInfo = await this.rackService.getRackCapacityInfo(id);

      res.json({
        success: true,
        data: capacityInfo,
      });
    } catch (error) {
      const status = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: 'Error fetching rack capacity info',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getAvailablePositions(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { units } = req.query;

      const requiredUnits = units ? parseInt(units as string) : 1;

      if (isNaN(requiredUnits) || requiredUnits < 1 || requiredUnits > 42) {
        res.status(400).json({
          success: false,
          message: 'Invalid units parameter. Must be a number between 1 and 42.',
        });
        return;
      }

      const availablePositions = await this.rackService.getAvailablePositions(
        id,
        requiredUnits
      );

      res.json({
        success: true,
        data: {
          rack_id: id,
          required_units: requiredUnits,
          available_positions: availablePositions,
        },
        meta: {
          count: availablePositions.length,
        },
      });
    } catch (error) {
      const status = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: 'Error fetching available positions',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}