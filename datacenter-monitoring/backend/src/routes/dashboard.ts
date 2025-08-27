import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { asyncHandler, metricsRateLimiter } from '../middleware';

const router = Router();
const dashboardController = new DashboardController();

// GET /api/v1/dashboard/overview - Get dashboard overview
router.get(
  '/overview',
  metricsRateLimiter,
  asyncHandler(dashboardController.getDashboardOverview.bind(dashboardController))
);

// GET /api/v1/dashboard/capacity - Get capacity metrics
router.get(
  '/capacity',
  metricsRateLimiter,
  asyncHandler(dashboardController.getCapacityMetrics.bind(dashboardController))
);

// GET /api/v1/dashboard/alerts - Get alerts dashboard
router.get(
  '/alerts',
  metricsRateLimiter,
  asyncHandler(dashboardController.getAlertsDashboard.bind(dashboardController))
);

export default router;