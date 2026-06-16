import { Router } from 'express';
import { reportController } from '../controllers/report.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// Admin: get all reports
router.get('/', authenticate, authorize('Administrador'), reportController.getReports);

// Admin: update report status
router.patch('/:id/status', authenticate, authorize('Administrador'), reportController.updateReportStatus);

export default router;
