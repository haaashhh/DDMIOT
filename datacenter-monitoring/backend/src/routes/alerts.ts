import { Router } from 'express';
import { AlertController } from '../controllers/AlertController';
import { 
  validatePagination, 
  validateQuery, 
  validateUUID,
  asyncHandler 
} from '../middleware';

const router = Router();
const alertController = new AlertController();

// GET /api/v1/alerts - Get all alerts with filtering
router.get(
  '/',
  validateQuery(['status', 'type', 'category', 'server_id', 'rack_id', 'limit', 'offset']),
  validatePagination,
  asyncHandler(alertController.getAllAlerts.bind(alertController))
);

// GET /api/v1/alerts/active - Get active alerts
router.get(
  '/active',
  asyncHandler(alertController.getActiveAlerts.bind(alertController))
);

// GET /api/v1/alerts/critical - Get critical alerts
router.get(
  '/critical',
  asyncHandler(alertController.getCriticalAlerts.bind(alertController))
);

// GET /api/v1/alerts/summary - Get alert summary
router.get(
  '/summary',
  asyncHandler(alertController.getAlertSummary.bind(alertController))
);

// GET /api/v1/alerts/trends - Get alert trends
router.get(
  '/trends',
  validateQuery(['days']),
  asyncHandler(alertController.getAlertTrends.bind(alertController))
);

// GET /api/v1/alerts/server/:serverId - Get alerts for specific server
router.get(
  '/server/:serverId',
  asyncHandler(alertController.getAlertsForServer.bind(alertController))
);

// GET /api/v1/alerts/rack/:rackId - Get alerts for specific rack
router.get(
  '/rack/:rackId',
  asyncHandler(alertController.getAlertsForRack.bind(alertController))
);

// GET /api/v1/alerts/:id - Get alert by ID
router.get(
  '/:id',
  validateUUID(),
  asyncHandler(alertController.getAlertById.bind(alertController))
);

// POST /api/v1/alerts - Create new alert
router.post(
  '/',
  asyncHandler(alertController.createAlert.bind(alertController))
);

// PUT /api/v1/alerts/:id/acknowledge - Acknowledge alert
router.put(
  '/:id/acknowledge',
  validateUUID(),
  asyncHandler(alertController.acknowledgeAlert.bind(alertController))
);

// PUT /api/v1/alerts/:id/resolve - Resolve alert
router.put(
  '/:id/resolve',
  validateUUID(),
  asyncHandler(alertController.resolveAlert.bind(alertController))
);

// DELETE /api/v1/alerts/:id - Delete alert
router.delete(
  '/:id',
  validateUUID(),
  asyncHandler(alertController.deleteAlert.bind(alertController))
);

// POST /api/v1/alerts/server/:serverId/generate - Generate alerts from metrics
router.post(
  '/server/:serverId/generate',
  validateQuery(['auto_resolve']),
  asyncHandler(alertController.generateAlertFromMetrics.bind(alertController))
);

// POST /api/v1/alerts/bulk/resolve - Bulk resolve alerts
router.post(
  '/bulk/resolve',
  asyncHandler(alertController.bulkResolveAlerts.bind(alertController))
);

export default router;