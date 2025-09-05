import { Router } from 'express';
import { NetworkDeviceController } from '../controllers/NetworkDeviceController';
import { 
  validatePagination, 
  validateQuery, 
  asyncHandler 
} from '../middleware';

const router = Router();
const networkDeviceController = new NetworkDeviceController();

// GET /api/v1/network-devices - Get all network devices with optional filtering
router.get(
  '/',
  validateQuery(['device_type', 'rack_id', 'limit', 'offset']),
  validatePagination,
  asyncHandler(networkDeviceController.getAllNetworkDevices.bind(networkDeviceController))
);

// GET /api/v1/network-devices/search - Search network devices
router.get(
  '/search',
  validateQuery(['q', 'limit']),
  asyncHandler(networkDeviceController.searchNetworkDevices.bind(networkDeviceController))
);

// GET /api/v1/network-devices/stats/by-type - Get device count by type
router.get(
  '/stats/by-type',
  asyncHandler(networkDeviceController.getNetworkDevicesByType.bind(networkDeviceController))
);

// GET /api/v1/network-devices/stats/port-utilization - Get port utilization stats
router.get(
  '/stats/port-utilization',
  asyncHandler(networkDeviceController.getPortUtilizationStats.bind(networkDeviceController))
);

// GET /api/v1/network-devices/:id - Get network device by ID
router.get(
  '/:id',
  asyncHandler(networkDeviceController.getNetworkDeviceById.bind(networkDeviceController))
);

// POST /api/v1/network-devices - Create new network device
router.post(
  '/',
  asyncHandler(networkDeviceController.createNetworkDevice.bind(networkDeviceController))
);

// PUT /api/v1/network-devices/:id - Update network device
router.put(
  '/:id',
  asyncHandler(networkDeviceController.updateNetworkDevice.bind(networkDeviceController))
);

// DELETE /api/v1/network-devices/:id - Delete network device
router.delete(
  '/:id',
  asyncHandler(networkDeviceController.deleteNetworkDevice.bind(networkDeviceController))
);

export default router;