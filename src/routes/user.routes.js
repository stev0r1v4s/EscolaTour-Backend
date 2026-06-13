import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// Admin-only user management routes
router.get('/', authenticate, authorize('Administrador'), userController.getUsers);
router.patch('/:id/status', authenticate, authorize('Administrador'), userController.updateStatus);

export default router;
