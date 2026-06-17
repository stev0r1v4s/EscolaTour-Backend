import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate }   from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.post('/register',  authController.register);
router.post('/login',     authController.login);

// Email verification
router.get('/verify-email',          authController.verifyEmail);
router.post('/resend-verification',  authController.resendVerification);

// Protected routes
router.get('/me',                    authenticate, authController.getCurrentUser);
router.post('/me/change-password',   authenticate, authController.changePassword);

export default router;
