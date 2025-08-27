import { Router } from 'express';
import { RackController } from '../controllers/RackController';
import { 
  validateQuery, 
  asyncHandler,
  metricsRateLimiter 
} from '../middleware';

const router = Router();
const rackController = new RackController();

// GET /api/v1/racks - Get all racks
router.get(
  '/',
  validateQuery(['zone']),
  asyncHandler(rackController.getAllRacks.bind(rackController))
);

// GET /api/v1/racks/zones - Get racks grouped by zone
router.get(
  '/zones',
  asyncHandler(rackController.getRacksByZone.bind(rackController))
);

// GET /api/v1/racks/:id - Get rack by ID
router.get(
  '/:id',
  asyncHandler(rackController.getRackById.bind(rackController))
);

// POST /api/v1/racks - Create new rack
router.post(
  '/',
  asyncHandler(rackController.createRack.bind(rackController))
);

// PUT /api/v1/racks/:id - Update rack
router.put(
  '/:id',
  asyncHandler(rackController.updateRack.bind(rackController))
);

// DELETE /api/v1/racks/:id - Delete rack
router.delete(
  '/:id',
  asyncHandler(rackController.deleteRack.bind(rackController))
);

// GET /api/v1/racks/:id/servers - Get servers in a rack
router.get(
  '/:id/servers',
  asyncHandler(rackController.getRackServers.bind(rackController))
);

// GET /api/v1/racks/:id/metrics - Get rack metrics
router.get(
  '/:id/metrics',
  metricsRateLimiter,
  asyncHandler(rackController.getRackMetrics.bind(rackController))
);

// GET /api/v1/racks/:id/capacity - Get rack capacity information
router.get(
  '/:id/capacity',
  asyncHandler(rackController.getRackCapacity.bind(rackController))
);

// GET /api/v1/racks/:id/positions/available - Get available positions in rack
router.get(
  '/:id/positions/available',
  validateQuery(['units']),
  asyncHandler(rackController.getAvailablePositions.bind(rackController))
);

export default router;