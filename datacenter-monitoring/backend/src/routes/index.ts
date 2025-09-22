import { Router } from 'express';
import serverRoutes from './servers';
import rackRoutes from './racks';
import alertRoutes from './alerts';
import dashboardRoutes from './dashboard';
import networkDeviceRoutes from './networkDevices';
import authRoutes from './auth';

const router = Router();

// Mount all route modules
router.use('/auth', authRoutes);
router.use('/servers', serverRoutes);
router.use('/racks', rackRoutes);
router.use('/alerts', alertRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/network-devices', networkDeviceRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Datacenter Monitoring API is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      servers: '/api/v1/servers',
      racks: '/api/v1/racks',
      alerts: '/api/v1/alerts',
      dashboard: '/api/v1/dashboard',
      networkDevices: '/api/v1/network-devices',
    },
  });
});

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Datacenter Monitoring API',
    version: '1.0.0',
    documentation: {
      servers: {
        'GET /servers': 'List all servers',
        'GET /servers/:id': 'Get server details',
        'POST /servers': 'Create new server',
        'PUT /servers/:id': 'Update server',
        'DELETE /servers/:id': 'Delete server',
        'GET /servers/:id/metrics': 'Get server metrics',
        'GET /servers/:id/health': 'Get server health',
      },
      racks: {
        'GET /racks': 'List all racks',
        'GET /racks/:id': 'Get rack details',
        'POST /racks': 'Create new rack',
        'PUT /racks/:id': 'Update rack',
        'DELETE /racks/:id': 'Delete rack',
        'GET /racks/:id/servers': 'Get servers in rack',
        'GET /racks/:id/metrics': 'Get rack metrics',
      },
      alerts: {
        'GET /alerts': 'List all alerts',
        'GET /alerts/:id': 'Get alert details',
        'POST /alerts': 'Create new alert',
        'PUT /alerts/:id/acknowledge': 'Acknowledge alert',
        'PUT /alerts/:id/resolve': 'Resolve alert',
        'DELETE /alerts/:id': 'Delete alert',
      },
      dashboard: {
        'GET /dashboard/overview': 'Get dashboard overview',
        'GET /dashboard/capacity': 'Get capacity metrics',
        'GET /dashboard/alerts': 'Get alerts dashboard',
      },
    },
  });
});

export default router;