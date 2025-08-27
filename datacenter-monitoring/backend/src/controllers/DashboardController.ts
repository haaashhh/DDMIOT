import { Request, Response } from 'express';
import { DashboardService } from '../services/DashboardService';

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  async getDashboardOverview(req: Request, res: Response): Promise<void> {
    try {
      const overview = await this.dashboardService.getDashboardOverview();

      res.json({
        success: true,
        data: overview,
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching dashboard overview',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getCapacityMetrics(req: Request, res: Response): Promise<void> {
    try {
      const capacityMetrics = await this.dashboardService.getCapacityMetrics();

      res.json({
        success: true,
        data: capacityMetrics,
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching capacity metrics',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getAlertsDashboard(req: Request, res: Response): Promise<void> {
    try {
      const alertsDashboard = await this.dashboardService.getAlertsDashboard();

      res.json({
        success: true,
        data: alertsDashboard,
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching alerts dashboard',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}