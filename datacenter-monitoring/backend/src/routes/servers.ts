import { Router } from 'express';
import { ServerController } from '../controllers/ServerController';
import { 
  validatePagination, 
  validateQuery, 
  asyncHandler,
  metricsRateLimiter 
} from '../middleware';

const router = Router();
const serverController = new ServerController();

// GET /api/v1/servers - Get all servers with optional filtering
router.get(
  '/',
  validateQuery(['status', 'rack_id', 'limit', 'offset']),
  validatePagination,
  asyncHandler(serverController.getAllServers.bind(serverController))
);

// GET /api/v1/servers/search - Search servers
router.get(
  '/search',
  validateQuery(['q', 'limit']),
  asyncHandler(serverController.searchServers.bind(serverController))
);

// GET /api/v1/servers/status - Get server count by status
router.get(
  '/status',
  asyncHandler(serverController.getServersByStatus.bind(serverController))
);

// GET /api/v1/servers/:id - Get server by ID
router.get(
  '/:id',
  asyncHandler(serverController.getServerById.bind(serverController))
);

// POST /api/v1/servers - Create new server
router.post(
  '/',
  asyncHandler(serverController.createServer.bind(serverController))
);

// PUT /api/v1/servers/:id - Update server
router.put(
  '/:id',
  asyncHandler(serverController.updateServer.bind(serverController))
);

// DELETE /api/v1/servers/:id - Delete server
router.delete(
  '/:id',
  asyncHandler(serverController.deleteServer.bind(serverController))
);

// GET /api/v1/servers/:id/metrics - Get server metrics
router.get(
  '/:id/metrics',
  metricsRateLimiter,
  validateQuery(['hours']),
  asyncHandler(serverController.getServerMetrics.bind(serverController))
);

// GET /api/v1/servers/:id/health - Get server health status
router.get(
  '/:id/health',
  asyncHandler(serverController.getServerHealth.bind(serverController))
);

// PUT /api/v1/servers/:id/status - Update server status
router.put(
  '/:id/status',
  asyncHandler(serverController.updateServerStatus.bind(serverController))
);

export default router;