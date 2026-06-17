import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Private route (to verify current token user details)
router.get('/me', authenticate, authController.getCurrentUser);

// Password change
router.post('/me/change-password', authenticate, authController.changePassword);

export default router;
