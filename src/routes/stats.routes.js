import { Router } from 'express';
import { statsController } from '../controllers/stats.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// Retrieve KPI statistics (Admin only)
router.get('/', authenticate, authorize('Administrador'), statsController.getStats);

// Public stats for landing page
router.get('/public', statsController.getPublicStats);

export default router;
