import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { ServerService } from '../services/ServerService';
import { Server, ServerStatus } from '../entities/Server';

export class ServerController {
  private serverService: ServerService;

  constructor() {
    this.serverService = new ServerService();
  }

  async getAllServers(req: Request, res: Response): Promise<void> {
    try {
      const { status, rack_id, limit, offset } = req.query;
      
      const result = await this.serverService.getAllServers(
        status as ServerStatus,
        rack_id as string,
        limit ? parseInt(limit as string) : undefined,
        offset ? parseInt(offset as string) : undefined
      );

      res.json({
        success: true,
        data: result.servers,
        meta: {
          total: result.total,
          count: result.servers.length,
          limit: limit ? parseInt(limit as string) : null,
          offset: offset ? parseInt(offset as string) : null,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching servers',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getServerById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const server = await this.serverService.getServerById(id);

      if (!server) {
        res.status(404).json({
          success: false,
          message: `Server with ID ${id} not found`,
        });
        return;
      }

      res.json({
        success: true,
        data: server,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching server',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async createServer(req: Request, res: Response): Promise<void> {
    try {
      const serverData = req.body;

      const server = new Server();
      Object.assign(server, serverData);

      const errors = await validate(server);
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

      const createdServer = await this.serverService.createServer(serverData);

      res.status(201).json({
        success: true,
        message: 'Server created successfully',
        data: createdServer,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating server',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async updateServer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const server = new Server();
      Object.assign(server, updateData);

      const errors = await validate(server, { skipMissingProperties: true });
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

      const updatedServer = await this.serverService.updateServer(id, updateData);

      res.json({
        success: true,
        message: 'Server updated successfully',
        data: updatedServer,
      });
    } catch (error) {
      const status = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: 'Error updating server',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async deleteServer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.serverService.deleteServer(id);

      res.json({
        success: true,
        message: 'Server deleted successfully',
      });
    } catch (error) {
      const status = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: 'Error deleting server',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getServerMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { hours } = req.query;

      const metrics = await this.serverService.getServerMetrics(
        id,
        hours ? parseInt(hours as string) : 24
      );

      res.json({
        success: true,
        data: metrics,
        meta: {
          server_id: id,
          hours: hours ? parseInt(hours as string) : 24,
        },
      });
    } catch (error) {
      const status = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: 'Error fetching server metrics',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getServerHealth(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const healthData = await this.serverService.getServerHealth(id);

      res.json({
        success: true,
        data: healthData,
      });
    } catch (error) {
      const status = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: 'Error fetching server health',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async updateServerStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!Object.values(ServerStatus).includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Invalid server status',
          valid_statuses: Object.values(ServerStatus),
        });
        return;
      }

      const updatedServer = await this.serverService.updateServerStatus(id, status);

      res.json({
        success: true,
        message: 'Server status updated successfully',
        data: updatedServer,
      });
    } catch (error) {
      const status = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: 'Error updating server status',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async searchServers(req: Request, res: Response): Promise<void> {
    try {
      const { q, limit } = req.query;

      if (!q) {
        res.status(400).json({
          success: false,
          message: 'Search query parameter "q" is required',
        });
        return;
      }

      const servers = await this.serverService.searchServers(
        q as string,
        limit ? parseInt(limit as string) : 10
      );

      res.json({
        success: true,
        data: servers,
        meta: {
          query: q,
          count: servers.length,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error searching servers',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getServersByStatus(req: Request, res: Response): Promise<void> {
    try {
      const statusCounts = await this.serverService.getServersByStatus();

      res.json({
        success: true,
        data: statusCounts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching server status counts',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}