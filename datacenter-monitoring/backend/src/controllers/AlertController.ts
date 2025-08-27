import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { AlertService, AlertFilters } from '../services/AlertService';
import { Alert, AlertType, AlertCategory, AlertStatus } from '../entities/Alert';

export class AlertController {
  private alertService: AlertService;

  constructor() {
    this.alertService = new AlertService();
  }

  async getAllAlerts(req: Request, res: Response): Promise<void> {
    try {
      const filters: AlertFilters = {
        status: req.query.status as AlertStatus,
        type: req.query.type as AlertType,
        category: req.query.category as AlertCategory,
        server_id: req.query.server_id as string,
        rack_id: req.query.rack_id as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
      };

      const result = await this.alertService.getAllAlerts(filters);

      res.json({
        success: true,
        data: result.alerts,
        summary: result.summary,
        meta: {
          total: result.total,
          count: result.alerts.length,
          filters: Object.keys(req.query).length > 0 ? req.query : null,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching alerts',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getAlertById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const alert = await this.alertService.getAlertById(id);

      if (!alert) {
        res.status(404).json({
          success: false,
          message: `Alert with ID ${id} not found`,
        });
        return;
      }

      res.json({
        success: true,
        data: alert,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching alert',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async createAlert(req: Request, res: Response): Promise<void> {
    try {
      const alertData = req.body;

      const alert = new Alert();
      Object.assign(alert, alertData);

      const errors = await validate(alert, { skipMissingProperties: true });
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

      const createdAlert = await this.alertService.createAlert(alertData);

      res.status(201).json({
        success: true,
        message: 'Alert created successfully',
        data: createdAlert,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating alert',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async acknowledgeAlert(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const acknowledgedAlert = await this.alertService.acknowledgeAlert(id);

      res.json({
        success: true,
        message: 'Alert acknowledged successfully',
        data: acknowledgedAlert,
      });
    } catch (error) {
      const status = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: 'Error acknowledging alert',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async resolveAlert(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { resolution_note } = req.body;

      const resolvedAlert = await this.alertService.resolveAlert(id, resolution_note);

      res.json({
        success: true,
        message: 'Alert resolved successfully',
        data: resolvedAlert,
      });
    } catch (error) {
      const status = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: 'Error resolving alert',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async deleteAlert(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.alertService.deleteAlert(id);

      res.json({
        success: true,
        message: 'Alert deleted successfully',
      });
    } catch (error) {
      const status = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: 'Error deleting alert',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getActiveAlerts(req: Request, res: Response): Promise<void> {
    try {
      const activeAlerts = await this.alertService.getActiveAlerts();

      res.json({
        success: true,
        data: activeAlerts,
        meta: {
          count: activeAlerts.length,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching active alerts',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getCriticalAlerts(req: Request, res: Response): Promise<void> {
    try {
      const criticalAlerts = await this.alertService.getCriticalAlerts();

      res.json({
        success: true,
        data: criticalAlerts,
        meta: {
          count: criticalAlerts.length,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching critical alerts',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getAlertSummary(req: Request, res: Response): Promise<void> {
    try {
      const summary = await this.alertService.getAlertSummary();

      res.json({
        success: true,
        data: summary,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching alert summary',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getAlertsForServer(req: Request, res: Response): Promise<void> {
    try {
      const { serverId } = req.params;
      const alerts = await this.alertService.getAlertsForServer(serverId);

      res.json({
        success: true,
        data: alerts,
        meta: {
          server_id: serverId,
          count: alerts.length,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching alerts for server',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getAlertsForRack(req: Request, res: Response): Promise<void> {
    try {
      const { rackId } = req.params;
      const alerts = await this.alertService.getAlertsForRack(rackId);

      res.json({
        success: true,
        data: alerts,
        meta: {
          rack_id: rackId,
          count: alerts.length,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching alerts for rack',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async generateAlertFromMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { serverId } = req.params;
      const { auto_resolve } = req.query;

      const alerts = await this.alertService.generateAlertFromMetrics(
        serverId,
        auto_resolve === 'true'
      );

      res.json({
        success: true,
        message: `Generated ${alerts.length} alerts from server metrics`,
        data: alerts,
        meta: {
          server_id: serverId,
          count: alerts.length,
        },
      });
    } catch (error) {
      const status = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: 'Error generating alerts from metrics',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async bulkResolveAlerts(req: Request, res: Response): Promise<void> {
    try {
      const { alert_ids } = req.body;

      if (!Array.isArray(alert_ids) || alert_ids.length === 0) {
        res.status(400).json({
          success: false,
          message: 'alert_ids must be a non-empty array',
        });
        return;
      }

      const resolvedAlerts = await this.alertService.bulkResolveAlerts(alert_ids);

      res.json({
        success: true,
        message: `Resolved ${resolvedAlerts.length} alerts`,
        data: resolvedAlerts,
        meta: {
          count: resolvedAlerts.length,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error bulk resolving alerts',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getAlertTrends(req: Request, res: Response): Promise<void> {
    try {
      const { days } = req.query;
      const trendDays = days ? parseInt(days as string) : 7;

      if (isNaN(trendDays) || trendDays < 1 || trendDays > 30) {
        res.status(400).json({
          success: false,
          message: 'Days parameter must be a number between 1 and 30',
        });
        return;
      }

      const trends = await this.alertService.getAlertTrends(trendDays);

      res.json({
        success: true,
        data: trends,
        meta: {
          days: trendDays,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching alert trends',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}